import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "Bathroom Quote Checklist | Sydney Renovation Planning",
  description:
    "Use this bathroom quote checklist to clarify inclusions, exclusions, allowances and risk prompts before signing. Planning guidance only.",
  alternates: { canonical: "/guides/bathroom-quote-checklist" },
  openGraph: {
    title: "Bathroom quote checklist",
    description:
      "A planning-only checklist for reviewing bathroom renovation quotes before site measure and written scope confirmation."
  }
};

export default function BathroomQuoteChecklistGuide() {
  const faqItems = [
    {
      question: "What should a bathroom renovation quote include?",
      answer:
        "A bathroom renovation quote should clearly describe scope inclusions, exclusions, allowances, waterproofing prompts, trade scope, GST status, deposit request, timeline assumptions and what needs confirmation before contract pricing."
    },
    {
      question: "Can Operon confirm if my bathroom quote is complete online?",
      answer:
        "No. Operon can provide planning guidance and quote clarity prompts online, but site measure, selections, licensed trade checks and written scope confirmation are required before contract pricing."
    },
    {
      question: "When should I request a bathroom quote review?",
      answer:
        "Request review when waterproofing, PC sums, provisional sums, exclusions, access, strata, asbestos risk or plumbing and electrical scope is unclear before signing."
    }
  ];

  return (
    <section className="page-section">
      <FaqJsonLd items={faqItems} />
      <div className="container">
        <p className="pill">Quote clarity guide</p>
        <h1>Bathroom quote checklist before you commit.</h1>
        <p className="lead">
          Use this checklist to prepare better questions for a bathroom renovation quote. It is
          planning guidance only, not legal advice, and it does not confirm contract pricing.
        </p>

        <div className="notice">
          Site measure, selections, licensed trade checks and written scope confirmation are
          required before contract pricing.
        </div>

        <div className="grid two">
          <div className="card">
            <h2>Scope inclusions to check</h2>
            <ul className="mini-list">
              <li>Demolition, rubbish removal and site protection.</li>
              <li>Waterproofing, certificate prompt and wet-area scope.</li>
              <li>Floor tiling, wall tiling, screed, falls and drainage.</li>
              <li>Plumbing, electrical, ventilation and painting responsibility.</li>
              <li>Shower screen, vanity, toilet, tapware, mirror and accessories.</li>
            </ul>
          </div>
          <div className="card">
            <h2>Commercial details to clarify</h2>
            <ul className="mini-list">
              <li>GST status, deposit request and payment milestones.</li>
              <li>PC sums, provisional sums and selection allowances.</li>
              <li>Exclusions, variation process and timeline assumptions.</li>
              <li>HBC/HBCF prompt where project value may require it.</li>
              <li>Builder licence details and written scope attachments.</li>
            </ul>
          </div>
        </div>

        <div className="grid">
          <div className="card">
            <h2>Questions to ask in writing</h2>
            <p>
              Ask what is included, what is excluded, which allowances are placeholders, which
              items can vary after demolition, and what evidence is needed before site measure.
              Avoid assuming a low total means the same scope is covered.
            </p>
          </div>
          <div className="card">
            <h2>When to request review</h2>
            <p>
              Request review if waterproofing, PC sums, provisional sums, access, strata,
              asbestos risk or service relocation is unclear. Operon will provide general
              planning guidance only.
            </p>
            <div className="actions" style={{ justifyContent: "flex-start" }}>
              <Link className="button" href="/quote/review">Review my bathroom quote</Link>
              <Link className="button secondary" href="/bathroom-renovation-cost-sydney">Read cost guide</Link>
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
