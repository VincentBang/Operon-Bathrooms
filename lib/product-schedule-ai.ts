import type {
  BathroomSchedule,
  BathroomScheduleItem,
  ProductScheduleInput
} from "@/lib/product-schedule";

const normaliseText = (text: string) => text.toLowerCase().replace(/\s+/g, " ").trim();

export function generateBathroomScheduleSummary(
  input: ProductScheduleInput,
  scheduleItems: BathroomScheduleItem[]
) {
  const productNames = scheduleItems.map((item) => item.recommendedProduct.name).join(", ");
  return [
    `This bathroom product schedule is a planning guide for a ${input.bathroomType.replaceAll("_", " ")} at ${input.renovationStage.replaceAll("_", " ")} stage.`,
    `It prioritises ${productNames}.`,
    "Selections and allowance ranges must be checked against site measure, availability, licensed trade requirements and written scope confirmation before contract pricing."
  ].join(" ");
}

export function explainBathroomRecommendation(input: ProductScheduleInput, item: BathroomScheduleItem) {
  const finishContext =
    input.tapwareFinish === "matte_black" || input.tapwareFinish === "brushed_gold"
      ? " The selected specialty finish should be checked for warranty and care requirements."
      : "";

  return `${item.recommendedProduct.name} is included because it fits the selected ${input.bathroomSize.replaceAll("_", " ")} bathroom and ${input.budgetLevel.replaceAll("_", " ")} allowance band.${finishContext}`;
}

export function generateBuilderReadyBathroomSchedule(schedule: Omit<BathroomSchedule, "builderReadySummary">) {
  const lines = schedule.items.map(
    (item) =>
      `${item.category}: ${item.recommendedProduct.name}, planning allowance ${item.allowanceLow}-${item.allowanceHigh} AUD. Confirm compliance, availability, installation requirements and exclusions in writing.`
  );

  return [
    `Bathroom product schedule ${schedule.id}.`,
    ...lines,
    "Planning guidance only. Site measure, final selections, licensed trade checks and written scope confirmation are required before contract pricing."
  ].join("\n");
}

export function checkBathroomComplianceNotes(scheduleItems: BathroomScheduleItem[]) {
  const notes = new Set<string>();

  for (const item of scheduleItems) {
    if (item.recommendedProduct.watermarkRequired || item.recommendedProduct.welsRequired) {
      notes.add("Confirm WaterMark and WELS status for tapware or shower products before ordering.");
    }
    if (item.recommendedProduct.electricalComplianceRequired) {
      notes.add("Electrical products need licensed electrician review and suitable installation location.");
    }
    if (item.recommendedProduct.wallHung) {
      notes.add("Wall-hung products need fixing, wall support and service-location confirmation.");
    }
  }

  notes.add("This is general planning guidance only, not legal advice or a compliance certificate.");
  return [...notes];
}

export function reviewBathroomQuoteText(text: string) {
  const quote = normaliseText(text);
  if (!quote) return [];

  const flags = new Set<string>();
  const hasAny = (...terms: string[]) => terms.some((term) => quote.includes(term));

  if (!hasAny("vanity")) flags.add("Missing or unclear vanity allowance.");
  if (!hasAny("basin", "sink")) flags.add("Missing or unclear basin allowance.");
  if (!hasAny("tapware", "mixer", "tap")) flags.add("Missing or unclear tapware allowance.");
  if (!hasAny("mirror", "shaving cabinet")) flags.add("Missing mirror or shaving cabinet allowance.");
  if (!hasAny("towel rail", "robe hook", "toilet roll", "accessories")) {
    flags.add("Missing bathroom accessories allowance.");
  }
  if (!hasAny("shower screen")) flags.add("Shower screen allowance is unclear.");
  if (!hasAny("toilet", "wc")) flags.add("Toilet allowance is unclear.");
  if (!hasAny("wels", "watermark")) flags.add("No WaterMark/WELS mention found for plumbing fixtures.");
  if (hasAny("pc item", "prime cost", "pc sum") && !/\$[0-9]/.test(quote)) {
    flags.add("PC item wording appears vague without clear allowance amounts.");
  }
  if (hasAny("$500", "$600", "$700") && hasAny("vanity", "tapware", "basin")) {
    flags.add("Allowance may be low for multiple bathroom products; clarify before signing.");
  }
  if (!hasAny("installation", "install", "labour", "by owner", "excluded")) {
    flags.add("Installation inclusions or exclusions are unclear.");
  }
  if (!hasAny("waterproof", "tiling interface", "substrate", "falls", "screed")) {
    flags.add("Waterproofing, tiling interface or drainage detail is unclear.");
  }

  return [...flags];
}

export function extractBathroomQuoteAllowanceAmounts(text: string) {
  const quote = normaliseText(text);
  if (!quote) return [];

  const categories = [
    ["vanity", /\bvanit(?:y|ies)\b/],
    ["basin", /\b(?:basin|sink)\b/],
    ["tapware", /\b(?:tapware|mixer|tap)\b/],
    ["mirror", /\b(?:mirror|shaving cabinet)\b/],
    ["accessories", /\b(?:towel rail|robe hook|toilet roll|accessories)\b/],
    ["shower screen", /\bshower screen\b/],
    ["toilet", /\b(?:toilet|wc)\b/]
  ] as const;

  return categories.map(([category, pattern]) => {
    const match = quote.match(new RegExp(`${pattern.source}.{0,80}?\\$\\s?([0-9][0-9,]*)`, "i"));
    const amount = match?.[1] ? Number(match[1].replace(/,/g, "")) : null;
    const mentioned = pattern.test(quote);
    return {
      category,
      mentioned,
      quotedAmount: Number.isFinite(amount) ? amount : null,
      source: mentioned ? "quote_text" : "not_found"
    };
  });
}

export const futureBathroomAiWorkflow = {
  summary: "Future LLM calls can replace deterministic templates after approval.",
  allowedUses: [
    "summarise product schedule",
    "explain allowance gaps",
    "draft builder-ready schedule text",
    "classify pasted quote text"
  ],
  forbiddenUses: [
    "final pricing",
    "legal advice",
    "compliance certification",
    "supplier cost or margin disclosure",
    "checkout or payment decisions"
  ]
};
