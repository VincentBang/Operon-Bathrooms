import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { SiteMeasureForm } from "@/components/RequestReviewForm";

export const metadata: Metadata = {
  title: "Bathroom Site Measure Sydney | Prepare for Written Scope",
  description:
    "Request a site measure to confirm waterproofing condition, substrate, falls, services, ventilation, asbestos and strata requirements.",
  alternates: { canonical: "/site-measure" },
  openGraph: {
    title: "Bathroom site measure request",
    description:
      "Prepare a bathroom site measure before selections, licensed trade checks and written scope confirmation."
  }
};

export default function SiteMeasurePage() {
  return (
    <section className="page-section">
      <div className="container two-col">
        <div>
          <p className="pill">Site measure</p>
          <h1>Confirm the site before contract pricing.</h1>
          <p className="lead">
            Online estimates cannot confirm waterproofing condition, substrate, falls, plumbing
            access, electrical condition, ventilation, asbestos risk, strata requirements or DBP
            triggers.
          </p>
          <p>
            This page provides planning guidance only and helps prepare the information needed for a
            site inspection.
            If you are still budgeting, start with the <Link href="/quote">planning estimate</Link> or read the{" "}
            <Link href="/bathroom-renovation-cost-sydney">cost guide</Link>.
          </p>
          <div className="notice">
            <p>
              Contract pricing requires site inspection, selections, licensed trade checks and
              written scope confirmation. This request does not create contract pricing.
            </p>
          </div>
          <div className="grid two">
            <div className="card">
              <h2>What site measure checks</h2>
              <ul>
                <li>Waterproofing condition, substrate, screed, falls and drainage.</li>
                <li>Plumbing access, electrical condition and ventilation path.</li>
                <li>Access, parking, lift/stairs and strata approval status.</li>
              </ul>
            </div>
            <div className="card">
              <h2>Online estimates cannot confirm</h2>
              <ul>
                <li>Asbestos, hidden leaks, mould or structural/substrate issues.</li>
                <li>DBP/Class 2 triggers or project-specific compliance obligations.</li>
                <li>Final selections, licensed trade scope or written contract scope.</li>
              </ul>
            </div>
          </div>
        </div>
        <SiteMeasureForm />
      </div>
    </section>
  );
}
