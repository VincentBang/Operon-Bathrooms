import { createClient } from "@supabase/supabase-js";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Attribution } from "./attribution";
import { ChatbotIntent } from "./chatbot/bathroomChatbotResponses";
import { highRiskTopicsFor } from "./chatbot/bathroomChatbotSafety";

export type ChatbotQualificationStatus =
  | "new"
  | "reviewed"
  | "converted_to_lead"
  | "manual_review_needed"
  | "not_fit"
  | "archived";

export type FollowUpTaskStatus = "open" | "in_progress" | "waiting_on_customer" | "completed" | "cancelled" | "archived";
export type FollowUpTaskPriority = "urgent" | "high" | "normal" | "low";
export type FollowUpTaskType =
  | "follow_up"
  | "request_evidence"
  | "quote_review"
  | "site_measure"
  | "manual_review"
  | "customer_response"
  | "admin_check";

export type ChatbotQualificationInput = {
  name: string;
  email: string;
  phone?: string;
  suburb: string;
  preferredNextStep: "estimate" | "quote_review" | "scope_review" | "site_measure" | "manual_review";
  message: string;
  latestIntent?: ChatbotIntent;
  latestAssistantTitle?: string;
  highRiskTopics?: string[];
  privacyAccepted: boolean;
  termsAccepted: boolean;
  guidanceAccepted: boolean;
  attribution?: Attribution;
  request: Request;
};

export type ChatbotQualificationRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ChatbotQualificationStatus;
  sourceRoute: string;
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  userAgent?: string;
  sessionId?: string;
  leadType: "chatbot";
  leadId?: string | null;
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
    suburb: string;
  };
  chatbotPayload: Record<string, unknown>;
  qualificationResult: Record<string, unknown>;
  riskFlags: string[];
  missingEvidence: string[];
  recommendedNextAction: string;
  confidenceScore: number;
  manualReviewRequired: boolean;
  privacyAccepted: boolean;
  termsAccepted: boolean;
  guidanceAccepted: boolean;
};

export type FollowUpTaskRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: FollowUpTaskStatus;
  priority: FollowUpTaskPriority;
  taskType: FollowUpTaskType;
  leadType: "chatbot";
  leadId?: string | null;
  chatbotQualificationId: string;
  title: string;
  description: string;
  dueAt: string;
  sourceRoute?: string;
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  riskFlags: string[];
  taskPayload: Record<string, unknown>;
};

type LocalData = {
  qualifications: ChatbotQualificationRecord[];
  tasks: FollowUpTaskRecord[];
};

const localStorePath = path.join(process.cwd(), ".local", "bathroom-chatbot-qualifications.json");
let localQueue = Promise.resolve();

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

function id() {
  return globalThis.crypto?.randomUUID?.() ?? `chatbot_${Date.now().toString(36)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function addHours(start: Date, hours: number) {
  const next = new Date(start);
  next.setHours(next.getHours() + hours);
  return next.toISOString();
}

function uniqueLines(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function inferRiskFlags(input: ChatbotQualificationInput) {
  return uniqueLines([...(input.highRiskTopics || []), ...highRiskTopicsFor(input.message)]);
}

function missingEvidenceFor(input: ChatbotQualificationInput, riskFlags: string[]) {
  const missing = ["photos of the bathroom", "preferred scope or written quote if available"];
  if (riskFlags.some((flag) => flag.includes("apartment") || flag.includes("strata"))) missing.push("strata notes or access constraints");
  if (riskFlags.some((flag) => flag.includes("waterproofing") || flag.includes("leak"))) missing.push("photos of wet areas, leaks or mould");
  if (input.preferredNextStep === "quote_review") missing.push("builder quote or inclusions list");
  return uniqueLines(missing);
}

function qualificationFor(input: ChatbotQualificationInput, riskFlags: string[], missingEvidence: string[]) {
  const manualReviewRequired =
    riskFlags.length > 0 || input.preferredNextStep === "manual_review" || input.preferredNextStep === "quote_review";
  const confidenceScore = Math.max(35, Math.min(82, 78 - riskFlags.length * 8 - Math.max(0, missingEvidence.length - 2) * 4));
  const recommendedNextAction =
    input.preferredNextStep === "site_measure"
      ? "book_site_measure"
      : input.preferredNextStep === "quote_review"
        ? "prepare_manual_quote_review"
        : manualReviewRequired
          ? "request_evidence"
          : "call_customer";

  return {
    manualReviewRequired,
    confidenceScore,
    recommendedNextAction,
    summary: manualReviewRequired
      ? "Chatbot handoff should be reviewed before recommending a site measure or written scope pathway."
      : "Chatbot handoff is suitable for a normal first response."
  };
}

function taskFor(input: ChatbotQualificationInput, qualification: ChatbotQualificationRecord): FollowUpTaskRecord {
  const urgent = qualification.riskFlags.some((flag) => /urgent|leak|mould|asbestos|deposit/i.test(flag));
  const taskType: FollowUpTaskType =
    input.preferredNextStep === "site_measure"
      ? "site_measure"
      : input.preferredNextStep === "quote_review"
        ? "quote_review"
        : qualification.manualReviewRequired
          ? "manual_review"
          : "follow_up";
  const priority: FollowUpTaskPriority = urgent ? "urgent" : qualification.manualReviewRequired ? "high" : "normal";
  const createdAt = nowIso();

  return {
    id: id(),
    createdAt,
    updatedAt: createdAt,
    status: "open",
    priority,
    taskType,
    leadType: "chatbot",
    leadId: null,
    chatbotQualificationId: qualification.id,
    title: `${taskType.replaceAll("_", " ")}: ${qualification.contactInfo.name || qualification.contactInfo.email}`,
    description: "Review chatbot handoff context and route the customer to estimate, quote review, scope review or site measure.",
    dueAt: addHours(new Date(createdAt), priority === "urgent" ? 4 : priority === "high" ? 24 : 48),
    sourceRoute: qualification.sourceRoute,
    landingPage: qualification.landingPage,
    referrer: qualification.referrer,
    utmSource: qualification.utmSource,
    utmMedium: qualification.utmMedium,
    utmCampaign: qualification.utmCampaign,
    utmContent: qualification.utmContent,
    utmTerm: qualification.utmTerm,
    riskFlags: qualification.riskFlags,
    taskPayload: {
      preferredNextStep: input.preferredNextStep,
      latestIntent: input.latestIntent,
      missingEvidence: qualification.missingEvidence
    }
  };
}

async function readLocalData(): Promise<LocalData> {
  try {
    const raw = await readFile(localStorePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<LocalData>;
    return {
      qualifications: parsed.qualifications || [],
      tasks: parsed.tasks || []
    };
  } catch {
    return { qualifications: [], tasks: [] };
  }
}

async function writeLocalData(data: LocalData) {
  await mkdir(path.dirname(localStorePath), { recursive: true });
  await writeFile(localStorePath, JSON.stringify(data, null, 2));
}

function qualificationRow(record: ChatbotQualificationRecord) {
  return {
    id: record.id,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
    status: record.status,
    source_route: record.sourceRoute,
    landing_page: record.landingPage,
    referrer: record.referrer,
    utm_source: record.utmSource,
    utm_medium: record.utmMedium,
    utm_campaign: record.utmCampaign,
    utm_content: record.utmContent,
    utm_term: record.utmTerm,
    user_agent: record.userAgent,
    session_id: record.sessionId,
    lead_type: record.leadType,
    lead_id: record.leadId,
    contact_info: record.contactInfo,
    chatbot_payload: record.chatbotPayload,
    qualification_result: record.qualificationResult,
    risk_flags: record.riskFlags,
    missing_evidence: record.missingEvidence,
    recommended_next_action: record.recommendedNextAction,
    confidence_score: record.confidenceScore,
    manual_review_required: record.manualReviewRequired,
    privacy_accepted: record.privacyAccepted,
    terms_accepted: record.termsAccepted,
    guidance_accepted: record.guidanceAccepted
  };
}

function taskRow(record: FollowUpTaskRecord) {
  return {
    id: record.id,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
    status: record.status,
    priority: record.priority,
    task_type: record.taskType,
    lead_type: record.leadType,
    lead_id: record.leadId,
    chatbot_qualification_id: record.chatbotQualificationId,
    title: record.title,
    description: record.description,
    due_at: record.dueAt,
    source_route: record.sourceRoute,
    landing_page: record.landingPage,
    referrer: record.referrer,
    utm_source: record.utmSource,
    utm_medium: record.utmMedium,
    utm_campaign: record.utmCampaign,
    utm_content: record.utmContent,
    utm_term: record.utmTerm,
    risk_flags: record.riskFlags,
    task_payload: record.taskPayload
  };
}

function normalizeQualification(row: Record<string, unknown>): ChatbotQualificationRecord {
  return {
    id: String(row.id),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at || row.created_at),
    status: (row.status as ChatbotQualificationStatus) || "new",
    sourceRoute: String(row.source_route || ""),
    landingPage: String(row.landing_page || ""),
    referrer: String(row.referrer || ""),
    utmSource: String(row.utm_source || ""),
    utmMedium: String(row.utm_medium || ""),
    utmCampaign: String(row.utm_campaign || ""),
    utmContent: String(row.utm_content || ""),
    utmTerm: String(row.utm_term || ""),
    userAgent: String(row.user_agent || ""),
    sessionId: String(row.session_id || ""),
    leadType: "chatbot",
    leadId: (row.lead_id as string | null) || null,
    contactInfo: (row.contact_info as ChatbotQualificationRecord["contactInfo"]) || { name: "", email: "", suburb: "" },
    chatbotPayload: (row.chatbot_payload as Record<string, unknown>) || {},
    qualificationResult: (row.qualification_result as Record<string, unknown>) || {},
    riskFlags: Array.isArray(row.risk_flags) ? row.risk_flags.map(String) : [],
    missingEvidence: Array.isArray(row.missing_evidence) ? row.missing_evidence.map(String) : [],
    recommendedNextAction: String(row.recommended_next_action || ""),
    confidenceScore: typeof row.confidence_score === "number" ? row.confidence_score : 0,
    manualReviewRequired: row.manual_review_required === true,
    privacyAccepted: row.privacy_accepted === true,
    termsAccepted: row.terms_accepted === true,
    guidanceAccepted: row.guidance_accepted === true
  };
}

function normalizeTask(row: Record<string, unknown>): FollowUpTaskRecord {
  return {
    id: String(row.id),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at || row.created_at),
    status: (row.status as FollowUpTaskStatus) || "open",
    priority: (row.priority as FollowUpTaskPriority) || "normal",
    taskType: (row.task_type as FollowUpTaskType) || "follow_up",
    leadType: "chatbot",
    leadId: (row.lead_id as string | null) || null,
    chatbotQualificationId: String(row.chatbot_qualification_id || ""),
    title: String(row.title || ""),
    description: String(row.description || ""),
    dueAt: String(row.due_at || ""),
    sourceRoute: String(row.source_route || ""),
    landingPage: String(row.landing_page || ""),
    referrer: String(row.referrer || ""),
    utmSource: String(row.utm_source || ""),
    utmMedium: String(row.utm_medium || ""),
    utmCampaign: String(row.utm_campaign || ""),
    utmContent: String(row.utm_content || ""),
    utmTerm: String(row.utm_term || ""),
    riskFlags: Array.isArray(row.risk_flags) ? row.risk_flags.map(String) : [],
    taskPayload: (row.task_payload as Record<string, unknown>) || {}
  };
}

export async function storeChatbotQualification(input: ChatbotQualificationInput) {
  const riskFlags = inferRiskFlags(input);
  const missingEvidence = missingEvidenceFor(input, riskFlags);
  const qualification = qualificationFor(input, riskFlags, missingEvidence);
  const createdAt = nowIso();
  const attribution = input.attribution;
  const record: ChatbotQualificationRecord = {
    id: id(),
    createdAt,
    updatedAt: createdAt,
    status: qualification.manualReviewRequired ? "manual_review_needed" : "new",
    sourceRoute: attribution?.sourceRoute || "/chatbot",
    landingPage: attribution?.landingPage || "",
    referrer: attribution?.referrer || "",
    utmSource: attribution?.utmSource || "",
    utmMedium: attribution?.utmMedium || "",
    utmCampaign: attribution?.utmCampaign || "",
    utmContent: attribution?.utmContent || "",
    utmTerm: attribution?.utmTerm || "",
    userAgent: input.request.headers.get("user-agent") || "",
    sessionId: input.request.headers.get("x-operon-chat-session") || "",
    leadType: "chatbot",
    leadId: null,
    contactInfo: {
      name: input.name,
      email: input.email,
      phone: input.phone || "",
      suburb: input.suburb
    },
    chatbotPayload: {
      message: input.message,
      latestIntent: input.latestIntent,
      latestAssistantTitle: input.latestAssistantTitle,
      preferredNextStep: input.preferredNextStep
    },
    qualificationResult: qualification,
    riskFlags,
    missingEvidence,
    recommendedNextAction: qualification.recommendedNextAction,
    confidenceScore: qualification.confidenceScore,
    manualReviewRequired: qualification.manualReviewRequired,
    privacyAccepted: input.privacyAccepted,
    termsAccepted: input.termsAccepted,
    guidanceAccepted: input.guidanceAccepted
  };
  const task = taskFor(input, record);
  const supabase = client();

  if (!supabase) {
    await (localQueue = localQueue.then(async () => {
      const data = await readLocalData();
      data.qualifications.unshift(record);
      data.tasks.unshift(task);
      await writeLocalData(data);
    }));
    return { ok: true, stored: true, storage: "local" as const, qualification: record, followUpTask: task };
  }

  const { error: qualificationError } = await supabase.from("operon_chatbot_qualifications").insert(qualificationRow(record));
  if (qualificationError) {
    return { ok: false, stored: false, storage: "supabase" as const, reason: "Chatbot qualification storage failed" };
  }

  const { error: taskError } = await supabase.from("operon_follow_up_tasks").insert(taskRow(task));
  if (taskError) {
    return { ok: false, stored: false, storage: "supabase" as const, reason: "Follow-up task storage failed" };
  }

  return { ok: true, stored: true, storage: "supabase" as const, qualification: record, followUpTask: task };
}

export async function listChatbotQualifications() {
  const supabase = client();
  if (!supabase) {
    await localQueue;
    return readLocalData();
  }

  const [{ data: qualificationRows }, { data: taskRows }] = await Promise.all([
    supabase.from("operon_chatbot_qualifications").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("operon_follow_up_tasks").select("*").order("created_at", { ascending: false }).limit(150)
  ]);
  return {
    qualifications: (qualificationRows || []).map((row) => normalizeQualification(row as Record<string, unknown>)),
    tasks: (taskRows || []).map((row) => normalizeTask(row as Record<string, unknown>))
  };
}
