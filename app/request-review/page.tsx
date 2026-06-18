import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { RequestReviewForm } from "@/components/RequestReviewForm";

export const metadata: Metadata = {
  title: "Bathroom Scope Review Request",
  description:
    "Request a planning review of bathroom photos, plans, ideas or renovation scope before quote review or site measure.",
  alternates: { canonical: "/request-review" },
  openGraph: {
    title: "Bathroom scope review request",
    description: "Request planning guidance for photos, plans, ideas or bathroom renovation scope."
  }
};

export default function RequestReviewPage() {
  return (
    <section className="page-section">
      <div className="container two-col">
        <div>
          <p className="pill">Request review</p>
          <h1>Request a bathroom scope review.</h1>
          <p className="lead">
            Share where you are up to, what information you have, and what you need clarified before
            moving toward quote review, site measure, selections and written scope confirmation.
          </p>
          <p>
            This request creates planning guidance only. It does not create contract pricing or
            replace a site inspection.
          </p>
          <p>
            Already have a builder quote? Use the <Link href="/quote/review">quote review</Link> intake.
            If you are closer to inspection, prepare a <Link href="/site-measure">site measure</Link>.
          </p>
          <div className="grid two">
            <div className="card">
              <h2>What Operon reviews</h2>
              <ul>
                <li>Photos, plans, ideas or early scope notes.</li>
                <li>Bathroom type, project stage, budget range and timing.</li>
                <li>Whether quote review or site measure is the right next step.</li>
              </ul>
            </div>
            <div className="card">
              <h2>Prepare next</h2>
              <ul>
                <li>Photos of the bathroom and access path.</li>
                <li>Plans, strata notes or builder quote if available.</li>
                <li>Known issues such as leaks, mould, asbestos concern or access constraints.</li>
              </ul>
            </div>
          </div>
        </div>
        <RequestReviewForm />
      </div>
    </section>
  );
}
