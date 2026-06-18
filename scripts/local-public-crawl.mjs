/* global console, process, fetch, URL */

const baseUrl = process.argv[2] || "http://localhost:3000";

const routes = [
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
  "/faq",
  "/privacy",
  "/terms"
];

function textBetween(html, pattern) {
  return html.match(pattern)?.[1]?.replace(/\s+/g, " ").trim() || "";
}

function countMatches(html, pattern) {
  return Array.from(html.matchAll(pattern)).length;
}

const failures = [];

for (const route of routes) {
  const url = new URL(route, baseUrl).toString();
  const response = await fetch(url);
  const html = await response.text();
  const title = textBetween(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const h1Count = countMatches(html, /<h1\b/gi);
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] || "";
  const hasFinalQuoteClaim = /free final quote online|fixed price guarantee|guaranteed compliance|we provide legal advice|certified compliant online/i.test(html);
  const hasPrivateLeak = /supplier cost:|labou?r rate:|margin logic|service_role|service role key|lead score:/i.test(html);

  console.log(`${route} ${response.status} title=${title ? "yes" : "no"} h1=${h1Count} canonical=${canonical ? "yes" : "no"}`);

  if (!response.ok) failures.push(`${route}: returned ${response.status}`);
  if (!title) failures.push(`${route}: missing title`);
  if (h1Count !== 1) failures.push(`${route}: expected one h1, found ${h1Count}`);
  if (!canonical) failures.push(`${route}: missing canonical`);
  if (hasFinalQuoteClaim) failures.push(`${route}: risky final/legal/compliance wording found`);
  if (hasPrivateLeak) failures.push(`${route}: possible private/internal leak wording found`);
}

if (failures.length) {
  console.error("\nCrawl failures:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("\nPassed: public crawl routes have titles, one H1, canonicals and no obvious forbidden wording.");
