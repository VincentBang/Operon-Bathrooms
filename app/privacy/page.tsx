import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" }
};

export default function PrivacyPage() {
  return (
    <section className="page-section">
      <div className="container">
        <h1>Privacy policy</h1>
        <p>
          Placeholder policy for Operon Bathrooms. The planning estimate wizard may collect contact
          details, project answers, suburb, risk prompts and estimate results so the team can follow
          up about bathroom renovation services.
        </p>
        <p>
          Do not enter sensitive personal information into the MVP. Supabase storage is configurable
          for local development and should be reviewed before production use.
        </p>
      </div>
    </section>
  );
}
