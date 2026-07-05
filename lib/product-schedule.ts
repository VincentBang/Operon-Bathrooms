import { z } from "zod";
import {
  bathroomProductCandidates,
  bathroomProductPacks,
  type ProductCandidate,
  type ProductPack
} from "@/data/product-schedule/bathroom-products";
import {
  checkBathroomComplianceNotes,
  extractBathroomQuoteAllowanceAmounts,
  generateBathroomScheduleSummary,
  generateBuilderReadyBathroomSchedule,
  reviewBathroomQuoteText
} from "@/lib/product-schedule-ai";

export const productScheduleInputSchema = z.object({
  projectType: z.enum(["renovation", "new_build", "quote_review", "product_selection"]),
  bathroomType: z.enum(["main_bathroom", "ensuite", "powder_room", "laundry_bathroom", "apartment_bathroom"]),
  bathroomSize: z.enum(["compact", "standard", "large", "unknown"]),
  renovationStage: z.enum(["early_planning", "have_builder_quote", "ready_for_site_measure", "under_construction"]),
  stylePreference: z.enum(["simple_modern", "warm_neutral", "premium_hotel", "classic", "unsure"]),
  vanityWidth: z.enum(["under_600", "600_750", "900", "1200_plus", "unknown"]),
  storagePreference: z.enum(["minimal", "drawers", "maximum", "unsure"]),
  basinPreference: z.enum(["integrated", "above_counter", "inset", "unsure"]),
  tapwareFinish: z.enum(["chrome", "matte_black", "brushed_gold", "brushed_nickel", "unsure"]),
  showerConfiguration: z.enum(["existing_position", "new_position", "walk_in", "over_bath", "unsure"]),
  mirrorPreference: z.enum(["plain_mirror", "shaving_cabinet", "led_mirror", "unsure"]),
  accessoryFinish: z.enum(["chrome", "matte_black", "brushed_gold", "brushed_nickel", "match_tapware", "unsure"]),
  budgetLevel: z.enum(["value", "mid_range", "premium", "unsure"]),
  customerType: z.enum(["homeowner", "builder", "designer", "trade", "property_manager"]),
  postcode: z.string().trim().regex(/^\d{4}$/, "Enter a 4 digit Australian postcode."),
  timeline: z.enum(["asap", "1_3_months", "3_6_months", "6_plus_months", "unsure"]),
  hasExistingQuote: z.boolean(),
  wantsRenovationHelp: z.boolean().default(false),
  wantsProductQuote: z.boolean().default(false),
  wantsQuoteReview: z.boolean().default(false),
  quoteText: z.string().max(6000).optional().default("")
});

export const productScheduleLeadSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().max(40).optional().default(""),
  consentAccepted: z.boolean().refine((value) => value, "Consent is required."),
  company: z.string().max(0).optional().default("")
});

export type ProductScheduleInput = z.infer<typeof productScheduleInputSchema>;
export type ProductScheduleLeadInput = z.infer<typeof productScheduleLeadSchema>;

export type PublicProductRecommendation = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  productType: string;
  finish: string;
  material: string;
  dimensions: string;
  wallHung: boolean;
  floorstanding: boolean;
  complianceNotes: string[];
  installationNotes: string[];
  freightRisk: "low" | "medium" | "high";
  warrantyRisk: "low" | "medium" | "high";
  watermarkRequired: boolean;
  watermarkStatus: "required" | "not_required" | "confirm_before_order";
  welsRequired: boolean;
  welsRating?: string;
  electricalComplianceRequired: boolean;
};

export type BathroomScheduleItem = {
  id: string;
  category: string;
  recommendedProduct: PublicProductRecommendation;
  substitutionOptions: ProductSubstitutionOption[];
  allowanceLow: number;
  allowanceHigh: number;
  reason: string;
  complianceNote: string;
  riskNote: string;
};

export type ProductSubstitutionOption = {
  product: PublicProductRecommendation;
  reason: string;
  tradeOff: string;
};

export type BathroomQuoteAllowanceCheck = {
  category: string;
  quotedAmount: number | null;
  planningLow: number | null;
  planningHigh: number | null;
  status: "missing" | "unclear" | "below_planning_range" | "within_planning_range" | "above_planning_range";
  prompt: string;
};

export type BathroomAllowanceReview = {
  summary: string;
  checks: BathroomQuoteAllowanceCheck[];
  quoteRiskPrompts: string[];
};

export type ProductPackComparison = {
  id: string;
  name: string;
  allowanceRange: string;
  scheduleFit: "preferred" | "alternate" | "review";
  allowanceAlignment: "lower_than_schedule" | "similar_to_schedule" | "higher_than_schedule";
  whyItFits: string;
  watchouts: string[];
};

export type BathroomSchedule = {
  id: string;
  source: "bathroom_product_schedule";
  projectType: ProductScheduleInput["projectType"];
  bathroomType: ProductScheduleInput["bathroomType"];
  bathroomSize: ProductScheduleInput["bathroomSize"];
  style: ProductScheduleInput["stylePreference"];
  budgetLevel: ProductScheduleInput["budgetLevel"];
  vanityWidth: ProductScheduleInput["vanityWidth"];
  basinPreference: ProductScheduleInput["basinPreference"];
  tapwareFinish: ProductScheduleInput["tapwareFinish"];
  mirrorPreference: ProductScheduleInput["mirrorPreference"];
  showerConfiguration: ProductScheduleInput["showerConfiguration"];
  postcode: string;
  timeline: ProductScheduleInput["timeline"];
  generatedSummary: string;
  builderReadySummary: string;
  totalAllowanceLow: number;
  totalAllowanceHigh: number;
  confidence: "low" | "medium" | "high";
  items: BathroomScheduleItem[];
  recommendedPacks: PublicProductPack[];
  complianceNotes: string[];
  freightRiskNotes: string[];
  installationNotes: string[];
  quoteReviewFlags: string[];
  allowanceReview: BathroomAllowanceReview | null;
  packComparisons: ProductPackComparison[];
  builderExport: string;
  nextStepCtas: Array<{ label: string; href: string; intent: string }>;
  createdAt: string;
};

export type ProductScheduleResult = {
  schedule: BathroomSchedule;
  assumptions: string[];
  warnings: string[];
};

export type PublicProductPack = Omit<ProductPack, "allowanceLow" | "allowanceHigh"> & {
  allowanceRange: string;
};

const allowanceMultiplierByBudget: Record<ProductScheduleInput["budgetLevel"], number> = {
  value: 0.85,
  mid_range: 1,
  premium: 1.45,
  unsure: 1
};

const publicProduct = (product: ProductCandidate): PublicProductRecommendation => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  categoryId: product.category_id,
  productType: product.product_type,
  finish: product.finish,
  material: product.material,
  dimensions: product.dimensions,
  wallHung: product.wall_hung,
  floorstanding: product.floorstanding,
  complianceNotes: product.compliance_notes,
  installationNotes: product.installation_notes,
  freightRisk: product.freight_risk,
  warrantyRisk: product.warranty_risk,
  watermarkRequired: product.watermark_required,
  watermarkStatus: product.watermark_status,
  welsRequired: product.wels_required,
  welsRating: product.wels_rating,
  electricalComplianceRequired: product.electrical_compliance_required
});

const findProduct = (id: string) => {
  const product = bathroomProductCandidates.find((candidate) => candidate.id === id);
  if (!product) {
    throw new Error(`Missing product schedule seed: ${id}`);
  }
  return product;
};

const productCategoryLabels: Record<string, string> = {
  cat_vanity: "vanity",
  cat_basin: "basin",
  cat_basin_mixer: "tapware",
  cat_shower_mixer: "tapware",
  cat_shower_rail: "tapware",
  cat_shower_head: "tapware",
  cat_mirror: "mirror",
  cat_led_mirror: "mirror",
  cat_shaving_cabinet: "mirror",
  cat_accessories: "accessories",
  cat_linear_drain: "drainage",
  cat_waste: "drainage",
  cat_niche: "niche"
};

const currency = (value: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0
  }).format(value);

export function calculatePcAllowanceRange(
  products: ProductCandidate[],
  budgetLevel: ProductScheduleInput["budgetLevel"]
) {
  const multiplier = allowanceMultiplierByBudget[budgetLevel];
  const low = Math.round(
    products.reduce((total, product) => total + product.price_min, 0) * multiplier
  );
  const high = Math.round(
    products.reduce((total, product) => total + product.price_max, 0) * multiplier
  );

  return { low, high, label: `${currency(low)} - ${currency(high)}` };
}

function chooseVanity(input: ProductScheduleInput) {
  if (
    input.bathroomType === "apartment_bathroom" ||
    input.bathroomType === "ensuite" ||
    input.bathroomSize === "compact" ||
    input.vanityWidth === "under_600" ||
    input.vanityWidth === "600_750"
  ) {
    return findProduct("vanity_compact_wall_hung");
  }

  if (input.stylePreference === "premium_hotel" || input.budgetLevel === "premium") {
    return findProduct("vanity_premium_fluted");
  }

  return findProduct("vanity_drawer_standard");
}

function chooseBasin(input: ProductScheduleInput) {
  if (input.stylePreference === "premium_hotel" || input.basinPreference === "above_counter") {
    return findProduct("basin_stone_look");
  }

  return findProduct("basin_ceramic_standard");
}

function chooseTapware(input: ProductScheduleInput) {
  if (input.tapwareFinish === "matte_black" || input.tapwareFinish === "brushed_gold") {
    return findProduct("tapware_finish_upgrade");
  }

  return findProduct("tapware_chrome_standard");
}

function chooseMirror(input: ProductScheduleInput) {
  if (input.mirrorPreference === "led_mirror") {
    return findProduct("mirror_led");
  }

  if (input.mirrorPreference === "shaving_cabinet" || input.storagePreference === "maximum") {
    return findProduct("shaving_cabinet_recessed");
  }

  return findProduct("mirror_standard");
}

function chooseAccessoryPack() {
  return findProduct("accessory_pack_standard");
}

function recommendationReason(input: ProductScheduleInput, product: ProductCandidate) {
  if (product.id === "vanity_compact_wall_hung") {
    return "Recommended because compact, ensuite or apartment bathrooms usually benefit from a smaller footprint and clearer floor area.";
  }
  if (product.id === "vanity_premium_fluted") {
    return "Recommended because the selected style or budget supports a more design-led vanity allowance.";
  }
  if (product.id === "tapware_finish_upgrade") {
    return "Recommended because the selected finish needs a realistic allowance and warranty/finish-care check.";
  }
  if (product.id === "mirror_led") {
    return "Recommended because LED mirror preference was selected, subject to electrical and warranty review.";
  }
  if (product.id === "shaving_cabinet_recessed") {
    return "Recommended because additional storage was selected, subject to wall and service checks.";
  }
  return "Recommended as a practical planning category for the selected bathroom schedule.";
}

function riskNote(input: ProductScheduleInput, product: ProductCandidate) {
  const notes = [...product.installation_notes];

  if (input.vanityWidth === "under_600") {
    notes.push("Vanity widths under 600mm can limit basin, storage and tapware options.");
  }
  if (product.wall_hung) {
    notes.push("Wall-hung items need suitable wall support confirmed on site.");
  }
  if (input.showerConfiguration === "new_position") {
    notes.push("Moving shower or plumbing positions reduces quote certainty until licensed trade checks are complete.");
  }
  if (input.bathroomType === "apartment_bathroom") {
    notes.push("Apartment bathrooms may need strata, access and Class 2/DBP screening depending on scope.");
  }
  if (input.timeline === "asap") {
    notes.push("Tight timelines should prioritise local-stock and standard-size selections.");
  }

  return notes.join(" ");
}

function buildScheduleItems(input: ProductScheduleInput, products: ProductCandidate[]) {
  return products.map((product, index): BathroomScheduleItem => {
    const range = calculatePcAllowanceRange([product], input.budgetLevel);
    return {
      id: `${product.id}_${index + 1}`,
      category: product.product_type,
      recommendedProduct: publicProduct(product),
      substitutionOptions: buildSubstitutionOptions(input, product),
      allowanceLow: range.low,
      allowanceHigh: range.high,
      reason: recommendationReason(input, product),
      complianceNote:
        product.compliance_notes.join(" ") ||
        "Confirm suitability, warranty and installation requirements before ordering.",
      riskNote: riskNote(input, product)
    };
  });
}

function buildSubstitutionOptions(input: ProductScheduleInput, product: ProductCandidate): ProductSubstitutionOption[] {
  const sameCategory = bathroomProductCandidates.filter(
    (candidate) =>
      candidate.active &&
      candidate.recommended &&
      candidate.category_id === product.category_id &&
      candidate.id !== product.id
  );
  const crossCategoryIds: Record<string, string[]> = {
    mirror_standard: ["shaving_cabinet_recessed", "mirror_led"],
    mirror_led: ["mirror_standard", "shaving_cabinet_recessed"],
    shaving_cabinet_recessed: ["mirror_standard"],
    tapware_chrome_standard: ["tapware_finish_upgrade"],
    tapware_finish_upgrade: ["tapware_chrome_standard"],
    basin_ceramic_standard: ["basin_stone_look"],
    basin_stone_look: ["basin_ceramic_standard"],
    vanity_compact_wall_hung: ["vanity_drawer_standard"],
    vanity_drawer_standard: ["vanity_compact_wall_hung", "vanity_premium_fluted"],
    vanity_premium_fluted: ["vanity_drawer_standard"]
  };
  const crossCategory = (crossCategoryIds[product.id] ?? []).map(findProduct);
  const candidates = [...sameCategory, ...crossCategory]
    .filter((candidate, index, list) => list.findIndex((item) => item.id === candidate.id) === index)
    .slice(0, 2);

  return candidates.map((candidate) => ({
    product: publicProduct(candidate),
    reason: substitutionReason(input, product, candidate),
    tradeOff: substitutionTradeOff(product, candidate)
  }));
}

function substitutionReason(
  input: ProductScheduleInput,
  selected: ProductCandidate,
  substitute: ProductCandidate
) {
  if (selected.price_min > substitute.price_min) {
    return "Lower planning allowance option to discuss if budget needs tightening.";
  }
  if (selected.price_min < substitute.price_min) {
    return "Upgrade option to discuss if the finish level matters more than allowance control.";
  }
  if (input.storagePreference === "maximum" && substitute.id === "shaving_cabinet_recessed") {
    return "Storage-focused alternative for bathrooms where mirror storage is useful.";
  }
  return "Alternative category to compare before final selections are confirmed.";
}

function substitutionTradeOff(selected: ProductCandidate, substitute: ProductCandidate) {
  if (substitute.electrical_compliance_required) {
    return "Adds electrical review, warranty and installation-location checks.";
  }
  if (substitute.wall_hung && !selected.wall_hung) {
    return "May need additional wall support and fixing review.";
  }
  if (substitute.freight_risk === "high" || substitute.warranty_risk === "high") {
    return "May increase lead-time, freight or warranty review needs.";
  }
  if (selected.price_min > substitute.price_min) {
    return "Usually simpler, but may reduce storage, finish or design impact.";
  }
  return "Confirm dimensions, compatibility and availability before selecting.";
}

function buildWarnings(input: ProductScheduleInput, items: BathroomScheduleItem[]) {
  const warnings = new Set<string>();

  warnings.add(
    "Online guidance is a planning range only. Site measure, selections, licensed trade checks and written scope confirmation are required before contract pricing."
  );
  if (input.vanityWidth === "under_600") {
    warnings.add("Vanity under 600mm: confirm basin size, storage needs and tapware reach before ordering.");
  }
  if (input.mirrorPreference === "led_mirror") {
    warnings.add("LED mirror: electrical compliance, IP suitability, warranty and power location need licensed review.");
  }
  if (input.tapwareFinish === "matte_black" || input.tapwareFinish === "brushed_gold") {
    warnings.add("Specialty tapware finishes should be checked for care requirements and warranty terms.");
  }
  if (input.showerConfiguration === "new_position") {
    warnings.add("Plumbing relocation should be confirmed by licensed trades before contract pricing.");
  }
  if (input.bathroomType === "apartment_bathroom") {
    warnings.add("Apartment/strata bathrooms may need access, approval and Class 2/DBP screening. This is not legal advice.");
  }
  if (items.some((item) => item.recommendedProduct.watermarkRequired || item.recommendedProduct.welsRequired)) {
    warnings.add("Tapware and shower products should have WaterMark and WELS status confirmed before ordering.");
  }

  return [...warnings];
}

function buildPacks(input: ProductScheduleInput): PublicProductPack[] {
  const matchingPacks = bathroomProductPacks.filter((pack) => {
    if (input.bathroomType === "apartment_bathroom") {
      return pack.id === "pack_apartment_compact" || pack.id === "pack_builder_pc";
    }
    if (input.budgetLevel === "premium") {
      return pack.id === "pack_premium_bathroom" || pack.id === "pack_premium_upgrade";
    }
    if (input.tapwareFinish === "matte_black") {
      return pack.id === "pack_matte_black_tapware" || pack.id === "pack_builder_pc";
    }
    if (input.tapwareFinish === "brushed_gold") {
      return pack.id === "pack_brushed_gold_accessory" || pack.id === "pack_premium_bathroom";
    }
    return pack.id === "pack_standard_ensuite" || pack.id === "pack_builder_pc";
  });

  return matchingPacks.slice(0, 3).map(({ allowanceLow, allowanceHigh, ...pack }) => ({
    ...pack,
    allowanceRange: `${currency(allowanceLow)} - ${currency(allowanceHigh)}`
  }));
}

function compareProductPacks(input: ProductScheduleInput, scheduleLow: number, scheduleHigh: number) {
  const packs = buildPacks(input);

  return packs.map((pack): ProductPackComparison => {
    const sourcePack = bathroomProductPacks.find((item) => item.id === pack.id);
    const low = sourcePack?.allowanceLow ?? scheduleLow;
    const high = sourcePack?.allowanceHigh ?? scheduleHigh;
    const scheduleFit =
      pack.bestFor.includes(input.bathroomType.replace("_bathroom", "")) ||
      pack.bestFor.includes(input.budgetLevel) ||
      (input.bathroomType === "apartment_bathroom" && pack.bestFor.includes("apartment"))
        ? "preferred"
        : input.budgetLevel === "unsure"
          ? "review"
          : "alternate";
    const allowanceAlignment =
      high < scheduleLow
        ? "lower_than_schedule"
        : low > scheduleHigh
          ? "higher_than_schedule"
          : "similar_to_schedule";

    return {
      id: pack.id,
      name: pack.name,
      allowanceRange: pack.allowanceRange,
      scheduleFit,
      allowanceAlignment,
      whyItFits: buildPackFitReason(input, scheduleFit, allowanceAlignment),
      watchouts: [...pack.riskNotes, ...pack.complianceNotes]
    };
  });
}

function buildPackFitReason(
  input: ProductScheduleInput,
  fit: ProductPackComparison["scheduleFit"],
  alignment: ProductPackComparison["allowanceAlignment"]
) {
  if (fit === "preferred" && input.bathroomType === "apartment_bathroom") {
    return "Good planning fit for compact apartment context, subject to strata, access and site checks.";
  }
  if (alignment === "lower_than_schedule") {
    return "Could reduce allowance pressure, but confirm it still matches the expected finish level.";
  }
  if (alignment === "higher_than_schedule") {
    return "Could support a higher finish level, but may widen allowance and lead-time risk.";
  }
  return "Comparable planning pack to review against the generated schedule and builder quote.";
}

function buildAllowanceReview(input: ProductScheduleInput, items: BathroomScheduleItem[]) {
  if (!input.quoteText?.trim()) {
    return null;
  }
  const extracted = extractBathroomQuoteAllowanceAmounts(input.quoteText);
  const checks = extracted.map((entry): BathroomQuoteAllowanceCheck => {
    const matchingItems = items.filter((item) => {
      const label = productCategoryLabels[item.recommendedProduct.categoryId] ?? item.category;
      return label === entry.category || item.category.includes(entry.category);
    });
    const planningLow = matchingItems.length
      ? matchingItems.reduce((total, item) => total + item.allowanceLow, 0)
      : null;
    const planningHigh = matchingItems.length
      ? matchingItems.reduce((total, item) => total + item.allowanceHigh, 0)
      : null;
    const status = allowanceStatus(entry.mentioned, entry.quotedAmount, planningLow, planningHigh);

    return {
      category: entry.category,
      quotedAmount: entry.quotedAmount,
      planningLow,
      planningHigh,
      status,
      prompt: allowancePrompt(entry.category, status)
    };
  });
  const quoteRiskPrompts = [
    ...reviewBathroomQuoteText(input.quoteText),
    ...checks
      .filter((check) => check.status === "missing" || check.status === "below_planning_range" || check.status === "unclear")
      .map((check) => check.prompt)
  ].filter((prompt, index, list) => list.indexOf(prompt) === index);

  return {
    summary:
      "Pasted quote text was checked for product allowance clarity. This is a planning prompt only; confirm inclusions, exclusions, PC sums and selections in writing.",
    checks,
    quoteRiskPrompts
  };
}

function allowanceStatus(
  mentioned: boolean,
  quotedAmount: number | null,
  planningLow: number | null,
  planningHigh: number | null
): BathroomQuoteAllowanceCheck["status"] {
  if (!mentioned) return "missing";
  if (!quotedAmount || !planningLow || !planningHigh) return "unclear";
  if (quotedAmount < planningLow) return "below_planning_range";
  if (quotedAmount > planningHigh) return "above_planning_range";
  return "within_planning_range";
}

function allowancePrompt(category: string, status: BathroomQuoteAllowanceCheck["status"]) {
  if (status === "missing") return `${category}: clarify whether this product category is included before signing.`;
  if (status === "unclear") return `${category}: confirm the allowance amount, inclusions and exclusions in writing.`;
  if (status === "below_planning_range") {
    return `${category}: quoted allowance appears below this planning schedule range; clarify expected selection quality before signing.`;
  }
  if (status === "above_planning_range") {
    return `${category}: quoted allowance is above this planning range; confirm what upgrade or scope is included.`;
  }
  return `${category}: allowance appears broadly aligned with this planning schedule range, subject to final selections.`;
}

function buildBuilderExport(schedule: Omit<BathroomSchedule, "builderReadySummary" | "builderExport">) {
  const itemLines = schedule.items.map((item) => {
    const substitutions = item.substitutionOptions.length
      ? ` Alternatives to review: ${item.substitutionOptions.map((option) => option.product.name).join("; ")}.`
      : "";
    return `- ${item.category}: ${item.recommendedProduct.name}. Planning allowance ${formatAllowanceRange(item.allowanceLow, item.allowanceHigh)}. ${item.complianceNote} ${item.riskNote}${substitutions}`;
  });
  const allowanceLines =
    schedule.allowanceReview?.checks.map(
      (check) =>
        `- ${check.category}: ${check.status.replaceAll("_", " ")}. ${check.prompt}`
    ) ?? [];

  return [
    `Operon Bathroom Product Schedule ${schedule.id}`,
    "",
    "Use: planning guidance for quote review, product selection discussion and site-measure preparation.",
    "Not for: checkout, final pricing, legal advice, compliance certification or purchase orders.",
    "",
    `Total PC allowance planning range: ${formatAllowanceRange(schedule.totalAllowanceLow, schedule.totalAllowanceHigh)}.`,
    `Confidence: ${schedule.confidence}.`,
    "",
    "Recommended product categories:",
    ...itemLines,
    "",
    "Product pack comparison:",
    ...schedule.packComparisons.map(
      (pack) => `- ${pack.name}: ${pack.allowanceRange}; ${pack.scheduleFit}; ${pack.whyItFits}`
    ),
    ...(allowanceLines.length ? ["", "Quote allowance review:", ...allowanceLines] : []),
    "",
    "Required next confirmation: site measure, final selections, licensed trade checks, availability and written scope confirmation before contract pricing."
  ].join("\n");
}

function buildCtas(input: ProductScheduleInput) {
  const ctas = [
    { label: "Review My Bathroom Quote", href: "/quote/review", intent: "quote_review" },
    { label: "Request Bathroom Product Pack Quote", href: "/request-review", intent: "product_quote" },
    { label: "Send to Operon Bathroom Consultant", href: "/request-review", intent: "consultation" },
    { label: "Prepare Site Measure", href: "/site-measure", intent: "site_measure" }
  ];

  if (input.hasExistingQuote || input.wantsQuoteReview) {
    return [ctas[0], ctas[2], ctas[3]];
  }
  if (input.renovationStage === "ready_for_site_measure") {
    return [ctas[3], ctas[2], ctas[0]];
  }
  return ctas;
}

function confidence(input: ProductScheduleInput): BathroomSchedule["confidence"] {
  if (
    input.bathroomSize === "unknown" ||
    input.vanityWidth === "unknown" ||
    input.basinPreference === "unsure" ||
    input.tapwareFinish === "unsure" ||
    input.mirrorPreference === "unsure"
  ) {
    return "low";
  }
  if (
    input.bathroomType === "apartment_bathroom" ||
    input.showerConfiguration === "new_position" ||
    input.mirrorPreference === "led_mirror"
  ) {
    return "medium";
  }
  return "high";
}

export function reviewBathroomProductQuoteText(text: string) {
  return reviewBathroomQuoteText(text);
}

export function generateBathroomProductSchedule(rawInput: ProductScheduleInput): ProductScheduleResult {
  const input = productScheduleInputSchema.parse(rawInput);
  const selectedProducts = [
    chooseVanity(input),
    chooseBasin(input),
    chooseTapware(input),
    chooseMirror(input),
    chooseAccessoryPack()
  ];
  const items = buildScheduleItems(input, selectedProducts);
  const total = calculatePcAllowanceRange(selectedProducts, input.budgetLevel);
  const quoteReviewFlags = input.quoteText ? reviewBathroomProductQuoteText(input.quoteText) : [];
  const allowanceReview = buildAllowanceReview(input, items);
  const complianceNotes = checkBathroomComplianceNotes(items);
  const warnings = buildWarnings(input, items);
  const freightRiskNotes = items
    .filter((item) => item.recommendedProduct.freightRisk !== "low")
    .map((item) => `${item.recommendedProduct.name}: confirm availability, freight and access before order.`);
  const installationNotes = items.map((item) => item.riskNote);
  const scheduleWithoutSummaries = {
    id: `bps_${Date.now().toString(36)}`,
    source: "bathroom_product_schedule" as const,
    projectType: input.projectType,
    bathroomType: input.bathroomType,
    bathroomSize: input.bathroomSize,
    style: input.stylePreference,
    budgetLevel: input.budgetLevel,
    vanityWidth: input.vanityWidth,
    basinPreference: input.basinPreference,
    tapwareFinish: input.tapwareFinish,
    mirrorPreference: input.mirrorPreference,
    showerConfiguration: input.showerConfiguration,
    postcode: input.postcode,
    timeline: input.timeline,
    generatedSummary: "",
    builderReadySummary: "",
    totalAllowanceLow: total.low,
    totalAllowanceHigh: total.high,
    confidence: confidence(input),
    items,
    recommendedPacks: buildPacks(input),
    complianceNotes,
    freightRiskNotes,
    installationNotes,
    quoteReviewFlags,
    allowanceReview,
    packComparisons: compareProductPacks(input, total.low, total.high),
    builderExport: "",
    nextStepCtas: buildCtas(input),
    createdAt: new Date().toISOString()
  };
  const schedule: BathroomSchedule = {
    ...scheduleWithoutSummaries,
    generatedSummary: generateBathroomScheduleSummary(input, items),
    builderReadySummary: generateBuilderReadyBathroomSchedule(scheduleWithoutSummaries),
    builderExport: buildBuilderExport(scheduleWithoutSummaries)
  };

  return {
    schedule,
    assumptions: [
      "Selections are category recommendations, not confirmed purchase orders.",
      "PC allowance ranges are planning guidance only and exclude project-specific contract pricing.",
      "Site measure, selections, licensed trade checks and written scope confirmation are required before contract pricing."
    ],
    warnings
  };
}

export function createProductScheduleLead(
  input: ProductScheduleInput,
  lead: ProductScheduleLeadInput | null,
  schedule: BathroomSchedule
) {
  if (!lead) {
    return null;
  }
  const parsedLead = productScheduleLeadSchema.parse(lead);
  const parsedInput = productScheduleInputSchema.parse(input);

  return {
    id: `bps_lead_${Date.now().toString(36)}`,
    name: parsedLead.name,
    email: parsedLead.email,
    phone: parsedLead.phone,
    postcode: parsedInput.postcode,
    projectType: parsedInput.projectType,
    bathroomType: parsedInput.bathroomType,
    renovationStage: parsedInput.renovationStage,
    timeline: parsedInput.timeline,
    source: "bathroom_product_schedule" as const,
    scheduleId: schedule.id,
    quoteReviewRequested: parsedInput.wantsQuoteReview,
    productQuoteRequested: parsedInput.wantsProductQuote,
    renovationHelpRequested: parsedInput.wantsRenovationHelp,
    createdAt: new Date().toISOString()
  };
}

export function formatAllowanceRange(low: number, high: number) {
  return `${currency(low)} - ${currency(high)}`;
}
