import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Bathroom Site Measure Checklist | Sydney Planning",
  description:
    "Prepare photos, access notes, quote documents and bathroom scope questions before a site measure. Planning guidance only.",
  alternates: { canonical: "/guides/site-measure-checklist" },
  openGraph: {
    title: "Bathroom site measure checklist",
    description:
      "Evidence and access checklist for bathroom site-measure preparation before contract pricing."
  }
};

export default function SiteMeasureChecklistGuide() {
  return (
    <section className="page-section">
      <div className="container">
        <p className="pill">Site measure guide</p>
        <h1>Bathroom site measure checklist.</h1>
        <p className="lead">
          A site measure helps turn online planning into a more reliable written scope. It is still
          not a contract price until selections, licensed trade checks and written confirmation are
          complete.
        </p>

        <div className="grid two">
          <div className="card">
            <h2>What to prepare</h2>
            <ul className="mini-list">
              <li>Photos of the whole bathroom, shower, vanity, toilet, ceiling and access path.</li>
              <li>Existing quote, plans, strata notes or builder correspondence if available.</li>
              <li>Known leaks, mould, ventilation, asbestos concern or age of building.</li>
              <li>Preferred fixture style, finish level and product schedule notes.</li>
              <li>Parking, lift, stairs, loading and work-hour constraints.</li>
            </ul>
          </div>
          <div className="card">
            <h2>What online estimates cannot confirm</h2>
            <ul className="mini-list">
              <li>Waterproofing condition, substrate condition and falls.</li>
              <li>Plumbing access, electrical condition and ventilation suitability.</li>
              <li>Asbestos status, strata approval and Class 2/DBP triggers.</li>
              <li>Access, parking, demolition path and site-specific risks.</li>
            </ul>
          </div>
        </div>

        <div className="grid">
          <div className="card">
            <h2>Request the right review</h2>
            <p>
              If you already have a quote, start with quote review. If you have early photos,
              plans or ideas, request scope review. If you are ready for an inspection, request
              site measure.
            </p>
            <div className="actions" style={{ justifyContent: "flex-start" }}>
              <Link className="button" href="/site-measure">Request site measure</Link>
              <Link className="button secondary" href="/request-review">Request scope review</Link>
              <Link className="button ghost" href="/quote/review">Review quote</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
