import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { SeoPage } from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Bathroom Refresh Sydney | Scope Review Before You Commit",
  description:
    "Plan a Sydney bathroom refresh with clear scope boundaries, fixture and surface prompts, and site-measure preparation before written pricing.",
  alternates: { canonical: "/services/bathroom-refresh" },
  openGraph: {
    title: "Bathroom refresh Sydney",
    description:
      "Scope-boundary planning for bathroom refresh projects before site measure and written confirmation."
  }
};

export default function BathroomRefreshPage() {
  return (
    <SeoPage
      title="Bathroom refresh Sydney."
      intro="A bathroom refresh may be suitable when the layout is mostly unchanged, but wet-area condition, waterproofing, fixtures, surfaces and exclusions still need careful review."
      bullets={[
        "Clarify whether the project is cosmetic refresh or renovation.",
        "Check fixture, surface, painting, waterproofing and trade-scope boundaries.",
        "Use request review or site measure before relying on written pricing."
      ]}
      primaryHref="/request-review"
      primaryLabel="Request scope review"
    >
      <div className="notice">
        <p>
          Operon does not position around cheap or supply-only bathroom work. Refresh planning
          still needs safe scope boundaries and written confirmation.
        </p>
      </div>
      <div className="actions" style={{ justifyContent: "flex-start" }}>
        <Link className="button" href="/request-review">Request scope review</Link>
        <Link className="button secondary" href="/quote/review">Review a quote</Link>
        <Link className="button ghost" href="/site-measure">Prepare site measure</Link>
      </div>
    </SeoPage>
  );
}
