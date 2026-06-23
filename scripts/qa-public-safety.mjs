/* global console, process, fetch, URL */

const baseUrl = process.argv[2] || "http://localhost:3000";

const publicRoutes = [
  "/",
  "/quote",
  "/quote/review",
  "/request-review",
  "/site-measure",
  "/bathroom-renovation-cost-sydney",
  "/bathroom-quote-sydney",
  "/services/full-bathroom-renovation",
  "/services/apartment-bathroom-renovation-sydney",
  "/services/ensuite-renovation",
  "/services/small-bathroom-renovation",
  "/services/bathroom-refresh",
  "/services/laundry-bathroom-renovation",
  "/how-it-works",
  "/guides",
  "/areas",
  "/faq",
  "/privacy",
  "/terms"
];

const conversionRoutes = ["/", "/quote", "/quote/review", "/request-review", "/site-measure", "/bathroom-renovation-cost-sydney"];

const forbiddenPublicPatterns = [
  ["final quote promise", /\b(?:free\s+)?final quote online\b|binding quote online|confirmed quote online/i],
  ["fixed price promise", /fixed[- ]price (?:promise|guarantee)|guaranteed price|price guarantee/i],
  ["legal advice claim", /\bwe (?:provide|give) legal advice\b|legal advice service/i],
  ["guaranteed compliance claim", /guaranteed compliance|certified compliant online|we certify compliance online/i],
  ["cheap acquisition positioning", /cheap bathroom renovation/i],
  ["DIY waterproofing positioning", /diy waterproofing guide|waterproof your own bathroom/i],
  ["emergency repair positioning", /emergency leak repair today|24\/7 leak repair/i],
  ["supply-only positioning", /supply-only fixtures/i],
  ["private pricing exposure", /supplier cost:|labou?r rate:|margin logic|rate card|service_role|service role key|lead score:/i]
];

const failures = [];

function textFromHtml(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countMatches(html, pattern) {
  return Array.from(html.matchAll(pattern)).length;
}

async function fetchText(route) {
  const response = await fetch(new URL(route, baseUrl));
  const text = await response.text();
  return { response, text };
}

for (const route of publicRoutes) {
  const { response, text: html } = await fetchText(route);
  const plainText = textFromHtml(html);
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] || "";
  const h1Count = countMatches(html, /<h1\b/gi);
  const hasAdminLink = /href=["']\/admin\b/i.test(html);

  console.log(`${route} ${response.status} title=${title ? "yes" : "no"} h1=${h1Count} canonical=${canonical ? "yes" : "no"} adminLink=${hasAdminLink ? "yes" : "no"}`);

  if (!response.ok) failures.push(`${route}: returned ${response.status}`);
  if (!title) failures.push(`${route}: missing title`);
  if (h1Count !== 1) failures.push(`${route}: expected one h1, found ${h1Count}`);
  if (!canonical) failures.push(`${route}: missing canonical`);
  if (hasAdminLink) failures.push(`${route}: public page links to admin`);

  for (const [label, pattern] of forbiddenPublicPatterns) {
    if (pattern.test(plainText)) failures.push(`${route}: forbidden public wording found (${label})`);
  }

  if (conversionRoutes.includes(route)) {
    const lower = plainText.toLowerCase();
    if (!lower.includes("planning guidance only")) failures.push(`${route}: missing planning guidance only wording`);
    if (!lower.includes("site measure")) failures.push(`${route}: missing site measure wording`);
    if (!lower.includes("written scope confirmation")) failures.push(`${route}: missing written scope confirmation wording`);
  }
}

const robots = await fetchText("/robots.txt");
if (!/disallow:\s*\/admin/i.test(robots.text)) failures.push("robots.txt: missing /admin disallow");
if (!/disallow:\s*\/api/i.test(robots.text)) failures.push("robots.txt: missing /api disallow");

const sitemap = await fetchText("/sitemap.xml");
if (/<loc>[^<]*(?:\/admin|\/api|\/debug|\/internal)/i.test(sitemap.text)) {
  failures.push("sitemap.xml: contains admin/api/debug/internal route");
}

const admin = await fetch(new URL("/admin/leads", baseUrl));
const adminHtml = await admin.text();
if (!/noindex/i.test(adminHtml) || !/nofollow/i.test(adminHtml)) {
  failures.push("/admin/leads: missing noindex/nofollow metadata");
}

if (failures.length) {
  console.error("\nPublic safety QA failures:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("\nPassed: public routes, sitemap, robots and copy safety checks are within the approved public boundary.");
