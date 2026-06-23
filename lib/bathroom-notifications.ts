import { NormalizedLead, NotificationResult, ResponseStatus } from "./lead-workflow";

type PreparedEmail = {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  text: string;
};

type NotificationBundle = {
  adminEmail: PreparedEmail | null;
  customerEmail: PreparedEmail | null;
  result: NotificationResult;
};

export type NotificationPreviewContract = NotificationResult & {
  adminNotificationPayload: {
    subject: string;
    text: string;
    leadType: string;
    leadId: string;
    adminLink: string;
  };
  customerAcknowledgementPayload: {
    subject: string;
    text: string;
    leadType: string;
    customerName: string;
  };
  notificationSent: boolean;
};

export type PublicNotificationSummary = Pick<
  NotificationResult,
  "notificationPrepared" | "adminNotificationSent" | "customerAcknowledgementSent"
> & {
  notificationWarning?: string;
};

function siteUrl() {
  return (
    process.env.OPERON_BATHROOMS_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function fromEmail() {
  return process.env.OPERON_BATHROOMS_FROM_EMAIL || "";
}

function replyToEmail() {
  return process.env.OPERON_BATHROOMS_REPLY_TO_EMAIL || process.env.OPERON_BATHROOMS_ADMIN_EMAIL || "";
}

function notificationMode(): NotificationResult["notificationMode"] {
  const configured = process.env.OPERON_BATHROOMS_NOTIFICATION_MODE;
  if (configured === "disabled" || configured === "preview" || configured === "send") return configured;
  return "preview";
}

function customerSubjectForLead(lead: NormalizedLead) {
  if (lead.leadType === "quote_review") return "We received your bathroom quote review request";
  if (lead.leadType === "request_review") return "We received your bathroom scope review request";
  if (lead.leadType === "site_measure") return "We received your bathroom site measure request";
  return "Your Operon Bathrooms planning estimate request";
}

function adminLink(lead: NormalizedLead) {
  const base = siteUrl();
  return `${base}/admin/leads?leadType=${encodeURIComponent(lead.leadType)}&leadId=${encodeURIComponent(lead.id)}`;
}

function subjectForLead(lead: NormalizedLead) {
  const suburb = lead.suburb || lead.contact.suburb || "unknown suburb";
  if (lead.leadType === "quote_review") {
    return `[Operon Bathrooms] Quote review lead - ${suburb} - clarity ${lead.quoteClarityScore ?? "n/a"}`;
  }
  if (lead.leadType === "request_review") {
    return `[Operon Bathrooms] Request review - ${suburb} - ${lead.timeline || "stage not supplied"}`;
  }
  if (lead.leadType === "site_measure") {
    const preferred = String(lead.payload.preferredTimeWindow || "time not supplied");
    return `[Operon Bathrooms] Site measure request - ${suburb} - ${preferred}`;
  }
  return `[Operon Bathrooms] New estimate lead - ${suburb} - ${lead.confidenceScore ?? "n/a"}`;
}

function safe(value: unknown) {
  if (value === null || value === undefined || value === "") return "not supplied";
  if (Array.isArray(value)) return value.length ? value.join("; ") : "none";
  return String(value);
}

function internalNotificationText(lead: NormalizedLead) {
  return [
    subjectForLead(lead),
    "",
    `Lead id: ${lead.id}`,
    `Lead type: ${lead.leadType}`,
    `Priority: ${lead.responsePriority}`,
    `Response due: ${safe(lead.responseDueAt)}`,
    `Submitted: ${lead.createdAt}`,
    "",
    "Contact",
    `Name: ${safe(lead.contact.name)}`,
    `Email: ${safe(lead.contact.email)}`,
    `Phone: ${safe(lead.contact.phone)}`,
    `Suburb: ${safe(lead.suburb || lead.contact.suburb)}`,
    `Property type: ${safe(lead.propertyType || lead.contact.propertyType)}`,
    `Bathroom type: ${safe(lead.bathroomType)}`,
    "",
    "Lead signals",
    `Estimate range: ${safe(lead.estimateRange)}`,
    `Confidence score: ${safe(lead.confidenceScore)}`,
    `Quote amount: ${safe(lead.quoteAmount)}`,
    `Quote clarity score: ${safe(lead.quoteClarityScore)}`,
    `Risk flags: ${safe(lead.riskFlags)}`,
    `Recommended next step: ${safe(lead.recommendedNextStep)}`,
    `Finish level: ${safe(lead.payload.finishLevel || lead.payload.fixturesLevel || lead.payload.fixtureLevel)}`,
    `Scope summary: ${safe(lead.scoringResult.scopeSummary || lead.payload.scopeSummary)}`,
    "",
    "Payload highlights",
    `Project stage: ${safe(lead.payload.projectStage)}`,
    `Budget range: ${safe(lead.payload.budgetRange)}`,
    `Timeline: ${safe(lead.timeline || lead.payload.timeline)}`,
    `GST status: ${safe(lead.payload.quote && typeof lead.payload.quote === "object" ? (lead.payload.quote as Record<string, unknown>).gstStatus : undefined)}`,
    `Deposit requested: ${safe(lead.payload.quote && typeof lead.payload.quote === "object" ? (lead.payload.quote as Record<string, unknown>).depositRequested : undefined)}`,
    `Builder/company: ${safe(lead.payload.quote && typeof lead.payload.quote === "object" ? (lead.payload.quote as Record<string, unknown>).builderName : undefined)}`,
    `Preferred time window: ${safe(lead.payload.preferredTimeWindow)}`,
    `Access notes: ${safe(lead.payload.accessNotes)}`,
    `Parking/lift/stairs: ${safe(lead.payload.parkingLiftStairsNotes)}`,
    `Strata status: ${safe(lead.payload.strataApprovalStatus)}`,
    `Known issues: ${safe(lead.payload.knownIssues)}`,
    `Upload metadata: ${safe(lead.payload.upload && typeof lead.payload.upload === "object" ? JSON.stringify(lead.payload.upload) : undefined)}`,
    "",
    "Attribution",
    `Source route: ${safe(lead.sourceRoute)}`,
    `Landing page: ${safe(lead.landingPage)}`,
    `Referrer: ${safe(lead.referrer)}`,
    `UTM source: ${safe(lead.utmSource)}`,
    `UTM medium: ${safe(lead.utmMedium)}`,
    `UTM campaign: ${safe(lead.utmCampaign)}`,
    `UTM content: ${safe(lead.utmContent)}`,
    `UTM term: ${safe(lead.utmTerm)}`,
    "",
    `Admin link: ${adminLink(lead)}`
  ].join("\n");
}

function acknowledgementText(lead: NormalizedLead) {
  const firstName = lead.contact.name?.trim().split(/\s+/)[0] || "there";
  const footer =
    "This is planning guidance only, not a final quote, legal advice, a fixed-price guarantee or a compliance guarantee. Site measure, selections, licensed trade checks and written scope confirmation are required before contract pricing.";

  if (lead.leadType === "quote_review") {
    return [
      `Hi ${firstName},`,
      "",
      "Thanks for submitting your bathroom quote review details.",
      "Operon will look for missing inclusions, allowance risk, PC/provisional sums, waterproofing and trade-scope clarity, exclusions, deposit/HBCF prompts and next-step readiness.",
      "Please keep a copy of the full quote, inclusions, exclusions, drawings/photos and any builder licence or insurance details.",
      "",
      footer
    ].join("\n");
  }

  if (lead.leadType === "request_review") {
    return [
      `Hi ${firstName},`,
      "",
      "Thanks for requesting a bathroom scope review.",
      "Operon will review your project stage, scope, budget range, photos or plans if provided, and preferred next step.",
      "Please prepare photos, plans, measurements, strata notes and any builder quote if available.",
      "",
      footer
    ].join("\n");
  }

  if (lead.leadType === "site_measure") {
    return [
      `Hi ${firstName},`,
      "",
      "Thanks for requesting a bathroom site measure.",
      "A site measure helps confirm room dimensions, access, waterproofing clues, substrate/falls, plumbing and electrical access, ventilation, strata/access constraints and known issues.",
      "Please prepare access notes, photos, existing quote or plans if available, and fixture or finish ideas.",
      "",
      footer
    ].join("\n");
  }

  return [
    `Hi ${firstName},`,
    "",
    "Thanks for completing the bathroom planning estimate.",
    lead.estimateRange ? `The range shown online was ${lead.estimateRange}, as planning guidance only.` : "",
    "Operon may review risk flags such as waterproofing, plumbing/electrical scope, access, strata or asbestos before any written scope is confirmed.",
    lead.recommendedNextStep ? `Suggested next step: ${lead.recommendedNextStep}` : "",
    "",
    footer
  ]
    .filter(Boolean)
    .join("\n");
}

export function prepareBathroomNotifications(lead: NormalizedLead): NotificationBundle {
  const adminEmail = process.env.OPERON_BATHROOMS_ADMIN_EMAIL;
  const from = fromEmail();
  const replyTo = replyToEmail();
  const mode = notificationMode();
  const adminNotificationPrepared = Boolean(adminEmail && from);
  const customerAcknowledgementPrepared = Boolean(lead.contact.email && from);
  const notificationWarnings = [
    mode === "disabled" ? "Notification sending is disabled; payloads were prepared only." : "",
    mode === "preview" ? "Notification mode is preview; no email was sent." : "",
    adminNotificationPrepared ? "" : "Admin notification is not configured.",
    customerAcknowledgementPrepared ? "" : "Customer acknowledgement is not configured or customer email is missing."
  ].filter(Boolean);
  const result: NotificationResult = {
    notificationPrepared: true,
    adminNotificationPrepared,
    customerAcknowledgementPrepared,
    adminNotificationSent: false,
    customerAcknowledgementSent: false,
    notificationMode: mode,
    notificationErrors: [],
    notificationWarnings,
    provider: process.env.RESEND_API_KEY ? "resend" : "none",
    adminNotificationSentAt: null,
    customerAcknowledgementSentAt: null,
    notificationSentAt: null
  };

  return {
    adminEmail:
      adminEmail && from
        ? {
            to: adminEmail,
            from,
            replyTo,
            subject: subjectForLead(lead),
            text: internalNotificationText(lead)
          }
        : null,
    customerEmail:
      lead.contact.email && from
        ? {
            to: lead.contact.email,
            from,
            replyTo,
            subject: customerSubjectForLead(lead),
            text: acknowledgementText(lead)
          }
        : null,
    result
  };
}

export function prepareBathroomNotificationPreview(lead: NormalizedLead): NotificationPreviewContract {
  const base = prepareBathroomNotifications(lead);
  return {
    ...base.result,
    notificationPrepared: true,
    notificationSent: base.result.adminNotificationSent || base.result.customerAcknowledgementSent,
    adminNotificationPayload: {
      subject: subjectForLead(lead),
      text: internalNotificationText(lead),
      leadType: lead.leadType,
      leadId: lead.id,
      adminLink: adminLink(lead)
    },
    customerAcknowledgementPayload: {
      subject: customerSubjectForLead(lead),
      text: acknowledgementText(lead),
      leadType: lead.leadType,
      customerName: lead.contact.name || ""
    },
    notificationErrors: base.result.notificationErrors,
    notificationWarnings: base.result.notificationWarnings
  };
}

export function publicNotificationSummary(result: NotificationResult): PublicNotificationSummary {
  return {
    notificationPrepared: result.notificationPrepared,
    adminNotificationSent: result.adminNotificationSent,
    customerAcknowledgementSent: result.customerAcknowledgementSent,
    notificationWarning: result.notificationWarnings[0] || result.notificationErrors[0]
  };
}

export function responseStatusForNotification(result: NotificationResult): ResponseStatus {
  if (result.adminNotificationSent) return "notification_sent";
  if (result.customerAcknowledgementSent) return "acknowledgement_sent";
  if (result.notificationPrepared) return "notification_prepared";
  return "not_started";
}

async function sendWithResend(email: PreparedEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, error: "Email provider not configured" };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: email.from,
        to: email.to,
        reply_to: email.replyTo || undefined,
        subject: email.subject,
        text: email.text
      })
    });

    if (!response.ok) return { sent: false, error: "Email provider returned a delivery error" };
    return { sent: true, error: "" };
  } catch {
    return { sent: false, error: "Email provider request failed" };
  }
}

export async function prepareAndSendBathroomNotifications(lead: NormalizedLead) {
  const bundle = prepareBathroomNotifications(lead);
  const result = { ...bundle.result };

  if (result.notificationMode !== "send") {
    return result;
  }

  if (!process.env.RESEND_API_KEY) {
    result.provider = "none";
    result.notificationWarnings.push("Email provider is not configured; notification payloads were prepared only.");
    return result;
  }

  if (bundle.adminEmail) {
    const sent = await sendWithResend(bundle.adminEmail);
    result.adminNotificationSent = sent.sent;
    if (sent.sent) result.adminNotificationSentAt = new Date().toISOString();
    if (!sent.sent) result.notificationErrors.push(sent.error);
  } else {
    result.notificationWarnings.push("Admin notification is not configured.");
  }

  if (bundle.customerEmail) {
    const sent = await sendWithResend(bundle.customerEmail);
    result.customerAcknowledgementSent = sent.sent;
    if (sent.sent) result.customerAcknowledgementSentAt = new Date().toISOString();
    if (!sent.sent) result.notificationErrors.push(sent.error);
  } else {
    result.notificationWarnings.push("Customer acknowledgement is not configured or customer email is missing.");
  }

  result.notificationSentAt = result.adminNotificationSentAt || result.customerAcknowledgementSentAt;

  return result;
}
