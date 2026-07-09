import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "Bathroom Quote vs Estimate | Sydney Planning Guide",
  description:
    "Understand the difference between bathroom estimates, quote review and contract pricing. Planning guidance only.",
  alternates: { canonical: "/guides/bathroom-quote-vs-estimate" },
  openGraph: {
    title: "Bathroom quote vs estimate",
    description:
      "Planning-only guide to bathroom estimate ranges, quote review and site-measure readiness."
  }
};

export default function BathroomQuoteVsEstimateGuide() {
  const faqItems = [
    {
      question: "Is an online bathroom estimate a final quote?",
      answer:
        "No. An online bathroom estimate is planning guidance only. Site measure, selections, licensed trade checks and written scope confirmation are required before contract pricing."
    },
    {
      question: "When should I use quote review instead of an estimate?",
      answer:
        "Use quote review when you already have a builder quote and need to clarify inclusions, exclusions, allowances, risk prompts and site-measure readiness."
    },
    {
      question: "What makes a bathroom quote more certain?",
      answer:
        "A quote is easier to compare when scope, waterproofing, selections, PC sums, provisional sums, exclusions, GST status, access and written assumptions are clear."
    }
  ];

  return (
    <section className="page-section">
      <FaqJsonLd items={faqItems} />
      <div className="container">
        <p className="pill">Quote clarity guide</p>
        <h1>Bathroom quote vs estimate: know the difference.</h1>
        <p className="lead">
          A planning estimate helps you understand likely scope drivers. A quote review helps you
          compare written inclusions and risks. Neither replaces site measure, selections, licensed
          trade checks or written scope confirmation.
        </p>
        <div className="grid two">
          <div className="card">
            <h2>Planning estimate</h2>
            <p>
              Use an estimate when you are still shaping budget, scope and risk questions. It can
              produce a planning range and confidence score, but it is not contract pricing.
            </p>
            <Link className="button secondary" href="/quote">Start planning estimate</Link>
          </div>
          <div className="card">
            <h2>Quote review</h2>
            <p>
              Use quote review when you have a written builder quote and want to clarify missing
              inclusions, exclusions, allowances, waterproofing, deposit and HBC/HBCF prompts.
            </p>
            <Link className="button secondary" href="/quote/review">Review my quote</Link>
          </div>
        </div>
        <div className="notice">
          Operon provides planning guidance only. It does not provide legal advice, online
          compliance certification or contract-pricing promises.
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
