import type { BathroomDesignDraft } from "@/lib/bathroom-design/schema";

export type DesignConstraintPrompt = BathroomDesignDraft["constraintPrompts"][number];

type ConstraintInput = Pick<
  BathroomDesignDraft,
  | "bathroomType"
  | "startingPoint"
  | "layoutPlanning"
  | "productShortlist"
  | "allowanceBand"
>;

function addUnique(prompts: DesignConstraintPrompt[], prompt: DesignConstraintPrompt) {
  if (!prompts.some((item) => item.id === prompt.id)) prompts.push(prompt);
}

function hasServiceChange(input: ConstraintInput, serviceChange: "relocate" | "new" | "unclear") {
  return input.layoutPlanning.fixtureZones.some((zone) => zone.serviceChange === serviceChange);
}

function hasCategory(input: ConstraintInput, category: string) {
  return input.productShortlist.some((item) => item.category === category);
}

export function getDesignConstraintPrompts(input: ConstraintInput): DesignConstraintPrompt[] {
  const prompts: DesignConstraintPrompt[] = [];
  const constraints = input.layoutPlanning.constraints;

  if (input.layoutPlanning.roomShape === "unknown" || input.layoutPlanning.sizeBand === "unknown") {
    addUnique(prompts, {
      id: "constraint-layout-basics",
      category: "layout",
      level: "check",
      title: "Confirm room shape and size band",
      message: "Unknown layout basics reduce planning certainty. Confirm the room shape, size band and access path before relying on the brief.",
      evidenceToPrepare: ["wide bathroom photos", "rough room measurements", "door and window location notes"],
      nextStep: "request-review"
    });
  }

  if (input.bathroomType === "apartment-bathroom" || constraints.strataOrClass2) {
    addUnique(prompts, {
      id: "constraint-strata-class-2",
      category: "strata",
      level: "review",
      title: "Prepare strata and access notes",
      message: "Apartment, strata or Class 2 context may affect approvals, access and documentation. Treat this as a review prompt, not legal advice.",
      evidenceToPrepare: ["strata renovation rules", "lift or stair access notes", "working hours or by-law notes"],
      nextStep: "request-review"
    });
  }

  if (constraints.waterproofingUncertainty) {
    addUnique(prompts, {
      id: "constraint-waterproofing-evidence",
      category: "waterproofing",
      level: "site-review",
      title: "Waterproofing evidence needed",
      message: "Online planning cannot confirm membrane condition or certificate needs. Check waterproofing assumptions during site measure and written scope review.",
      evidenceToPrepare: ["shower and floor photos", "known leak or mould notes", "existing quote waterproofing inclusion"],
      nextStep: "site-measure"
    });
  }

  if (constraints.drainageOrFallsConcern) {
    addUnique(prompts, {
      id: "constraint-falls-drainage",
      category: "layout",
      level: "site-review",
      title: "Falls and drainage need site checking",
      message: "Screed, falls and drain access can change scope certainty. Keep this as a site-review item before written scope confirmation.",
      evidenceToPrepare: ["floor waste location photos", "shower base photos", "notes on pooling or slow drainage"],
      nextStep: "site-measure"
    });
  }

  if (constraints.ventilationConcern || hasCategory(input, "storage")) {
    addUnique(prompts, {
      id: "constraint-ventilation-service",
      category: "ventilation",
      level: "review",
      title: "Ventilation and wall services to confirm",
      message: "Ventilation, lighting and cabinet placement can affect service coordination. Confirm assumptions in writing before contract pricing.",
      evidenceToPrepare: ["ceiling fan photo", "window or duct path photo", "mirror cabinet preference"],
      nextStep: "request-review"
    });
  }

  if (constraints.suspectedAsbestos) {
    addUnique(prompts, {
      id: "constraint-asbestos-review",
      category: "evidence",
      level: "site-review",
      title: "Suspected asbestos needs specialist assessment",
      message: "Suspected asbestos should be assessed by an appropriate professional before demolition planning continues. This planner does not provide removal advice.",
      evidenceToPrepare: ["home age notes", "wall lining photos", "previous asbestos reports if available"],
      nextStep: "site-measure"
    });
  }

  if (constraints.accessLimitations) {
    addUnique(prompts, {
      id: "constraint-access-path",
      category: "access",
      level: "review",
      title: "Access path affects site setup",
      message: "Lift, stairs, parking or tight access may affect sequencing and site setup. Prepare access notes for review.",
      evidenceToPrepare: ["parking notes", "lift or stair photos", "entry path photos"],
      nextStep: "request-review"
    });
  }

  if (hasServiceChange(input, "relocate")) {
    addUnique(prompts, {
      id: "constraint-service-relocation",
      category: "services",
      level: "site-review",
      title: "Service relocation needs licensed-trade review",
      message: "Moving plumbing, drainage or electrical services can change scope certainty. Confirm service assumptions through site review and licensed-trade checks.",
      evidenceToPrepare: ["existing fixture locations", "desired new fixture locations", "quote notes on plumbing or electrical scope"],
      nextStep: "site-measure"
    });
  }

  if (hasServiceChange(input, "new") || hasServiceChange(input, "unclear")) {
    addUnique(prompts, {
      id: "constraint-service-clarity",
      category: "services",
      level: "check",
      title: "Clarify service intent",
      message: "Unclear or new service intent should be confirmed before relying on the planning brief.",
      evidenceToPrepare: ["fixture list", "preferred layout notes", "builder quote service inclusions if available"],
      nextStep: "quote-review"
    });
  }

  if (input.startingPoint.photoUsed) {
    addUnique(prompts, {
      id: "constraint-photo-follow-up",
      category: "evidence",
      level: "check",
      title: "Prepare wider evidence beyond the inspiration photo",
      message: "A local photo can help planning context, but it does not verify substrate, waterproofing, services or access.",
      evidenceToPrepare: ["wide bathroom photos", "ceiling and ventilation photo", "access path photo"],
      nextStep: "request-review"
    });
  }

  if (input.productShortlist.length >= 4 || input.allowanceBand === "premium") {
    addUnique(prompts, {
      id: "constraint-selection-check",
      category: "selection",
      level: "review",
      title: "Selections need compatibility checks",
      message: "Shortlisted candidates are planning items only. Confirm dimensions and compatibility through human selection checks and written scope before contract pricing.",
      evidenceToPrepare: ["preferred fixture examples", "finish direction notes", "site dimensions at measure"],
      nextStep: "request-review"
    });
  }

  if (!prompts.length) {
    addUnique(prompts, {
      id: "constraint-evidence-baseline",
      category: "evidence",
      level: "check",
      title: "Prepare baseline site evidence",
      message: "Even low-risk planning briefs need site evidence before written scope confirmation.",
      evidenceToPrepare: ["whole bathroom photos", "fixture photos", "known issue notes"],
      nextStep: "estimate"
    });
  }

  return prompts.slice(0, 10);
}
