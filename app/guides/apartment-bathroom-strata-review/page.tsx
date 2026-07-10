import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { FaqJsonLd } from "@/components/FaqJsonLd";

export const metadata: Metadata = {
  title: "Apartment Bathroom Strata Guide",
  description:
    "Plan apartment bathroom renovation questions around strata, access, waterproofing, Class 2 prompts and site-measure readiness.",
  alternates: { canonical: "/guides/apartment-bathroom-strata-review" },
  openGraph: {
    title: "Apartment bathroom strata review",
    description:
      "Planning prompts for apartment bathroom quote review, strata access and site-measure preparation."
  }
};

export default function ApartmentBathroomStrataReviewGuide() {
  const faqItems = [
    {
      question: "Do apartment bathrooms need strata review before renovation?",
      answer:
        "Many apartment bathroom projects should clarify strata approval, access, work hours, lift bookings and building rules before committing. This is planning guidance only, not legal advice."
    },
    {
      question: "Can Class 2 or DBP requirements be confirmed online?",
      answer:
        "No. Online planning can prompt questions, but project-specific Class 2 or DBP obligations need appropriate professional review and written confirmation."
    },
    {
      question: "What should I prepare for an apartment bathroom site measure?",
      answer:
        "Prepare photos, quote documents, strata notes, access details, lift or parking constraints, known leak or mould issues and preferred selections."
    }
  ];

  return (
    <section className="page-section">
      <FaqJsonLd items={faqItems} />
      <div className="container">
        <p className="pill">Apartment guide</p>
        <h1>Apartment bathroom strata review before renovation.</h1>
        <p className="lead">
          Apartment and strata bathrooms can involve access, approval, waterproofing and building
          class prompts that affect quote certainty. This page is general planning guidance only,
          not legal advice.
        </p>

        <div className="grid two">
          <div className="card">
            <h2>Strata and access prompts</h2>
            <ul className="mini-list">
              <li>Strata approval status, by-law prompts and work-hour limits.</li>
              <li>Lift bookings, stairs, parking, loading and rubbish removal path.</li>
              <li>Neighbour, noise, common-area and protection requirements.</li>
              <li>Class 2 and DBP screening prompts where relevant to the scope.</li>
            </ul>
          </div>
          <div className="card">
            <h2>Quote risk prompts</h2>
            <ul className="mini-list">
              <li>Waterproofing scope and evidence.</li>
              <li>Plumbing access and floor waste changes.</li>
              <li>Ventilation, electrical and fire-safety interface prompts.</li>
              <li>Hidden substrate, leak or mould risks.</li>
            </ul>
          </div>
        </div>

        <div className="notice">
          Online guidance cannot confirm strata approval, Class 2 triggers, waterproofing
          condition or access constraints. Confirm these through the appropriate written review
          and site checks.
        </div>

        <div className="grid">
          <div className="card">
            <h2>Best next step</h2>
            <p>
              If the quote does not mention strata, access or waterproofing evidence, request
              review before committing to the scope.
            </p>
            <div className="actions" style={{ justifyContent: "flex-start" }}>
              <Link className="button" href="/request-review">Request apartment scope review</Link>
              <Link className="button secondary" href="/quote/review">Review existing quote</Link>
              <Link className="button ghost" href="/services/apartment-bathroom-renovation-sydney">Apartment service page</Link>
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
