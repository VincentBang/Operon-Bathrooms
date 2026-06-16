export type ChatbotRouteKey =
  | "estimate"
  | "quoteReview"
  | "scopeReview"
  | "siteMeasure"
  | "costGuide"
  | "waterproofingGuide"
  | "allowancesGuide"
  | "strataGuide";

export type ChatbotCta = {
  label: string;
  href: string;
};

export const bathroomChatbotRoutes: Record<ChatbotRouteKey, ChatbotCta> = {
  estimate: { label: "Start bathroom estimate", href: "/quote" },
  quoteReview: { label: "Review existing quote", href: "/quote/review" },
  scopeReview: { label: "Request scope review", href: "/request-review" },
  siteMeasure: { label: "Prepare site measure", href: "/site-measure" },
  costGuide: { label: "Read cost guide", href: "/bathroom-renovation-cost-sydney" },
  waterproofingGuide: { label: "Waterproofing guide", href: "/guides#waterproofing" },
  allowancesGuide: { label: "PC/provisional sums guide", href: "/guides#allowances" },
  strataGuide: { label: "Apartment strata guide", href: "/guides#strata" }
};

export const fallbackCtas = [
  bathroomChatbotRoutes.estimate,
  bathroomChatbotRoutes.quoteReview,
  bathroomChatbotRoutes.scopeReview,
  bathroomChatbotRoutes.siteMeasure
];
