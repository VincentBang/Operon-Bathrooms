import assert from "node:assert/strict";
import test from "node:test";
import { POST as generateReport } from "../app/api/admin/manual-review-report/route";
import { POST as previewReport } from "../app/api/admin/manual-review-report-preview/route";
import { POST as updateReport } from "../app/api/admin/manual-review-report-update/route";
import { buildManualReviewReport } from "../lib/bathroom-manual-review-report";
import { storeStructuredLead } from "../lib/lead-store";
import { NormalizedLead } from "../lib/lead-workflow";

const token = "test-admin-token";

function useLocalStore() {
  process.env.OPERON_BATHROOMS_ADMIN_TOKEN = token;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "";
}

function lead(overrides: Partial<NormalizedLead>): NormalizedLead {
  return {
    id: "manual-report-lead",
    leadType: "quote_review",
    table: "bathroom_quote_reviews",
    createdAt: "2026-06-17T00:00:00.000Z",
    updatedAt: "2026-06-17T00:00:00.000Z",
    status: "new",
    sourceRoute: "/quote/review",
    landingPage: "/bathroom-renovation-cost-sydney",
    referrer: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    contact: { name: "Report Lead", email: "report@example.com", phone: "0400000000", suburb: "Marrickville", propertyType: "apartment-strata" },
    suburb: "Marrickville",
    propertyType: "apartment-strata",
    bathroomType: "main-bathroom",
    timeline: "urgent",
    quoteAmount: 52000,
    quoteClarityScore: 42,
    riskFlags: ["Waterproofing is not clearly included.", "Deposit/HBCF prompt should be clarified.", "Apartment / strata approval may be required."],
    scoringResult: {
      missingInclusions: ["Waterproofing certificate", "Waste removal"],
      allowanceRisk: ["PC sums unclear"],
      compliancePrompts: ["Clarify HBCF before committing."],
      questionsToAsk: ["Does the quote include waterproofing evidence?"]
    },
    payload: {
      quote: { amount: 52000, gstStatus: "unclear", depositRequested: 8000, timeline: "urgent", builderName: "Builder Co" },
      allowances: { pcSumsPresent: "unclear", provisionalSumsPresent: "unclear", exclusionsClearlyListed: "unclear" },
      upload: { fileName: "quote.pdf", fileType: "application/pdf", fileSize: 1000 }
    },
    internalNotes: "",
    responseStatus: "not_started",
    responsePriority: "high",
    notificationSentAt: null,
    acknowledgementSentAt: null,
    firstResponseAt: null,
    lastContactedAt: null,
    responseDueAt: null,
    followUpAt: null,
    notificationResult: null,
    leadFitScore: 68,
    leadFitTier: "needs_review",
    qualificationStatus: "manual_review_needed",
    urgency: "urgent",
    projectValueBand: "high",
    riskLevel: "critical",
    evidenceQuality: "adequate",
    manualReviewRequired: true,
    manualReviewReason: ["Quote clarity is low and needs human review."],
    missingEvidence: ["Inclusions and exclusions"],
    disqualificationFlags: [],
    recommendedNextAction: "prepare_manual_quote_review",
    qualificationSummary: "Needs review quote review lead.",
    customerSafeNextStep: "",
    qualificationNotes: "",
    qualificationUpdatedAt: null,
    qualificationUpdatedBy: null,
    evidenceChecklist: {
      quotePdf: "received",
      inclusionsExclusions: "missing",
      pcSums: "received",
      provisionalSums: "received",
      builderDetails: "received",
      builderLicence: "missing",
      quoteDate: "missing",
      gstStatus: "missing",
      depositRequested: "received",
      photosPlans: "missing",
      timeline: "received"
    },
    ...overrides
  };
}

test("manual review report summarizes quote review risks without public pricing promises", () => {
  const report = buildManualReviewReport(lead({}));

  assert.equal(report.leadType, "quote_review");
  assert.equal(report.recommendedNextAction, "prepare_manual_quote_review");
  assert.equal(report.manualReviewRequired, true);
  assert.ok(report.quoteReviewSummary?.some((item) => item.includes("Quote clarity score")));
  assert.ok(report.customerFollowUpQuestions.some((question) => /quote|photo|strata/i.test(question)));
  assert.doesNotMatch(JSON.stringify(report), /supplier cost|margin|rate card|final quote/i);
});

test("manual review report flags bad-fit lead internally", () => {
  const report = buildManualReviewReport(
    lead({
      leadType: "estimate",
      table: "bathroom_estimates",
      leadFitTier: "not_fit",
      recommendedNextAction: "refer_out",
      disqualificationFlags: ["Outside likely Sydney service area."],
      payload: { message: "I want DIY waterproofing and legal advice." }
    })
  );

  assert.ok(report.doNotQuoteReasons.length > 0);
  assert.equal(report.recommendedAdminStatus, "not_fit");
  assert.doesNotMatch(report.copyTemplates.customerFollowUpMessage, /not fit|do not quote/i);
});

test("manual review report admin routes require token, preview and persist locally", async () => {
  useLocalStore();
  const stored = await storeStructuredLead({
    leadType: "request_review",
    sourceRoute: "/request-review",
    payload: {
      name: "Manual Report API",
      email: "manual-api@example.com",
      phone: "0400000000",
      suburb: "Marrickville",
      propertyType: "house",
      bathroomType: "main-bathroom",
      projectStage: "planning",
      budgetRange: "25k-40k",
      timeline: "one-to-three-months",
      hasPhotosPlans: false,
      hasBuilderQuote: false,
      preferredNextStep: "email-review",
      message: "Need help preparing a bathroom scope review."
    },
    riskFlags: ["Photos or plans may improve review confidence."],
    scoringResult: {},
    privacyAccepted: true,
    termsAccepted: true,
    request: new Request("http://localhost/request-review")
  });

  const unauth = await previewReport(
    new Request("http://localhost/api/admin/manual-review-report-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadType: stored.lead.leadType, leadId: stored.lead.id })
    })
  );
  assert.equal(unauth.status, 401);

  const preview = await previewReport(
    new Request("http://localhost/api/admin/manual-review-report-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ leadType: stored.lead.leadType, leadId: stored.lead.id })
    })
  );
  const previewBody = await preview.json();
  assert.equal(preview.status, 200);
  assert.equal(previewBody.persisted, false);
  assert.equal(previewBody.report.leadId, stored.lead.id);

  const generated = await generateReport(
    new Request("http://localhost/api/admin/manual-review-report", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ leadType: stored.lead.leadType, leadId: stored.lead.id })
    })
  );
  const generatedBody = await generated.json();
  assert.equal(generated.status, 200);
  assert.equal(generatedBody.persisted, true);

  const updated = await updateReport(
    new Request("http://localhost/api/admin/manual-review-report-update", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reportId: generatedBody.report.reportId, reportStatus: "reviewed", internalReviewNote: "<script>safe text</script>" })
    })
  );
  const updatedBody = await updated.json();
  assert.equal(updated.status, 200);
  assert.equal(updatedBody.report.reportStatus, "reviewed");
  assert.ok(updatedBody.report.internalReviewNotes.some((note: string) => note.includes("<script>safe text</script>")));
});
