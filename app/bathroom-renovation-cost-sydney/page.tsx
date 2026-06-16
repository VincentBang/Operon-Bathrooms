import type { Metadata } from "next";
import { SeoPage } from "@/components/SeoPage";
import React from "react";

export const metadata: Metadata = {
  title: "Bathroom Renovation Cost Sydney",
  description:
    "A planning-first Sydney bathroom renovation cost guide with scope variables, risk prompts and an indicative estimate wizard.",
  alternates: { canonical: "/bathroom-renovation-cost-sydney" }
};

export default function CostGuidePage() {
  return (
    <SeoPage
      title="Bathroom renovation cost Sydney"
      intro="Use this guide to understand the questions that shape a bathroom renovation estimate before a site visit. Public content uses planning ranges only and avoids internal rate cards."
      bullets={[
        "How room size, layout changes and fixture selections affect planning confidence.",
        "Why strata, asbestos risk, access and older homes can change the final scope.",
        "How the planning estimate wizard prepares a better site-review conversation."
      ]}
    >
      <div className="notice">
        <h3>Compliance prompts</h3>
        <p>
          For NSW projects, check current rules for contractor licensing above $5k, deposits
          generally limited to 10%, and HBCF cover generally required over $20k. This page is not
          legal advice.
        </p>
      </div>
    </SeoPage>
  );
}
