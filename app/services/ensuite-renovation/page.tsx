import type { Metadata } from "next";
import { SeoPage } from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Ensuite Renovation Sydney",
  description:
    "Plan an ensuite renovation in Sydney with guidance-only estimate ranges and project risk prompts.",
  alternates: { canonical: "/services/ensuite-renovation" }
};

export default function EnsuitePage() {
  return (
    <SeoPage
      title="Ensuite renovation"
      intro="Ensuites often look simple but can be sensitive to access, ventilation, waterproofing and tight fixture clearances."
      bullets={[
        "Small-room layout and fixture planning.",
        "Ventilation and waterproofing prompts for enclosed spaces.",
        "Planning estimate workflow before final selections."
      ]}
    />
  );
}
