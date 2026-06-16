import rateCard from "@/data/private/bathroom-rate-card.json";
import { EstimateResult, QuoteWizardInput, quoteWizardSchema } from "./estimate-schema";

type RateCard = typeof rateCard;

const currency = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0
});

export function formatAud(value: number): string {
  return currency.format(value);
}

function roundedHundreds(value: number): number {
  return Math.round(value / 100) * 100;
}

function confidenceLabel(score: number): EstimateResult["confidenceLabel"] {
  if (score >= 78) return "High";
  if (score >= 58) return "Medium";
  return "Low";
}

export function calculateEstimate(rawInput: QuoteWizardInput): EstimateResult {
  const input = quoteWizardSchema.parse(rawInput);
  const card: RateCard = rateCard;
  let planningTotal = card.base[input.roomSize];
  const riskFlags: string[] = [];
  const assumptions: string[] = [
    "Planning guidance only, based on supplied answers and typical bathroom renovation variables.",
    "Contract pricing requires a site inspection, licensed trade review, product selections and written scope confirmation.",
    "Figures are indicative ranges and may change after compliance, strata or latent-condition review."
  ];

  if (input.layoutChange === "minor") planningTotal += card.adjustments.layoutMinor;
  if (input.layoutChange === "move-wet-area") {
    planningTotal += card.adjustments.layoutMoveWetArea;
    riskFlags.push("Moving wet areas can increase plumbing, waterproofing and approval complexity.");
  }

  if (input.homeAge === "pre-1980" || input.homeAge === "unknown") {
    planningTotal += card.adjustments.homePre1980;
    riskFlags.push("Older homes may need additional checks for asbestos, structure and existing services.");
  }

  if (input.condition === "poor") {
    planningTotal += card.adjustments.poorCondition;
    riskFlags.push("Poor existing condition may reveal substrate, framing or water damage once demolition starts.");
  }

  if (input.strata) {
    planningTotal += card.adjustments.strata;
    riskFlags.push("Apartment / strata / Class 2 screening may be required before committing.");
  }

  if (input.access === "limited" || input.access === "difficult") {
    planningTotal += input.access === "difficult" ? card.adjustments.difficultAccess : 1600;
    riskFlags.push("Limited access can affect demolition, waste removal and delivery allowances.");
  }

  if (input.asbestosConcern !== "no") {
    planningTotal += card.adjustments.asbestosRisk;
    riskFlags.push("Possible asbestos must be assessed by qualified professionals before disturbance.");
  }

  if (input.plumbingScope !== "like-for-like") {
    riskFlags.push("Plumbing relocation or upgrade scope should be confirmed by licensed trades.");
  }

  if (input.electricalScope !== "like-for-like") {
    riskFlags.push("Electrical relocation or upgrade scope should be confirmed by licensed trades.");
  }

  if (input.waterproofingComplexity !== "standard") {
    riskFlags.push("Waterproofing uncertainty can reduce estimate confidence until site review.");
  }

  if (input.ventilationScope !== "existing-ok") {
    riskFlags.push("Ventilation scope should be confirmed before written scope confirmation.");
  }

  if (input.fixtureLevel === "mid") planningTotal += card.adjustments.midFixtures;
  if (input.fixtureLevel === "premium") planningTotal += card.adjustments.premiumFixtures;
  if (input.tilingScope === "floor-to-ceiling") planningTotal += card.adjustments.floorToCeilingTile;
  if (input.waterproofingComplexity !== "standard") planningTotal += card.adjustments.waterproofingComplex;
  if (input.ventilationScope !== "existing-ok") planningTotal += card.adjustments.ventilationUpgrade;
  if (input.electricalScope !== "like-for-like") planningTotal += card.adjustments.electricalUpgrade;
  if (input.plumbingScope !== "like-for-like") planningTotal += card.adjustments.plumbingUpgrade;

  const uncertaintySignals = [
    input.homeAge === "unknown",
    input.waterproofingComplexity === "unknown",
    input.asbestosConcern !== "no",
    input.layoutChange === "move-wet-area",
    input.condition === "poor",
    input.strata,
    input.access === "difficult"
  ].filter(Boolean).length;

  const confidenceScore = Math.max(42, 88 - uncertaintySignals * 8);
  const low = roundedHundreds(planningTotal * card.range.lowMultiplier);
  const high = roundedHundreds(planningTotal * card.range.highMultiplier);

  if (high > 20000) {
    riskFlags.push("HBC/HBCF and deposit prompts should be reviewed for this likely project scale.");
  }

  return {
    estimateId: `bath-${Date.now().toString(36)}`,
    range: {
      low,
      high,
      label: `${formatAud(low)} - ${formatAud(high)}`
    },
    confidenceScore,
    confidenceLabel: confidenceLabel(confidenceScore),
    scopeSummary: [
      `${input.projectType.replaceAll("-", " ")} in ${input.suburb}`,
      `${input.propertyType}, ${input.roomSize} room, ${input.layoutChange.replaceAll("-", " ")} layout`,
      `${input.fixtureLevel} fixtures, ${input.tilingScope.replaceAll("-", " ")} tiling`,
      `${input.plumbingScope.replaceAll("-", " ")} plumbing and ${input.electricalScope.replaceAll("-", " ")} electrical scope`
    ],
    assumptions,
    exclusions: [
      "No legal, building-certification or engineering advice is provided.",
      "Does not include final product selections, authority fees, strata fees or specialist hazardous-material removal.",
      "Does not replace a written quote, licence check, contract review or site assessment."
    ],
    riskFlags,
    compliancePrompts: [
      "NSW prompt: residential building work over $5k generally requires an appropriately licensed contractor. Check current requirements before engaging trades.",
      "NSW prompt: deposits are generally capped at 10% for residential building work. Do not treat this as legal advice.",
      "NSW prompt: Home Building Compensation Fund (HBCF) cover is generally required for residential building work over $20k before work starts or money is taken. Confirm current obligations."
    ],
    recommendedNextStep:
      "Book a site measure so Operon Bathrooms can confirm scope, compliance requirements and product selections before written scope confirmation and contract pricing."
  };
}
