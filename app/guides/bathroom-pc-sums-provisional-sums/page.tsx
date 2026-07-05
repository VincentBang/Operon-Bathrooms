import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "Bathroom PC Sums and Provisional Sums | Quote Clarity",
  description:
    "Learn how PC sums and provisional sums affect bathroom quote certainty and what to clarify before signing.",
  alternates: { canonical: "/guides/bathroom-pc-sums-provisional-sums" },
  openGraph: {
    title: "Bathroom PC sums and provisional sums",
    description:
      "Planning-only guide to bathroom quote allowances, selections and hidden-condition prompts."
  }
};

export default function BathroomAllowancesGuide() {
  const faqItems = [
    {
      question: "What is a PC sum in a bathroom quote?",
      answer:
        "A PC sum is commonly used for selectable products or finishes, such as vanity, tapware, toilet, tiles, mirror or accessories. Confirm whether the allowance matches the finish level you expect."
    },
    {
      question: "What is a provisional sum in a bathroom quote?",
      answer:
        "A provisional sum is commonly used where work cannot be fully known until inspection or demolition, such as substrate repair, plumbing changes, access constraints or hidden conditions."
    },
    {
      question: "How do I compare bathroom quotes with allowances?",
      answer:
        "Compare the written scope, exclusions and assumptions before comparing totals. Allowances can change quote certainty, and online guidance is not contract pricing."
    }
  ];

  return (
    <section className="page-section">
      <FaqJsonLd items={faqItems} />
      <div className="container">
        <p className="pill">Allowance guide</p>
        <h1>PC sums and provisional sums in bathroom renovation quotes.</h1>
        <p className="lead">
          Allowances can make bathroom quotes difficult to compare. This guide explains what to
          clarify in writing before signing. It does not expose internal rates or provide final
          pricing.
        </p>

        <div className="grid two">
          <div className="card">
            <h2>PC sums</h2>
            <p>
              PC sums often relate to selectable fixtures or finishes, such as vanity, basin,
              tapware, mirror, toilet, accessories, shower screen or tiles. Ask whether the
              allowance matches the finish level you expect.
            </p>
          </div>
          <div className="card">
            <h2>Provisional sums</h2>
            <p>
              Provisional sums often relate to work that cannot be fully known until inspection
              or demolition, such as substrate repair, plumbing changes, access work or hidden
              conditions. Clarify what evidence will convert the allowance into written scope.
            </p>
          </div>
        </div>

        <div className="grid">
          <div className="card">
            <h2>Allowance questions</h2>
            <ul className="mini-list">
              <li>Which items are allowances rather than fixed inclusions?</li>
              <li>What happens if selections exceed the allowance?</li>
              <li>Are tile, fixture and accessory allowances clearly separated?</li>
              <li>Are waterproofing, plumbing and electrical assumptions written down?</li>
              <li>Are exclusions and variation rules easy to compare?</li>
            </ul>
          </div>
          <div className="card">
            <h2>Compare the quote safely</h2>
            <p>
              Do not compare two bathroom quote totals until the allowances, exclusions and
              hidden-condition assumptions are clear. A lower total can still carry more
              uncertainty.
            </p>
            <div className="actions" style={{ justifyContent: "flex-start" }}>
              <Link className="button" href="/quote/review">Check my quote allowances</Link>
              <Link className="button secondary" href="/product-schedule">Build product schedule</Link>
              <Link className="button ghost" href="/bathroom-renovation-cost-sydney">Read cost guide</Link>
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
