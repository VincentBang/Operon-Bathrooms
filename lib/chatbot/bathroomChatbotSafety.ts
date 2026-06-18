export const planningGuidanceNotice =
  "Online guidance is a planning range only. Site measure, selections, licensed trade checks and written scope confirmation are required before contract pricing.";

export const noLegalAdviceNotice =
  "This is general planning guidance only, not legal advice or compliance certification.";

export function containsPrivatePricingRequest(message: string) {
  return /\b(labou?r rate|hourly rate|margin|markup|supplier cost|rate card|internal pricing|profit)\b/i.test(message);
}

export function containsContractPricingRequest(message: string) {
  return /\b(final quote|fixed price|guaranteed price|confirm price|contract price|binding quote|quote online)\b/i.test(message);
}

export function highRiskTopicsFor(message: string) {
  const topics = new Set<string>();
  const text = message.toLowerCase();
  if (/\b(apartment|unit|strata|owners corporation|class 2|by-law|lift)\b/.test(text)) topics.add("apartment / strata");
  if (/\b(asbestos|fibro|old bathroom|old house|1970|1980)\b/.test(text)) topics.add("suspected asbestos");
  if (/\b(leak|mould|mold|shower leak|water damage)\b/.test(text)) topics.add("leak or mould");
  if (/\b(move plumbing|move toilet|move shower|move vanity|relocat(e|ion).*(plumbing|toilet|shower|vanity))\b/.test(text)) {
    topics.add("plumbing relocation");
  }
  if (/\b(electrical|power point|heated towel rail|underfloor heating|exhaust fan)\b/.test(text)) topics.add("electrical / ventilation");
  if (/\b(waterproof|waterproofing|membrane|wet area)\b/.test(text)) topics.add("waterproofing uncertainty");
  if (/\b(deposit|hbc|hbcf|home building compensation)\b/.test(text)) topics.add("deposit or HBC/HBCF prompt");
  if (/\b(too cheap|too expensive|quote different|quote varies|missing inclusions|provisional|pc sum|allowance)\b/.test(text)) {
    topics.add("quote clarity");
  }
  if (/\b(urgent|asap|today|tomorrow)\b.*\b(site measure|inspection|visit)\b/.test(text)) topics.add("urgent site measure");
  return Array.from(topics);
}
