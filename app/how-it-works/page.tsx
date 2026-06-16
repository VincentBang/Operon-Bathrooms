import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How Operon Bathrooms turns planning inputs into guidance-only estimate ranges before any final quote.",
  alternates: { canonical: "/how-it-works" }
};

export default function HowItWorksPage() {
  return (
    <section className="page-section">
      <div className="container two-col">
        <div>
          <p className="pill">Process</p>
          <h1>How it works</h1>
          <p className="lead">
            The MVP helps homeowners organise early project information. It does not replace a site
            inspection, written quote, contract or compliance advice.
          </p>
          <Link className="button" href="/quote">
            Start planning estimate
          </Link>
        </div>
        <div className="panel">
          <ol>
            <li>Answer scope, property, services, finishes and access questions.</li>
            <li>Receive an indicative planning range and confidence score.</li>
            <li>Review assumptions, exclusions, risk flags and NSW compliance prompts.</li>
            <li>Book a site review before any final quote or contract discussion.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
