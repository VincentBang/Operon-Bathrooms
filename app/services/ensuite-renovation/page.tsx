import type { Metadata } from "next";
import Link from "next/link";
import { SeoPage } from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Ensuite Renovation Sydney | Planning Estimate & Site Measure",
  description:
    "Plan a Sydney ensuite renovation with layout, waterproofing, ventilation and fixture prompts before site measure and written scope confirmation.",
  alternates: { canonical: "/services/ensuite-renovation" },
  openGraph: {
    title: "Ensuite renovation Sydney",
    description:
      "Planning guidance for ensuite layout, waterproofing, ventilation and site-measure readiness."
  }
};

export default function EnsuitePage() {
  return (
    <SeoPage
      title="Ensuite renovation Sydney."
      intro="Ensuites often look simple but can be sensitive to access, ventilation, waterproofing and tight fixture clearances."
      bullets={[
        "Small-room layout and fixture planning.",
        "Ventilation and waterproofing prompts for enclosed spaces.",
        "Planning estimate workflow before final selections."
      ]}
    >
      <div className="actions" style={{ justifyContent: "flex-start" }}>
        <Link className="button" href="/quote">Start ensuite estimate</Link>
        <Link className="button secondary" href="/quote/review">Review a quote</Link>
        <Link className="button ghost" href="/site-measure">Prepare site measure</Link>
      </div>
    </SeoPage>
  );
}
