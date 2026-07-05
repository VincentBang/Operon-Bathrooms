import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "Waterproofing and Bathroom Quotes | NSW Planning Guide",
  description:
    "Understand why waterproofing scope and certificate prompts matter in bathroom renovation quotes. Planning guidance only, not legal advice.",
  alternates: { canonical: "/guides/waterproofing-and-bathroom-quotes" },
  openGraph: {
    title: "Waterproofing and bathroom quotes",
    description:
      "Waterproofing quote prompts for Sydney bathroom planning, review and site-measure preparation."
  }
};

export default function WaterproofingBathroomQuotesGuide() {
  const faqItems = [
    {
      question: "Should waterproofing be mentioned in a bathroom quote?",
      answer:
        "Yes, waterproofing scope, wet-area coverage, responsibility and certificate prompts should be clarified in writing. Online guidance cannot certify compliance."
    },
    {
      question: "Can waterproofing condition be confirmed online?",
      answer:
        "No. Waterproofing condition, substrate, falls, leaks and hidden site issues require site inspection and appropriate licensed trade checks."
    },
    {
      question: "What should I do if waterproofing is unclear in my quote?",
      answer:
        "Clarify it before signing. Quote review or scope review can help prepare questions, but contract pricing still requires site measure, selections and written scope confirmation."
    }
  ];

  return (
    <section className="page-section">
      <FaqJsonLd items={faqItems} />
      <div className="container">
        <p className="pill">Waterproofing guide</p>
        <h1>Bathroom waterproofing and quote clarity.</h1>
        <p className="lead">
          Waterproofing is one of the highest-risk bathroom quote items because it sits behind
          finishes and depends on site condition. This page is planning guidance only and does not
          certify compliance.
        </p>

        <div className="grid two">
          <div className="card">
            <h2>What the quote should make clear</h2>
            <ul className="mini-list">
              <li>Whether waterproofing is included in the bathroom scope.</li>
              <li>Which wet areas are included and whether walls are covered as expected.</li>
              <li>Whether a waterproofing certificate or evidence is mentioned.</li>
              <li>How demolition findings, substrate condition or leaks will be handled.</li>
              <li>Whether responsibility sits with a licensed or suitably qualified trade.</li>
            </ul>
          </div>
          <div className="card">
            <h2>Why it affects quote certainty</h2>
            <p>
              Leaks, mould, damaged substrate, unclear falls and hidden conditions can change the
              written scope after inspection. Confirm assumptions before signing and avoid relying
              on online guidance for waterproofing status.
            </p>
          </div>
        </div>

        <div className="notice">
          NSW bathroom projects should be checked against current rules by the appropriate
          licensed professionals. Operon does not provide legal advice or online compliance
          certification.
        </div>

        <div className="grid">
          <div className="card">
            <h2>Useful next step</h2>
            <p>
              If waterproofing is missing, vague or tied to provisional sums, use quote review or
              request a scope review before committing.
            </p>
            <div className="actions" style={{ justifyContent: "flex-start" }}>
              <Link className="button" href="/quote/review">Review my bathroom quote</Link>
              <Link className="button secondary" href="/request-review">Request scope review</Link>
              <Link className="button ghost" href="/site-measure">Prepare site measure</Link>
            </div>
          </div>
        </div>
        <div className="grid two">
          {faqItems.map((item) => (
            <div className="card" key={item.question}>
              <h2>{item.question}</h2>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
