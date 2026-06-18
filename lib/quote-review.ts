import { QuoteReviewInput, quoteReviewSchema } from "./intake-schemas";

export type QuoteReviewResult = {
  clarityScore: number;
  missingInclusions: string[];
  allowanceRisk: string[];
  compliancePrompts: string[];
  highRiskFlags: string[];
  questionsToAsk: string[];
  recommendedNextStep: string;
};

const scopeLabels: Record<string, string> = {
  demolition: "demolition",
  rubbishRemoval: "rubbish removal",
  waterproofing: "waterproofing",
  waterproofingCertificate: "waterproofing certificate",
  floorTiling: "floor tiling",
  wallTiling: "wall tiling",
  screedFallsDrainage: "screed, falls and drainage",
  plumbingRoughIn: "plumbing rough-in",
  plumbingRelocation: "plumbing relocation",
  electrical: "electrical",
  ventilation: "exhaust fan or ventilation",
  showerScreen: "shower screen",
  vanity: "vanity",
  toilet: "toilet",
  tapware: "tapware",
  mirrorCabinet: "mirror or shaving cabinet",
  accessories: "accessories",
  painting: "painting",
  heating: "underfloor heating or heated towel rail"
};

export function reviewBathroomQuote(rawInput: QuoteReviewInput): QuoteReviewResult {
  const input = quoteReviewSchema.parse(rawInput);
  let score = 100;
  const missingInclusions: string[] = [];
  const allowanceRisk: string[] = [];
  const highRiskFlags: string[] = [];
  const questionsToAsk: string[] = [];

  const deduct = (points: number) => {
    score = Math.max(0, score - points);
  };

  Object.entries(scopeLabels).forEach(([key, label]) => {
    if (!input.scope[key]) {
      missingInclusions.push(`Check whether ${label} is included or excluded.`);
      deduct(key === "waterproofing" ? 14 : 4);
    }
  });

  if (input.quote.gstStatus === "unclear") {
    deduct(8);
    questionsToAsk.push("Is GST included, excluded, or still to be confirmed?");
  }

  if (input.quote.depositRequested > input.quote.amount * 0.1) {
    deduct(10);
    highRiskFlags.push("Deposit requested appears above 10% of the quoted amount. Check this before signing.");
  }

  if (!input.scope.waterproofing) {
    highRiskFlags.push("Waterproofing is not clearly included. This may require clarification in writing.");
  }

  if (!input.scope.waterproofingCertificate) {
    deduct(8);
    questionsToAsk.push("Will waterproofing be certified, documented, and included in the written scope?");
  }

  if (!input.scope.demolition || !input.scope.rubbishRemoval) {
    deduct(6);
    questionsToAsk.push("Who is responsible for demolition, rubbish removal, protection and clean-up?");
  }

  if (input.allowances.pcSumsPresent !== "yes") {
    deduct(7);
    allowanceRisk.push("PC sums are not clearly identified. This can reduce quote certainty.");
  }

  if (input.allowances.provisionalSumsPresent !== "yes" && hasProjectRisk(input)) {
    deduct(7);
    allowanceRisk.push("Risk items exist but provisional sums are not clearly explained.");
  }

  if (input.allowances.exclusionsClearlyListed !== "yes") {
    deduct(8);
    highRiskFlags.push("Exclusions are not clearly listed. Confirm exclusions in writing before committing.");
  }

  if (input.contact.propertyType === "apartment-strata" && input.risk.strataApprovalRequired !== "yes") {
    deduct(7);
    questionsToAsk.push("What strata approval, work-hours and waterproofing evidence will be required?");
  }

  if (input.quote.amount > 20000 && input.quote.hbcMentioned !== "yes") {
    deduct(8);
    highRiskFlags.push("Project may sit above the HBCF threshold. Confirm current insurance obligations.");
  }

  if (input.risk.suspectedAsbestos !== "no") {
    deduct(7);
    highRiskFlags.push("Suspected asbestos should be assessed before disturbance or demolition.");
  }

  if (input.risk.layoutOrServiceChanges !== "no" && (!input.scope.plumbingRoughIn || !input.scope.electrical)) {
    deduct(8);
    questionsToAsk.push("How are plumbing, electrical and service changes described in the written scope?");
  }

  if (input.quote.timeline === "unclear" || input.quote.timeline === "not-stated") {
    deduct(5);
    questionsToAsk.push("What start date, duration, access assumptions and delay exclusions apply?");
  }

  if (!input.quote.builderLicence) {
    deduct(7);
    questionsToAsk.push("What licence details apply to the builder or relevant contractor?");
  }

  return {
    clarityScore: score,
    missingInclusions,
    allowanceRisk,
    compliancePrompts: [
      "NSW prompt: residential building work over $5k generally requires an appropriately licensed contractor. Check current requirements.",
      "NSW prompt: deposits are generally capped at 10%. This is a prompt to clarify, not legal advice.",
      "NSW prompt: Home Building Compensation Fund (HBCF) cover is generally required over $20k before work starts or money is taken.",
      "Check whether waterproofing evidence, certificates and written scope details are included."
    ],
    highRiskFlags,
    questionsToAsk,
    recommendedNextStep:
      score >= 78
        ? "Request written confirmation of open items, then prepare for a site measure before contract pricing."
        : "Ask for written clarification of the flagged items before signing or paying a deposit."
  };
}

function hasProjectRisk(input: QuoteReviewInput) {
  return (
    input.risk.leaksOrMould !== "no" ||
    input.risk.suspectedAsbestos !== "no" ||
    input.risk.accessConstraints !== "no" ||
    input.risk.layoutOrServiceChanges !== "no" ||
    input.risk.buildingAge === "pre-1980"
  );
}
