import { createClient } from "@supabase/supabase-js";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Attribution } from "./attribution";
import { buildEvidenceChecklist, qualifyBathroomLead, QualificationResult } from "./bathroom-lead-qualification";
import {
  BathroomLeadType,
  calculateResponseDueAt,
  EvidenceStatus,
  determineResponsePriority,
  leadTableByType,
  leadTypeByTable,
  NormalizedLead,
  NotificationResult,
  QualificationStatus,
  RecommendedNextAction,
  ResponsePriority,
  RiskLevel,
  ResponseStatus,
  toLines
} from "./lead-workflow";

type LeadStoreInput = {
  leadType: BathroomLeadType;
  sourceRoute: string;
  payload: Record<string, unknown>;
  riskFlags?: unknown;
  scoringResult?: Record<string, unknown>;
  privacyAccepted: boolean;
  termsAccepted: boolean;
  guidanceAccepted?: boolean;
  attribution?: Attribution;
  request: Request;
  contact?: NormalizedLead["contact"];
  bathroomType?: string;
  timeline?: string;
  estimateRange?: string;
  confidenceScore?: number;
  quoteClarityScore?: number;
  quoteAmount?: number;
  recommendedNextStep?: string;
};

type StoreResult = {
  ok: boolean;
  stored: boolean;
  reason?: string;
  lead: NormalizedLead;
  record: Record<string, unknown>;
  storage: "supabase" | "local";
};

const localStorePath = path.join(process.cwd(), ".local", "bathroom-leads.json");
let localStoreQueue = Promise.resolve();

function supabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  };
}

function client() {
  const { url, serviceKey } = supabaseConfig();
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

function nowIso() {
  return new Date().toISOString();
}

function id() {
  return globalThis.crypto?.randomUUID?.() ?? `lead-${Date.now().toString(36)}`;
}

function contactFromPayload(payload: Record<string, unknown>): NormalizedLead["contact"] {
  const nested = payload.contact && typeof payload.contact === "object" ? (payload.contact as Record<string, unknown>) : payload;
  return {
    name: typeof nested.name === "string" ? nested.name : "",
    email: typeof nested.email === "string" ? nested.email : "",
    phone: typeof nested.phone === "string" ? nested.phone : "",
    suburb: typeof nested.suburb === "string" ? nested.suburb : "",
    propertyType: typeof nested.propertyType === "string" ? nested.propertyType : ""
  };
}

function normalizeRiskFlags(flags: unknown) {
  return toLines(flags);
}

function normalizeLead(input: LeadStoreInput, leadId = id(), createdAt = nowIso()): NormalizedLead {
  const riskFlags = normalizeRiskFlags(input.riskFlags ?? []);
  const contact = input.contact || contactFromPayload(input.payload);
  const propertyType = contact.propertyType || String(input.payload.propertyType || "");
  const leadBase = {
    leadType: input.leadType,
    riskFlags,
    confidenceScore: input.confidenceScore,
    quoteClarityScore: input.quoteClarityScore,
    quoteAmount: input.quoteAmount,
    timeline: input.timeline,
    contact,
    recommendedNextStep: input.recommendedNextStep
  };
  const responsePriority = determineResponsePriority(leadBase);

  const lead: NormalizedLead = {
    id: leadId,
    leadType: input.leadType,
    table: leadTableByType[input.leadType],
    createdAt,
    updatedAt: createdAt,
    status: "new",
    sourceRoute: input.attribution?.sourceRoute || input.sourceRoute,
    landingPage: input.attribution?.landingPage || "",
    referrer: input.attribution?.referrer || "",
    utmSource: input.attribution?.utmSource || "",
    utmMedium: input.attribution?.utmMedium || "",
    utmCampaign: input.attribution?.utmCampaign || "",
    utmContent: input.attribution?.utmContent || "",
    utmTerm: input.attribution?.utmTerm || "",
    contact,
    suburb: contact.suburb || String(input.payload.suburb || ""),
    propertyType,
    bathroomType: input.bathroomType,
    timeline: input.timeline,
    estimateRange: input.estimateRange,
    confidenceScore: input.confidenceScore,
    quoteClarityScore: input.quoteClarityScore,
    quoteAmount: input.quoteAmount,
    recommendedNextStep: input.recommendedNextStep,
    riskFlags,
    scoringResult: input.scoringResult || {},
    payload: input.payload,
    internalNotes: "",
    responseStatus: "not_started",
    responsePriority,
    notificationSentAt: null,
    acknowledgementSentAt: null,
    firstResponseAt: null,
    lastContactedAt: null,
    responseDueAt: calculateResponseDueAt(input.leadType, responsePriority, new Date(createdAt)),
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
    evidenceChecklist: {}
  };
  return applyQualification(lead, qualifyBathroomLead(lead), "system");
}

function toRecord(input: LeadStoreInput, lead: NormalizedLead) {
  const base: Record<string, unknown> = {
    id: lead.id,
    created_at: lead.createdAt,
    updated_at: lead.updatedAt,
    last_updated_at: lead.updatedAt,
    status: lead.status,
    source_route: lead.sourceRoute,
    landing_page: lead.landingPage,
    referrer: lead.referrer,
    utm_source: lead.utmSource,
    utm_medium: lead.utmMedium,
    utm_campaign: lead.utmCampaign,
    utm_content: lead.utmContent,
    utm_term: lead.utmTerm,
    user_agent: input.request.headers.get("user-agent") ?? "",
    form_payload: input.payload,
    risk_flags: lead.riskFlags,
    scoring_result: lead.scoringResult,
    internal_notes: "",
    guidance_accepted: input.guidanceAccepted ?? false,
    privacy_accepted: input.privacyAccepted,
    terms_accepted: input.termsAccepted,
    response_status: lead.responseStatus,
    response_priority: lead.responsePriority,
    notification_sent_at: lead.notificationSentAt,
    acknowledgement_sent_at: lead.acknowledgementSentAt,
    first_response_at: lead.firstResponseAt,
    last_contacted_at: lead.lastContactedAt,
    response_due_at: lead.responseDueAt,
    follow_up_at: lead.followUpAt,
    notification_result: lead.notificationResult,
    notification_prepared: lead.notificationResult?.notificationPrepared ?? false,
    admin_notification_sent: lead.notificationResult?.adminNotificationSent ?? false,
    customer_acknowledgement_sent: lead.notificationResult?.customerAcknowledgementSent ?? false,
    response_template_key: lead.responseTemplateKey,
    lead_fit_score: lead.leadFitScore,
    lead_fit_tier: lead.leadFitTier,
    qualification_status: lead.qualificationStatus,
    urgency: lead.urgency,
    project_value_band: lead.projectValueBand,
    risk_level: lead.riskLevel,
    evidence_quality: lead.evidenceQuality,
    manual_review_required: lead.manualReviewRequired,
    manual_review_reason: lead.manualReviewReason,
    missing_evidence: lead.missingEvidence,
    disqualification_flags: lead.disqualificationFlags,
    recommended_next_action: lead.recommendedNextAction,
    qualification_summary: lead.qualificationSummary,
    customer_safe_next_step: lead.customerSafeNextStep,
    qualification_notes: lead.qualificationNotes,
    qualification_updated_at: lead.qualificationUpdatedAt,
    qualification_updated_by: lead.qualificationUpdatedBy,
    evidence_checklist: lead.evidenceChecklist
  };

  if (input.leadType === "estimate") {
    base.user_input = input.payload;
    base.estimate_range = input.scoringResult?.estimateRange || { label: input.estimateRange };
    base.confidence_score = input.confidenceScore ?? 0;
    base.contact_info = lead.contact;
  }

  return base;
}

async function readLocalLeads() {
  try {
    const raw = await readFile(localStorePath, "utf8");
    return JSON.parse(raw) as NormalizedLead[];
  } catch {
    return [];
  }
}

async function writeLocalLeads(leads: NormalizedLead[]) {
  await mkdir(path.dirname(localStorePath), { recursive: true });
  await writeFile(localStorePath, JSON.stringify(leads, null, 2));
}

async function saveLocalLead(lead: NormalizedLead) {
  localStoreQueue = localStoreQueue.then(async () => {
    const leads = await readLocalLeads();
    leads.unshift(lead);
    await writeLocalLeads(leads);
  });
  await localStoreQueue;
}

export async function storeStructuredLead(input: LeadStoreInput): Promise<StoreResult> {
  const lead = normalizeLead(input);
  const record = toRecord(input, lead);
  const supabase = client();

  if (!supabase) {
    await saveLocalLead(lead);
    return { ok: true, stored: true, record, lead, storage: "local" };
  }

  const { error } = await supabase.from(lead.table).insert(record);
  if (error) return { ok: false, stored: false, reason: "Lead storage failed", record, lead, storage: "supabase" };
  return { ok: true, stored: true, record, lead, storage: "supabase" };
}

function normalizeFromDatabase(row: Record<string, unknown>, table: string): NormalizedLead {
  const leadType = leadTypeByTable[table];
  const payload =
    (row.form_payload as Record<string, unknown> | undefined) ||
    (row.user_input as Record<string, unknown> | undefined) ||
    {};
  const scoring =
    (row.scoring_result as Record<string, unknown> | undefined) ||
    ({ estimateRange: row.estimate_range, confidenceScore: row.confidence_score } as Record<string, unknown>);
  const contact =
    (row.contact_info as NormalizedLead["contact"] | undefined) ||
    contactFromPayload(payload);
  const riskFlags = normalizeRiskFlags(row.risk_flags);
  const quote = payload.quote && typeof payload.quote === "object" ? (payload.quote as Record<string, unknown>) : {};
  return {
    id: String(row.id),
    leadType,
    table,
    createdAt: String(row.created_at),
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : undefined,
    status: String(row.status || "new"),
    sourceRoute: String(row.source_route || ""),
    landingPage: String(row.landing_page || ""),
    referrer: String(row.referrer || ""),
    utmSource: String(row.utm_source || ""),
    utmMedium: String(row.utm_medium || ""),
    utmCampaign: String(row.utm_campaign || ""),
    utmContent: String(row.utm_content || ""),
    utmTerm: String(row.utm_term || ""),
    contact,
    suburb: contact.suburb || String(payload.suburb || ""),
    propertyType: contact.propertyType || String(payload.propertyType || ""),
    bathroomType: String(payload.bathroomType || payload.projectType || ""),
    timeline: String(payload.timeline || quote.timeline || ""),
    estimateRange:
      typeof row.estimate_range === "object" && row.estimate_range && "label" in row.estimate_range
        ? String((row.estimate_range as { label?: string }).label)
        : undefined,
    confidenceScore: typeof row.confidence_score === "number" ? row.confidence_score : undefined,
    quoteClarityScore: typeof scoring.clarityScore === "number" ? scoring.clarityScore : undefined,
    quoteAmount: typeof quote.amount === "number" ? quote.amount : undefined,
    recommendedNextStep: typeof scoring.recommendedNextStep === "string" ? scoring.recommendedNextStep : undefined,
    riskFlags,
    scoringResult: scoring,
    payload,
    internalNotes: String(row.internal_notes || ""),
    responseStatus: (row.response_status as ResponseStatus) || "not_started",
    responsePriority: (row.response_priority as ResponsePriority) || "normal",
    notificationSentAt: (row.notification_sent_at as string | null) || null,
    acknowledgementSentAt: (row.acknowledgement_sent_at as string | null) || null,
    firstResponseAt: (row.first_response_at as string | null) || null,
    lastContactedAt: (row.last_contacted_at as string | null) || null,
    responseDueAt: (row.response_due_at as string | null) || null,
    followUpAt: (row.follow_up_at as string | null) || null,
    notificationResult: (row.notification_result as NotificationResult | null) || null,
    responseTemplateKey: (row.response_template_key as string | null) || null,
    leadFitScore: typeof row.lead_fit_score === "number" ? row.lead_fit_score : null,
    leadFitTier: (row.lead_fit_tier as NormalizedLead["leadFitTier"]) || null,
    qualificationStatus: (row.qualification_status as QualificationStatus) || "unreviewed",
    urgency: (row.urgency as NormalizedLead["urgency"]) || null,
    projectValueBand: (row.project_value_band as NormalizedLead["projectValueBand"]) || null,
    riskLevel: (row.risk_level as RiskLevel) || null,
    evidenceQuality: (row.evidence_quality as NormalizedLead["evidenceQuality"]) || null,
    manualReviewRequired: row.manual_review_required === true,
    manualReviewReason: normalizeRiskFlags(row.manual_review_reason),
    missingEvidence: normalizeRiskFlags(row.missing_evidence),
    disqualificationFlags: normalizeRiskFlags(row.disqualification_flags),
    recommendedNextAction: (row.recommended_next_action as RecommendedNextAction) || null,
    qualificationSummary: (row.qualification_summary as string | null) || null,
    customerSafeNextStep: (row.customer_safe_next_step as string | null) || null,
    qualificationNotes: (row.qualification_notes as string | null) || "",
    qualificationUpdatedAt: (row.qualification_updated_at as string | null) || null,
    qualificationUpdatedBy: (row.qualification_updated_by as string | null) || null,
    evidenceChecklist:
      row.evidence_checklist && typeof row.evidence_checklist === "object"
        ? (row.evidence_checklist as Record<string, EvidenceStatus>)
        : buildEvidenceChecklist({
            leadType,
            payload,
            riskFlags,
            contact,
            propertyType: contact.propertyType || String(payload.propertyType || "")
          } as NormalizedLead)
  };
}

export async function listStoredLeads() {
  const supabase = client();
  if (!supabase) {
    await localStoreQueue;
    return readLocalLeads();
  }

  const all: NormalizedLead[] = [];
  for (const table of Object.values(leadTableByType)) {
    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false }).limit(100);
    if (!error && data) all.push(...data.map((row) => normalizeFromDatabase(row as Record<string, unknown>, table)));
  }
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getStoredLead(leadType: BathroomLeadType, leadId: string) {
  const supabase = client();
  const table = leadTableByType[leadType];
  if (!supabase) {
    await localStoreQueue;
    const leads = await readLocalLeads();
    return leads.find((lead) => lead.leadType === leadType && lead.id === leadId) || null;
  }

  const { data, error } = await supabase.from(table).select("*").eq("id", leadId).maybeSingle();
  if (error || !data) return null;
  return normalizeFromDatabase(data as Record<string, unknown>, table);
}

export async function updateLeadResponse(
  leadType: BathroomLeadType,
  leadId: string,
  patch: Partial<
    Pick<
      NormalizedLead,
      | "status"
      | "responseStatus"
      | "responsePriority"
      | "notificationSentAt"
      | "acknowledgementSentAt"
      | "firstResponseAt"
      | "lastContactedAt"
      | "responseDueAt"
      | "followUpAt"
      | "notificationResult"
      | "responseTemplateKey"
      | "internalNotes"
      | "leadFitScore"
      | "leadFitTier"
      | "qualificationStatus"
      | "urgency"
      | "projectValueBand"
      | "riskLevel"
      | "evidenceQuality"
      | "manualReviewRequired"
      | "manualReviewReason"
      | "missingEvidence"
      | "disqualificationFlags"
      | "recommendedNextAction"
      | "qualificationSummary"
      | "customerSafeNextStep"
      | "qualificationNotes"
      | "qualificationUpdatedAt"
      | "qualificationUpdatedBy"
      | "evidenceChecklist"
    >
  >,
  eventType = "response_update"
) {
  const updatedAt = nowIso();
  const supabase = client();
  const table = leadTableByType[leadType];
  const dbPatch: Record<string, unknown> = {
    updated_at: updatedAt,
    last_updated_at: updatedAt,
    status: patch.status,
    response_status: patch.responseStatus,
    response_priority: patch.responsePriority,
    notification_sent_at: patch.notificationSentAt,
    acknowledgement_sent_at: patch.acknowledgementSentAt,
    first_response_at: patch.firstResponseAt,
    last_contacted_at: patch.lastContactedAt,
    response_due_at: patch.responseDueAt,
    follow_up_at: patch.followUpAt,
    notification_result: patch.notificationResult,
    notification_prepared: patch.notificationResult?.notificationPrepared,
    admin_notification_sent: patch.notificationResult?.adminNotificationSent,
    customer_acknowledgement_sent: patch.notificationResult?.customerAcknowledgementSent,
    response_template_key: patch.responseTemplateKey,
    internal_notes: patch.internalNotes,
    lead_fit_score: patch.leadFitScore,
    lead_fit_tier: patch.leadFitTier,
    qualification_status: patch.qualificationStatus,
    urgency: patch.urgency,
    project_value_band: patch.projectValueBand,
    risk_level: patch.riskLevel,
    evidence_quality: patch.evidenceQuality,
    manual_review_required: patch.manualReviewRequired,
    manual_review_reason: patch.manualReviewReason,
    missing_evidence: patch.missingEvidence,
    disqualification_flags: patch.disqualificationFlags,
    recommended_next_action: patch.recommendedNextAction,
    qualification_summary: patch.qualificationSummary,
    customer_safe_next_step: patch.customerSafeNextStep,
    qualification_notes: patch.qualificationNotes,
    qualification_updated_at: patch.qualificationUpdatedAt,
    qualification_updated_by: patch.qualificationUpdatedBy,
    evidence_checklist: patch.evidenceChecklist
  };
  Object.keys(dbPatch).forEach((key) => dbPatch[key] === undefined && delete dbPatch[key]);

  if (!supabase) {
    await localStoreQueue;
    const leads = await readLocalLeads();
    const index = leads.findIndex((lead) => lead.leadType === leadType && lead.id === leadId);
    if (index === -1) return null;
    leads[index] = { ...leads[index], ...patch, updatedAt };
    await writeLocalLeads(leads);
    return leads[index];
  }

  const { error } = await supabase.from(table).update(dbPatch).eq("id", leadId);
  if (error) return null;
  await supabase.from("bathroom_lead_response_events").insert({
    lead_type: leadType,
    lead_id: leadId,
    event_type: eventType,
    event_payload: dbPatch,
    actor: "admin",
    channel: "admin"
  });
  if (eventType.includes("qualification") || eventType.includes("evidence")) {
    await supabase.from("bathroom_lead_qualification_events").insert({
      lead_type: leadType,
      lead_id: leadId,
      event_type: eventType,
      new_value: dbPatch,
      actor: "admin",
      note: typeof patch.qualificationNotes === "string" ? patch.qualificationNotes : null
    });
  }
  return getStoredLead(leadType, leadId);
}

export function applyQualification(lead: NormalizedLead, qualification: QualificationResult, actor = "system") {
  const updatedAt = nowIso();
  return {
    ...lead,
    leadFitScore: qualification.leadFitScore,
    leadFitTier: qualification.leadFitTier,
    qualificationStatus: qualification.qualificationStatus,
    urgency: qualification.urgency,
    projectValueBand: qualification.projectValueBand,
    riskLevel: qualification.riskLevel,
    evidenceQuality: qualification.evidenceQuality,
    manualReviewRequired: qualification.manualReviewRequired,
    manualReviewReason: qualification.manualReviewReason,
    missingEvidence: qualification.missingEvidence,
    disqualificationFlags: qualification.disqualificationFlags,
    recommendedNextAction: qualification.recommendedNextAction,
    qualificationSummary: qualification.qualificationSummary,
    customerSafeNextStep: qualification.customerSafeNextStep,
    evidenceChecklist: qualification.evidenceChecklist,
    qualificationUpdatedAt: updatedAt,
    qualificationUpdatedBy: actor,
    updatedAt
  };
}

export async function qualifyStoredLead(leadType: BathroomLeadType, leadId: string, actor = "admin") {
  const lead = await getStoredLead(leadType, leadId);
  if (!lead) return null;
  const qualified = applyQualification(lead, qualifyBathroomLead(lead), actor);
  return updateLeadResponse(leadType, leadId, qualified, "qualification_run");
}

export async function updateEvidenceStatus(
  leadType: BathroomLeadType,
  leadId: string,
  evidenceKey: string,
  evidenceStatus: EvidenceStatus,
  actor = "admin"
) {
  const lead = await getStoredLead(leadType, leadId);
  if (!lead) return null;
  const evidenceChecklist = { ...buildEvidenceChecklist(lead), [evidenceKey]: evidenceStatus };
  const nextLead = { ...lead, evidenceChecklist };
  const qualified = applyQualification(nextLead, qualifyBathroomLead(nextLead), actor);
  qualified.evidenceChecklist = evidenceChecklist;
  if (evidenceStatus === "requested") qualified.qualificationStatus = "evidence_requested";
  if (evidenceStatus === "received") qualified.qualificationStatus = "evidence_received";
  return updateLeadResponse(leadType, leadId, qualified, "evidence_update");
}
