/* global console, process, fetch, URLSearchParams */

const baseUrl = (process.argv[2] || process.env.OPERON_BATHROOMS_ADMIN_SMOKE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const adminToken = process.env.OPERON_BATHROOMS_ADMIN_TOKEN || "";
const nonLocalApproved = process.env.OPERON_BATHROOMS_ADMIN_SMOKE_APPROVED === "true";
const marker = `admin_smoke_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const leadEmail = `admin-smoke-lead-${marker}@example.com`;
const productEmail = `admin-smoke-product-${marker}@example.com`;
const failures = [];

function fail(message) {
  failures.push(message);
}

function isLocalUrl(value) {
  return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?/i.test(value);
}

function safeJson(value) {
  const text = JSON.stringify(value).toLowerCase();
  const forbidden = [
    /operon_bathrooms_admin_token/,
    /authorization/,
    /bearer /,
    /service_role/,
    /supplier cost/,
    /labou?r rate/,
    /margin logic/,
    /rate card/
  ];
  for (const pattern of forbidden) {
    if (pattern.test(text)) fail(`Response leaked forbidden marker: ${pattern}`);
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let json = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }
  }
  return { response, json };
}

function requestReviewPayload() {
  return {
    name: "Admin Smoke Lead",
    email: leadEmail,
    phone: "0400000000",
    suburb: "Sydney",
    propertyType: "house",
    bathroomType: "main-bathroom",
    projectStage: "planning",
    budgetRange: "40k-60k",
    timeline: "one-to-three-months",
    hasPhotosPlans: true,
    hasBuilderQuote: false,
    preferredNextStep: "email-review",
    message: `Admin smoke test lead ${marker}. Planning guidance only verification.`,
    privacyAccepted: true,
    termsAccepted: true,
    company: "",
    attribution: {
      sourceRoute: "/request-review",
      landingPage: `/request-review?utm_campaign=${marker}`,
      referrer: "admin-smoke-test",
      utmSource: "admin-smoke",
      utmMedium: "qa",
      utmCampaign: marker,
      utmContent: "standard-lead",
      utmTerm: "admin smoke"
    }
  };
}

function productSchedulePayload() {
  return {
    input: {
      projectType: "renovation",
      bathroomType: "main_bathroom",
      bathroomSize: "standard",
      renovationStage: "early_planning",
      stylePreference: "warm_neutral",
      vanityWidth: "900",
      storagePreference: "drawers",
      basinPreference: "integrated",
      tapwareFinish: "chrome",
      showerConfiguration: "existing_position",
      mirrorPreference: "plain_mirror",
      accessoryFinish: "match_tapware",
      budgetLevel: "mid_range",
      customerType: "homeowner",
      postcode: "2000",
      timeline: "1_3_months",
      hasExistingQuote: true,
      wantsRenovationHelp: true,
      wantsProductQuote: true,
      wantsQuoteReview: true,
      quoteText: `Admin smoke product schedule ${marker}. Vanity allowance $600. Tapware allowance $300. Mirror excluded.`
    },
    lead: {
      name: "Admin Smoke Product Schedule",
      email: productEmail,
      phone: "0400000000",
      consentAccepted: true,
      company: ""
    }
  };
}

async function submitStandardLead() {
  const { response, json } = await request("/api/request-review", {
    method: "POST",
    body: JSON.stringify(requestReviewPayload())
  });
  safeJson(json);
  if (!response.ok || !json?.ok || !json?.stored) {
    fail(`Standard lead submission failed with ${response.status}.`);
    return null;
  }
  console.log(`- standard lead submitted: ${json.leadId}`);
  return json.leadId;
}

async function submitProductSchedule() {
  const { response, json } = await request("/api/product-schedule", {
    method: "POST",
    body: JSON.stringify(productSchedulePayload())
  });
  safeJson(json);
  if (!response.ok || !json?.ok || !json?.stored) {
    fail(`Product Schedule submission failed with ${response.status}.`);
    return null;
  }
  console.log(`- product schedule submitted: ${json.recordId}`);
  return json.recordId;
}

async function verifyStandardLead(leadId) {
  const params = new URLSearchParams({ search: leadEmail, limit: "20" });
  const { response, json } = await request(`/api/admin/leads?${params.toString()}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  safeJson(json);
  if (!response.ok || !json?.ok) {
    fail(`Admin leads endpoint failed with ${response.status}.`);
    return;
  }
  const matching = (json.leads || []).find((lead) => lead.id === leadId || lead.contact?.email === leadEmail);
  if (!matching) fail("Submitted standard lead was not visible in protected admin leads endpoint.");
  if (typeof json.summary?.totalLeads !== "number") fail("Admin leads summary did not include totalLeads count.");
  console.log(`- admin leads visible: total=${json.summary?.totalLeads ?? "n/a"} matched=${matching ? "yes" : "no"}`);
}

async function verifyProductSchedule(recordId) {
  const { response, json } = await request("/api/admin/product-schedules", {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  safeJson(json);
  if (!response.ok || !json?.ok) {
    fail(`Admin Product Schedule endpoint failed with ${response.status}.`);
    return;
  }
  const matching = (json.records || []).find((record) => record.id === recordId || record.contact?.email === productEmail);
  if (!matching) fail("Submitted Product Schedule was not visible in protected admin Product Schedule endpoint.");
  if (typeof json.summary?.totalSchedules !== "number") fail("Product Schedule summary did not include totalSchedules count.");
  console.log(`- admin product schedules visible: total=${json.summary?.totalSchedules ?? "n/a"} matched=${matching ? "yes" : "no"}`);
}

async function main() {
  console.log("Operon Bathrooms admin lead smoke test");
  console.log(`- Base URL: ${baseUrl}`);
  console.log("- Admin token: " + (adminToken ? "present" : "missing"));
  console.log("- Secrets are never printed.");

  if (!adminToken) fail("Set OPERON_BATHROOMS_ADMIN_TOKEN before running this smoke test.");
  if (!isLocalUrl(baseUrl) && !nonLocalApproved) {
    fail("Set OPERON_BATHROOMS_ADMIN_SMOKE_APPROVED=true before submitting smoke leads to a non-local URL.");
  }
  if (failures.length) {
    console.error("\nAdmin smoke test refused to run:");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  const leadId = await submitStandardLead();
  const recordId = await submitProductSchedule();
  if (leadId) await verifyStandardLead(leadId);
  if (recordId) await verifyProductSchedule(recordId);

  if (failures.length) {
    console.error("\nAdmin smoke test failures:");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  console.log("\nPassed: submitted lead and Product Schedule are visible through protected admin endpoints.");
}

await main();
