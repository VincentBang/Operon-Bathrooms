export type BathroomLeadType = "estimate" | "quote_review" | "request_review" | "site_measure";

export type ResponseStatus =
  | "not_started"
  | "notification_prepared"
  | "notification_sent"
  | "acknowledgement_sent"
  | "contacted"
  | "awaiting_customer"
  | "follow_up_needed"
  | "booked"
  | "site_measure_booked"
  | "qualified"
  | "not_fit"
  | "closed";

export type LeadStatus =
  | "new"
  | "reviewed"
  | "contacted"
  | "awaiting_customer"
  | "site_measure_requested"
  | "site_measure_booked"
  | "quote_reviewed"
  | "qualified"
  | "not_fit"
  | "won"
  | "lost"
  | "archived";

export type ResponsePriority = "urgent" | "high" | "normal" | "low";

export type LeadFitTier = "strong_fit" | "good_fit" | "needs_review" | "weak_fit" | "not_fit";
export type QualificationStatus =
  | "unreviewed"
  | "system_qualified"
  | "manual_review_needed"
  | "evidence_requested"
  | "evidence_received"
  | "qualified"
  | "not_fit"
  | "ready_for_site_measure"
  | "ready_for_quote_review"
  | "archived";
export type Urgency = "urgent" | "high" | "normal" | "low";
export type ProjectValueBand = "low" | "medium" | "high" | "premium" | "unknown";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type EvidenceQuality = "complete" | "adequate" | "thin" | "missing";
export type EvidenceStatus = "missing" | "requested" | "received" | "not_required";
export type RecommendedNextAction =
  | "call_customer"
  | "request_photos"
  | "request_quote_pdf"
  | "request_inclusions_exclusions"
  | "clarify_budget"
  | "clarify_timeline"
  | "clarify_strata"
  | "clarify_access"
  | "clarify_asbestos"
  | "book_site_measure"
  | "prepare_manual_quote_review"
  | "mark_not_fit"
  | "archive"
  | "refer_out";

export const leadTableByType: Record<BathroomLeadType, string> = {
  estimate: "bathroom_estimates",
  quote_review: "bathroom_quote_reviews",
  request_review: "bathroom_review_requests",
  site_measure: "bathroom_site_measure_requests"
};

export const leadTypeByTable: Record<string, BathroomLeadType> = Object.fromEntries(
  Object.entries(leadTableByType).map(([leadType, table]) => [table, leadType])
) as Record<string, BathroomLeadType>;

export const responseStatuses: ResponseStatus[] = [
  "not_started",
  "notification_prepared",
  "notification_sent",
  "acknowledgement_sent",
  "contacted",
  "awaiting_customer",
  "follow_up_needed",
  "booked",
  "site_measure_booked",
  "qualified",
  "not_fit",
  "closed"
];

export const responsePriorities: ResponsePriority[] = ["urgent", "high", "normal", "low"];
export const leadStatuses: LeadStatus[] = [
  "new",
  "reviewed",
  "contacted",
  "awaiting_customer",
  "site_measure_requested",
  "site_measure_booked",
  "quote_reviewed",
  "qualified",
  "not_fit",
  "won",
  "lost",
  "archived"
];
export const leadFitTiers: LeadFitTier[] = ["strong_fit", "good_fit", "needs_review", "weak_fit", "not_fit"];
export const qualificationStatuses: QualificationStatus[] = [
  "unreviewed",
  "system_qualified",
  "manual_review_needed",
  "evidence_requested",
  "evidence_received",
  "qualified",
  "not_fit",
  "ready_for_site_measure",
  "ready_for_quote_review",
  "archived"
];
export const urgencyLevels: Urgency[] = ["urgent", "high", "normal", "low"];
export const projectValueBands: ProjectValueBand[] = ["low", "medium", "high", "premium", "unknown"];
export const riskLevels: RiskLevel[] = ["low", "medium", "high", "critical"];
export const evidenceQualities: EvidenceQuality[] = ["complete", "adequate", "thin", "missing"];
export const evidenceStatuses: EvidenceStatus[] = ["missing", "requested", "received", "not_required"];
export const recommendedNextActions: RecommendedNextAction[] = [
  "call_customer",
  "request_photos",
  "request_quote_pdf",
  "request_inclusions_exclusions",
  "clarify_budget",
  "clarify_timeline",
  "clarify_strata",
  "clarify_access",
  "clarify_asbestos",
  "book_site_measure",
  "prepare_manual_quote_review",
  "mark_not_fit",
  "archive",
  "refer_out"
];

export type NotificationResult = {
  notificationPrepared: boolean;
  adminNotificationPrepared: boolean;
  customerAcknowledgementPrepared: boolean;
  adminNotificationSent: boolean;
  customerAcknowledgementSent: boolean;
  notificationMode: "disabled" | "preview" | "send";
  notificationErrors: string[];
  notificationWarnings: string[];
  provider: "resend" | "none" | "unknown";
  adminNotificationSentAt: string | null;
  customerAcknowledgementSentAt: string | null;
  notificationSentAt: string | null;
};

export type LeadContact = {
  name?: string;
  email?: string;
  phone?: string;
  suburb?: string;
  propertyType?: string;
};

export type NormalizedLead = {
  id: string;
  leadType: BathroomLeadType;
  table: string;
  createdAt: string;
  updatedAt?: string;
  status: string;
  sourceRoute: string;
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  contact: LeadContact;
  suburb?: string;
  propertyType?: string;
  bathroomType?: string;
  timeline?: string;
  estimateRange?: string;
  confidenceScore?: number;
  quoteClarityScore?: number;
  quoteAmount?: number;
  recommendedNextStep?: string;
  riskFlags: string[];
  scoringResult: Record<string, unknown>;
  payload: Record<string, unknown>;
  internalNotes?: string;
  responseStatus: ResponseStatus;
  responsePriority: ResponsePriority;
  notificationSentAt: string | null;
  acknowledgementSentAt: string | null;
  firstResponseAt: string | null;
  lastContactedAt: string | null;
  responseDueAt: string | null;
  followUpAt: string | null;
  notificationResult: NotificationResult | null;
  responseTemplateKey?: string | null;
  leadFitScore?: number | null;
  leadFitTier?: LeadFitTier | null;
  qualificationStatus: QualificationStatus;
  urgency?: Urgency | null;
  projectValueBand?: ProjectValueBand | null;
  riskLevel?: RiskLevel | null;
  evidenceQuality?: EvidenceQuality | null;
  manualReviewRequired: boolean;
  manualReviewReason: string[];
  missingEvidence: string[];
  disqualificationFlags: string[];
  recommendedNextAction?: RecommendedNextAction | null;
  qualificationSummary?: string | null;
  customerSafeNextStep?: string | null;
  qualificationNotes?: string | null;
  qualificationUpdatedAt?: string | null;
  qualificationUpdatedBy?: string | null;
  evidenceChecklist: Record<string, EvidenceStatus>;
  manualReviewReportStatus?: string | null;
  manualReviewReportGeneratedAt?: string | null;
  manualReviewReportConfidence?: string | null;
  manualReviewReportRecommendedAdminStatus?: string | null;
  manualReviewReportDoNotQuoteReasons?: string[];
};

export function addBusinessDays(start: Date, days: number) {
  const next = new Date(start);
  let remaining = days;
  while (remaining > 0) {
    next.setDate(next.getDate() + 1);
    const day = next.getDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return next;
}

export function calculateResponseDueAt(leadType: BathroomLeadType, priority: ResponsePriority, createdAt = new Date()) {
  const due = new Date(createdAt);
  if (leadType === "site_measure" || priority === "urgent") {
    due.setHours(due.getHours() + 4);
    return due.toISOString();
  }
  if (leadType === "estimate" && priority === "normal") {
    return addBusinessDays(due, 2).toISOString();
  }
  return addBusinessDays(due, 1).toISOString();
}

export function isOverdue(lead: NormalizedLead) {
  return Boolean(
    lead.responseDueAt &&
      !["contacted", "awaiting_customer", "booked", "site_measure_booked", "qualified", "not_fit", "closed"].includes(
        lead.responseStatus
      ) &&
      new Date(lead.responseDueAt).getTime() < Date.now()
  );
}

function hasPhone(lead: Pick<NormalizedLead, "contact">) {
  return Boolean(lead.contact.phone && lead.contact.phone.trim().length >= 8);
}

export function determineResponsePriority(
  lead: Pick<
    NormalizedLead,
    "leadType" | "riskFlags" | "confidenceScore" | "quoteClarityScore" | "timeline" | "quoteAmount" | "contact" | "recommendedNextStep"
  >
): ResponsePriority {
  const riskText = lead.riskFlags.join(" ").toLowerCase();
  const wantsManualReview = (lead.recommendedNextStep ?? "").toLowerCase().includes("manual");
  if (lead.leadType === "site_measure") return hasPhone(lead) ? "urgent" : "high";
  if (lead.timeline === "ready-now" || lead.timeline === "urgent") return "high";
  if (lead.confidenceScore !== undefined && lead.confidenceScore < 58) return "high";
  if (lead.quoteClarityScore !== undefined && lead.quoteClarityScore < 65) return "high";
  if (lead.quoteAmount !== undefined && lead.quoteAmount >= 40000) return "high";
  if (
    wantsManualReview ||
    riskText.includes("strata") ||
    riskText.includes("asbestos") ||
    riskText.includes("waterproof") ||
    riskText.includes("leak") ||
    riskText.includes("mould") ||
    riskText.includes("deposit") ||
    riskText.includes("hbc")
  ) {
    return "high";
  }
  if (lead.riskFlags.length >= 4) return "high";
  return "normal";
}

export function suggestedNextActions(lead: NormalizedLead) {
  const actions = new Set<string>();
  if (lead.leadType === "site_measure") actions.add("Call customer and book site measure");
  if (lead.leadType === "quote_review") actions.add("Ask for quote PDF, inclusions, exclusions and photos");
  if (lead.leadType === "request_review") actions.add("Ask for photos, plans or measurements");
  if (lead.leadType === "estimate") actions.add("Confirm scope and ask for 3-5 photos");
  const riskText = lead.riskFlags.join(" ").toLowerCase();
  if (riskText.includes("strata")) actions.add("Clarify strata approval and access rules");
  if (riskText.includes("asbestos")) actions.add("Clarify asbestos concerns before disturbance");
  if (riskText.includes("waterproof")) actions.add("Clarify waterproofing evidence and certificate expectations");
  if (riskText.includes("plumbing") || riskText.includes("electrical")) actions.add("Confirm licensed trade scope");
  if (lead.timeline === "ready-now" || lead.timeline === "urgent") actions.add("Prioritise same-day contact if possible");
  actions.add("Remind customer this is planning guidance only");
  return Array.from(actions);
}

export function toLines(items: unknown) {
  if (Array.isArray(items)) return items.map(String);
  if (typeof items === "string" && items) return [items];
  return [];
}
