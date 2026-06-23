import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DesignStudio } from "@/components/design-studio/DesignStudio";
import { isBathroomDesignStudioEnabled } from "@/lib/bathroom-design/feature-flag";

export const metadata: Metadata = {
  title: "Bathroom Design Studio Planning Preview",
  description:
    "A gated planning preview for bathroom inspiration visuals, conceptual selections and planning estimate handoff.",
  alternates: { canonical: "/design-studio" },
  robots: {
    index: false,
    follow: false
  },
  openGraph: {
    title: "Operon Bathroom Design Studio planning preview",
    description:
      "Feature-flagged inspiration flow for structured bathroom design preferences and planning estimate handoff."
  }
};

export default function DesignStudioPage() {
  if (!isBathroomDesignStudioEnabled()) {
    notFound();
  }

  return <DesignStudio />;
}
