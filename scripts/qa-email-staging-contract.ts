import { prepareAndSendBathroomNotifications, prepareBathroomNotifications } from "../lib/bathroom-notifications";
import { NormalizedLead } from "../lib/lead-workflow";

const target = process.env.OPERON_BATHROOMS_EMAIL_QA_TARGET || "local";
const sendApproved = process.env.OPERON_BATHROOMS_EMAIL_QA_SEND_APPROVED === "true";
const mode = process.env.OPERON_BATHROOMS_NOTIFICATION_MODE || "preview";
const qaRecipient = process.env.OPERON_BATHROOMS_EMAIL_QA_RECIPIENT || "";

const failures: string[] = [];
const warnings: string[] = [];

function fail(message: string) {
  failures.push(message);
}

function warn(message: string) {
  warnings.push(message);
}

function restoreEnv(snapshot: Record<string, string | undefined>) {
  for (const [key, value] of Object.entries(snapshot)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function sampleLead(): NormalizedLead {
  return {
    id: `email-qa-${Date.now().toString(36)}`,
    leadType: "site_measure",
    table: "bathroom_site_measure_requests",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "new",
    sourceRoute: "/site-measure",
    landingPage: "/site-measure?utm_source=email-qa",
    referrer: "",
    utmSource: "email-qa",
    utmMedium: "local",
    utmCampaign: "notification-contract",
    utmContent: "",
    utmTerm: "",
    contact: {
      name: "Operon Email QA",
      email: qaRecipient || "qa-recipient@example.com",
      phone: "0400000000",
      suburb: "Ryde",
      propertyType: "apartment-strata"
    },
    suburb: "Ryde",
    propertyType: "apartment-strata",
    bathroomType: "main-bathroom",
    timeline: "weekday-morning",
    recommendedNextStep: "Request site measure",
    riskFlags: ["Strata approval status should be confirmed.", "Waterproofing condition cannot be confirmed online."],
    scoringResult: {},
    payload: {
      preferredTimeWindow: "weekday-morning",
      accessNotes: "Lift access may need booking.",
      parkingLiftStairsNotes: "Street parking only.",
      strataApprovalStatus: "unknown",
      knownIssues: "Possible mould near shower."
    },
    internalNotes: "",
    responseStatus: "not_started",
    responsePriority: "urgent",
    notificationSentAt: null,
    acknowledgementSentAt: null,
    firstResponseAt: null,
    lastContactedAt: null,
    responseDueAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    followUpAt: null,
    notificationResult: null,
    responseTemplateKey: null,
    leadFitScore: 78,
    leadFitTier: "good_fit",
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
    qualificationSummary: "Email QA site measure lead.",
    customerSafeNextStep: "Prepare photos and access notes before site measure.",
    qualificationNotes: "",
    qualificationUpdatedAt: new Date().toISOString(),
    qualificationUpdatedBy: "email_qa",
    evidenceChecklist: {
      addressOrSuburb: "received",
      phone: "received",
      preferredWindow: "received",
      accessNotes: "received",
      parkingLiftStairs: "received",
      strataStatus: "missing",
      knownIssues: "received",
      photosPlans: "missing"
    }
  };
}

function assertSafePublicResult(payload: unknown) {
  const text = JSON.stringify(payload).toLowerCase();
  const forbidden = [
    /resend_api_key/,
    /authorization/,
    /bearer /,
    /service_role/,
    /supplier cost/,
    /labou?r rate/,
    /margin/,
    /rate card/
  ];
  for (const pattern of forbidden) {
    if (pattern.test(text)) fail(`Public notification result contains forbidden marker: ${pattern}`);
  }
}

async function runPreviewContract() {
  const snapshot = {
    OPERON_BATHROOMS_NOTIFICATION_MODE: process.env.OPERON_BATHROOMS_NOTIFICATION_MODE,
    OPERON_BATHROOMS_ADMIN_EMAIL: process.env.OPERON_BATHROOMS_ADMIN_EMAIL,
    OPERON_BATHROOMS_FROM_EMAIL: process.env.OPERON_BATHROOMS_FROM_EMAIL,
    RESEND_API_KEY: process.env.RESEND_API_KEY
  };
  process.env.OPERON_BATHROOMS_NOTIFICATION_MODE = "preview";
  process.env.OPERON_BATHROOMS_ADMIN_EMAIL = process.env.OPERON_BATHROOMS_ADMIN_EMAIL || "admin@example.com";
  process.env.OPERON_BATHROOMS_FROM_EMAIL = process.env.OPERON_BATHROOMS_FROM_EMAIL || "bathrooms@example.com";

  try {
    const bundle = prepareBathroomNotifications(sampleLead());
    if (!bundle.result.notificationPrepared) fail("Preview notification was not prepared.");
    if (!bundle.result.adminNotificationPrepared) fail("Preview admin notification payload was not prepared.");
    if (!bundle.result.customerAcknowledgementPrepared) fail("Preview customer acknowledgement payload was not prepared.");
    if (bundle.result.adminNotificationSent || bundle.result.customerAcknowledgementSent) {
      fail("Preview mode unexpectedly marked email as sent.");
    }
    if (!bundle.result.notificationWarnings.some((warning) => /preview/i.test(warning))) {
      fail("Preview mode did not include a preview warning.");
    }
    const text = [bundle.adminEmail?.text, bundle.customerEmail?.text].filter(Boolean).join("\n");
    if (!/planning guidance only/i.test(text)) fail("Notification copy is missing planning guidance wording.");
    if (!/site measure, selections, licensed trade checks and written scope confirmation/i.test(text)) {
      fail("Customer acknowledgement is missing contract-pricing prerequisite wording.");
    }
    if (!/utm source/i.test(bundle.adminEmail?.text || "")) fail("Admin notification is missing attribution details.");
    if (!/risk flags/i.test(bundle.adminEmail?.text || "")) fail("Admin notification is missing risk flags.");
    assertSafePublicResult(bundle.result);
    console.log("- preview payload contract: passed");
  } finally {
    restoreEnv(snapshot);
  }
}

async function runFailureContract() {
  const snapshot = {
    OPERON_BATHROOMS_NOTIFICATION_MODE: process.env.OPERON_BATHROOMS_NOTIFICATION_MODE,
    OPERON_BATHROOMS_ADMIN_EMAIL: process.env.OPERON_BATHROOMS_ADMIN_EMAIL,
    OPERON_BATHROOMS_FROM_EMAIL: process.env.OPERON_BATHROOMS_FROM_EMAIL,
    RESEND_API_KEY: process.env.RESEND_API_KEY
  };
  const previousFetch = globalThis.fetch;
  process.env.OPERON_BATHROOMS_NOTIFICATION_MODE = "send";
  process.env.OPERON_BATHROOMS_ADMIN_EMAIL = "admin@example.com";
  process.env.OPERON_BATHROOMS_FROM_EMAIL = "bathrooms@example.com";
  process.env.RESEND_API_KEY = "email-qa-secret-should-not-leak";
  globalThis.fetch = (async () => new Response("{}", { status: 500 })) as typeof fetch;

  try {
    const result = await prepareAndSendBathroomNotifications(sampleLead());
    if (!result.notificationPrepared) fail("Failure contract did not prepare notification payloads.");
    if (result.adminNotificationSent || result.customerAcknowledgementSent) fail("Failure contract unexpectedly marked email as sent.");
    if (!result.notificationErrors.some((error) => /delivery error|request failed/i.test(error))) {
      fail("Failure contract did not return a generic provider error.");
    }
    assertSafePublicResult(result);
    if (JSON.stringify(result).includes("email-qa-secret-should-not-leak")) fail("Provider key leaked into notification result.");
    console.log("- provider failure contract: passed");
  } finally {
    globalThis.fetch = previousFetch;
    restoreEnv(snapshot);
  }
}

async function runApprovedSend() {
  if (mode !== "send") return;
  if (!sendApproved) {
    warn("Real send skipped: set OPERON_BATHROOMS_EMAIL_QA_SEND_APPROVED=true to send staging email.");
    return;
  }
  if (!["local", "staging"].includes(target)) {
    fail("Set OPERON_BATHROOMS_EMAIL_QA_TARGET to local or staging. Refusing production-like targets.");
    return;
  }
  if (/prod|production/i.test(target)) {
    fail("Email QA target appears production-like. Refusing to send.");
    return;
  }
  if (!process.env.RESEND_API_KEY || !process.env.OPERON_BATHROOMS_ADMIN_EMAIL || !process.env.OPERON_BATHROOMS_FROM_EMAIL || !qaRecipient) {
    fail("Real send requires RESEND_API_KEY, OPERON_BATHROOMS_ADMIN_EMAIL, OPERON_BATHROOMS_FROM_EMAIL and OPERON_BATHROOMS_EMAIL_QA_RECIPIENT.");
    return;
  }

  const lead = sampleLead();
  const result = await prepareAndSendBathroomNotifications(lead);
  assertSafePublicResult(result);
  if (!result.adminNotificationSent && !result.customerAcknowledgementSent) {
    fail("Approved send did not send any email. Check provider configuration.");
  }
  console.log(`- approved staging send: ${result.adminNotificationSent || result.customerAcknowledgementSent ? "sent" : "not sent"}`);
}

async function main() {
  console.log("Operon Bathrooms email QA contract");
  console.log(`- Target: ${target}`);
  console.log(`- Mode: ${mode}`);
  console.log("- Secrets are never printed.");
  await runPreviewContract();
  await runFailureContract();
  await runApprovedSend();

  if (warnings.length) {
    console.log("\nWarnings:");
    for (const warning of warnings) console.log(`- ${warning}`);
  }

  if (failures.length) {
    console.error("\nFailures:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log("\nPassed: email notification preview/failure contracts are safe. Real send remains opt-in.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Email QA failed");
  process.exit(1);
});
