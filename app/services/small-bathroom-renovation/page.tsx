import type { Metadata } from "next";
import Link from "next/link";
import { SeoPage } from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Small Bathroom Renovation Sydney | Planning Estimate",
  description:
    "Plan a small bathroom renovation in Sydney with space, waterproofing, access and selections prompts before site measure.",
  alternates: { canonical: "/services/small-bathroom-renovation" },
  openGraph: {
    title: "Small bathroom renovation Sydney",
    description:
      "Compact bathroom planning with waterproofing, access and written-scope prompts."
  }
};

export default function SmallBathroomPage() {
  return (
    <SeoPage
      title="Small bathroom renovation Sydney."
      intro="Small bathrooms need careful planning around storage, clearances, tiling extent, services and access."
      bullets={[
        "Compact layout planning without hard-coded public pricing.",
        "Risks that can reduce estimate confidence.",
        "Next steps for site review and written scope preparation."
      ]}
    >
      <div className="actions" style={{ justifyContent: "flex-start" }}>
        <Link className="button" href="/quote">Start small bathroom estimate</Link>
        <Link className="button secondary" href="/quote/review">Review a quote</Link>
        <Link className="button ghost" href="/site-measure">Prepare site measure</Link>
      </div>
    </SeoPage>
  );
}
