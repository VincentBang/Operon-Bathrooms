import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { FaqJsonLd } from "@/components/FaqJsonLd";

const contractsSource = "https://www.nsw.gov.au/housing-and-construction/building-or-renovating-a-home/preparing/contracts";

export const metadata: Metadata = {
  title: "HBCF Insurance for Bathroom Renovations | NSW Prompt",
  description:
    "Planning prompt for Home Building Compensation cover in NSW bathroom renovation quotes. Check current rules before signing.",
  alternates: { canonical: "/guides/home-building-compensation-insurance-bathrooms" },
  openGraph: {
    title: "HBCF insurance for bathroom renovations",
    description:
      "Planning prompts for HBC/HBCF cover in NSW bathroom renovation quote review."
  }
};

export default function HomeBuildingCompensationGuide() {
  const faqItems = [
    {
      question: "When should HBC/HBCF be checked for a bathroom renovation?",
      answer:
        "NSW Government guidance says jobs over $20,000 require home building compensation cover. Check current rules and ask for evidence before signing or paying."
    },
    {
      question: "Can Operon confirm HBC/HBCF cover online?",
      answer:
        "No. Operon can prompt what to ask, but HBC/HBCF cover and certificate validity should be checked through official channels and written documentation."
    },
    {
      question: "What quote details help HBC/HBCF review?",
      answer:
        "Prepare contract value, builder details, quote scope, payment schedule, deposit request and whether an insurance certificate is mentioned."
    }
  ];

  return (
    <section className="page-section">
      <FaqJsonLd items={faqItems} />
      <div className="container">
        <p className="pill">Insurance prompt guide</p>
        <h1>HBCF insurance prompts for bathroom renovations.</h1>
        <p className="lead">
          Home Building Compensation prompts matter when a bathroom renovation quote approaches or
          exceeds relevant NSW thresholds. This is planning guidance only, not legal advice or
          insurance verification.
        </p>
        <div className="grid two">
          <div className="card">
            <h2>What to ask</h2>
            <ul className="mini-list">
              <li>Does the contract value trigger HBC/HBCF cover under current NSW rules?</li>
              <li>Is the certificate mentioned before deposit or payment?</li>
              <li>Do builder details match the quote and contract documents?</li>
              <li>Are progress payments tied to work actually completed?</li>
            </ul>
          </div>
          <div className="card">
            <h2>Official reference</h2>
            <p>
              NSW Government guidance says jobs over $20,000 should have home building
              compensation cover. Check current guidance and certificate validity directly.
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
          <Link className="button" href="/quote/review">Review HBC/HBCF prompt</Link>
          <Link className="button secondary" href="/bathroom-renovation-cost-sydney">Read cost guide</Link>
        </div>
      </div>
    </section>
  );
}
