import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { QuoteReviewForm } from "@/components/QuoteReviewForm";

export const metadata: Metadata = {
  title: "Bathroom Quote Review | Identify Missing Inclusions & Risk Flags",
  description:
    "Submit bathroom renovation quote details to get a clarity score, identify missing inclusions, PC sums, provisional sums and compliance prompts before signing.",
  alternates: { canonical: "/quote/review" },
  openGraph: {
    title: "Bathroom quote review and risk checklist",
    description:
      "Review missing inclusions, allowances, waterproofing, strata and compliance prompts before committing."
  }
};

export default function QuoteReviewPage() {
  return (
    <section className="page-section">
      <div className="container two-col">
        <div>
          <p className="pill">Quote review</p>
          <h1>Review your bathroom renovation quote.</h1>
          <p className="lead">
            Have a bathroom renovation quote? Check what may be missing before you commit.
            Operon reviews scope clarity, missing inclusions, PC and provisional sums,
            waterproofing, plumbing/electrical detail, compliance prompts, risk flags and
            next-step readiness.
          </p>
          <div className="notice">
            <p>
              This is a structured quote review for planning guidance only. It is not legal advice,
              does not judge the builder, and does not create contract pricing.
            </p>
          </div>
          <p>
            Not ready to review a quote yet? Start with a <Link href="/request-review">scope review</Link> or prepare a{" "}
            <Link href="/site-measure">site-measure request</Link>.
          </p>
          <p>
            Comparing totals? Read the <Link href="/bathroom-renovation-cost-sydney">Sydney bathroom cost guide</Link>{" "}
            before relying on allowances or exclusions.
          </p>
          <div className="card">
            <h2>What the review checks</h2>
            <ul>
              <li>Missing inclusions, exclusions, GST status and deposit prompts.</li>
              <li>PC sums, provisional sums, waterproofing and trade-scope clarity.</li>
              <li>Questions to clarify in writing before site measure or signing.</li>
            </ul>
          </div>
        </div>
        <QuoteReviewForm />
      </div>
    </section>
  );
}
