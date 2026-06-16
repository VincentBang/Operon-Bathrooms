import type { Metadata } from "next";
import Link from "next/link";
import { SeoPage } from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Full Bathroom Renovation Sydney",
  description:
    "Plan a full Sydney bathroom renovation with scope prompts, indicative estimate ranges and next-step guidance.",
  alternates: { canonical: "/services/full-bathroom-renovation" },
  openGraph: {
    title: "Full bathroom renovation Sydney",
    description:
      "Scope, waterproofing, trade and site-measure prompts before written bathroom renovation pricing."
  }
};

export default function FullBathroomPage() {
  return (
    <SeoPage
      title="Full bathroom renovation"
      intro="A full bathroom renovation usually needs the broadest planning conversation: demolition, waterproofing, fixtures, services, tiling, ventilation and sequencing."
      bullets={[
        "Like-for-like refresh versus revised layout.",
        "Waterproofing, ventilation and electrical planning assumptions.",
        "Site inspection items required before contract pricing."
      ]}
    >
      <div className="grid">
        <div className="card">
          <h2>Typical scope prompts</h2>
          <p>
            Clarify demolition, rubbish removal, waterproofing, tiling heights, plumbing,
            electrical, ventilation, painting, fixtures and exclusions in writing.
          </p>
        </div>
        <div className="actions" style={{ justifyContent: "flex-start" }}>
          <Link className="button" href="/quote">Start full bathroom estimate</Link>
          <Link className="button secondary" href="/quote/review">Review a quote</Link>
          <Link className="button ghost" href="/site-measure">Prepare site measure</Link>
        </div>
      </div>
    </SeoPage>
  );
}
