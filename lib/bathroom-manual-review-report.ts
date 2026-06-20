import { getEvidenceLabel } from "./evidence-labels";
import { LeadStatus, NormalizedLead, RecommendedNextAction } from "./lead-workflow";

export type ManualReviewReportStatus = "draft" | "generated" | "reviewed" | "superseded" | "archived";
export type ReportConfidence = "high" | "medium" | "low";

export type EvidenceSummary = {
  received: string[];
  missing: string[];
  requested: string[];
  notRequired: string[];
};

export type ManualReviewReport = {
  reportId: string;
  reportGeneratedAt: string;
  reportReviewedAt?: string | null;
  reportReviewedBy?: string | null;
  leadId: string;
  leadType: NormalizedLead["leadType"];
  reportVersion: number;
  reportStatus: ManualReviewReportStatus;
  headlineSummary: string;
  leadSnapshot: Record<string, unknown>;
  customerContactSummary: string[];
  projectSummary: string[];
  scopeSummary: string[];
  qualificationSummary: string[];
  riskSummary: string[];
  evidenceSummary: EvidenceSummary;
  quoteReviewSummary?: string[];
  compliancePromptSummary: string[];
  siteMeasureReadiness: string;
  missingInformationQuestions: string[];
  customerFollowUpQuestions: string[];
  internalReviewNotes: string[];
  recommendedNextAction: RecommendedNextAction;
  recommendedAdminStatus: LeadStatus;
  recommendedResponseTemplateKey: string;
  reportConfidence: ReportConfidence;
  doNotQuoteReasons: string[];
  manualReviewRequired: boolean;
  nextStepChecklist: string[];
  copyTemplates: {
    internalProjectSummary: string;
    customerFollowUpMessage: string;
    siteMeasureChecklist: string;
    quoteReviewChecklist: string;
  };
};

function safe(value: unknown) {
  if (value === undefined || value === null || value === "") return "not supplied";
  if (Array.isArray(value)) return value.length ? value.join("; ") : "none";
  return String(value);
}

function field(payload: Record<string, unknown>, key: string) {
  return safe(payload[key]);
}

function nested(payload: Record<string, unknown>, key: string) {
  return payload[key] && typeof payload[key] === "object" ? (payload[key] as Record<string, unknown>) : {};
}

function readable(value?: string | null) {
  return value ? value.replaceAll("_", " ").replaceAll("-", " ") : "not supplied";
}

function reportIdFor(lead: NormalizedLead) {
  return `mrr_${lead.leadType}_${lead.id}_${Date.now().toString(36)}`;
}

export function evidenceSummaryForLead(lead: NormalizedLead): EvidenceSummary {
  const summary: EvidenceSummary = { received: [], missing: [], requested: [], notRequired: [] };
  Object.entries(lead.evidenceChecklist || {}).forEach(([key, status]) => {
    const label = getEvidenceLabel(key);
    if (status === "received") summary.received.push(label);
    if (status === "missing") summary.missing.push(label);
    if (status === "requested") summary.requested.push(label);
    if (status === "not_required") summary.notRequired.push(label);
  });
  return summary;
}

function reportConfidenceFor(lead: NormalizedLead, evidence: EvidenceSummary, doNotQuoteReasons: string[]): ReportConfidence {
  const missingMajorEvidence = evidence.missing.some((item) => /quote|photo|budget|phone|suburb|timeline|access/i.test(item));
  const highRisk = lead.riskLevel === "high" || lead.riskLevel === "critical";
  const weakContact = !lead.contact.email && !lead.contact.phone;
  if (doNotQuoteReasons.length || highRisk || missingMajorEvidence || weakContact || lead.evidenceQuality === "missing") return "low";
  if (lead.evidenceQuality === "thin" || lead.manualReviewRequired || evidence.missing.length || evidence.requested.length) return "medium";
  return "high";
}

function doNotQuoteReasonsFor(lead: NormalizedLead) {
  const haystack = JSON.stringify({ payload: lead.payload, riskFlags: lead.riskFlags, disqualificationFlags: lead.disqualificationFlags }).toLowerCase();
  const reasons = new Set<string>();
  lead.disqualificationFlags.forEach((flag) => reasons.add(flag));
  if (lead.recommendedNextAction === "refer_out") reasons.add("Outside likely Sydney service area.");
  if (lead.recommendedNextAction === "mark_not_fit" || lead.leadFitTier === "not_fit") reasons.add("Lead is currently marked not fit for the preferred renovation workflow.");
  if (/under-25k|\$8,000|\$12,000|cheapest/.test(haystack)) reasons.add("Budget may be below a viable renovation threshold.");
  if (/emergency leak/.test(haystack)) reasons.add("Emergency repair-only request is outside the preferred renovation workflow.");
  if (/supply only|supply-only/.test(haystack)) reasons.add("Supply-only fixture request is outside scope.");
  if (/diy|unlicensed/.test(haystack)) reasons.add("DIY or unlicensed work request is outside scope.");
  if (/legal advice|compliance certification/.test(haystack)) reasons.add("Legal advice or compliance certification request is outside scope.");
  if (/commercial|public building|structural|remedial/.test(haystack)) reasons.add("Major commercial, structural or remedial scope may be outside bathroom renovation scope.");
  if (!lead.contact.email && !lead.contact.phone) reasons.add("No clear customer contact path is available.");
  if (/final quote without site/.test(haystack)) reasons.add("Customer appears to want final pricing without site measure and written scope confirmation.");
  return Array.from(reasons);
}

function recommendedAdminStatusFor(lead: NormalizedLead, reasons: string[]): LeadStatus {
  if (reasons.length || lead.leadFitTier === "not_fit" || lead.recommendedNextAction === "refer_out") return "not_fit";
  if (lead.recommendedNextAction === "book_site_measure") return "site_measure_requested";
  if (lead.recommendedNextAction === "prepare_manual_quote_review") return "quote_reviewed";
  if (lead.recommendedNextAction?.startsWith("request_") || lead.recommendedNextAction?.startsWith("clarify_")) return "awaiting_customer";
  if (lead.qualificationStatus === "qualified" || lead.qualificationStatus === "system_qualified") return "qualified";
  return "reviewed";
}

function responseTemplateKeyFor(lead: NormalizedLead) {
  if (lead.leadType === "quote_review") return "quote_review_first_response";
  if (lead.leadType === "site_measure") return "site_measure_first_response";
  if (lead.leadType === "request_review") return "request_review_first_response";
  return "estimate_first_response";
}

function compliancePrompts(lead: NormalizedLead) {
  const prompts = Array.isArray(lead.scoringResult.compliancePrompts)
    ? lead.scoringResult.compliancePrompts.map(String)
    : [];
  const risk = lead.riskFlags.join(" ").toLowerCase();
  if (risk.includes("deposit")) prompts.push("Clarify deposit request before committing; confirm in writing.");
  if (risk.includes("hbc")) prompts.push("Clarify HBC/HBCF prompt before committing; confirm in writing.");
  if (risk.includes("waterproof")) prompts.push("Confirm waterproofing scope and evidence in writing.");
  if (risk.includes("strata")) prompts.push("Clarify strata, access and approval requirements.");
  if (risk.includes("asbestos")) prompts.push("Clarify property age and whether specialist asbestos assessment is required before disturbance.");
  return Array.from(new Set(prompts));
}

function questionsFor(lead: NormalizedLead, evidence: EvidenceSummary) {
  const questions = new Set<string>();
  const risk = lead.riskFlags.join(" ").toLowerCase();
  const missing = evidence.missing.join(" ").toLowerCase();
  if (missing.includes("photo")) {
    questions.add("Please send clear photos of the whole bathroom, shower area, vanity, toilet, floor/wall tiles, ceiling/ventilation, access path and any visible leaks or mould.");
  }
  if (missing.includes("quote")) {
    questions.add("Please send the full quote PDF, inclusions/exclusions, PC/provisional sums, GST status, deposit request and builder licence details if available.");
  }
  if (missing.includes("strata") || risk.includes("strata")) {
    questions.add("Can you confirm whether the property is strata, whether Owners Corporation approval is required, and whether there are renovation by-laws or access restrictions?");
  }
  if (risk.includes("asbestos")) {
    questions.add("Can you confirm the property age and whether any asbestos inspection/report exists? Do not start demolition until this is clarified with a qualified professional.");
  }
  if (missing.includes("access") || missing.includes("parking") || risk.includes("access")) {
    questions.add("Please confirm parking, lift access, stair access, working-hour restrictions and any building manager requirements.");
  }
  if (missing.includes("budget") || missing.includes("timeline") || lead.recommendedNextAction === "clarify_budget") {
    questions.add("Can you confirm your target budget range and when you would ideally like the work to start?");
  }
  if (!questions.size) questions.add("Can you confirm the preferred next step and whether you have photos, plans, quotes or strata notes ready for review?");
  return Array.from(questions);
}

function quoteReviewSummary(lead: NormalizedLead) {
  const quote = nested(lead.payload, "quote");
  const allowances = nested(lead.payload, "allowances");
  const upload = nested(lead.payload, "upload");
  const scoring = lead.scoringResult;
  return [
    `Quote amount: ${safe(lead.quoteAmount || quote.amount)}`,
    `Builder/company: ${safe(quote.builderName)}`,
    `Builder licence: ${safe(quote.builderLicence)}`,
    `GST status: ${safe(quote.gstStatus)}`,
    `Deposit requested: ${safe(quote.depositRequested)}`,
    `Timeline: ${safe(quote.timeline || lead.timeline)}`,
    `Quote clarity score: ${safe(lead.quoteClarityScore)}`,
    `Missing inclusions: ${safe(scoring.missingInclusions)}`,
    `Allowance risk: ${safe(scoring.allowanceRisk)}`,
    `PC sums: ${safe(allowances.pcSumsPresent)}`,
    `Provisional sums: ${safe(allowances.provisionalSumsPresent)}`,
    `Exclusions clearly listed: ${safe(allowances.exclusionsClearlyListed)}`,
    `Uploaded file: ${safe(upload.fileName)} (${safe(upload.fileType)}, ${safe(upload.fileSize)})`,
    `Questions to ask builder: ${safe(scoring.questionsToAsk)}`
  ];
}

function projectSummaryFor(lead: NormalizedLead) {
  const payload = lead.payload;
  if (lead.leadType === "site_measure") {
    return [
      `Suburb: ${safe(lead.suburb || lead.contact.suburb)}`,
      `Address: ${field(payload, "propertyAddress")}`,
      `Property type: ${safe(lead.propertyType || lead.contact.propertyType)}`,
      `Preferred time window: ${field(payload, "preferredTimeWindow")}`,
      `Access notes: ${field(payload, "accessNotes")}`,
      `Parking/lift/stairs: ${field(payload, "parkingLiftStairsNotes")}`,
      `Strata status: ${field(payload, "strataApprovalStatus")}`,
      `Known issues: ${field(payload, "knownIssues")}`
    ];
  }
  if (lead.leadType === "request_review") {
    return [
      `Project stage: ${field(payload, "projectStage")}`,
      `Budget range: ${field(payload, "budgetRange")}`,
      `Timeline: ${safe(lead.timeline || payload.timeline)}`,
      `Bathroom type: ${safe(lead.bathroomType || payload.bathroomType)}`,
      `Property type: ${safe(lead.propertyType || lead.contact.propertyType)}`,
      `Has photos/plans: ${safe(payload.hasPhotosPlans)}`,
      `Has builder quote: ${safe(payload.hasBuilderQuote)}`,
      `Preferred next step: ${field(payload, "preferredNextStep")}`,
      `Message: ${field(payload, "message")}`
    ];
  }
  if (lead.leadType === "quote_review") return quoteReviewSummary(lead);
  return [
    `Bathroom type: ${safe(lead.bathroomType || payload.projectType)}`,
    `Suburb: ${safe(lead.suburb || lead.contact.suburb)}`,
    `Property type: ${safe(lead.propertyType || lead.contact.propertyType)}`,
    `Budget range: ${field(payload, "budgetRange")}`,
    `Finish level: ${safe(payload.finishLevel || payload.fixtureLevel || payload.fixturesLevel)}`,
    `Timeline: ${safe(lead.timeline || payload.timeline)}`,
    `Layout change: ${safe(payload.layoutChange || payload.layoutChangeLevel)}`,
    `Planning range: ${safe(lead.estimateRange)}`,
    `Confidence score: ${safe(lead.confidenceScore)}`,
    `Recommended next step: ${safe(lead.recommendedNextStep)}`
  ];
}

function siteMeasureReadiness(lead: NormalizedLead, evidence: EvidenceSummary, reasons: string[]) {
  if (reasons.length) return "Not ready for site measure until do-not-quote reasons are resolved or lead is marked suitable.";
  if (lead.manualReviewRequired || lead.riskLevel === "high" || lead.riskLevel === "critical") {
    return "Manual review required before site measure due to risk.";
  }
  if (lead.recommendedNextAction === "book_site_measure" && !evidence.missing.length) return "Ready to book site measure.";
  if (lead.recommendedNextAction === "book_site_measure") return "Potentially ready, but resolve evidence gaps before booking.";
  return "Not yet ready for site measure; confirm scope, evidence and next step first.";
}

function nextStepChecklistFor(lead: NormalizedLead, evidence: EvidenceSummary) {
  const items = new Set<string>();
  items.add("Confirm this is planning guidance only before any pricing discussion.");
  if (evidence.missing.length) items.add("Request missing evidence before heavier review.");
  if (lead.recommendedNextAction === "book_site_measure") items.add("Confirm inspection window, parking/lift/stairs, access path and photos before booking.");
  if (lead.recommendedNextAction === "prepare_manual_quote_review") items.add("Prepare manual quote review after full quote, inclusions/exclusions and photos are available.");
  if (lead.riskFlags.some((flag) => /strata/i.test(flag))) items.add("Clarify strata approval, work hours, access and building manager requirements.");
  if (lead.riskFlags.some((flag) => /asbestos/i.test(flag))) items.add("Clarify property age and asbestos report status before disturbance.");
  if (lead.riskFlags.some((flag) => /waterproof/i.test(flag))) items.add("Confirm waterproofing scope, certificate expectations and exclusions in writing.");
  items.add("Save admin notes after customer contact.");
  return Array.from(items);
}

export function buildManualReviewReport(lead: NormalizedLead, options: { status?: ManualReviewReportStatus; version?: number; reportId?: string } = {}): ManualReviewReport {
  const evidence = evidenceSummaryForLead(lead);
  const doNotQuoteReasons = doNotQuoteReasonsFor(lead);
  const confidence = reportConfidenceFor(lead, evidence, doNotQuoteReasons);
  const recommendedAdminStatus = recommendedAdminStatusFor(lead, doNotQuoteReasons);
  const customerQuestions = questionsFor(lead, evidence);
  const compliance = compliancePrompts(lead);
  const nextAction = lead.recommendedNextAction || "call_customer";
  const projectSummary = projectSummaryFor(lead);
  const riskSummary = lead.riskFlags.length
    ? lead.riskFlags.map((flag) => `${flag} Clarify before committing; confirm in writing where relevant.`)
    : ["No risk flags supplied in the current lead payload."];
  const headlineSummary = `${readable(lead.leadFitTier)} ${lead.leadType.replaceAll("_", " ")} lead in ${
    lead.suburb || lead.contact.suburb || "unknown suburb"
  }; ${readable(lead.riskLevel)} risk, ${readable(lead.evidenceQuality)} evidence, next action ${readable(nextAction)}.`;
  const siteMeasureChecklist = [
    "Photos of bathroom, access path and any known issue areas",
    "Access notes, parking, lift/stairs and working-hour restrictions",
    "Strata approval status and building manager requirements",
    "Known leaks, mould, asbestos concerns or ventilation issues",
    "Existing quotes/plans if available",
    "Preferred fixtures/finishes and preferred inspection windows"
  ].join("\n");
  const quoteReviewChecklist = [
    "Full quote PDF or images",
    "Inclusions and exclusions",
    "PC sums and provisional sums",
    "GST status and deposit request",
    "Builder licence details if available",
    "Waterproofing/certificate details",
    "Plumbing/electrical scope",
    "Demolition/waste scope",
    "Photos/plans"
  ].join("\n");

  return {
    reportId: options.reportId || reportIdFor(lead),
    reportGeneratedAt: new Date().toISOString(),
    leadId: lead.id,
    leadType: lead.leadType,
    reportVersion: options.version || 1,
    reportStatus: options.status || "generated",
    headlineSummary,
    leadSnapshot: {
      status: lead.status,
      responseStatus: lead.responseStatus,
      responsePriority: lead.responsePriority,
      sourceRoute: lead.sourceRoute,
      landingPage: lead.landingPage,
      referrer: lead.referrer,
      utm: [lead.utmSource, lead.utmMedium, lead.utmCampaign, lead.utmContent, lead.utmTerm].filter(Boolean).join(" / ")
    },
    customerContactSummary: [
      `Name: ${safe(lead.contact.name)}`,
      `Email: ${safe(lead.contact.email)}`,
      `Phone: ${safe(lead.contact.phone)}`,
      `Suburb: ${safe(lead.suburb || lead.contact.suburb)}`,
      `Property type: ${safe(lead.propertyType || lead.contact.propertyType)}`
    ],
    projectSummary,
    scopeSummary: [
      `Bathroom type: ${safe(lead.bathroomType)}`,
      `Timeline: ${safe(lead.timeline)}`,
      `Requested next step: ${safe(lead.recommendedNextStep || lead.recommendedNextAction)}`,
      `Scope notes: ${safe(lead.payload.message || lead.payload.scopeSummary || lead.scoringResult.scopeSummary)}`
    ],
    qualificationSummary: [
      `Fit tier: ${readable(lead.leadFitTier)}`,
      `Fit score: ${safe(lead.leadFitScore)}`,
      `Qualification status: ${readable(lead.qualificationStatus)}`,
      `Urgency: ${readable(lead.urgency)}`,
      `Project value band: ${readable(lead.projectValueBand)}`,
      `Risk level: ${readable(lead.riskLevel)}`,
      `Evidence quality: ${readable(lead.evidenceQuality)}`,
      `Manual review required: ${lead.manualReviewRequired ? "yes" : "no"}`,
      `Summary: ${safe(lead.qualificationSummary)}`
    ],
    riskSummary,
    evidenceSummary: evidence,
    quoteReviewSummary: lead.leadType === "quote_review" ? quoteReviewSummary(lead) : undefined,
    compliancePromptSummary: compliance.length ? compliance : ["No compliance prompts supplied. Continue using planning-guidance-only language."],
    siteMeasureReadiness: siteMeasureReadiness(lead, evidence, doNotQuoteReasons),
    missingInformationQuestions: customerQuestions,
    customerFollowUpQuestions: customerQuestions,
    internalReviewNotes: [
      "Internal report only. Do not send to customer as a proposal or quote.",
      "Do not provide final pricing until site measure, selections, licensed trade checks and written scope confirmation are complete.",
      ...(lead.manualReviewReason.length ? lead.manualReviewReason : ["No manual review reasons recorded."])
    ],
    recommendedNextAction: nextAction,
    recommendedAdminStatus,
    recommendedResponseTemplateKey: responseTemplateKeyFor(lead),
    reportConfidence: confidence,
    doNotQuoteReasons,
    manualReviewRequired: lead.manualReviewRequired || doNotQuoteReasons.length > 0 || confidence === "low",
    nextStepChecklist: nextStepChecklistFor(lead, evidence),
    copyTemplates: {
      internalProjectSummary: [
        headlineSummary,
        "",
        ...projectSummary,
        "",
        `Recommended action: ${readable(nextAction)}`,
        `Recommended admin status: ${readable(recommendedAdminStatus)}`,
        `Missing evidence: ${evidence.missing.join("; ") || "none"}`
      ].join("\n"),
      customerFollowUpMessage: [
        "Thanks for the bathroom renovation details. To keep the next step accurate, could you please confirm:",
        ...customerQuestions.map((question) => `- ${question}`),
        "This is planning guidance only. Contract pricing requires site measure, selections, licensed trade checks and written scope confirmation."
      ].join("\n"),
      siteMeasureChecklist,
      quoteReviewChecklist
    }
  };
}
