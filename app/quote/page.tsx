import type { Metadata } from "next";
import { QuoteWizard } from "@/components/QuoteWizard";

export const metadata: Metadata = {
  title: "Planning Estimate Wizard",
  description:
    "Answer bathroom renovation planning questions and receive a guidance-only estimate range and confidence score.",
  alternates: { canonical: "/quote" }
};

export default function QuotePage() {
  return (
    <section className="page-section">
      <div className="container">
        <p className="pill">Planning estimate wizard</p>
        <h1>Plan your bathroom renovation estimate</h1>
        <p className="lead">
          This wizard produces planning guidance only. It does not provide a final quote or legal
          advice, and all NSW compliance prompts should be checked against current requirements.
        </p>
        <QuoteWizard />
      </div>
    </section>
  );
}
