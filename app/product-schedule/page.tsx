import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { ProductScheduleForm } from "@/components/ProductScheduleForm";

export const metadata: Metadata = {
  title: "Bathroom Product Schedule Planner Sydney",
  description:
    "Generate a bathroom product schedule with vanity, basin, tapware, mirror, accessory and PC allowance planning prompts before quote review or site measure.",
  alternates: { canonical: "/product-schedule" },
  openGraph: {
    title: "Operon Bathroom Product Schedule",
    description:
      "Planning guidance for bathroom product selections, PC allowances, quote gaps and site-measure preparation."
  }
};

export default function ProductSchedulePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="pill">Bathroom product intelligence</p>
            <h1>Operon Bathroom Product Schedule</h1>
            <p className="lead">
              Build a planning schedule for vanity, basin, tapware, mirror, accessories and PC
              allowance checks before you compare quotes or request site measure.
            </p>
            <div className="actions" style={{ justifyContent: "flex-start" }}>
              <a className="button" href="#product-schedule-form">
                Generate Bathroom Product Schedule
              </a>
              <Link className="button secondary" href="/quote/review">
                Review My Bathroom Quote
              </Link>
            </div>
            <div className="notice">
              Planning guidance only. This is not checkout, a final quote, legal advice or a
              compliance certificate. Site measure, selections, licensed trade checks and written
              scope confirmation are required before contract pricing.
            </div>
          </div>
          <div className="panel featured">
            <p className="pill">What this creates</p>
            <h2>Product schedule preview</h2>
            <ul className="mini-list">
              <li>Recommended vanity, basin, tapware and mirror categories</li>
              <li>Bathroom accessory pack and product pack options</li>
              <li>PC allowance planning range</li>
              <li>WaterMark/WELS, electrical and installation prompts</li>
              <li>Quote gap flags when quote text is supplied</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container grid three">
          {[
            [
              "Not ecommerce",
              "The MVP recommends product categories and packs. It does not take payment or confirm stock."
            ],
            [
              "Quote-review ready",
              "Use pasted quote text to flag unclear PC items, missing inclusions or WaterMark/WELS prompts."
            ],
            [
              "Builder-ready summary",
              "Use the output as a structured conversation starter before written scope confirmation."
            ]
          ].map(([title, text]) => (
            <article className="card" key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section" id="product-schedule-form">
        <div className="container">
          <ProductScheduleForm />
        </div>
      </section>

      <section className="page-section">
        <div className="container two-col">
          <div>
            <p className="section-kicker">Next step</p>
            <h2>Move from product planning into review or site confirmation.</h2>
            <p>
              Product schedules are most useful when they are checked against the builder quote,
              access, dimensions, waterproofing interfaces and licensed trade scope.
            </p>
          </div>
          <div className="grid">
            {[
              ["Start renovation estimate", "/quote"],
              ["Review existing quote", "/quote/review"],
              ["Request product pack review", "/request-review"],
              ["Prepare site measure", "/site-measure"],
              ["Read cost guide", "/bathroom-renovation-cost-sydney"]
            ].map(([label, href]) => (
              <Link className="card" href={href} key={href}>
                <h3>{label}</h3>
                <p>Continue with planning guidance before contract pricing.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
