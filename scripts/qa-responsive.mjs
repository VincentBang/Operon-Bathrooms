/* global Buffer, URL, clearTimeout, console, process, fetch, setTimeout, WebSocket */

import { mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const baseUrl = process.argv[2] || "http://127.0.0.1:3000";
const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const viewports = [
  { label: "desktop", width: 1440, height: 1100 },
  { label: "laptop", width: 1280, height: 900 },
  { label: "tablet", width: 768, height: 1024 },
  { label: "mobile", width: 390, height: 844 }
];

const routes = [
  "/",
  "/quote",
  "/quote/review",
  "/request-review",
  "/site-measure",
  "/admin/leads",
  ...(process.env.NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO === "true" ? ["/design-studio"] : [])
];

const screenshotDir = join(process.cwd(), ".local", "qa-responsive");
const failures = [];
const warnings = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function removeUserDataDir(userDataDir) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await rm(userDataDir, { recursive: true, force: true });
      return;
    } catch (error) {
      if (!["ENOTEMPTY", "EBUSY", "EPERM"].includes(error.code) || attempt === 4) throw error;
      await sleep(250 * (attempt + 1));
    }
  }
}

function waitForDevtools(processHandle) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Timed out waiting for Chrome DevTools endpoint.")), 15_000);

    function onData(buffer) {
      const text = buffer.toString();
      const match = text.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timeout);
        processHandle.stderr.off("data", onData);
        resolve(match[1]);
      }
    }

    processHandle.stderr.on("data", onData);
    processHandle.once("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`Chrome exited before DevTools endpoint was ready: ${code}`));
    });
  });
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.nextId = 1;
    this.pending = new Map();
  }

  async connect() {
    this.socket = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message || "CDP command failed"));
      else pending.resolve(message.result || {});
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    const payload = JSON.stringify({ id, method, params });
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(payload);
      setTimeout(() => {
        if (!this.pending.has(id)) return;
        this.pending.delete(id);
        reject(new Error(`CDP command timed out: ${method}`));
      }, 12_000);
    });
  }

  close() {
    this.socket?.close();
  }
}

async function createPage(browserWsUrl) {
  const browserUrl = new URL(browserWsUrl);
  const endpoint = `http://${browserUrl.host}/json/new?about:blank`;
  const response = await fetch(endpoint, { method: "PUT" });
  if (!response.ok) throw new Error(`Unable to create Chrome target: ${response.status}`);
  const target = await response.json();
  const client = new CdpClient(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  return client;
}

async function navigate(client, url) {
  await client.send("Page.navigate", { url });
  for (let index = 0; index < 80; index += 1) {
    const result = await client.send("Runtime.evaluate", {
      expression: "document.readyState",
      returnByValue: true
    });
    if (result.result?.value === "complete") return;
    await sleep(100);
  }
  throw new Error(`Timed out loading ${url}`);
}

async function evaluateQa(client) {
  const expression = `(() => {
    const doc = document.documentElement;
    const body = document.body;
    const h1 = Array.from(document.querySelectorAll("h1"));
    const launcher = document.querySelector(".chatbot-launcher");
    const buttons = Array.from(document.querySelectorAll("button, a.button, input[type='submit']"));
    const visible = (el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
    };
    const launcherRect = launcher && visible(launcher) ? launcher.getBoundingClientRect() : null;
    const overlappingSubmitters = launcherRect
      ? buttons
          .filter((el) => visible(el) && !el.classList.contains("chatbot-launcher"))
          .map((el) => ({ text: el.textContent.trim(), rect: el.getBoundingClientRect() }))
          .filter(({ rect }) => !(launcherRect.right < rect.left || launcherRect.left > rect.right || launcherRect.bottom < rect.top || launcherRect.top > rect.bottom))
          .map(({ text }) => text || "unnamed control")
      : [];

    return {
      title: document.title,
      url: location.pathname,
      innerWidth,
      scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
      clientWidth: doc.clientWidth,
      h1Count: h1.length,
      h1Text: h1[0]?.textContent?.trim() || "",
      chatbotVisible: Boolean(launcherRect),
      launcherBottom: launcherRect ? Math.round(innerHeight - launcherRect.bottom) : null,
      launcherRight: launcherRect ? Math.round(innerWidth - launcherRect.right) : null,
      overlappingSubmitters,
      activeFocusableCount: Array.from(document.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])")).filter(visible).length
    };
  })()`;
  const result = await client.send("Runtime.evaluate", {
    expression,
    returnByValue: true
  });
  return result.result.value;
}

async function screenshot(client, filePath) {
  const result = await client.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  await writeFile(filePath, Buffer.from(result.data, "base64"));
}

async function main() {
  if (!existsSync(chromePath)) {
    throw new Error(`Chrome was not found at ${chromePath}. Set CHROME_PATH to run responsive QA.`);
  }

  await rm(screenshotDir, { recursive: true, force: true });
  await mkdir(screenshotDir, { recursive: true });

  const userDataDir = join(tmpdir(), `operon-bathrooms-chrome-${Date.now()}`);
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDataDir}`,
    "about:blank"
  ], { stdio: ["ignore", "ignore", "pipe"] });

  let browserWsUrl;
  try {
    browserWsUrl = await waitForDevtools(chrome);
    for (const viewport of viewports) {
      for (const route of routes) {
        const client = await createPage(browserWsUrl);
        const url = new URL(route, baseUrl).toString();
        try {
          await client.send("Emulation.setDeviceMetricsOverride", {
            width: viewport.width,
            height: viewport.height,
            deviceScaleFactor: 1,
            mobile: viewport.width <= 480
          });
          await navigate(client, url);
          await sleep(250);
          const qa = await evaluateQa(client);
          const overflow = qa.scrollWidth - qa.clientWidth;
          const screenshotName = `${viewport.label}-${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}.png`;
          await screenshot(client, join(screenshotDir, screenshotName));
          console.log(`${viewport.label} ${route} h1=${qa.h1Count} overflow=${overflow} chatbot=${qa.chatbotVisible ? "yes" : "no"} focusable=${qa.activeFocusableCount}`);

          if (qa.h1Count !== 1) failures.push(`${viewport.label} ${route}: expected one H1, found ${qa.h1Count}`);
          if (overflow > 2) failures.push(`${viewport.label} ${route}: horizontal overflow ${overflow}px`);
          if (qa.overlappingSubmitters.length) {
            failures.push(`${viewport.label} ${route}: chatbot launcher overlaps ${qa.overlappingSubmitters.join(", ")}`);
          }
          if (route.startsWith("/admin") && qa.chatbotVisible) failures.push(`${viewport.label} ${route}: chatbot visible on admin route`);
          if (!route.startsWith("/admin") && !["/privacy", "/terms"].includes(route) && !qa.chatbotVisible) {
            warnings.push(`${viewport.label} ${route}: chatbot launcher not visible`);
          }
          if (viewport.width <= 480 && qa.chatbotVisible && (qa.launcherRight < 8 || qa.launcherBottom < 8)) {
            warnings.push(`${viewport.label} ${route}: chatbot launcher close to viewport edge`);
          }
        } finally {
          client.close();
        }
      }
    }
  } finally {
    chrome.kill("SIGTERM");
    await new Promise((resolve) => {
      chrome.once("exit", resolve);
      setTimeout(resolve, 1500);
    });
    await removeUserDataDir(userDataDir);
  }

  if (warnings.length) {
    console.log("\nWarnings:");
    for (const warning of warnings) console.log(`- ${warning}`);
  }

  if (failures.length) {
    console.error("\nResponsive QA failures:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`\nPassed: responsive QA checks completed for ${routes.length} routes at ${viewports.length} viewport sizes.`);
  console.log(`Screenshots saved to ${screenshotDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
