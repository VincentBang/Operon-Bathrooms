import assert from "node:assert/strict";
import test from "node:test";
import { qualifyBathroomLead } from "../lib/bathroom-lead-qualification";
import { NormalizedLead } from "../lib/lead-workflow";

function lead(overrides: Partial<NormalizedLead>): NormalizedLead {
  return {
    id: "lead-test",
    leadType: "estimate",
    table: "bathroom_estimates",
    createdAt: "2026-06-17T00:00:00.000Z",
    updatedAt: "2026-06-17T00:00:00.000Z",
    status: "new",
    sourceRoute: "/quote",
    landingPage: "/quote",
    referrer: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    contact: {
      name: "Test Lead",
      email: "lead@example.com",
      phone: "0400000000",
      suburb: "Marrickville",
      propertyType: "house"
    },
    suburb: "Marrickville",
    propertyType: "house",
    bathroomType: "full-bathroom",
    timeline: "one-to-three-months",
    estimateRange: "$32,000 - $44,000",
    confidenceScore: 82,
    quoteAmount: undefined,
    quoteClarityScore: undefined,
    recommendedNextStep: "Book site measure",
    riskFlags: [],
    scoringResult: {},
    payload: {
      projectType: "full-bathroom",
      timeline: "one-to-three-months",
      propertyType: "house",
      suburb: "Marrickville",
      fixtureLevel: "mid",
      layoutChange: "keep"
    },
    internalNotes: "",
    responseStatus: "not_started",
    responsePriority: "normal",
    notificationSentAt: null,
    acknowledgementSentAt: null,
    firstResponseAt: null,
    lastContactedAt: null,
    responseDueAt: null,
    followUpAt: null,
    notificationResult: null,
    responseTemplateKey: null,
    leadFitScore: null,
    leadFitTier: null,
    qualificationStatus: "unreviewed",
    urgency: null,
    projectValueBand: null,
    riskLevel: null,
    evidenceQuality: null,
    manualReviewRequired: false,
    manualReviewReason: [],
    missingEvidence: [],
    disqualificationFlags: [],
    recommendedNextAction: null,
    qualificationSummary: null,
    customerSafeNextStep: null,
    qualificationNotes: "",
    qualificationUpdatedAt: null,
    qualificationUpdatedBy: null,
    evidenceChecklist: {},
    ...overrides
  };
}

test("strong fit estimate is actionable without manual review when evidence is adequate", () => {
  const result = qualifyBathroomLead(
    lead({
      evidenceChecklist: {
        photos: "received",
        roughDimensions: "received",
        bathroomType: "received",
        propertyType: "received",
        budget: "received",
        timeline: "received",
        layoutDetails: "received",
        strataStatus: "not_required",
        accessNotes: "received",
        knownIssues: "received",
        preferredFinishes: "received"
      }
    })
  );

  assert.match(result.leadFitTier, /strong_fit|good_fit/);
  assert.equal(result.manualReviewRequired, false);
  assert.equal(result.evidenceQuality, "complete");
});

test("high-risk apartment estimate requires manual review", () => {
  const result = qualifyBathroomLead(
    lead({
      propertyType: "apartment",
      contact: { name: "Risk Lead", email: "risk@example.com", phone: "0400000000", suburb: "Chatswood", propertyType: "apartment" },
      suburb: "Chatswood",
      timeline: "ready-now",
      confidenceScore: 42,
      estimateRange: "$82,000 - $113,000",
      riskFlags: [
        "Apartment / strata / Class 2 screening may be required.",
        "Possible asbestos must be assessed before disturbance.",
        "Plumbing relocation should be confirmed by licensed trades."
      ]
    })
  );

  assert.equal(result.manualReviewRequired, true);
  assert.match(result.riskLevel, /high|critical/);
  assert.ok(result.missingEvidence.some((item) => /strata|asbestos|photo/i.test(item)));
});

test("weak low-budget lead avoids site measure recommendation", () => {
  const result = qualifyBathroomLead(
    lead({
      contact: { name: "Low Budget", email: "low@example.com", phone: "", suburb: "Marrickville", propertyType: "house" },
      estimateRange: "$8,000 - $12,000",
      payload: { budgetRange: "under-25k", message: "cheapest option only" }
    })
  );

  assert.match(result.leadFitTier, /weak_fit|not_fit/);
  assert.match(result.recommendedNextAction, /clarify_budget|mark_not_fit|refer_out/);
});

test("quote review with uploaded low-clarity quote routes to manual quote review", () => {
  const result = qualifyBathroomLead(
    lead({
      leadType: "quote_review",
      table: "bathroom_quote_reviews",
      quoteAmount: 52000,
      quoteClarityScore: 30,
      riskFlags: ["Waterproofing is not clearly included."],
      payload: {
        contact: { propertyType: "house" },
        quote: { amount: 52000, timeline: "urgent" },
        upload: { fileName: "quote.pdf" },
        allowances: { pcSumsPresent: "unclear", provisionalSumsPresent: "unclear", exclusionsClearlyListed: "unclear" }
      }
    })
  );

  assert.equal(result.manualReviewRequired, true);
  assert.match(result.recommendedNextAction, /prepare_manual_quote_review|request_inclusions_exclusions/);
});

test("site measure ready lead becomes ready for site measure", () => {
  const result = qualifyBathroomLead(
    lead({
      leadType: "site_measure",
      table: "bathroom_site_measure_requests",
      payload: {
        preferredTimeWindow: "weekday-morning",
        accessNotes: "Easy side access",
        parkingLiftStairsNotes: "Street parking",
        strataApprovalStatus: "not-required"
      },
      evidenceChecklist: {
        addressOrSuburb: "received",
        phone: "received",
        preferredWindow: "received",
        accessNotes: "received",
        parkingLiftStairs: "received",
        strataStatus: "not_required",
        knownIssues: "received",
        photosPlans: "received"
      }
    })
  );

  assert.equal(result.recommendedNextAction, "book_site_measure");
  assert.equal(result.qualificationStatus, "ready_for_site_measure");
});

test("outside service area is refer out or not fit", () => {
  const result = qualifyBathroomLead(
    lead({
      suburb: "Melbourne",
      contact: { name: "Out Area", email: "out@example.com", phone: "0400000000", suburb: "Melbourne", propertyType: "house" }
    })
  );

  assert.equal(result.recommendedNextAction, "refer_out");
  assert.ok(result.disqualificationFlags.length > 0);
});

test("missing evidence lead asks for evidence before heavier review", () => {
  const result = qualifyBathroomLead(
    lead({
      evidenceChecklist: {
        photos: "missing",
        roughDimensions: "missing",
        bathroomType: "received",
        propertyType: "received",
        budget: "received",
        timeline: "missing"
      }
    })
  );

  assert.match(result.evidenceQuality, /thin|missing/);
  assert.match(result.recommendedNextAction, /request_photos|clarify_timeline/);
});

test("request review with builder quote asks for quote evidence", () => {
  const result = qualifyBathroomLead(
    lead({
      leadType: "request_review",
      table: "bathroom_review_requests",
      payload: {
        projectStage: "has-builder-quote",
        budgetRange: "40k-60k",
        timeline: "one-to-three-months",
        hasPhotosPlans: true,
        hasBuilderQuote: true,
        preferredNextStep: "email-review",
        message: "I have an early bathroom quote and want help checking scope clarity."
      }
    })
  );

  assert.equal(result.recommendedNextAction, "request_quote_pdf");
  assert.match(result.leadFitTier, /strong_fit|good_fit|needs_review/);
});

test("bad-fit DIY or legal-advice request is not treated as site-measure ready", () => {
  const result = qualifyBathroomLead(
    lead({
      payload: {
        budgetRange: "under-25k",
        message: "I want DIY waterproofing instructions and legal advice for unlicensed work."
      }
    })
  );

  assert.match(result.leadFitTier, /weak_fit|not_fit/);
  assert.notEqual(result.recommendedNextAction, "book_site_measure");
  assert.ok(result.disqualificationFlags.length > 0);
});
