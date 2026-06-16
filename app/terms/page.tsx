import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  alternates: { canonical: "/terms" }
};

export default function TermsPage() {
  return (
    <section className="page-section">
      <div className="container">
        <h1>Terms</h1>
        <p>
          Placeholder terms for Operon Bathrooms. Estimate outputs are planning guidance only and
          are not final quotes, contracts, professional reports, building approvals or legal advice.
        </p>
        <p>
          Final scope, timing and pricing require a site inspection, written quote, product
          selections, licence checks and current NSW compliance review.
        </p>
      </div>
    </section>
  );
}
