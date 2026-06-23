import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { SeoPage } from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Apartment Bathroom Renovations | Strata & Class 2 Sydney",
  description:
    "Plan an apartment bathroom renovation in Sydney with strata, access, waterproofing and Class 2 prompts before site measure and written scope confirmation.",
  alternates: { canonical: "/services/apartment-bathroom-renovation-sydney" },
  openGraph: {
    title: "Apartment bathroom renovations Sydney",
    description:
      "Strata, access, waterproofing and Class 2 planning prompts before bathroom renovation contract pricing."
  }
};

export default function ApartmentBathroomRenovationSydneyPage() {
  return (
    <SeoPage
      title="Apartment and strata bathroom renovations in Sydney."
      intro="Apartment bathrooms can involve strata approval, access rules, lift bookings, waterproofing evidence and Class 2 screening. Operon helps prepare planning questions before site measure and written scope confirmation."
      bullets={[
        "Strata, access, parking, lift/stairs and work-hour constraints.",
        "Waterproofing, drainage, ventilation and hidden-condition prompts.",
        "Quote review flags for apartment and Class 2 bathroom projects."
      ]}
    >
      <div className="grid">
        <div className="card">
          <h2>Why apartments need earlier checks</h2>
          <p>
            Apartment projects can be affected by owners corporation requirements, common property,
            access, noisy works, waterproofing evidence and building classification prompts.
          </p>
        </div>
        <div className="card">
          <h2>Quote review considerations</h2>
          <p>
            Confirm strata assumptions, waste removal, lift protection, waterproofing certificate
            wording, plumbing access and exclusions before comparing quote totals.
          </p>
        </div>
        <div className="actions" style={{ justifyContent: "flex-start" }}>
          <Link className="button" href="/quote">Start apartment estimate</Link>
          <Link className="button secondary" href="/quote/review">Review a quote</Link>
          <Link className="button ghost" href="/site-measure">Prepare site measure</Link>
        </div>
      </div>
    </SeoPage>
  );
}
