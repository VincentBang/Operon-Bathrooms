import type { Metadata } from "next";
import { SeoPage } from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Small Bathroom Renovation Sydney",
  description:
    "Plan a small Sydney bathroom renovation with scope assumptions, confidence scoring and compliance prompts.",
  alternates: { canonical: "/services/small-bathroom-renovation" }
};

export default function SmallBathroomPage() {
  return (
    <SeoPage
      title="Small bathroom renovation"
      intro="Small bathrooms need careful planning around storage, clearances, tiling extent, services and access."
      bullets={[
        "Compact layout planning without hard-coded public pricing.",
        "Risks that can reduce estimate confidence.",
        "Next steps for site review and final quote preparation."
      ]}
    />
  );
}
