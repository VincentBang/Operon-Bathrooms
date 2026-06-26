import { getDesignConstraintPrompts } from "@/lib/bathroom-design/constraints";
import { evidenceReadinessSummary } from "@/lib/bathroom-design/evidence-readiness";
import { getLayoutRiskPrompts } from "@/lib/bathroom-design/layout-risk";
import type { BathroomDesignDraft } from "@/lib/bathroom-design/schema";

export const DESIGN_QUOTE_OS_HANDOFF_VERSION = "0.1" as const;
export const MAX_QUOTE_OS_REVIEW_QUESTIONS = 12;

type FixtureZone = BathroomDesignDraft["layoutPlanning"]["fixtureZones"][number];
type EvidenceReadinessItem = BathroomDesignDraft["evidenceReadiness"][number];

export type BathroomDesignQuoteOsHandoff = {
  version: typeof DESIGN_QUOTE_OS_HANDOFF_VERSION;
  source: "design-studio";
  draftId: string;
  schemaVersion: BathroomDesignDraft["schemaVersion"];
  createdAt: string;
  bathroomType: BathroomDesignDraft["bathroomType"];
  preferredNextStep: BathroomDesignDraft["preferredNextStep"];
  planningContext: {
    startingPoint: BathroomDesignDraft["startingPoint"]["kind"];
    sampleTemplateId?: BathroomDesignDraft["startingPoint"]["sampleTemplateId"];
    styleId: BathroomDesignDraft["styleId"];
    paletteId: BathroomDesignDraft["paletteId"];
    allowanceBand: BathroomDesignDraft["allowanceBand"];
    selectedVariantId: string;
    photoUsed: boolean;
  };
  layoutContext: {
    roomShape: BathroomDesignDraft["layoutPlanning"]["roomShape"];
    sizeBand: BathroomDesignDraft["layoutPlanning"]["sizeBand"];
    entryPosition: BathroomDesignDraft["layoutPlanning"]["entryPosition"];
    fixtureZones: Array<Pick<FixtureZone, "fixtureType" | "label" | "approximatePosition" | "status" | "serviceChange">>;
    constraints: BathroomDesignDraft["layoutPlanning"]["constraints"];
  };
  selectionContext: Array<{
    category: string;
    label: string;
    finishFamily: string;
    planningUse: string;
    evidencePrompt: string;
    verificationStatus: "catalogue-candidate";
  }>;
  promptContext: {
    layoutRiskPromptIds: string[];
    constraintPromptIds: string[];
    reviewQuestions: string[];
  };
  evidenceContext: {
    summary: ReturnType<typeof evidenceReadinessSummary>;
    preparedItemIds: string[];
    missingItemIds: string[];
    plannedItemIds: string[];
    requiresSiteMeasureConfirmation: true;
  };
  safety: {
    internalOnly: true;
    planningContextOnly: true;
    finalPricing: false;
    quoteApproval: false;
    proposalOutput: false;
    procurement: false;
    payment: false;
    crm: false;
    adminAutomation: false;
    publicOutput: false;
    schemaVersionChanged: false;
  };
};

const forbiddenKeyPattern =
  /finalPrice|quoteTotal|contractPrice|fixedPrice|rateCard|supplierCost|labou?rRate|margin|serviceRole|adminNote|adminNotes|leadScore|privateScore|sku|supplierFeed|verifiedProduct|pricingIncluded|confirmedSku/i;
const forbiddenStringPattern =
  /final price|fixed price|contract price|rate card|supplier cost|labou?r rate|margin|service role|admin note|lead score|private score|base64|data:image|blob:|exif/i;

function readable(value: string) {
  return value.replace(/-/g, " ");
}

function uniqueLimited(values: string[], max = MAX_QUOTE_OS_REVIEW_QUESTIONS) {
  const output: string[] = [];
  for (const value of values) {
    if (!output.includes(value)) output.push(value);
    if (output.length >= max) break;
  }
  return output;
}

function idsByStatus(items: EvidenceReadinessItem[], status: EvidenceReadinessItem["status"]) {
  return items.filter((item) => item.status === status).map((item) => item.id);
}

export function createQuoteOsReviewQuestions(draft: BathroomDesignDraft) {
  const layoutPrompts = draft.layoutRiskPrompts.length
    ? draft.layoutRiskPrompts
    : getLayoutRiskPrompts(draft.layoutPlanning);
  const constraintPrompts = draft.constraintPrompts.length
    ? draft.constraintPrompts
    : getDesignConstraintPrompts(draft);
  const evidenceQuestions = draft.evidenceReadiness
    .filter((item) => item.status === "missing" || item.status === "planned")
    .map((item) => `Ask whether ${item.label.toLowerCase()} is ready before site measure or written scope review.`);

  return uniqueLimited([
    `Confirm ${readable(draft.bathroomType)} scope during site measure before contract pricing.`,
    ...layoutPrompts.map((prompt) => `Confirm ${prompt.title.toLowerCase()} during site review or in writing.`),
    ...constraintPrompts.map((prompt) => `Prepare evidence for ${prompt.title.toLowerCase()} before scope confirmation.`),
    ...evidenceQuestions,
    "Confirm selections, licensed-trade checks and written scope before relying on contract pricing."
  ]);
}

export function createQuoteOsHandoff(
  draft: BathroomDesignDraft,
  now = new Date()
): BathroomDesignQuoteOsHandoff {
  const layoutPrompts = draft.layoutRiskPrompts.length
    ? draft.layoutRiskPrompts
    : getLayoutRiskPrompts(draft.layoutPlanning);
  const constraintPrompts = draft.constraintPrompts.length
    ? draft.constraintPrompts
    : getDesignConstraintPrompts(draft);

  return {
    version: DESIGN_QUOTE_OS_HANDOFF_VERSION,
    source: "design-studio",
    draftId: draft.id,
    schemaVersion: draft.schemaVersion,
    createdAt: now.toISOString(),
    bathroomType: draft.bathroomType,
    preferredNextStep: draft.preferredNextStep,
    planningContext: {
      startingPoint: draft.startingPoint.kind,
      sampleTemplateId: draft.startingPoint.sampleTemplateId,
      styleId: draft.styleId,
      paletteId: draft.paletteId,
      allowanceBand: draft.allowanceBand,
      selectedVariantId: draft.selectedVariantId,
      photoUsed: draft.startingPoint.photoUsed
    },
    layoutContext: {
      roomShape: draft.layoutPlanning.roomShape,
      sizeBand: draft.layoutPlanning.sizeBand,
      entryPosition: draft.layoutPlanning.entryPosition,
      fixtureZones: draft.layoutPlanning.fixtureZones.map((zone) => ({
        fixtureType: zone.fixtureType,
        label: zone.label,
        approximatePosition: zone.approximatePosition,
        status: zone.status,
        serviceChange: zone.serviceChange
      })),
      constraints: draft.layoutPlanning.constraints
    },
    selectionContext: draft.productShortlist.map((item) => ({
      category: item.category,
      label: item.label,
      finishFamily: item.finishFamily,
      planningUse: item.planningUse,
      evidencePrompt: item.evidencePrompt,
      verificationStatus: item.verificationStatus
    })),
    promptContext: {
      layoutRiskPromptIds: layoutPrompts.map((prompt) => prompt.id),
      constraintPromptIds: constraintPrompts.map((prompt) => prompt.id),
      reviewQuestions: createQuoteOsReviewQuestions(draft)
    },
    evidenceContext: {
      summary: evidenceReadinessSummary(draft.evidenceReadiness),
      preparedItemIds: idsByStatus(draft.evidenceReadiness, "prepared"),
      missingItemIds: idsByStatus(draft.evidenceReadiness, "missing"),
      plannedItemIds: idsByStatus(draft.evidenceReadiness, "planned"),
      requiresSiteMeasureConfirmation: true
    },
    safety: {
      internalOnly: true,
      planningContextOnly: true,
      finalPricing: false,
      quoteApproval: false,
      proposalOutput: false,
      procurement: false,
      payment: false,
      crm: false,
      adminAutomation: false,
      publicOutput: false,
      schemaVersionChanged: false
    }
  };
}

export function quoteOsHandoffContainsForbiddenPublicData(value: unknown) {
  function visit(next: unknown, path: string[] = []): boolean {
    if (typeof next === "string") return forbiddenStringPattern.test(next);
    if (typeof next !== "object" || next === null) return false;
    if (Array.isArray(next)) return next.some((item, index) => visit(item, [...path, String(index)]));

    return Object.entries(next).some(([key, entry]) => {
      const isSafetyFlag = path[0] === "safety" && typeof entry === "boolean";
      if (!isSafetyFlag && forbiddenKeyPattern.test(key)) return true;
      return visit(entry, [...path, key]);
    });
  }

  return visit(value);
}
