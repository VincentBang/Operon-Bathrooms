import { z } from "zod";

export const attributionSchema = z.object({
  sourceRoute: z.string().default(""),
  landingPage: z.string().default(""),
  referrer: z.string().default(""),
  utmSource: z.string().default(""),
  utmMedium: z.string().default(""),
  utmCampaign: z.string().default(""),
  utmContent: z.string().default(""),
  utmTerm: z.string().default("")
});

export type Attribution = z.infer<typeof attributionSchema>;

export const emptyAttribution: Attribution = {
  sourceRoute: "",
  landingPage: "",
  referrer: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  utmTerm: ""
};

export function readAttribution(sourceRoute: string): Attribution {
  if (typeof window === "undefined") return { ...emptyAttribution, sourceRoute };

  const params = new URLSearchParams(window.location.search);
  const landingPage =
    window.sessionStorage.getItem("operon_bathrooms_landing_page") ??
    `${window.location.pathname}${window.location.search}`;
  window.sessionStorage.setItem("operon_bathrooms_landing_page", landingPage);

  return {
    sourceRoute,
    landingPage,
    referrer: document.referrer,
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    utmContent: params.get("utm_content") ?? "",
    utmTerm: params.get("utm_term") ?? ""
  };
}
