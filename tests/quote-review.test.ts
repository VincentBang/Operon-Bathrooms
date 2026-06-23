import assert from "node:assert/strict";
import test from "node:test";
import { POST as postQuoteReview } from "../app/api/quote-review/route";
import { QuoteReviewInput } from "../lib/intake-schemas";
import { reviewBathroomQuote } from "../lib/quote-review";

const baseInput: QuoteReviewInput = {
  contact: {
    name: "Test Lead",
    email: "lead@example.com",
    phone: "",
    suburb: "Marrickville",
    propertyType: "apartment-strata"
  },
  quote: {
    amount: 42000,
    builderName: "",
    builderLicence: "",
    quoteDate: "",
    gstStatus: "unclear",
    depositRequested: 8000,
    timeline: "not-stated",
    hbcMentioned: "unclear"
  },
  risk: {
    buildingAge: "pre-1980",
    leaksOrMould: "yes",
    suspectedAsbestos: "yes",
    strataApprovalRequired: "unclear",
    accessConstraints: "yes",
    layoutOrServiceChanges: "yes"
  },
  scope: {
    demolition: false,
    rubbishRemoval: false,
    waterproofing: false,
    waterproofingCertificate: false,
    floorTiling: true,
    wallTiling: true,
    screedFallsDrainage: false,
    plumbingRoughIn: false,
    plumbingRelocation: false,
    electrical: false,
    ventilation: false,
    showerScreen: true,
    vanity: true,
    toilet: true,
    tapware: true,
    mirrorCabinet: true,
    accessories: false,
    painting: false,
    heating: false
  },
  allowances: {
    pcSumsPresent: "unclear",
    provisionalSumsPresent: "no",
    tileAllowanceAmount: "",
    fixtureAllowanceAmount: "",
    exclusionsClearlyListed: "unclear"
  },
  upload: { fileName: "", fileType: "", fileSize: 0 },
  consent: { privacyAccepted: true, termsAccepted: true, guidanceAccepted: true },
  company: "",
  attribution: {
    sourceRoute: "/quote/review",
    landingPage: "/bathroom-renovation-cost-sydney?utm_source=test",
    referrer: "https://example.com",
    utmSource: "test",
    utmMedium: "organic",
    utmCampaign: "bathrooms",
    utmContent: "cta",
    utmTerm: "quote"
  }
};

test("quote review scoring flags missing inclusions and compliance prompts", () => {
  const result = reviewBathroomQuote(baseInput);

  assert.ok(result.clarityScore < 70);
  assert.ok(result.missingInclusions.some((item) => item.includes("waterproofing")));
  assert.ok(result.allowanceRisk.length > 0);
  assert.ok(result.compliancePrompts.some((item) => item.includes("HBCF")));
  assert.ok(result.questionsToAsk.some((item) => item.includes("licence")));
});

test("quote review API scores server-side and rejects honeypot spam", async () => {
  const goodResponse = await postQuoteReview(
    new Request("http://localhost/api/quote-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(baseInput)
    })
  );
  const goodBody = await goodResponse.json();

  assert.equal(goodResponse.status, 200);
  assert.equal(goodBody.ok, true);
  assert.equal(goodBody.stored, true);
  assert.equal(typeof goodBody.result.clarityScore, "number");
  assert.equal(goodBody.responsePriority, "high");
  assert.equal(goodBody.notificationPrepared, true);
  assert.equal(goodBody.adminNotificationSent, false);
  assert.equal(goodBody.customerAcknowledgementSent, false);
  assert.equal(typeof goodBody.notificationWarning, "string");
  assert.equal("notification" in goodBody, false);
  assert.equal("notificationPreview" in goodBody, false);

  const spamResponse = await postQuoteReview(
    new Request("http://localhost/api/quote-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...baseInput, company: "spam co" })
    })
  );

  assert.equal(spamResponse.status, 400);
});
