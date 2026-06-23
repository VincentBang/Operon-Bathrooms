import { BathroomDesignDraft } from "@/lib/bathroom-design/schema";

export type BathroomDesignEventName =
  | "design_studio_viewed"
  | "design_studio_started"
  | "bathroom_type_selected"
  | "style_selected"
  | "palette_selected"
  | "concept_generated"
  | "variant_compared"
  | "design_saved_local"
  | "design_brief_printed"
  | "estimate_handoff_started"
  | "design_studio_completed";

export type BathroomDesignEvent = {
  name: BathroomDesignEventName;
  timestamp: string;
  draftId?: string;
  payload?: {
    bathroomType?: BathroomDesignDraft["bathroomType"];
    styleId?: string;
    paletteId?: string;
    selectedVariantId?: string;
    photoUsed?: boolean;
    allowanceBand?: BathroomDesignDraft["allowanceBand"];
  };
};

export function createDesignEvent(name: BathroomDesignEventName, event: Omit<BathroomDesignEvent, "name" | "timestamp"> = {}) {
  return {
    name,
    timestamp: new Date().toISOString(),
    ...event
  };
}

export function trackDesignStudioEvent(name: BathroomDesignEventName, event: Omit<BathroomDesignEvent, "name" | "timestamp"> = {}) {
  const nextEvent = createDesignEvent(name, event);
  return nextEvent;
}
