import type { MetadataRoute } from "next";
import { isBathroomDesignStudioDiscoverable } from "@/lib/bathroom-design/feature-flag";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.operonbathrooms.com.au";

const routes = [
  "/",
  "/quote",
  "/quote/review",
  "/request-review",
  "/site-measure",
  "/bathroom-renovation-cost-sydney",
  "/bathroom-quote-sydney",
  "/services/full-bathroom-renovation",
  "/services/apartment-bathroom-renovation-sydney",
  "/services/ensuite-renovation",
  "/services/small-bathroom-renovation",
  "/services/bathroom-refresh",
  "/services/laundry-bathroom-renovation",
  "/guides",
  "/areas",
  "/faq",
  "/how-it-works",
  "/privacy",
  "/terms"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes = isBathroomDesignStudioDiscoverable() ? [...routes, "/design-studio"] : routes;
  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7
  }));
}
