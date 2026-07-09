import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { FaqJsonLd } from "@/components/FaqJsonLd";

const contractsSource = "https://www.nsw.gov.au/housing-and-construction/building-or-renovating-a-home/preparing/contracts";
const providerSource = "https://www.nsw.gov.au/housing-and-construction/compliance-and-regulation/your-obligations-to-your-customers/guide-to-providing-home-building-contracts";

export const metadata: Metadata = {
  title: "Bathroom Compliance NSW | Planning Prompts",
  description:
    "NSW bathroom renovation planning prompts for contracts, licence checks, HBC/HBCF, deposits, waterproofing and strata. Not legal advice.",
  alternates: { canonical: "/guides/bathroom-compliance-nsw" },
  openGraph: {
    title: "Bathroom compliance NSW planning prompts",
    description:
      "Planning-only prompts for NSW bathroom quote review and site-measure readiness."
  }
};

export default function BathroomComplianceNswGuide() {
  const faqItems = [
    {
      question: "Can Operon confirm bathroom compliance online?",
      answer:
        "No. Operon provides planning prompts only. Site measure, selections, licensed trade checks, official rule checks and written scope confirmation are required before contract pricing."
    },
    {
      question: "Which NSW prompts should a bathroom quote review include?",
      answer:
        "Check licence details, written contract threshold, deposit request, HBC/HBCF cover, waterproofing evidence, strata or Class 2 prompts, progress payments and variations."
    },
    {
      question: "Where should I check current NSW contract rules?",
      answer:
        "Use official NSW Government contract and Building Commission guidance, and seek independent advice where contract terms are unclear."
    }
  ];

  return (
    <section className="page-section">
      <FaqJsonLd items={faqItems} />
      <div className="container">
        <p className="pill">NSW planning prompts</p>
        <h1>Bathroom compliance prompts for NSW quote review.</h1>
        <p className="lead">
          Bathroom renovations can involve licensing, contracts, deposits, waterproofing, HBC/HBCF,
          strata, Class 2 and trade-scope prompts. This page helps frame questions only. It is not
          legal advice or compliance certification.
        </p>
        <div className="grid two">
          <div className="card">
            <h2>Quote review prompts</h2>
            <ul className="mini-list">
              <li>Written contract and licence details where thresholds apply.</li>
              <li>Deposit request, progress payments and variation wording.</li>
              <li>HBC/HBCF cover prompt where project value may require it.</li>
              <li>Waterproofing, plumbing, electrical and ventilation responsibility.</li>
              <li>Apartment, strata, access, Class 2 or DBP screening prompts.</li>
            </ul>
          </div>
          <div className="card">
            <h2>Official references</h2>
            <p>
              Check current rules directly with NSW Government. Operon can help identify questions
              to ask, but cannot provide legal advice.
            </p>
            <div className="actions" style={{ justifyContent: "flex-start" }}>
              <a className="button secondary" href={contractsSource}>Owner contract guidance</a>
              <a className="button ghost" href={providerSource}>Provider contract guidance</a>
            </div>
          </div>
        </div>
        <div className="notice">
          Public planning reminder: contractor licensing above $5k, deposit limit prompts around
          10%, and HBC/HBCF cover above $20k should be checked against current NSW rules before
          signing. This is not legal advice.
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
