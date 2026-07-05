import assert from "node:assert/strict";
import test from "node:test";
import { GET as getAdminProductSchedules, POST as postAdminProductSchedule } from "../app/api/admin/product-schedules/route";
import { POST } from "../app/api/product-schedule/route";
import {
  calculatePcAllowanceRange,
  generateBathroomProductSchedule,
  productScheduleInputSchema,
  reviewBathroomProductQuoteText,
  type ProductScheduleInput
} from "../lib/product-schedule";
import { bathroomProductCandidates } from "../data/product-schedule/bathroom-products";

const baseInput: ProductScheduleInput = {
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
  hasExistingQuote: false,
  wantsRenovationHelp: true,
  wantsProductQuote: false,
  wantsQuoteReview: false,
  quoteText: ""
};

const adminToken = "product-schedule-admin-token";

function useProductScheduleAdminToken() {
  process.env.OPERON_BATHROOMS_ADMIN_TOKEN = adminToken;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "";
}

test("product schedule validation accepts complete MVP input", () => {
  const parsed = productScheduleInputSchema.safeParse(baseInput);

  assert.equal(parsed.success, true);
});

test("small apartment bathroom recommends compact vanity and strata risk prompts", () => {
  const result = generateBathroomProductSchedule({
    ...baseInput,
    bathroomType: "apartment_bathroom",
    bathroomSize: "compact",
    vanityWidth: "under_600"
  });

  const vanity = result.schedule.items.find((item) => item.category.includes("vanity"));

  assert.match(vanity?.recommendedProduct.name ?? "", /Compact wall-hung vanity/);
  assert.match(result.warnings.join(" "), /Apartment\/strata bathrooms/);
  assert.match(result.warnings.join(" "), /not legal advice/);
});

test("premium LED and specialty finish selections produce compliance warnings", () => {
  const result = generateBathroomProductSchedule({
    ...baseInput,
    stylePreference: "premium_hotel",
    budgetLevel: "premium",
    tapwareFinish: "matte_black",
    mirrorPreference: "led_mirror"
  });

  const text = JSON.stringify(result);

  assert.match(text, /LED mirror/);
  assert.match(text, /electrical compliance/i);
  assert.match(text, /WaterMark and WELS/);
  assert.match(text, /Specialty tapware finishes/);
});

test("allowance calculation returns bounded planning range", () => {
  const products = bathroomProductCandidates.slice(0, 2);
  const range = calculatePcAllowanceRange(products, "mid_range");

  assert.equal(range.low > 0, true);
  assert.equal(range.high > range.low, true);
  assert.match(range.label, /\$/);
});

test("quote text review flags missing bathroom product allowances", () => {
  const flags = reviewBathroomProductQuoteText(
    "Bathroom vanity, basin and tapware PC item $600. Waterproofing included."
  );

  assert.ok(flags.some((flag) => flag.includes("mirror")));
  assert.ok(flags.some((flag) => flag.includes("accessories")));
  assert.ok(flags.some((flag) => flag.includes("WaterMark/WELS")));
  assert.ok(flags.some((flag) => flag.includes("allowance may be low") || flag.includes("Allowance may be low")));
});

test("product schedule public output does not expose internal margin or supplier fields", () => {
  const result = generateBathroomProductSchedule(baseInput);
  const publicJson = JSON.stringify(result);

  assert.doesNotMatch(publicJson, /estimated_margin/);
  assert.doesNotMatch(publicJson, /default_margin_range/);
  assert.doesNotMatch(publicJson, /supplier/);
});

test("phase 2 schedule includes substitution options and pack comparison", () => {
  const result = generateBathroomProductSchedule({
    ...baseInput,
    budgetLevel: "premium",
    mirrorPreference: "led_mirror",
    tapwareFinish: "brushed_gold"
  });
  const publicJson = JSON.stringify(result);

  assert.ok(result.schedule.items.some((item) => item.substitutionOptions.length > 0));
  assert.ok(result.schedule.packComparisons.length > 0);
  assert.match(result.schedule.packComparisons[0].whyItFits, /planning|fit|allowance|finish/i);
  assert.doesNotMatch(publicJson, /supplier|estimated_margin|default_margin_range/);
});

test("phase 2 quote allowance review compares visible amounts to planning bands", () => {
  const result = generateBathroomProductSchedule({
    ...baseInput,
    quoteText: "Vanity allowance $500. Basin allowance $200. Tapware PC item $300. Mirror excluded."
  });

  assert.ok(result.schedule.allowanceReview);
  assert.ok(
    result.schedule.allowanceReview.checks.some(
      (check) => check.category === "vanity" && check.status === "below_planning_range"
    )
  );
  assert.ok(result.schedule.allowanceReview.quoteRiskPrompts.some((prompt) => /clarify/i.test(prompt)));
});

test("phase 2 builder export stays planning-only and non-commerce", () => {
  const result = generateBathroomProductSchedule({
    ...baseInput,
    quoteText: "Vanity allowance $500. Basin allowance $200. Tapware allowance $300."
  });

  assert.match(result.schedule.builderExport, /planning guidance/i);
  assert.match(result.schedule.builderExport, /site measure/i);
  assert.match(result.schedule.builderExport, /Not for: checkout/);
  assert.doesNotMatch(result.schedule.builderExport, /pay now|add to cart|confirmed order|supplier|margin|rate card/i);
});

test("product schedule API validates, stores lead, and returns safe schedule", async () => {
  const request = new Request("http://localhost/api/product-schedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: {
        ...baseInput,
        quoteText: "Vanity PC item $600. Tapware by owner."
      },
      lead: {
        name: "Schedule Lead",
        email: "schedule@example.com",
        phone: "0400000000",
        consentAccepted: true,
        company: ""
      }
    })
  });
  const response = await POST(request);
  const payload = await response.json();
  const publicJson = JSON.stringify(payload);

  assert.equal(response.status, 200);
  assert.equal(payload.ok, true);
  assert.equal(payload.stored, true);
  assert.match(payload.schedule.builderReadySummary, /Planning guidance only/);
  assert.doesNotMatch(publicJson, /estimated_margin/);
  assert.doesNotMatch(publicJson, /default_margin_range/);
});

test("phase 3 admin endpoint lists and updates product schedule follow-up context", async () => {
  useProductScheduleAdminToken();
  const marker = globalThis.crypto.randomUUID();
  const email = `product-schedule-${marker}@example.com`;
  const submit = await POST(
    new Request("http://localhost/api/product-schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: {
          ...baseInput,
          wantsProductQuote: true,
          wantsQuoteReview: true,
          quoteText: "Vanity allowance $500. Basin allowance $200. Tapware allowance $300."
        },
        lead: {
          name: "Product Schedule Admin",
          email,
          phone: "0400000000",
          consentAccepted: true,
          company: ""
        }
      })
    })
  );
  const submitBody = await submit.json();
  assert.equal(submit.status, 200);
  assert.equal(submitBody.ok, true);

  const unauthorized = await getAdminProductSchedules(new Request("http://localhost/api/admin/product-schedules"));
  assert.equal(unauthorized.status, 401);

  const list = await getAdminProductSchedules(
    new Request(`http://localhost/api/admin/product-schedules?token=${adminToken}`)
  );
  const listBody = await list.json();
  assert.equal(list.status, 200);
  assert.equal(listBody.ok, true);
  const record = listBody.records.find((item: { contact?: { email?: string } }) => item.contact?.email === email);
  assert.ok(record);
  assert.equal(record.requested.productQuote, true);
  assert.equal(record.requested.quoteReview, true);
  assert.ok(record.packInterests.length >= 1);
  assert.ok(record.allowanceFlags.length >= 1);
  assert.ok(record.substitutionNotes.length >= 1);
  assert.match(record.builderExport, /planning guidance/i);
  assert.doesNotMatch(JSON.stringify(record), /estimated_margin|default_margin_range|supplier cost|rate card/i);

  const updated = await postAdminProductSchedule(
    new Request("http://localhost/api/admin/product-schedules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        recordId: record.id,
        adminStatus: "follow_up_needed",
        followUpStatus: "requested",
        internalNotes: "Ask customer whether they want curated pack follow-up."
      })
    })
  );
  const updatedBody = await updated.json();
  assert.equal(updated.status, 200);
  assert.equal(updatedBody.record.adminStatus, "follow_up_needed");
  assert.equal(updatedBody.record.followUpStatus, "requested");
  assert.match(updatedBody.record.internalNotes, /curated pack/i);
});
