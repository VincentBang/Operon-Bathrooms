import type { Metadata } from "next";
import Link from "next/link";
import { SeoPage } from "@/components/SeoPage";
import React from "react";

export const metadata: Metadata = {
  title: "Bathroom Renovation Costs in Sydney | Planning Ranges & Factors",
  description:
    "Learn how bathroom renovation costs in Sydney vary by size, layout, waterproofing, selections and site conditions. Operon provides planning guidance, not fixed quotes.",
  alternates: { canonical: "/bathroom-renovation-cost-sydney" },
  openGraph: {
    title: "Bathroom renovation cost Sydney",
    description:
      "Planning-first cost factors, allowance prompts and next steps before site measure."
  }
};

export default function CostGuidePage() {
  return (
    <SeoPage
      title="Bathroom Renovation Cost Guide for Sydney 2026."
      intro="Use this guide to understand the questions that shape a bathroom renovation estimate before a site visit. Operon provides planning ranges and risk prompts only, not fixed quotes."
      bullets={[
        "How room size, layout changes, waterproofing and fixture selections affect planning confidence.",
        "Why strata, asbestos risk, access, PC sums and provisional sums can change written scope.",
        "How the planning estimate wizard prepares a better site-review conversation."
      ]}
    >
      <div className="grid">
        <div className="card">
          <h2>Planning range factors</h2>
          <p>
            Bathroom size, building age, layout changes, tiling extent, fixture selections, access
            and hidden conditions can all change the range. Treat online figures as planning
            inputs, not contract pricing.
          </p>
        </div>
        <div className="card">
          <h2>Allowances and exclusions</h2>
          <p>
            PC sums, provisional sums, exclusions, GST status and variation wording should be
            clarified before comparing quote totals.
          </p>
        </div>
        <div className="card">
          <h2>Next steps</h2>
          <p>
            Start the wizard for a project-specific planning range, review an existing quote or
            prepare a site measure before written scope confirmation.
          </p>
          <div className="actions" style={{ justifyContent: "flex-start" }}>
            <Link className="button" href="/quote">Get your planning estimate</Link>
            <Link className="button secondary" href="/site-measure">Prepare site measure</Link>
          </div>
        </div>
      </div>
      <div className="notice">
        <h3>Compliance prompts</h3>
        <p>
          For NSW projects, check current rules for contractor licensing above $5k, deposits
          generally limited to 10%, and HBCF cover generally required over $20k. This page is not
          legal advice.
        </p>
        <Link className="button secondary" href="/quote/review">
          Review an existing quote
        </Link>
      </div>
      <div className="grid two">
        {[
          ["Full bathroom renovation", "/services/full-bathroom-renovation"],
          ["Apartment bathroom renovation", "/services/apartment-bathroom-renovation-sydney"],
          ["Ensuite renovation", "/services/ensuite-renovation"],
          ["Small bathroom renovation", "/services/small-bathroom-renovation"]
        ].map(([title, href]) => (
          <Link className="card" href={href} key={href}>
            <h2>{title}</h2>
            <p>Review the service-specific scope prompts before estimating your project.</p>
          </Link>
        ))}
      </div>
    </SeoPage>
  );
}
