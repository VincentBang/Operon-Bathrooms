import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { SeoPage } from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Laundry Bathroom Renovation Sydney | Wet Area Planning",
  description:
    "Plan a laundry bathroom renovation in Sydney with waterproofing, drainage, ventilation, fixtures and access prompts before site measure.",
  alternates: { canonical: "/services/laundry-bathroom-renovation" },
  openGraph: {
    title: "Laundry bathroom renovation Sydney",
    description:
      "Combined wet-area planning with scope, services and site-measure prompts."
  }
};

export default function LaundryBathroomRenovationPage() {
  return (
    <SeoPage
      title="Laundry bathroom renovation Sydney."
      intro="Combined laundry and bathroom projects need clear planning around wet-area separation, drainage, ventilation, storage, appliances, fixtures and trade sequencing."
      bullets={[
        "Confirm wet-area scope, waterproofing and drainage assumptions.",
        "Clarify appliance, cabinetry, plumbing and electrical inclusions.",
        "Prepare site-measure notes before written scope confirmation."
      ]}
    >
      <div className="grid">
        <div className="card">
          <h2>Combined wet-area prompts</h2>
          <p>
            A combined room may include laundry tubs, washing machine services, bathroom fixtures,
            floor falls, ventilation and storage. These details should be confirmed in writing.
          </p>
        </div>
        <div className="actions" style={{ justifyContent: "flex-start" }}>
          <Link className="button" href="/quote">Start planning estimate</Link>
          <Link className="button secondary" href="/quote/review">Review a quote</Link>
          <Link className="button ghost" href="/site-measure">Prepare site measure</Link>
        </div>
      </div>
    </SeoPage>
  );
}
