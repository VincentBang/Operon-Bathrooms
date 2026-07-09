import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { FaqJsonLd } from "@/components/FaqJsonLd";

const contractsSource = "https://www.nsw.gov.au/housing-and-construction/building-or-renovating-a-home/preparing/contracts";

export const metadata: Metadata = {
  title: "Bathroom Deposit Limit NSW | Quote Review Prompt",
  description:
    "Planning prompt for checking bathroom renovation deposit requests in NSW. Clarify before signing. Not legal advice.",
  alternates: { canonical: "/guides/bathroom-deposit-limit-nsw" },
  openGraph: {
    title: "Bathroom deposit limit NSW",
    description:
      "Planning guidance for checking deposit requests in NSW bathroom renovation quotes."
  }
};

export default function BathroomDepositLimitGuide() {
  const faqItems = [
    {
      question: "What deposit prompt should I check in NSW?",
      answer:
        "NSW Government guidance says the deposit must not exceed 10% of the contract price. Confirm current rules directly and clarify any deposit request before signing."
    },
    {
      question: "Is a high deposit request automatically wrong?",
      answer:
        "Operon does not make legal conclusions. Treat a high or unclear deposit request as something to clarify in writing before signing or paying."
    },
    {
      question: "What should I prepare before quote review?",
      answer:
        "Prepare the quote, deposit amount, payment milestones, HBC/HBCF mention, exclusions, PC sums, provisional sums and any contract documents."
    }
  ];

  return (
    <section className="page-section">
      <FaqJsonLd items={faqItems} />
      <div className="container">
        <p className="pill">Payment prompt guide</p>
        <h1>Bathroom renovation deposit prompts in NSW.</h1>
        <p className="lead">
          A deposit request can affect quote confidence. This guide helps you identify what to
          clarify before signing. It is planning guidance only, not legal advice.
        </p>
        <div className="notice">
          NSW Government guidance says the deposit must not exceed 10% of the contract price.
          Always check current rules and contract documents before paying.
        </div>
        <div className="grid two">
          <div className="card">
            <h2>What to clarify</h2>
            <ul className="mini-list">
              <li>Deposit amount and percentage of the contract price.</li>
              <li>Progress payment schedule and what work each stage represents.</li>
              <li>Whether HBC/HBCF cover is required before deposit or payment.</li>
              <li>What happens if scope, selections or hidden conditions change.</li>
            </ul>
          </div>
          <div className="card">
            <h2>Official reference</h2>
            <p>
              Read NSW Government contract guidance and seek independent advice if anything in a
              contract is unclear. Operon can help prepare quote-review questions only.
            </p>
            <a className="button secondary" href={contractsSource}>Read NSW contracts guidance</a>
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
        <Link className="button" href="/quote/review">Review my quote before paying</Link>
      </div>
    </section>
  );
}
