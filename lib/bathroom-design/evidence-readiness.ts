import type { BathroomDesignDraft } from "@/lib/bathroom-design/schema";

type EvidenceReadinessItem = BathroomDesignDraft["evidenceReadiness"][number];
type EvidenceStatus = EvidenceReadinessItem["status"];

type EvidenceInput = Pick<BathroomDesignDraft, "bathroomType" | "layoutPlanning" | "startingPoint" | "productShortlist">;

function evidenceItem(
  id: string,
  category: EvidenceReadinessItem["category"],
  label: string,
  prompt: string,
  status: EvidenceStatus = "planned"
): EvidenceReadinessItem {
  return {
    id,
    category,
    label,
    prompt,
    status,
    userSupplied: true,
    verifiedOnline: false,
    uploadStored: false,
    requiresSiteMeasureConfirmation: true
  };
}

export function createEvidencePlanning(): BathroomDesignDraft["evidencePlanning"] {
  return {
    mode: "evidence-readiness",
    evidenceReadinessOnly: true,
    cameraCapture: false,
    arPlacement: false,
    uploadedMedia: false,
    persistedMedia: false,
    measuredAccuracy: false,
    userSuppliedUnverified: true,
    planningGuidanceOnly: true
  };
}

export function createEvidenceReadiness(input: EvidenceInput): EvidenceReadinessItem[] {
  const items: EvidenceReadinessItem[] = [
    evidenceItem(
      "whole-room-photos",
      "photos",
      "Whole bathroom photos",
      "Prepare wide photos from the entry and each corner so site reviewers can understand the room context.",
      input.startingPoint.photoUsed ? "prepared" : "planned"
    ),
    evidenceItem(
      "shower-and-wet-area",
      "photos",
      "Shower and wet-area photos",
      "Prepare shower, floor waste, hob, screen and wet-wall photos so waterproofing and falls can be checked on site."
    ),
    evidenceItem(
      "fixture-location-notes",
      "measurements",
      "Fixture location notes",
      "Prepare rough notes showing current shower, vanity, toilet, bath, laundry and waste locations."
    ),
    evidenceItem(
      "ceiling-ventilation",
      "services",
      "Ceiling and ventilation evidence",
      "Prepare photos or notes for exhaust fan, window, ceiling access and possible duct path."
    ),
    evidenceItem(
      "access-path",
      "access",
      "Access path notes",
      "Prepare notes for parking, stairs, lift, tight entries, working hours or material movement constraints."
    ),
    evidenceItem(
      "known-issues",
      "issues",
      "Known leak, mould or asbestos notes",
      "Prepare notes about leaks, mould, old wall linings, previous reports or anything that should be assessed before demolition."
    ),
    evidenceItem(
      "selection-preferences",
      "selections",
      "Selection preference examples",
      "Prepare preferred fixture, tile, vanity, screen and accessory examples for human selection checks."
    )
  ];

  if (input.bathroomType === "apartment-bathroom" || input.layoutPlanning.constraints.strataOrClass2) {
    items.push(
      evidenceItem(
        "strata-notes",
        "strata",
        "Strata and Class 2 notes",
        "Prepare strata renovation rules, by-law notes, lift booking constraints and any Class 2/DBP questions for review."
      )
    );
  }

  if (input.layoutPlanning.fixtureZones.some((zone) => zone.serviceChange === "relocate" || zone.serviceChange === "new")) {
    items.push(
      evidenceItem(
        "service-change-notes",
        "services",
        "Plumbing and electrical change notes",
        "Prepare notes on which services may move so licensed trades can review assumptions during site measure."
      )
    );
  }

  if (input.productShortlist.length) {
    items.push(
      evidenceItem(
        "candidate-selection-check",
        "selections",
        "Catalogue candidate check",
        "Prepare selected candidate preferences for human checking against dimensions, compatibility and written scope."
      )
    );
  }

  return items.slice(0, 12);
}

export function mergeEvidenceReadinessStatus(
  nextItems: EvidenceReadinessItem[],
  currentItems: EvidenceReadinessItem[]
) {
  const currentStatus = new Map(currentItems.map((item) => [item.id, item.status]));
  return nextItems.map((item) => ({
    ...item,
    status: currentStatus.get(item.id) ?? item.status
  }));
}

export function evidenceReadinessSummary(items: EvidenceReadinessItem[]) {
  const prepared = items.filter((item) => item.status === "prepared").length;
  const missing = items.filter((item) => item.status === "missing").length;
  const planned = items.filter((item) => item.status === "planned").length;
  return { prepared, missing, planned, total: items.length };
}
