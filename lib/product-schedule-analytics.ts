export type BathroomProductScheduleEventName =
  | "bathroom_schedule_started"
  | "bathroom_schedule_completed"
  | "vanity_selector_completed"
  | "basin_selector_completed"
  | "tapware_selector_completed"
  | "bathroom_pack_viewed"
  | "product_quote_requested"
  | "bathroom_quote_review_requested"
  | "operon_consultation_requested";

export type BathroomProductScheduleEvent = {
  name: BathroomProductScheduleEventName;
  source: "bathroom_product_schedule";
  timestamp: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export function trackBathroomProductScheduleEvent(
  name: BathroomProductScheduleEventName,
  metadata: BathroomProductScheduleEvent["metadata"] = {}
): BathroomProductScheduleEvent {
  return {
    name,
    source: "bathroom_product_schedule",
    timestamp: new Date().toISOString(),
    metadata
  };
}
