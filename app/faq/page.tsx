import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bathroom Renovation FAQ",
  description:
    "Questions about bathroom planning estimates, quote review, waterproofing, strata and site measure.",
  alternates: { canonical: "/faq" }
};

export default function FaqPage() {
  return (
    <section className="page-section">
      <div className="container">
        <p className="pill">FAQ</p>
        <h1>Questions people ask before bathroom quoting.</h1>
        <div className="grid two">
          {[
            ["Is this a confirmed quote?", "No. It is planning guidance only before site measure, selections and written scope confirmation."],
            ["Why do bathroom quotes vary so much?", "Waterproofing, plumbing, electrical, tiling, access, allowances and exclusions can change the written scope."],
            ["Can you review another bathroom quote?", "Yes. The review checks missing inclusions, PC sums, provisional sums, compliance prompts and questions to ask."],
            ["What should I prepare before site measure?", "Photos, plans, quote documents, access notes, strata status and preferred selections."],
            ["Do apartment bathrooms need strata review?", "Often. Work hours, access, lift bookings, waterproofing evidence and class 2 screening may matter."],
            ["Why is waterproofing such a major risk?", "It is hidden once finishes are installed, so scope, evidence and certification should be clarified early."]
          ].map(([question, answer]) => (
            <div className="card" key={question}>
              <h2>{question}</h2>
              <p>{answer}</p>
            </div>
          ))}
        </div>
        <div className="actions" style={{ justifyContent: "flex-start" }}>
          <Link className="button" href="/quote">Start bathroom estimate</Link>
          <Link className="button secondary" href="/quote/review">Review existing quote</Link>
        </div>
      </div>
    </section>
  );
}
