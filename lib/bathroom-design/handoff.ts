import { findPalette } from "@/data/public/bathroom-design-poc";
import {
  BathroomDesignDraft,
  BathroomDesignHandoff,
  bathroomDesignHandoffSchema,
  safeParseBathroomDesignHandoff
} from "@/lib/bathroom-design/schema";

export const DESIGN_HANDOFF_STORAGE_KEY = "operon:bathroom-design:quote-handoff:v0.2";
const HANDOFF_TTL_MS = 1000 * 60 * 60 * 24;

export function createEstimateHandoff(draft: BathroomDesignDraft, now = new Date()): BathroomDesignHandoff {
  const palette = findPalette(draft.paletteId);
  const expiresAt = new Date(now.getTime() + HANDOFF_TTL_MS).toISOString();
  return bathroomDesignHandoffSchema.parse({
    schemaVersion: draft.schemaVersion,
    designDraftId: draft.id,
    createdAt: draft.createdAt,
    updatedAt: draft.updatedAt,
    expiresAt,
    bathroomType: draft.bathroomType,
    sampleTemplateId: draft.startingPoint.sampleTemplateId,
    styleId: draft.styleId,
    paletteId: draft.paletteId,
    conceptualSelections: draft.conceptualSelections,
    finishFamilies: palette?.finishFamilies ?? [],
    photoUsed: draft.startingPoint.photoUsed,
    selectedVariantId: draft.selectedVariantId,
    allowanceBand: draft.allowanceBand,
    labels: draft.labels,
    layoutPlanning: draft.layoutPlanning,
    layoutRiskPrompts: draft.layoutRiskPrompts,
    preferredNextStep: "estimate"
  });
}

export function writeEstimateHandoff(
  handoff: BathroomDesignHandoff,
  storage: Pick<Storage, "setItem">
) {
  storage.setItem(DESIGN_HANDOFF_STORAGE_KEY, JSON.stringify(handoff));
}

export function readEstimateHandoff(storage: Pick<Storage, "getItem" | "removeItem">) {
  const raw = storage.getItem(DESIGN_HANDOFF_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = safeParseBathroomDesignHandoff(JSON.parse(raw));
    if (!parsed.success) {
      storage.removeItem(DESIGN_HANDOFF_STORAGE_KEY);
      return null;
    }
    return parsed.data;
  } catch {
    storage.removeItem(DESIGN_HANDOFF_STORAGE_KEY);
    return null;
  }
}

export function mapHandoffToQuoteDefaults(handoff: BathroomDesignHandoff) {
  return {
    projectType:
      handoff.bathroomType === "ensuite"
        ? "ensuite"
        : handoff.bathroomType === "small-bathroom"
          ? "small-bathroom"
          : "full-bathroom",
    fixtureLevel:
      handoff.allowanceBand === "premium"
        ? "premium"
        : handoff.allowanceBand === "considered"
          ? "mid"
          : "budget"
  } as const;
}
