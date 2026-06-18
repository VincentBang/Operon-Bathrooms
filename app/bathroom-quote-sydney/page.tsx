import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { SeoPage } from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Bathroom Renovation Quote Sydney | Planning Estimate First",
  description:
    "Looking for a bathroom renovation quote in Sydney? Start with a planning estimate, quote review prompts and site-measure preparation before contract pricing.",
  alternates: { canonical: "/bathroom-quote-sydney" },
  openGraph: {
    title: "Bathroom renovation quote Sydney",
    description:
      "Start with planning clarity, risk prompts and site-measure preparation before written scope confirmation."
  }
};

export default function BathroomQuoteSydneyPage() {
  return (
    <SeoPage
      title="Bathroom renovation quote Sydney: start with planning clarity."
      intro="If you are looking for a bathroom renovation quote in Sydney, start by clarifying scope, assumptions, exclusions and site-measure readiness. Operon provides planning guidance only before contract pricing."
      bullets={[
        "Use the quote wizard to prepare a planning range and confidence score.",
        "Review an existing quote for missing inclusions, allowances and risk flags.",
        "Prepare a site measure before selections, licensed trade checks and written scope confirmation."
      ]}
      primaryLabel="Start your planning estimate"
    >
      <div className="grid">
        <div className="card">
          <h2>Why planning comes first</h2>
          <p>
            Bathroom quotes depend on waterproofing, demolition, tiling extent, fixtures,
            plumbing/electrical scope, access, strata and exclusions. Online planning helps frame
            the conversation but does not replace site inspection.
          </p>
        </div>
        <div className="card">
          <h2>Already have a quote?</h2>
          <p>
            Use the quote review path to check GST status, deposit prompts, PC sums, provisional
            sums, waterproofing, exclusions and questions to confirm in writing.
          </p>
          <Link className="button secondary" href="/quote/review">Review my bathroom quote</Link>
        </div>
        <div className="card">
          <h2>Need budgeting context?</h2>
          <p>
            The Sydney cost guide explains planning factors without package-price promises or
            internal rate-card details.
          </p>
          <Link className="button secondary" href="/bathroom-renovation-cost-sydney">Read cost guide</Link>
        </div>
      </div>
    </SeoPage>
  );
}
