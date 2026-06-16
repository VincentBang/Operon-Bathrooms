import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Bathroom Renovation Planning in Sydney",
  description:
    "Use Operon Bathrooms' planning estimate wizard for indicative Sydney bathroom renovation guidance.",
  alternates: { canonical: "/" }
};

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="pill">Phase 1 MVP</p>
            <h1>Bathroom renovation planning before the quote.</h1>
            <p className="lead">
              Operon Bathrooms helps Sydney homeowners frame scope, risks and compliance questions
              before requesting a final site-verified quote.
            </p>
            <div className="actions" style={{ justifyContent: "flex-start" }}>
              <Link className="button" href="/quote">
                Start estimate
              </Link>
              <Link className="button secondary" href="/bathroom-renovation-cost-sydney">
                Read cost guide
              </Link>
            </div>
          </div>
          <div className="panel">
            <h2>Guidance, not a final quote</h2>
            <p>
              The estimate range is based on your answers and broad planning assumptions. A final
              quote requires inspection, product selections, trade review and current compliance
              checks.
            </p>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="container grid">
          {[
            ["Full bathroom renovation", "/services/full-bathroom-renovation"],
            ["Ensuite renovation", "/services/ensuite-renovation"],
            ["Small bathroom renovation", "/services/small-bathroom-renovation"]
          ].map(([title, href]) => (
            <Link className="card" href={href} key={href}>
              <h3>{title}</h3>
              <p>Scope planning, assumptions, risk prompts and next steps for Sydney homes.</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
