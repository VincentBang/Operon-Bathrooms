import type { Metadata } from "next";
import Link from "next/link";
import { QuoteWizard } from "@/components/QuoteWizard";

export const metadata: Metadata = {
  title: "Bathroom Renovation Estimate Quote Wizard",
  description:
    "Get a bathroom renovation planning estimate in minutes. Answer questions about size, property type, age, layout changes and finishes to receive a planning range and confidence score.",
  alternates: { canonical: "/quote" },
  openGraph: {
    title: "Bathroom renovation estimate wizard",
    description:
      "Planning range, confidence score and bathroom-specific risk prompts before site measure."
  }
};

export default function QuotePage() {
  return (
    <section className="page-section">
      <div className="container">
        <p className="pill">Estimate</p>
        <h1>Start your bathroom planning estimate.</h1>
        <p className="lead">
          This wizard produces planning guidance only. It does not provide contract pricing or legal
          advice, and all NSW compliance prompts should be checked against current requirements.
        </p>
        <div className="actions" style={{ justifyContent: "flex-start" }}>
          <Link className="button secondary" href="/quote/review">Review an existing quote</Link>
          <Link className="button ghost" href="/bathroom-renovation-cost-sydney">Read the cost guide</Link>
          <Link className="button ghost" href="/site-measure">Prepare site measure</Link>
        </div>
        <QuoteWizard />
      </div>
    </section>
  );
}
