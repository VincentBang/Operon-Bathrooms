import type { Metadata } from "next";
import { SeoPage } from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Full Bathroom Renovation Sydney",
  description:
    "Plan a full Sydney bathroom renovation with scope prompts, indicative estimate ranges and next-step guidance.",
  alternates: { canonical: "/services/full-bathroom-renovation" }
};

export default function FullBathroomPage() {
  return (
    <SeoPage
      title="Full bathroom renovation"
      intro="A full bathroom renovation usually needs the broadest planning conversation: demolition, waterproofing, fixtures, services, tiling, ventilation and sequencing."
      bullets={[
        "Like-for-like refresh versus revised layout.",
        "Waterproofing, ventilation and electrical planning assumptions.",
        "Site inspection items required before any final quote."
      ]}
    />
  );
}
