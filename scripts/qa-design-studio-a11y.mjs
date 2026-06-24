/* global URL, clearTimeout, console, process, fetch, setTimeout, WebSocket */

import { rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const baseUrl = process.argv[2] || "http://127.0.0.1:3000";
const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const failures = [];

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
    const id = this.nextId;
    this.nextId += 1;
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
  await client.send("Accessibility.enable");
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

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    returnByValue: true
  });
  return result.result.value;
}

async function focusButtonByText(client, text) {
  const found = await evaluate(client, `(() => {
    const button = Array.from(document.querySelectorAll("button"))
      .find((item) => item.textContent.trim() === ${JSON.stringify(text)} && !item.disabled);
    if (!button) return false;
    button.focus();
    return document.activeElement === button;
  })()`);
  if (!found) failures.push(`Unable to focus button: ${text}`);
  return found;
}

async function keyboardActivateButton(client, text) {
  if (!(await focusButtonByText(client, text))) return;
  await evaluate(client, "(() => { document.activeElement.click(); return true; })()");
  await sleep(200);
}

async function getAccessibilityTreeSummary(client) {
  const tree = await client.send("Accessibility.getFullAXTree");
  const nodes = tree.nodes || [];
  return {
    buttons: nodes.filter((node) => node.role?.value === "button").length,
    comboboxes: nodes.filter((node) => node.role?.value === "combobox").length,
    images: nodes
      .filter((node) => node.role?.value === "image")
      .map((node) => node.name?.value || ""),
    currentSteps: nodes
      .filter((node) => (node.properties || []).some((property) => property.name === "current" && property.value?.value === "step"))
      .map((node) => node.name?.value || "")
  };
}

async function getPageQa(client) {
  return evaluate(client, `(() => {
    const visible = (el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
    };
    const nameFor = (el) => {
      if (el.getAttribute("aria-label")) return el.getAttribute("aria-label").trim();
      if (el.getAttribute("aria-labelledby")) {
        return el.getAttribute("aria-labelledby")
          .split(/\\s+/)
          .map((id) => document.getElementById(id)?.textContent?.trim() || "")
          .join(" ")
          .trim();
      }
      if (el.labels?.length) return Array.from(el.labels).map((label) => label.textContent.trim()).join(" ").trim();
      return el.textContent.trim();
    };
    const controls = Array.from(document.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])"))
      .filter((el) => visible(el) && el.type !== "hidden");
    const missingNames = controls
      .map((el) => ({ tag: el.tagName.toLowerCase(), type: el.getAttribute("type") || "", name: nameFor(el) }))
      .filter((item) => !item.name);
    const fieldsets = Array.from(document.querySelectorAll("fieldset"))
      .map((fieldset) => fieldset.querySelector("legend")?.textContent?.trim() || "");
    const preview = document.querySelector(".approx-layout-plan[role='img']");
    const resultActions = Array.from(document.querySelectorAll(".result-actions button, .result-actions a"))
      .map((item) => item.textContent.trim());
    const designStudioText = document.querySelector(".design-studio-page")?.textContent || "";
    const unsafeBodyMatches = designStudioText.match(/final quote|fixed price|guaranteed|compliant design|certified|CAD|blueprint|dimensioned|supplierCost|labou?rRate|margin/gi) || [];
    return {
      title: document.title,
      path: location.pathname,
      h1Count: document.querySelectorAll("h1").length,
      h1: document.querySelector("h1")?.textContent?.trim() || "",
      robots: document.querySelector("meta[name='robots']")?.content || "",
      activeStep: document.querySelector("[aria-current='step']")?.textContent?.trim() || "",
      currentStepCount: document.querySelectorAll("[aria-current='step']").length,
      visibleControlCount: controls.length,
      missingNames,
      fieldsets,
      previewRole: preview?.getAttribute("role") || "",
      previewName: preview?.getAttribute("aria-label") || "",
      previewDescriptionExists: Boolean(document.getElementById("approx-layout-description")),
      trustLabels: document.querySelectorAll(".trust-label-grid span").length,
      resultActions,
      unsafeBodyMatches: Array.from(new Set(unsafeBodyMatches.map((item) => item.toLowerCase())))
    };
  })()`);
}

function assertQa(label, qa, expectedStep) {
  if (qa.path !== "/design-studio") failures.push(`${label}: expected /design-studio, got ${qa.path}`);
  if (qa.h1Count !== 1) failures.push(`${label}: expected one H1, got ${qa.h1Count}`);
  if (!/Bathroom Design Studio/.test(qa.h1)) failures.push(`${label}: unexpected H1 ${qa.h1}`);
  if (!/noindex/i.test(qa.robots) || !/nofollow/i.test(qa.robots)) failures.push(`${label}: route is not noindex/nofollow`);
  if (qa.currentStepCount !== 1) failures.push(`${label}: expected one aria-current step, got ${qa.currentStepCount}`);
  if (expectedStep && !qa.activeStep.includes(expectedStep)) failures.push(`${label}: expected active step ${expectedStep}, got ${qa.activeStep}`);
  if (qa.missingNames.length) failures.push(`${label}: unnamed controls ${JSON.stringify(qa.missingNames)}`);
  if (qa.trustLabels < 7) failures.push(`${label}: expected at least 7 trust labels, got ${qa.trustLabels}`);
  if (qa.unsafeBodyMatches.length) failures.push(`${label}: unsafe wording found ${qa.unsafeBodyMatches.join(", ")}`);
}

async function runQaForViewport(browserWsUrl, viewport) {
  const client = await createPage(browserWsUrl);
  try {
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width <= 480
    });
    await navigate(client, new URL("/design-studio", baseUrl).toString());
    await sleep(350);

    const initialQa = await getPageQa(client);
    assertQa(`${viewport.label} initial`, initialQa, "Bathroom type");

    await keyboardActivateButton(client, "Next");
    await keyboardActivateButton(client, "Next");
    const layoutQa = await getPageQa(client);
    assertQa(`${viewport.label} layout`, layoutQa, "Approximate layout");
    for (const legend of ["Approximate room shape", "Approximate size band", "Approximate door entry", "Fixture-zone placement"]) {
      if (!layoutQa.fieldsets.includes(legend)) failures.push(`${viewport.label} layout: missing fieldset legend ${legend}`);
    }
    if (layoutQa.previewRole !== "img") failures.push(`${viewport.label} layout: preview missing role img`);
    if (!/Approximate .* bathroom layout/.test(layoutQa.previewName)) failures.push(`${viewport.label} layout: preview has weak accessible name`);
    if (!layoutQa.previewDescriptionExists) failures.push(`${viewport.label} layout: preview description target missing`);
    const layoutAxSummary = await getAccessibilityTreeSummary(client);
    if (!layoutAxSummary.images.some((name) => /Approximate .* bathroom layout/.test(name))) {
      failures.push(`${viewport.label}: accessibility tree missing approximate layout image name`);
    }

    await keyboardActivateButton(client, "Next");
    await keyboardActivateButton(client, "Next");
    await keyboardActivateButton(client, "Next");
    await keyboardActivateButton(client, "Next");
    await keyboardActivateButton(client, "Next");
    const evidenceQa = await getPageQa(client);
    assertQa(`${viewport.label} evidence`, evidenceQa, "Evidence readiness");
    if (!evidenceQa.fieldsets.includes("Evidence-readiness checklist")) {
      failures.push(`${viewport.label} evidence: missing fieldset legend Evidence-readiness checklist`);
    }
    await keyboardActivateButton(client, "Create brief");
    const resultQa = await getPageQa(client);
    assertQa(`${viewport.label} result`, resultQa, "Planning brief");
    for (const action of ["Save locally", "Copy design summary", "Print brief", "Start planning estimate", "Request scope review"]) {
      if (!resultQa.resultActions.includes(action)) failures.push(`${viewport.label} result: missing action ${action}`);
    }

    const axSummary = await getAccessibilityTreeSummary(client);

    console.log(`${viewport.label}: controls=${resultQa.visibleControlCount} axButtons=${axSummary.buttons} axComboboxes=${axSummary.comboboxes} resultActions=${resultQa.resultActions.length}`);
  } finally {
    client.close();
  }
}

async function main() {
  if (!existsSync(chromePath)) {
    throw new Error(`Chrome was not found at ${chromePath}. Set CHROME_PATH to run Design Studio accessibility QA.`);
  }

  const userDataDir = join(tmpdir(), `operon-bathrooms-design-studio-a11y-${Date.now()}`);
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDataDir}`,
    "about:blank"
  ], { stdio: ["ignore", "ignore", "pipe"] });

  try {
    const browserWsUrl = await waitForDevtools(chrome);
    for (const viewport of [
      { label: "desktop", width: 1440, height: 1000 },
      { label: "mobile", width: 390, height: 844 }
    ]) {
      await runQaForViewport(browserWsUrl, viewport);
    }
  } finally {
    chrome.kill("SIGTERM");
    await new Promise((resolve) => {
      chrome.once("exit", resolve);
      setTimeout(resolve, 1500);
    });
    await removeUserDataDir(userDataDir);
  }

  if (failures.length) {
    console.error("\nDesign Studio accessibility QA failures:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log("\nPassed: Design Studio keyboard and assistive-technology proxy QA completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
