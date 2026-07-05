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
            [
              "Bathroom quote checklist",
              "Inclusions, exclusions, allowances and commercial prompts to clarify before signing.",
              "/guides/bathroom-quote-checklist"
            ],
            [
              "PC sums and provisional sums",
              "Allowance wording can affect certainty when selections or hidden conditions are unclear.",
              "/guides/bathroom-pc-sums-provisional-sums"
            ],
            [
              "Waterproofing and bathroom quotes",
              "Wet-area scope, evidence and certificates should be clarified in writing.",
              "/guides/waterproofing-and-bathroom-quotes"
            ],
            [
              "Apartment bathroom strata review",
              "Access, work hours, lift bookings and Class 2 screening may need review.",
              "/guides/apartment-bathroom-strata-review"
            ],
            [
              "Bathroom site measure checklist",
              "Photos, access notes, quote documents and site-condition prompts to prepare.",
              "/guides/site-measure-checklist"
            ],
            [
              "Bathroom renovation process",
              "How online planning, quote review and site measure fit together.",
              "/how-it-works"
            ]
          ].map(([title, text, href]) => (
            <div className="card" key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
              <Link className="button secondary" href={href}>
                Open guide
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
