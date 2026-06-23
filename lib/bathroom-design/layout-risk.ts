import { BathroomDesignDraft } from "@/lib/bathroom-design/schema";

type LayoutPlanning = BathroomDesignDraft["layoutPlanning"];

export type LayoutRiskLevel = "check" | "review" | "site-review";

export type LayoutRiskPrompt = {
  id: string;
  level: LayoutRiskLevel;
  title: string;
  message: string;
  nextStep: "clarify" | "confirm-in-writing" | "site-measure" | "request-review";
};

const serviceSensitiveFixtures = new Set(["shower", "bath", "vanity", "toilet", "laundry", "waste-drain"]);

function hasFixture(layout: LayoutPlanning, fixtureType: LayoutPlanning["fixtureZones"][number]["fixtureType"]) {
  return layout.fixtureZones.some((zone) => zone.fixtureType === fixtureType);
}

function addUnique(prompts: LayoutRiskPrompt[], prompt: LayoutRiskPrompt) {
  if (!prompts.some((item) => item.id === prompt.id)) prompts.push(prompt);
}

export function getLayoutRiskPrompts(layout: LayoutPlanning): LayoutRiskPrompt[] {
  const prompts: LayoutRiskPrompt[] = [];

  if (layout.roomShape === "unknown" || layout.sizeBand === "unknown" || layout.entryPosition === "unknown") {
    addUnique(prompts, {
      id: "layout-unknown",
      level: "check",
      title: "Clarify the room basics",
      message: "Unknown shape, size band or entry location may reduce layout certainty. Confirm these before relying on the plan.",
      nextStep: "clarify"
    });
  }

  if (layout.constraints.strataOrClass2) {
    addUnique(prompts, {
      id: "strata-class-2",
      level: "review",
      title: "Apartment or strata review",
      message: "Apartment, strata or Class 2 work may need access, approval and documentation checks before scope is confirmed.",
      nextStep: "request-review"
    });
  }

  if (layout.constraints.waterproofingUncertainty) {
    addUnique(prompts, {
      id: "waterproofing-uncertain",
      level: "site-review",
      title: "Waterproofing condition is unknown",
      message: "Confirm waterproofing assumptions during site review. Online planning cannot verify membrane condition or certificate requirements.",
      nextStep: "site-measure"
    });
  }

  if (layout.constraints.drainageOrFallsConcern) {
    addUnique(prompts, {
      id: "drainage-falls",
      level: "site-review",
      title: "Falls and drainage need checking",
      message: "Screed, falls and drain access can affect scope. Check this on site before written scope confirmation.",
      nextStep: "site-measure"
    });
  }

  if (layout.constraints.ventilationConcern) {
    addUnique(prompts, {
      id: "ventilation",
      level: "review",
      title: "Ventilation to confirm",
      message: "Exhaust path and electrical allowance should be clarified before relying on the planning layout.",
      nextStep: "confirm-in-writing"
    });
  }

  if (layout.constraints.suspectedAsbestos) {
    addUnique(prompts, {
      id: "suspected-asbestos",
      level: "site-review",
      title: "Suspected asbestos",
      message: "Suspected asbestos should be assessed by an appropriate professional before demolition planning continues.",
      nextStep: "site-measure"
    });
  }

  if (layout.constraints.accessLimitations) {
    addUnique(prompts, {
      id: "access-limitations",
      level: "review",
      title: "Access constraints to clarify",
      message: "Lift, stairs, parking or tight access may affect sequencing and site setup. Confirm these details before committing.",
      nextStep: "request-review"
    });
  }

  if (layout.sizeBand === "compact" && layout.fixtureZones.length >= 4) {
    addUnique(prompts, {
      id: "compact-many-zones",
      level: "check",
      title: "Compact layout with multiple zones",
      message: "A compact bathroom with several fixture zones may need tighter access and clearance review during site measure.",
      nextStep: "site-measure"
    });
  }

  if (layout.roomShape === "galley" && (hasFixture(layout, "bath") || hasFixture(layout, "laundry"))) {
    addUnique(prompts, {
      id: "galley-large-fixture",
      level: "check",
      title: "Galley layout with larger fixture zones",
      message: "A bath or laundry zone in a galley-style room may affect circulation. Clarify the intended layout before scope review.",
      nextStep: "clarify"
    });
  }

  for (const zone of layout.fixtureZones) {
    if (zone.status === "unclear") {
      addUnique(prompts, {
        id: `zone-status-${zone.fixtureType}`,
        level: "check",
        title: `Clarify ${zone.label.toLowerCase()}`,
        message: "Unclear fixture status may reduce planning certainty. Confirm whether the zone is existing, planned or being removed.",
        nextStep: "clarify"
      });
    }

    if (zone.serviceChange === "relocate" && serviceSensitiveFixtures.has(zone.fixtureType)) {
      addUnique(prompts, {
        id: `service-relocate-${zone.fixtureType}`,
        level: "site-review",
        title: `${zone.label} relocation to review`,
        message: "Service relocation may affect plumbing, drainage, electrical or waterproofing scope. Confirm this through site review and licensed trade checks.",
        nextStep: "site-measure"
      });
    }

    if (zone.serviceChange === "new" && serviceSensitiveFixtures.has(zone.fixtureType)) {
      addUnique(prompts, {
        id: `service-new-${zone.fixtureType}`,
        level: "review",
        title: `${zone.label} as a new service`,
        message: "New service points may affect scope certainty. Confirm assumptions in writing before contract pricing.",
        nextStep: "confirm-in-writing"
      });
    }

    if (zone.serviceChange === "unclear" && serviceSensitiveFixtures.has(zone.fixtureType)) {
      addUnique(prompts, {
        id: `service-unclear-${zone.fixtureType}`,
        level: "check",
        title: `${zone.label} service intent unclear`,
        message: "Clarify whether this service stays, moves, is new or is removed before relying on the planning layout.",
        nextStep: "clarify"
      });
    }
  }

  return prompts.slice(0, 8);
}
