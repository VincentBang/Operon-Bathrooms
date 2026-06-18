import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bathroom Renovation Guides",
  description:
    "Bathroom renovation process, waterproofing, allowances, strata and quote clarity guides for Sydney planning.",
  alternates: { canonical: "/guides" }
};

export default function GuidesPage() {
  return (
    <section className="page-section">
      <div className="container">
        <p className="pill">Guides</p>
        <h1>Bathroom renovation guides for clearer scope.</h1>
        <p className="lead">
          Practical planning notes for reading bathroom quotes, preparing site measure and
          confirming written scope. Guidance only, not legal advice.
        </p>
        <div className="grid two">
          {[
            ["Bathroom renovation process", "How online planning, quote review and site measure fit together."],
            ["PC sums and provisional sums", "Allowance wording can affect certainty when selections or hidden conditions are unclear.", "allowances"],
            ["Waterproofing and bathroom quotes", "Wet-area scope, evidence and certificates should be clarified in writing.", "waterproofing"],
            ["Apartment bathroom strata review", "Access, work hours, lift bookings and class 2 screening may need review.", "strata"],
            ["Bathroom renovation glossary", "Terms to clarify before comparing quote totals."],
            ["Bathroom quote questions", "Questions to ask before signing or paying a deposit."]
          ].map(([title, text, id]) => (
            <div className="card" id={id} key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
              <Link className="button secondary" href="/quote/review">
                Review a quote
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
