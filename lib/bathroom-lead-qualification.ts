import {
  EvidenceQuality,
  EvidenceStatus,
  LeadFitTier,
  NormalizedLead,
  ProjectValueBand,
  QualificationStatus,
  RecommendedNextAction,
  RiskLevel,
  Urgency
} from "./lead-workflow";
import { getEvidenceLabel } from "./evidence-labels";

export type QualificationResult = {
  leadFitScore: number;
  leadFitTier: LeadFitTier;
  qualificationStatus: QualificationStatus;
  urgency: Urgency;
  projectValueBand: ProjectValueBand;
  riskLevel: RiskLevel;
  evidenceQuality: EvidenceQuality;
  manualReviewRequired: boolean;
  manualReviewReason: string[];
  missingEvidence: string[];
  disqualificationFlags: string[];
  recommendedNextAction: RecommendedNextAction;
  qualificationSummary: string;
  customerSafeNextStep: string;
  evidenceChecklist: Record<string, EvidenceStatus>;
};

const sydneySuburbs = new Set([
  "marrickville",
  "newtown",
  "ryde",
  "parramatta",
  "chatswood",
  "sydney",
  "bondi",
  "randwick",
  "manly",
  "cronulla",
  "blacktown",
  "castle hill",
  "strathfield",
  "burwood",
  "leichhardt",
  "paddington",
  "surry hills",
  "mosman",
  "bankstown",
  "hurstville",
  "auburn",
  "epping",
  "hornsby",
  "st leonards",
  "neutral bay",
  "coogee",
  "maroubra",
  "crows nest",
  "lane cove",
  "penrith",
  "campbelltown",
  "liverpool"
]);

const outsideAreaSignals = ["melbourne", "brisbane", "perth", "adelaide", "canberra", "wollongong", "newcastle", "central coast", "gold coast"];

export function evidenceKeysForLeadType(leadType: NormalizedLead["leadType"]) {
  if (leadType === "quote_review") {
    return [
      "quotePdf",
      "inclusionsExclusions",
      "pcSums",
      "provisionalSums",
      "builderDetails",
      "builderLicence",
      "quoteDate",
      "gstStatus",
      "depositRequested",
      "photosPlans",
      "timeline"
    ];
  }
  if (leadType === "request_review") {
    return ["photosPlans", "projectStage", "budget", "preferredNextStep", "propertyType", "bathroomType", "messageScope"];
  }
  if (leadType === "site_measure") {
    return [
      "addressOrSuburb",
      "phone",
      "preferredWindow",
      "accessNotes",
      "parkingLiftStairs",
      "strataStatus",
      "knownIssues",
      "photosPlans"
    ];
  }
  return [
    "photos",
    "roughDimensions",
    "bathroomType",
    "propertyType",
    "budget",
    "timeline",
    "layoutDetails",
    "strataStatus",
    "accessNotes",
    "knownIssues",
    "preferredFinishes"
  ];
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function num(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function bool(value: unknown) {
  return value === true;
}

function hasPhone(lead: NormalizedLead) {
  return Boolean(lead.contact.phone && lead.contact.phone.trim().length >= 8);
}

function suburbStatus(lead: NormalizedLead) {
  const suburb = (lead.suburb || lead.contact.suburb || "").toLowerCase().trim();
  if (!suburb) return "missing";
  if (outsideAreaSignals.some((signal) => suburb.includes(signal))) return "outside";
  if (sydneySuburbs.has(suburb)) return "sydney";
  return "unknown";
}

function riskText(lead: NormalizedLead) {
  return lead.riskFlags.join(" ").toLowerCase();
}

function estimateValueBand(lead: NormalizedLead): ProjectValueBand {
  const amount = lead.quoteAmount;
  const range = lead.estimateRange?.match(/\$?([\d,]+)/g)?.map((match) => Number(match.replace(/[$,]/g, ""))) || [];
  const high = amount || Math.max(...range, 0);
  if (!high) return "unknown";
  if (high < 25000) return "low";
  if (high < 45000) return "medium";
  if (high < 70000) return "high";
  return "premium";
}

function budgetBandFromPayload(lead: NormalizedLead): ProjectValueBand {
  const budget = text(lead.payload.budgetRange);
  if (budget === "under-25k") return "low";
  if (budget === "25k-40k") return "medium";
  if (budget === "40k-60k") return "high";
  if (budget === "60k-plus") return "premium";
  return estimateValueBand(lead);
}

function riskLevelFor(lead: NormalizedLead): RiskLevel {
  const risk = riskText(lead);
  if (risk.includes("asbestos") || risk.includes("deposit") || risk.includes("hbcf")) return "critical";
  if (
    risk.includes("strata") ||
    risk.includes("waterproof") ||
    risk.includes("leak") ||
    risk.includes("mould") ||
    risk.includes("plumbing") ||
    risk.includes("electrical") ||
    lead.riskFlags.length >= 4
  ) {
    return "high";
  }
  if (lead.riskFlags.length || lead.confidenceScore !== undefined && lead.confidenceScore < 70) return "medium";
  return "low";
}

function statusForChecklist(lead: NormalizedLead, key: string): EvidenceStatus {
  const payload = lead.payload;
  const quote = payload.quote && typeof payload.quote === "object" ? (payload.quote as Record<string, unknown>) : {};
  const upload = payload.upload && typeof payload.upload === "object" ? (payload.upload as Record<string, unknown>) : {};
  const allowances = payload.allowances && typeof payload.allowances === "object" ? (payload.allowances as Record<string, unknown>) : {};
  const risk = payload.risk && typeof payload.risk === "object" ? (payload.risk as Record<string, unknown>) : {};

  const received = (condition: boolean) => (condition ? "received" : "missing");
  switch (key) {
    case "photos":
    case "photosPlans":
      return received(bool(payload.hasPhotosPlans) || Boolean(text(upload.fileName)));
    case "quotePdf":
      return received(Boolean(text(upload.fileName)));
    case "roughDimensions":
      return "missing";
    case "bathroomType":
      return received(Boolean(lead.bathroomType || text(payload.bathroomType) || text(payload.projectType)));
    case "propertyType":
      return received(Boolean(lead.propertyType || lead.contact.propertyType));
    case "budget":
      return received(Boolean(text(payload.budgetRange) || lead.quoteAmount || lead.estimateRange));
    case "timeline":
      return received(Boolean(lead.timeline && lead.timeline !== "not-stated" && lead.timeline !== "unclear"));
    case "layoutDetails":
      return received(Boolean(text(payload.layoutChange) || risk.layoutOrServiceChanges));
    case "strataStatus":
      if (!/apartment|strata/i.test(`${lead.propertyType} ${lead.contact.propertyType} ${riskText(lead)}`)) return "not_required";
      return received(Boolean(risk.strataApprovalRequired) || Boolean(text(payload.strataApprovalStatus)));
    case "accessNotes":
      return received(Boolean(text(payload.accessNotes)) || Boolean(text(payload.access)) || Boolean(risk.accessConstraints));
    case "knownIssues":
      return received(Boolean(text(payload.knownIssues)) || Boolean(risk.leaksOrMould) || Boolean(risk.suspectedAsbestos));
    case "preferredFinishes":
      return received(Boolean(text(payload.fixtureLevel)));
    case "inclusionsExclusions":
      return received(allowances.exclusionsClearlyListed === "yes");
    case "pcSums":
      return received(Boolean(allowances.pcSumsPresent));
    case "provisionalSums":
      return received(Boolean(allowances.provisionalSumsPresent));
    case "builderDetails":
      return received(Boolean(text(quote.builderName)));
    case "builderLicence":
      return received(Boolean(text(quote.builderLicence)));
    case "quoteDate":
      return received(Boolean(text(quote.quoteDate)));
    case "gstStatus":
      return received(Boolean(quote.gstStatus) && quote.gstStatus !== "unclear");
    case "depositRequested":
      return received(num(quote.depositRequested) !== undefined);
    case "projectStage":
      return received(Boolean(text(payload.projectStage)));
    case "preferredNextStep":
      return received(Boolean(text(payload.preferredNextStep)));
    case "messageScope":
      return received(text(payload.message).length >= 20);
    case "addressOrSuburb":
      return received(Boolean(text(payload.propertyAddress) || lead.suburb || lead.contact.suburb));
    case "phone":
      return received(hasPhone(lead));
    case "preferredWindow":
      return received(Boolean(text(payload.preferredTimeWindow)));
    case "parkingLiftStairs":
      return received(Boolean(text(payload.parkingLiftStairsNotes)));
    default:
      return "missing";
  }
}

export function buildEvidenceChecklist(lead: NormalizedLead) {
  const existing = lead.evidenceChecklist || {};
  return Object.fromEntries(
    evidenceKeysForLeadType(lead.leadType).map((key) => [key, existing[key] || statusForChecklist(lead, key)])
  ) as Record<string, EvidenceStatus>;
}

function evidenceQuality(checklist: Record<string, EvidenceStatus>): EvidenceQuality {
  const relevant = Object.values(checklist).filter((status) => status !== "not_required");
  if (!relevant.length) return "missing";
  const received = relevant.filter((status) => status === "received").length;
  const ratio = received / relevant.length;
  if (ratio >= 0.85) return "complete";
  if (ratio >= 0.6) return "adequate";
  if (ratio >= 0.25) return "thin";
  return "missing";
}

function tierFor(score: number, disqualified: boolean, manualReview: boolean): LeadFitTier {
  if (disqualified || score < 30) return "not_fit";
  if (score < 48) return "weak_fit";
  if (manualReview || score < 65) return "needs_review";
  if (score < 82) return "good_fit";
  return "strong_fit";
}

function actionFor(lead: NormalizedLead, missing: string[], riskLevel: RiskLevel, valueBand: ProjectValueBand): RecommendedNextAction {
  const risk = riskText(lead);
  const hasBuilderQuote = bool(lead.payload.hasBuilderQuote);
  const hasPhotosPlans = bool(lead.payload.hasPhotosPlans) || Boolean(text((lead.payload.upload as Record<string, unknown> | undefined)?.fileName));
  if (suburbStatus(lead) === "outside") return "refer_out";
  if (valueBand === "low" && lead.leadType !== "quote_review") return "clarify_budget";
  if (risk.includes("asbestos")) return "clarify_asbestos";
  if (risk.includes("strata") || /apartment|strata/i.test(`${lead.propertyType} ${lead.contact.propertyType}`)) return "clarify_strata";
  if (lead.leadType === "quote_review") {
    if (missing.includes("Quote PDF or image")) return "request_quote_pdf";
    if (lead.quoteClarityScore !== undefined && lead.quoteClarityScore < 65) return "prepare_manual_quote_review";
    return "request_inclusions_exclusions";
  }
  if (lead.leadType === "request_review") {
    if (hasBuilderQuote) return "request_quote_pdf";
    if (!hasPhotosPlans) return "request_photos";
    if (lead.timeline === "urgent" && hasPhone(lead)) return "call_customer";
    if (lead.timeline === "planning") return "clarify_timeline";
    return riskLevel === "high" || riskLevel === "critical" ? "call_customer" : "prepare_manual_quote_review";
  }
  if (lead.leadType === "site_measure") {
    if (missing.some((item) => /access|parking|lift|stairs/i.test(item))) return "clarify_access";
    return "book_site_measure";
  }
  if (missing.some((item) => /photo/i.test(item))) return "request_photos";
  if (riskLevel === "high" || riskLevel === "critical") return "call_customer";
  return "book_site_measure";
}

export function qualifyBathroomLead(lead: NormalizedLead): QualificationResult {
  let score = 55;
  const manualReviewReason: string[] = [];
  const disqualificationFlags: string[] = [];
  const checklist = buildEvidenceChecklist(lead);
  const missingEvidence = Object.entries(checklist)
    .filter(([, status]) => status === "missing" || status === "requested")
    .map(([key]) => getEvidenceLabel(key));
  const suburb = suburbStatus(lead);
  const riskLevel = riskLevelFor(lead);
  const valueBand = budgetBandFromPayload(lead);
  const quality = evidenceQuality(checklist);
  const risk = riskText(lead);

  if (suburb === "sydney") score += 8;
  if (suburb === "unknown") score += 2;
  if (suburb === "missing") {
    score -= 12;
    manualReviewReason.push("Suburb is missing.");
  }
  if (suburb === "outside") {
    score -= 35;
    disqualificationFlags.push("Outside likely Sydney service area.");
  }

  if (hasPhone(lead)) score += 8;
  else score -= 8;
  if (lead.bathroomType) score += 5;
  if (lead.leadType === "site_measure") score += 18;
  if (lead.leadType === "request_review" && bool(lead.payload.hasPhotosPlans)) score += 8;
  if (lead.leadType === "request_review" && bool(lead.payload.hasBuilderQuote)) score += 7;
  if (lead.leadType === "request_review" && text(lead.payload.message).length >= 40) score += 4;
  if (lead.leadType === "quote_review" && lead.quoteAmount && lead.quoteAmount >= 25000) score += 10;
  if (lead.quoteClarityScore !== undefined && lead.quoteClarityScore < 65) {
    score += 5;
    manualReviewReason.push("Quote clarity is low and needs human review.");
  }
  if (lead.confidenceScore !== undefined && lead.confidenceScore < 58) {
    score -= 3;
    manualReviewReason.push("Estimate confidence is low.");
  }
  if (valueBand === "medium") score += 7;
  if (valueBand === "high") score += 12;
  if (valueBand === "premium") score += 14;
  if (valueBand === "low") {
    score -= 18;
    manualReviewReason.push("Budget or value band may be below a viable renovation threshold.");
  }
  if (quality === "complete") score += 12;
  if (quality === "adequate") score += 8;
  if (quality === "thin") score -= 5;
  if (quality === "missing") score -= 14;
  if (lead.timeline === "ready-now" || lead.timeline === "urgent") score += 6;
  if (lead.timeline === "planning" || lead.timeline === "not-stated" || lead.timeline === "unclear") score -= 3;

  if (riskLevel === "high" || riskLevel === "critical") {
    manualReviewReason.push(`Risk level is ${riskLevel}.`);
    if (valueBand === "high" || valueBand === "premium") score += 4;
    else score -= 6;
  }

  if (risk.includes("asbestos")) manualReviewReason.push("Asbestos concern needs clarification before disturbance.");
  if (risk.includes("strata")) manualReviewReason.push("Strata/Class 2 or apartment approval path needs clarification.");
  if (risk.includes("waterproof")) manualReviewReason.push("Waterproofing uncertainty needs written clarification.");
  if (
    /cheapest|supply only|supply-only|marketplace|multi-builder|emergency leak|diy waterproof|diy renovation|unlicensed|legal advice|compliance certification|commercial|public building|final quote without site/i.test(
      JSON.stringify(lead.payload)
    )
  ) {
    score -= 25;
    disqualificationFlags.push("Request appears outside the preferred renovation workflow.");
  }

  const manualReviewRequired = manualReviewReason.length > 0 || riskLevel === "high" || riskLevel === "critical";
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  const tier = tierFor(finalScore, disqualificationFlags.length > 0, manualReviewRequired);
  const urgency: Urgency =
    lead.leadType === "site_measure" || lead.timeline === "ready-now" || lead.timeline === "urgent"
      ? "urgent"
      : manualReviewRequired || lead.responsePriority === "high"
        ? "high"
        : tier === "weak_fit" || tier === "not_fit"
          ? "low"
          : "normal";
  const action = actionFor(lead, missingEvidence, riskLevel, valueBand);
  const qualificationStatus =
    tier === "not_fit"
      ? "not_fit"
      : action === "book_site_measure"
        ? "ready_for_site_measure"
        : action === "prepare_manual_quote_review"
          ? "ready_for_quote_review"
          : manualReviewRequired || tier === "needs_review"
            ? "manual_review_needed"
            : "system_qualified";

  return {
    leadFitScore: finalScore,
    leadFitTier: tier,
    qualificationStatus,
    urgency,
    projectValueBand: valueBand,
    riskLevel,
    evidenceQuality: quality,
    manualReviewRequired,
    manualReviewReason,
    missingEvidence,
    disqualificationFlags,
    recommendedNextAction: action,
    qualificationSummary: `${tier.replaceAll("_", " ")} ${lead.leadType.replaceAll("_", " ")} lead in ${
      lead.suburb || lead.contact.suburb || "unknown suburb"
    }; ${riskLevel} risk, ${quality} evidence, next action ${action.replaceAll("_", " ")}.`,
    customerSafeNextStep:
      "Operon can review the supplied details and may ask for photos, quote documents, access notes or a site measure before any contract pricing.",
    evidenceChecklist: checklist
  };
}
