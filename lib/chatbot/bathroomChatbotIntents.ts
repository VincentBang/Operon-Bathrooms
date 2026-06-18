import { ChatbotIntent, ChatbotResponse, chatbotResponses } from "./bathroomChatbotResponses";
import { containsContractPricingRequest, containsPrivatePricingRequest, highRiskTopicsFor } from "./bathroomChatbotSafety";

type IntentRule = {
  intent: ChatbotIntent;
  pattern: RegExp;
};

const intentRules: IntentRule[] = [
  {
    intent: "badFit",
    pattern: /\b(emergency leak|repair only|cheapest|cheap bathroom|supply only|supply-only|diy|unlicensed|legal advice|compliance certificate)\b/i
  },
  {
    intent: "deposit",
    pattern: /\b(deposit|50%|fifty percent|hbc|hbcf|home building compensation)\b/i
  },
  {
    intent: "quoteReview",
    pattern: /\b(review.*quote|compare.*quote|builder quote|quote too expensive|quote fair|missing inclusions|second opinion|quote different|quote varies)\b/i
  },
  {
    intent: "allowances",
    pattern: /\b(pc sum|prime cost|provisional sum|allowance|variation|exclusion|exclusions)\b/i
  },
  {
    intent: "siteMeasure",
    pattern: /\b(site measure|inspection|visit|measure|written scope)\b/i
  },
  {
    intent: "waterproofing",
    pattern: /\b(waterproofing|waterproof|leak|mould|mold|shower leak|membrane|certificate|wet area)\b/i
  },
  {
    intent: "services",
    pattern: /\b(move (my )?(plumbing|toilet|shower|vanity)|relocate|electrical|power point|heated towel rail|underfloor heating|exhaust fan|ventilation)\b/i
  },
  {
    intent: "strata",
    pattern: /\b(apartment|unit|strata|owners corporation|class 2|by-law|lift|access)\b/i
  },
  {
    intent: "asbestos",
    pattern: /\b(asbestos|old bathroom|old house|fibro|1970|1980|demolition risk)\b/i
  },
  {
    intent: "evidence",
    pattern: /\b(what do i need|prepare|photos|plans|measurement|documents|before site measure|evidence)\b/i
  },
  {
    intent: "estimate",
    pattern: /\b(cost|price|estimate|calculator|quote|how much|budget|bathroom renovation cost|ensuite cost|small bathroom cost)\b/i
  }
];

export function detectBathroomChatbotIntent(message: string): ChatbotIntent {
  const text = message.trim();
  if (!text) return "general";
  if (containsPrivatePricingRequest(text)) return "privatePricing";
  if (containsContractPricingRequest(text)) return "contractPricing";
  return intentRules.find((rule) => rule.pattern.test(text))?.intent || "general";
}

export function getBathroomChatbotResponse(message: string): ChatbotResponse {
  const intent = detectBathroomChatbotIntent(message);
  return {
    intent,
    ...chatbotResponses[intent],
    highRiskTopics: highRiskTopicsFor(message)
  };
}
