import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { FaqJsonLd } from "@/components/FaqJsonLd";

const contractsSource = "https://www.nsw.gov.au/housing-and-construction/building-or-renovating-a-home/preparing/contracts";

export const metadata: Metadata = {
  title: "Bathroom Renovation Licence NSW | Planning Prompt",
  description:
    "Bathroom renovation licence prompts for NSW quote review. Check current rules and written scope before signing. Not legal advice.",
  alternates: { canonical: "/guides/bathroom-renovation-licence-nsw" },
  openGraph: {
    title: "Bathroom renovation licence NSW",
    description:
      "Planning prompts for checking licence details in bathroom renovation quotes before signing."
  }
};

export default function BathroomRenovationLicenceGuide() {
  const faqItems = [
    {
      question: "When should licence details be checked for NSW bathroom work?",
      answer:
        "NSW Government guidance says written contracts are required for residential building work over $5,000 including GST, or when reasonable labour and material cost exceeds $5,000. Check current licence details before signing."
    },
    {
      question: "Can Operon confirm a contractor licence online?",
      answer:
        "No. Operon can prompt what to check, but licence status should be checked through the official NSW licence check and confirmed in writing before committing."
    },
    {
      question: "What should a bathroom quote include about licence details?",
      answer:
        "The quote or contract should make the contracting party, licence name, licence number, scope and written assumptions clear before contract pricing."
    }
  ];

  return (
    <section className="page-section">
      <FaqJsonLd items={faqItems} />
      <div className="container">
        <p className="pill">NSW prompt guide</p>
        <h1>Bathroom renovation licence prompts in NSW.</h1>
        <p className="lead">
          Use this page as a planning checklist for bathroom quote review. It is not legal advice
          and does not confirm licence status online.
        </p>
        <div className="grid two">
          <div className="card">
            <h2>What to check</h2>
            <ul className="mini-list">
              <li>Contractor or company name matches the written quote or contract.</li>
              <li>Licence number is stated clearly where required.</li>
              <li>Scope, plans, specifications and exclusions are attached or referenced.</li>
              <li>Bathroom trades, waterproofing and electrical/plumbing responsibility are clear.</li>
            </ul>
          </div>
          <div className="card">
            <h2>Official reference</h2>
            <p>
              NSW Government guidance says written contracts are needed for residential building
              work over $5,000 including GST, or where reasonable labour and material cost exceeds
              that amount. Check current rules directly with NSW Government before signing.
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
        <div className="actions" style={{ justifyContent: "flex-start" }}>
          <Link className="button" href="/quote/review">Review my bathroom quote</Link>
          <Link className="button secondary" href="/site-measure">Prepare site measure</Link>
        </div>
      </div>
    </section>
  );
}
