import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Sydney Bathroom Renovation Estimates and Quote Review",
  description:
    "Get a Sydney bathroom planning estimate, review quote risks and prepare for site measure before contract pricing.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sydney bathroom renovation estimates and quote review",
    description:
      "Planning estimate, quote review and site-measure preparation before bathroom renovation contract pricing."
  }
};

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="pill">Sydney bathroom quote clarity</p>
            <h1>Sydney bathroom renovation estimates and quote review before you commit.</h1>
            <p className="lead">
              Get a planning estimate, review hidden quote risks, and prepare for site measure
              before locking in bathroom renovation pricing.
            </p>
            <div className="actions" style={{ justifyContent: "flex-start" }}>
              <Link className="button" href="/quote">
                Start bathroom estimate
              </Link>
              <Link className="button secondary" href="/quote/review">
                Review existing quote
              </Link>
              <Link className="button ghost" href="/request-review">
                Request review
              </Link>
            </div>
            <div className="notice">
              Planning estimate only. Site measure, selections, licensed trade checks and written
              scope confirmation are required before contract pricing.
            </div>
          </div>
          <div className="panel featured hero-preview">
            <p className="pill">Example only</p>
            <h2>Planning range preview</h2>
            <p className="range-preview">$28k - $46k</p>
            <p>Medium confidence · 74/100</p>
            <ul className="mini-list">
              <li>Waterproofing review</li>
              <li>Plumbing/electrical confirmation</li>
              <li>Site measure required</li>
            </ul>
            <Link className="button" href="/quote">
              Start with your project details
            </Link>
            <p>Example only — actual range depends on scope, selections and site review.</p>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container grid four">
          {[
            "Estimate range, not guesswork",
            "Waterproofing and trade-scope clarity",
            "Photos and plans can improve confidence",
            "NSW compliance-aware prompts"
          ].map((item) => (
            <div className="card" key={item}>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="container two-col">
          <div>
            <p className="section-kicker">Sample estimate output</p>
            <h2>Know what you receive before completing the wizard.</h2>
            <p>
              The summary is designed like a mini planning report, not a vague calculator result.
            </p>
          </div>
          <div className="grid two">
            {[
              ["Planning range", "$28k - $46k example range"],
              ["Confidence score", "74/100 · medium confidence"],
              ["Included scope", "Demolition, waterproofing prompts, tiling and selected trade allowances"],
              ["Assumptions", "Services mostly stay in place and site conditions match supplied details"],
              ["Exclusions", "Hazardous material removal, strata approval and final selections not confirmed"],
              ["Review flags", "Waterproofing, ventilation, HBCF/deposit prompt"],
              ["Next step", "Prepare photos, plans or quote details, then request review or site measure"]
            ].map(([title, text]) => (
              <div className="card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <p className="section-kicker">Choose your path</p>
          <h2>Start from where you are now.</h2>
          <div className="grid four">
            {[
              ["Start bathroom estimate", "/quote", "Build a planning range with confidence score and review flags."],
              ["Review existing quote", "/quote/review", "Check inclusions, exclusions, PC sums and scope risk before comparing totals."],
              ["Request scope review", "/request-review", "Send project details so Operon Bathrooms can prepare the next review step."],
              ["Prepare for site measure", "/site-measure", "Understand what needs checking before written scope and project-specific pricing."]
            ].map(([title, href, text]) => (
              <Link className="card" href={href} key={href}>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="pill">Open</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container two-col">
          <div>
            <p className="section-kicker">Quote clarity</p>
            <h2>How Operon Bathrooms keeps renovation quotes clearer.</h2>
            <p>
              The flow keeps attention on budget range, confidence score, assumptions, exclusions,
              manual review flags, compliance prompts and the recommended next step.
            </p>
            <Link className="button secondary" href="/quote/review">
              Review my quote
            </Link>
          </div>
          <div className="panel">
            <ul className="mini-list">
              <li>Missing inclusions and exclusions</li>
              <li>Allowance and provisional-sum clarity</li>
              <li>Licensed trade prompts</li>
              <li>Waterproofing and strata review flags</li>
              <li>HBC/HBCF and deposit prompts</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <p className="section-kicker">Why bathroom quotes change</p>
          <h2>Bathroom-specific risk factors to clarify before signing.</h2>
          <div className="grid four">
            {[
              "Waterproofing",
              "Tiling height and tile allowance",
              "Screed/falls/drainage",
              "Plumbing relocation",
              "Electrical and ventilation",
              "Demolition and waste",
              "Access, parking, lift bookings and strata",
              "PC sums, provisional sums, exclusions and variation wording"
            ].map((item) => (
              <div className="card" key={item}>
                <h3>{item}</h3>
                <p>This should be confirmed in writing before contract pricing.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <p className="section-kicker">Quote clarity process</p>
          <h2>Move from online planning to written scope confirmation.</h2>
          <div className="grid">
            {[
              ["01", "Describe the project"],
              ["02", "Add bathroom layout and scope"],
              ["03", "Prepare review evidence"],
              ["04", "Review confidence"],
              ["05", "Confirm on site"]
            ].map(([number, title]) => (
              <div className="card" key={number}>
                <p className="pill">{number}</p>
                <h3>{title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <p className="section-kicker">Service paths</p>
          <h2>Bathroom planning paths for different project types.</h2>
          <div className="grid">
            {[
              ["Bathroom refresh", "/services/bathroom-refresh"],
              ["Full bathroom renovation", "/services/full-bathroom-renovation"],
              ["Apartment bathroom", "/services/apartment-bathroom-renovation-sydney"],
              ["Ensuite/small bathroom", "/services/ensuite-renovation"],
              ["Laundry/bathroom combination", "/services/laundry-bathroom-renovation"],
              ["Premium bathroom planning", "/site-measure"]
            ].map(([title, href]) => (
              <Link className="card" href={href} key={title}>
                <h3>{title}</h3>
                <p>Start with scope clarity, risk prompts and site-measure preparation.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <p className="section-kicker">Example only</p>
          <h2>Typical bathroom project profiles.</h2>
          <div className="grid">
            {[
              "Apartment quote review",
              "Family bathroom renovation",
              "Small ensuite estimate",
              "Investment property bathroom refresh",
              "Premium bathroom estimate"
            ].map((title) => (
              <div className="card" key={title}>
                <h3>{title}</h3>
                <p>
                  Example profile only. Actual scope depends on selections, site review and written
                  confirmation.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container two-col">
          <div>
            <p className="section-kicker">Compliance-aware prompts</p>
            <h2>Prompts are built into the planning flow.</h2>
          </div>
          <div className="panel">
            <ul>
              <li>Waterproofing and wet-area review.</li>
              <li>Plumbing/electrical work by licensed trades.</li>
              <li>Apartment and strata access/class 2 screening.</li>
              <li>HBC/HBCF and deposit guidance may require project-specific review.</li>
              <li>Site measure and written scope confirmation required before contract pricing.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <p className="section-kicker">FAQ</p>
          <h2>Questions people ask before bathroom quoting.</h2>
          <div className="grid two">
            {[
              ["Is this a confirmed quote?", "No. It is planning guidance only before site measure and written scope confirmation."],
              ["Why do bathroom quotes vary so much?", "Waterproofing, services, tiling, access, allowances and exclusions can change the written scope."],
              ["Can you review another bathroom quote?", "Yes. The quote review checks clarity, missing inclusions and questions to ask before committing."],
              ["What should I prepare before site measure?", "Photos, plans, quote documents, strata notes, access details and preferred selections."],
              ["Do apartment bathrooms need strata review?", "Often yes. Access, work hours, waterproofing evidence and class 2 triggers may need review."],
              ["Why is waterproofing such a major risk?", "It sits behind finished surfaces and must be scoped, installed and documented correctly."]
            ].map(([question, answer]) => (
              <div className="card" key={question}>
                <h3>{question}</h3>
                <p>{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hero">
        <div className="container two-col">
          <div>
            <p className="section-kicker">Ready when you are</p>
            <h2>Start with a planning estimate, then confirm written scope.</h2>
            <p>
              Choose the path that fits what you already have. Contract pricing comes after site
              measure, selections, licensed trade checks and written scope confirmation.
            </p>
          </div>
          <div className="actions" style={{ justifyContent: "flex-start" }}>
            <Link className="button" href="/quote">Start bathroom estimate</Link>
            <Link className="button secondary" href="/quote/review">Review existing quote</Link>
            <Link className="button ghost" href="/request-review">Request review</Link>
            <Link className="button ghost" href="/site-measure">Prepare for site measure</Link>
            <Link className="button ghost" href="/bathroom-renovation-cost-sydney">Read cost guide</Link>
          </div>
        </div>
      </section>
    </>
  );
}
