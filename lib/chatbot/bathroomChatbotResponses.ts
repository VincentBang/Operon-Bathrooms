import { bathroomChatbotRoutes, ChatbotCta, fallbackCtas } from "./bathroomChatbotRoutes";
import { noLegalAdviceNotice, planningGuidanceNotice } from "./bathroomChatbotSafety";

export type ChatbotIntent =
  | "estimate"
  | "quoteReview"
  | "siteMeasure"
  | "waterproofing"
  | "services"
  | "strata"
  | "asbestos"
  | "allowances"
  | "evidence"
  | "badFit"
  | "privatePricing"
  | "contractPricing"
  | "deposit"
  | "general";

export type ChatbotResponse = {
  intent: ChatbotIntent;
  title: string;
  body: string[];
  ctas: ChatbotCta[];
  highRiskTopics?: string[];
};

export const quickPrompts = [
  "Help me estimate my bathroom",
  "Review my bathroom quote",
  "What makes bathroom quotes change?",
  "Do I need a site measure?",
  "What should I prepare?",
  "Apartment / strata bathroom",
  "Waterproofing risk",
  "PC sums and provisional sums",
  "Why is my quote so different?",
  "Book or request a review"
];

export const chatbotResponses: Record<ChatbotIntent, Omit<ChatbotResponse, "intent" | "highRiskTopics">> = {
  estimate: {
    title: "Bathroom estimate help",
    body: [
      "A bathroom estimate is best treated as a planning range, not contract pricing.",
      "The main factors are room size, finish level, layout changes, waterproofing, tiling height, plumbing/electrical scope, ventilation, access/strata and PC or provisional sums.",
      planningGuidanceNotice
    ],
    ctas: [bathroomChatbotRoutes.estimate, bathroomChatbotRoutes.costGuide]
  },
  quoteReview: {
    title: "Existing quote review",
    body: [
      "A quote review helps check whether the written scope clearly covers demolition, waste, waterproofing, tiling, screed/falls, drainage, plumbing, electrical, ventilation, fixtures, exclusions and allowances.",
      "It can also flag deposit and HBC/HBCF prompts, site-measure readiness and questions to clarify before signing.",
      "This is general guidance only. It does not decide whether a builder is wrong or certify compliance."
    ],
    ctas: [bathroomChatbotRoutes.quoteReview, bathroomChatbotRoutes.siteMeasure]
  },
  siteMeasure: {
    title: "Why site measure matters",
    body: [
      "Online details cannot confirm waterproofing condition, substrate, falls, drainage, plumbing access, electrical condition, ventilation, asbestos, strata requirements, access or parking constraints.",
      planningGuidanceNotice
    ],
    ctas: [bathroomChatbotRoutes.siteMeasure, bathroomChatbotRoutes.scopeReview]
  },
  waterproofing: {
    title: "Waterproofing risk",
    body: [
      "Waterproofing is one of the biggest bathroom quote certainty risks because it affects demolition, substrate preparation, wet-area scope and certificates.",
      "Check whether waterproofing, substrate preparation and any certificate wording are included in the quote. Do not treat an online answer as a compliance confirmation.",
      noLegalAdviceNotice
    ],
    ctas: [bathroomChatbotRoutes.quoteReview, bathroomChatbotRoutes.scopeReview, bathroomChatbotRoutes.waterproofingGuide]
  },
  services: {
    title: "Plumbing, electrical and ventilation",
    body: [
      "Moving a toilet, shower, vanity, power point, heated towel rail, underfloor heating or exhaust fan usually reduces quote certainty until services are checked.",
      "Licensed trades and site review are required before those details can be confirmed in writing.",
      planningGuidanceNotice
    ],
    ctas: [bathroomChatbotRoutes.estimate, bathroomChatbotRoutes.siteMeasure]
  },
  strata: {
    title: "Apartment and strata bathrooms",
    body: [
      "Apartment bathrooms often need extra review around strata approvals, work hours, lift bookings, access, waterproofing evidence and Class 2/DBP triggers depending on the scope.",
      "Confirm requirements in writing with the relevant parties. This chat cannot give legal advice or confirm compliance.",
      planningGuidanceNotice
    ],
    ctas: [bathroomChatbotRoutes.scopeReview, bathroomChatbotRoutes.siteMeasure, bathroomChatbotRoutes.strataGuide]
  },
  asbestos: {
    title: "Older bathrooms and asbestos",
    body: [
      "If asbestos is suspected, it should be assessed before demolition. Older homes, fibro materials and some pre-1990 bathrooms deserve extra caution.",
      "Operon can help route the project for review, but asbestos assessment or removal advice must come from appropriately licensed specialists.",
      noLegalAdviceNotice
    ],
    ctas: [bathroomChatbotRoutes.scopeReview, bathroomChatbotRoutes.siteMeasure]
  },
  allowances: {
    title: "PC sums and provisional sums",
    body: [
      "PC sums and provisional sums can make bathroom quotes hard to compare because selections or hidden work may not be fully fixed yet.",
      "Clarify tile, fixture, demolition, waterproofing, plumbing/electrical, access and exclusion wording before signing. Unclear allowances may reduce quote certainty.",
      "A quote review is the best next step if your written quote has unclear allowances."
    ],
    ctas: [bathroomChatbotRoutes.quoteReview, bathroomChatbotRoutes.allowancesGuide]
  },
  evidence: {
    title: "What to prepare",
    body: [
      "Prepare photos of the whole bathroom, shower area, vanity, toilet, floor/wall tiles, ceiling/ventilation, access path and any leaks or mould.",
      "If you have them, add the written quote, plans, strata notes, preferred fixtures, finish ideas, budget range and timing.",
      "The more complete the evidence, the easier it is to give useful planning guidance before site measure."
    ],
    ctas: [bathroomChatbotRoutes.scopeReview, bathroomChatbotRoutes.siteMeasure]
  },
  badFit: {
    title: "Scope check",
    body: [
      "Operon Bathrooms is set up for renovation planning, quote review, scope review and site-measure preparation.",
      "For emergency leak repair, supply-only fixtures, DIY waterproofing, unlicensed work or legal advice, use an appropriate licensed professional or relevant authority.",
      "If your project is a renovation and you want structured planning guidance, request a scope review."
    ],
    ctas: [bathroomChatbotRoutes.scopeReview]
  },
  privatePricing: {
    title: "Private pricing",
    body: [
      "I cannot share internal rates, labour rates, supplier costs, margins, rate cards or private pricing logic.",
      "Public guidance is limited to planning ranges, confidence prompts and next-step routing.",
      planningGuidanceNotice
    ],
    ctas: [bathroomChatbotRoutes.estimate, bathroomChatbotRoutes.quoteReview]
  },
  contractPricing: {
    title: "Online pricing boundary",
    body: [
      "I cannot provide binding contract pricing online.",
      "Bathrooms need site measure, selections, licensed trade checks and written scope confirmation before contract pricing.",
      "The best next step is to prepare for a site measure or start with a planning estimate if you are still early."
    ],
    ctas: [bathroomChatbotRoutes.siteMeasure, bathroomChatbotRoutes.estimate]
  },
  deposit: {
    title: "Deposit prompt",
    body: [
      "A deposit that seems high should be clarified before signing. Ask for the deposit basis, staged payment schedule and any HBC/HBCF wording to be confirmed in writing.",
      "This is a prompt for review, not legal advice or a compliance decision.",
      "If a quote or deposit request feels unclear, use the quote review flow before committing."
    ],
    ctas: [bathroomChatbotRoutes.quoteReview, bathroomChatbotRoutes.scopeReview]
  },
  general: {
    title: "Bathroom planning assistant",
    body: [
      "I can help with planning estimates, existing quote review, site-measure preparation, waterproofing risk, allowances, strata/access concerns and evidence to prepare.",
      "Choose a prompt or type what you are trying to work out."
    ],
    ctas: fallbackCtas
  }
};
