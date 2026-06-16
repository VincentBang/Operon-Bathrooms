import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sydney Bathroom Renovation Areas",
  description:
    "Sydney-wide bathroom planning, quote review and site-measure preparation without thin suburb pages.",
  alternates: { canonical: "/areas" }
};

export default function AreasPage() {
  return (
    <section className="page-section">
      <div className="container two-col">
        <div>
          <p className="pill">Sydney areas</p>
          <h1>Sydney bathroom quote support by project context.</h1>
          <p className="lead">
            Operon Bathrooms supports Sydney homeowners with estimate planning, quote review and
            site-measure preparation. Area-specific pages will wait until each page can be useful
            and unique.
          </p>
          <div className="actions" style={{ justifyContent: "flex-start" }}>
            <Link className="button" href="/quote">Start estimate</Link>
            <Link className="button secondary" href="/site-measure">Prepare site measure</Link>
          </div>
        </div>
        <div className="panel">
          <h2>Project contexts</h2>
          <ul>
            <li>Houses and family bathrooms.</li>
            <li>Apartment and strata bathrooms.</li>
            <li>Ensuites and small bathrooms.</li>
            <li>Investment property refreshes.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
