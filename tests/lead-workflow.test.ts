import assert from "node:assert/strict";
import test from "node:test";
import { prepareAndSendBathroomNotifications, prepareBathroomNotifications } from "../lib/bathroom-notifications";
import { calculateResponseDueAt, determineResponsePriority, NormalizedLead } from "../lib/lead-workflow";
import { buildResponseTemplates } from "../lib/response-templates";

const lead: NormalizedLead = {
  id: "lead-1",
  leadType: "site_measure",
  table: "bathroom_site_measure_requests",
  createdAt: "2026-06-17T00:00:00.000Z",
  updatedAt: "2026-06-17T00:00:00.000Z",
  status: "new",
  sourceRoute: "/site-measure",
  landingPage: "/site-measure?utm_source=test",
  referrer: "",
  utmSource: "test",
  utmMedium: "manual",
  utmCampaign: "qa",
  contact: {
    name: "Vincent Test",
    email: "customer@example.com",
    phone: "0400000000",
    suburb: "Ryde",
    propertyType: "apartment-strata"
  },
  suburb: "Ryde",
  propertyType: "apartment-strata",
  bathroomType: "main-bathroom",
  timeline: "weekday-morning",
  recommendedNextStep: "Book site measure",
  riskFlags: ["Strata approval status should be confirmed."],
  scoringResult: {},
  payload: {
    preferredTimeWindow: "weekday-morning",
    accessNotes: "Lift access"
  },
  internalNotes: "",
  responseStatus: "not_started",
  responsePriority: "urgent",
  notificationSentAt: null,
  acknowledgementSentAt: null,
  firstResponseAt: null,
  lastContactedAt: null,
  responseDueAt: "2026-06-17T04:00:00.000Z",
  followUpAt: null,
  notificationResult: null,
  responseTemplateKey: null,
  leadFitScore: 82,
  leadFitTier: "strong_fit",
  qualificationStatus: "ready_for_site_measure",
  urgency: "urgent",
  projectValueBand: "unknown",
  riskLevel: "medium",
  evidenceQuality: "adequate",
  manualReviewRequired: false,
  manualReviewReason: [],
  missingEvidence: ["Parking, lift or stairs notes"],
  disqualificationFlags: [],
  recommendedNextAction: "book_site_measure",
  qualificationSummary: "strong fit site measure lead",
  customerSafeNextStep: "Prepare access notes before site measure.",
  qualificationNotes: "",
  qualificationUpdatedAt: "2026-06-17T00:00:00.000Z",
  qualificationUpdatedBy: "system",
  evidenceChecklist: {
    addressOrSuburb: "received",
    phone: "received",
    preferredWindow: "received",
    accessNotes: "received",
    parkingLiftStairs: "missing"
  }
};

test("response workflow calculates priority and simple SLA due dates", () => {
  const priority = determineResponsePriority({
    leadType: "site_measure",
    riskFlags: [],
    contact: { phone: "0400000000" }
  });

  assert.equal(priority, "urgent");
  assert.equal(calculateResponseDueAt("site_measure", priority, new Date("2026-06-17T00:00:00.000Z")), "2026-06-17T04:00:00.000Z");
});

test("notifications prepare safely when email provider env vars are absent", () => {
  const previousKey = process.env.RESEND_API_KEY;
  const previousFrom = process.env.OPERON_BATHROOMS_FROM_EMAIL;
  const previousAdmin = process.env.OPERON_BATHROOMS_ADMIN_EMAIL;
  const previousMode = process.env.OPERON_BATHROOMS_NOTIFICATION_MODE;
  delete process.env.RESEND_API_KEY;
  delete process.env.OPERON_BATHROOMS_FROM_EMAIL;
  delete process.env.OPERON_BATHROOMS_ADMIN_EMAIL;
  delete process.env.OPERON_BATHROOMS_NOTIFICATION_MODE;

  const bundle = prepareBathroomNotifications(lead);
  assert.equal(bundle.result.notificationPrepared, true);
  assert.equal(bundle.result.adminNotificationPrepared, false);
  assert.equal(bundle.result.customerAcknowledgementPrepared, false);
  assert.equal(bundle.result.adminNotificationSent, false);
  assert.equal(bundle.result.customerAcknowledgementSent, false);
  assert.equal(bundle.result.notificationMode, "preview");
  assert.equal(bundle.result.provider, "none");
  assert.ok(bundle.result.notificationWarnings.some((warning) => warning.includes("preview")));

  if (previousKey === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = previousKey;
  if (previousFrom === undefined) delete process.env.OPERON_BATHROOMS_FROM_EMAIL;
  else process.env.OPERON_BATHROOMS_FROM_EMAIL = previousFrom;
  if (previousAdmin === undefined) delete process.env.OPERON_BATHROOMS_ADMIN_EMAIL;
  else process.env.OPERON_BATHROOMS_ADMIN_EMAIL = previousAdmin;
  if (previousMode === undefined) delete process.env.OPERON_BATHROOMS_NOTIFICATION_MODE;
  else process.env.OPERON_BATHROOMS_NOTIFICATION_MODE = previousMode;
});

test("admin response templates avoid final pricing promises", () => {
  const templates = buildResponseTemplates(lead);
  assert.match(templates.emailBody, /planning guidance only/i);
  assert.match(templates.emailBody, /site measure/i);
  assert.doesNotMatch(templates.emailBody, /fixed-price guarantee/i);
  assert.ok(templates.smsCallScript.length > 20);
  assert.ok(templates.missingInfoQuestions.some((question) => question.includes("strata")));
});

test("email provider errors are safe and do not throw", async () => {
  const previousKey = process.env.RESEND_API_KEY;
  const previousFrom = process.env.OPERON_BATHROOMS_FROM_EMAIL;
  const previousAdmin = process.env.OPERON_BATHROOMS_ADMIN_EMAIL;
  const previousMode = process.env.OPERON_BATHROOMS_NOTIFICATION_MODE;
  const previousFetch = globalThis.fetch;
  process.env.RESEND_API_KEY = "test-key";
  process.env.OPERON_BATHROOMS_FROM_EMAIL = "bathrooms@example.com";
  process.env.OPERON_BATHROOMS_ADMIN_EMAIL = "admin@example.com";
  process.env.OPERON_BATHROOMS_NOTIFICATION_MODE = "send";
  globalThis.fetch = (async () => new Response("{}", { status: 500 })) as typeof fetch;

  const result = await prepareAndSendBathroomNotifications(lead);
  assert.equal(result.notificationPrepared, true);
  assert.equal(result.adminNotificationSent, false);
  assert.ok(result.notificationErrors.every((error) => !error.includes("test-key")));

  globalThis.fetch = previousFetch;
  if (previousKey === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = previousKey;
  if (previousFrom === undefined) delete process.env.OPERON_BATHROOMS_FROM_EMAIL;
  else process.env.OPERON_BATHROOMS_FROM_EMAIL = previousFrom;
  if (previousAdmin === undefined) delete process.env.OPERON_BATHROOMS_ADMIN_EMAIL;
  else process.env.OPERON_BATHROOMS_ADMIN_EMAIL = previousAdmin;
  if (previousMode === undefined) delete process.env.OPERON_BATHROOMS_NOTIFICATION_MODE;
  else process.env.OPERON_BATHROOMS_NOTIFICATION_MODE = previousMode;
});
