import { z } from "zod";

export const quoteWizardSchema = z.object({
  projectType: z.enum(["full-bathroom", "ensuite", "small-bathroom"]),
  timeline: z.enum(["planning", "one-to-three-months", "ready-now"]),
  propertyType: z.enum(["house", "apartment", "townhouse", "duplex"]),
  suburb: z.string().trim().min(2, "Enter a Sydney suburb"),
  homeAge: z.enum(["post-2000", "1980-2000", "pre-1980", "unknown"]),
  condition: z.enum(["good", "average", "poor"]),
  roomSize: z.enum(["small", "standard", "large"]),
  layoutChange: z.enum(["keep", "minor", "move-wet-area"]),
  plumbingScope: z.enum(["like-for-like", "some-upgrades", "major-upgrades"]),
  electricalScope: z.enum(["like-for-like", "new-lights-gpo", "major-upgrades"]),
  ventilationScope: z.enum(["existing-ok", "upgrade-needed", "unknown"]),
  waterproofingComplexity: z.enum(["standard", "complex", "unknown"]),
  tilingScope: z.enum(["partial-height", "floor-to-ceiling"]),
  fixtureLevel: z.enum(["budget", "mid", "premium"]),
  access: z.enum(["easy", "limited", "difficult"]),
  strata: z.boolean(),
  asbestosConcern: z.enum(["no", "possible", "known"]),
  contact: z.object({
    name: z.string().trim().min(2, "Enter your name"),
    email: z.string().trim().email("Enter a valid email"),
    phone: z.string().trim().min(8, "Enter a phone number")
  })
});

export type QuoteWizardInput = z.infer<typeof quoteWizardSchema>;

export type EstimateResult = {
  estimateId: string;
  range: {
    low: number;
    high: number;
    label: string;
  };
  confidenceScore: number;
  confidenceLabel: "High" | "Medium" | "Low";
  scopeSummary: string[];
  assumptions: string[];
  exclusions: string[];
  riskFlags: string[];
  compliancePrompts: string[];
  recommendedNextStep: string;
};

export const defaultWizardInput: QuoteWizardInput = {
  projectType: "full-bathroom",
  timeline: "planning",
  propertyType: "house",
  suburb: "",
  homeAge: "1980-2000",
  condition: "average",
  roomSize: "standard",
  layoutChange: "keep",
  plumbingScope: "like-for-like",
  electricalScope: "like-for-like",
  ventilationScope: "existing-ok",
  waterproofingComplexity: "standard",
  tilingScope: "partial-height",
  fixtureLevel: "mid",
  access: "easy",
  strata: false,
  asbestosConcern: "no",
  contact: {
    name: "",
    email: "",
    phone: ""
  }
};
