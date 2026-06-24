import { z } from "zod";
import {
  bathroomTypes,
  catalogueCandidates,
  conceptualProductArchetypes,
  designPalettes,
  designStyles,
  sampleTemplates
} from "@/data/public/bathroom-design-poc";

export const DESIGN_SCHEMA_VERSION = "0.4" as const;
export const MAX_DESIGN_VARIANTS = 3;
export const MAX_LAYOUT_ZONES = 8;
export const MAX_PRODUCT_SHORTLIST = 6;
export const MAX_CONSTRAINT_PROMPTS = 10;
export const REQUIRED_TRUST_LABELS = {
  inspirationVisual: true,
  approximateLayout: true,
  measuredLayout: false,
  verifiedProducts: false,
  approximatePlanningLayout: true,
  measuredPlan: false,
  constructionDrawing: false,
  planningGuidanceOnly: true
} as const;

const bathroomTypeValues = bathroomTypes.map((item) => item.id) as [
  (typeof bathroomTypes)[number]["id"],
  ...(typeof bathroomTypes)[number]["id"][]
];
const styleValues = designStyles.map((item) => item.id) as [
  (typeof designStyles)[number]["id"],
  ...(typeof designStyles)[number]["id"][]
];
const paletteValues = designPalettes.map((item) => item.id) as [
  (typeof designPalettes)[number]["id"],
  ...(typeof designPalettes)[number]["id"][]
];
const templateValues = sampleTemplates.map((item) => item.id) as [
  (typeof sampleTemplates)[number]["id"],
  ...(typeof sampleTemplates)[number]["id"][]
];
const archetypeValues = conceptualProductArchetypes.map((item) => item.id) as [
  (typeof conceptualProductArchetypes)[number]["id"],
  ...(typeof conceptualProductArchetypes)[number]["id"][]
];
const catalogueCandidateValues = catalogueCandidates.map((item) => item.id) as [
  (typeof catalogueCandidates)[number]["id"],
  ...(typeof catalogueCandidates)[number]["id"][]
];

export const bathroomDesignBathroomTypeSchema = z.enum(bathroomTypeValues);
export const bathroomDesignStyleSchema = z.enum(styleValues);
export const bathroomDesignPaletteSchema = z.enum(paletteValues);
export const bathroomDesignTemplateSchema = z.enum(templateValues);
export const conceptualSelectionSchema = z.object({
  archetypeId: z.enum(archetypeValues),
  label: z.string().min(1).max(80),
  finishFamily: z.string().min(1).max(120),
  verifiedProduct: z.literal(false)
});

export const designVariantSchema = z.object({
  id: z.string().min(1).max(40),
  name: z.string().min(1).max(80),
  summary: z.string().min(1).max(220),
  paletteId: bathroomDesignPaletteSchema,
  emphasis: z.enum(["balanced", "surface-led", "fixture-led"])
});

export const catalogueCandidateSelectionSchema = z.object({
  candidateId: z.enum(catalogueCandidateValues),
  archetypeId: z.enum(archetypeValues),
  category: z.string().min(1).max(40),
  label: z.string().min(1).max(100),
  finishFamily: z.string().min(1).max(120),
  planningUse: z.string().min(1).max(180),
  evidencePrompt: z.string().min(1).max(180),
  verificationStatus: z.literal("catalogue-candidate"),
  verifiedProduct: z.literal(false),
  confirmedSku: z.literal(false),
  supplierFeed: z.literal(false),
  pricingIncluded: z.literal(false)
});

export const cataloguePlanningSchema = z.object({
  mode: z.literal("curated-candidates"),
  liveSupplierFeed: z.literal(false),
  verifiedSku: z.literal(false),
  pricing: z.literal(false),
  procurement: z.literal(false),
  planningGuidanceOnly: z.literal(true),
  requiresHumanSelectionCheck: z.literal(true)
});

export const layoutFixtureZoneSchema = z.object({
  fixtureType: z.enum([
    "shower",
    "bath",
    "vanity",
    "toilet",
    "laundry",
    "storage",
    "door",
    "window",
    "ventilation",
    "waste-drain"
  ]),
  label: z.string().min(1).max(80),
  approximatePosition: z.enum([
    "north-wall",
    "east-wall",
    "south-wall",
    "west-wall",
    "centre",
    "corner",
    "entry-side",
    "window-side",
    "unknown"
  ]),
  status: z.enum(["existing", "planned", "unclear"]),
  serviceChange: z.enum(["keep", "relocate", "new", "remove", "unclear"]),
  notes: z.string().max(140).optional()
});

export const layoutPlanningSchema = z.object({
  roomShape: z.enum(["rectangle", "l-shape", "galley", "open-zone", "unknown"]),
  sizeBand: z.enum(["compact", "standard", "large", "unknown"]),
  entryPosition: z.enum(["north-wall", "east-wall", "south-wall", "west-wall", "unknown"]),
  fixtureZones: z.array(layoutFixtureZoneSchema).min(1).max(MAX_LAYOUT_ZONES),
  constraints: z.object({
    strataOrClass2: z.boolean(),
    accessLimitations: z.boolean(),
    waterproofingUncertainty: z.boolean(),
    drainageOrFallsConcern: z.boolean(),
    ventilationConcern: z.boolean(),
    suspectedAsbestos: z.boolean()
  }),
  labels: z.object({
    approximatePlanningLayout: z.literal(true),
    measuredPlan: z.literal(false),
    constructionDrawing: z.literal(false),
    planningGuidanceOnly: z.literal(true)
  })
});

export const layoutRiskPromptSchema = z.object({
  id: z.string().min(1).max(80),
  level: z.enum(["check", "review", "site-review"]),
  title: z.string().min(1).max(120),
  message: z.string().min(1).max(260),
  nextStep: z.enum(["clarify", "confirm-in-writing", "site-measure", "request-review"])
});

export const constraintPromptSchema = z.object({
  id: z.string().min(1).max(80),
  category: z.enum([
    "layout",
    "access",
    "waterproofing",
    "ventilation",
    "strata",
    "services",
    "evidence",
    "selection"
  ]),
  level: z.enum(["check", "review", "site-review"]),
  title: z.string().min(1).max(120),
  message: z.string().min(1).max(280),
  evidenceToPrepare: z.array(z.string().min(1).max(120)).max(5),
  nextStep: z.enum(["estimate", "quote-review", "request-review", "site-measure"])
});

export const constraintPlanningSchema = z.object({
  mode: z.literal("deterministic-constraints"),
  deterministicOnly: z.literal(true),
  aiAssisted: z.literal(false),
  externalProvider: z.literal(false),
  sourceMediaUsed: z.literal(false),
  personalDataUsed: z.literal(false),
  pricing: z.literal(false),
  complianceCertification: z.literal(false),
  planningGuidanceOnly: z.literal(true)
});

export const bathroomDesignDraftSchema = z
  .object({
    schemaVersion: z.literal(DESIGN_SCHEMA_VERSION),
    id: z.string().min(8).max(80),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    mode: z.literal("quick"),
    bathroomType: bathroomDesignBathroomTypeSchema,
    startingPoint: z.object({
      kind: z.enum(["sample", "local-photo"]),
      sampleTemplateId: bathroomDesignTemplateSchema.optional(),
      photoUsed: z.boolean()
    }),
    styleId: bathroomDesignStyleSchema,
    paletteId: bathroomDesignPaletteSchema,
    variants: z.array(designVariantSchema).min(1).max(MAX_DESIGN_VARIANTS),
    selectedVariantId: z.string().min(1).max(40),
    conceptualSelections: z.array(conceptualSelectionSchema).min(1).max(8),
    productShortlist: z.array(catalogueCandidateSelectionSchema).min(1).max(MAX_PRODUCT_SHORTLIST),
    cataloguePlanning: cataloguePlanningSchema,
    allowanceBand: z.enum(["essential", "considered", "premium"]),
    labels: z.object({
      inspirationVisual: z.literal(true),
      approximateLayout: z.literal(true),
      measuredLayout: z.literal(false),
      verifiedProducts: z.literal(false),
      approximatePlanningLayout: z.literal(true),
      measuredPlan: z.literal(false),
      constructionDrawing: z.literal(false),
      planningGuidanceOnly: z.literal(true)
    }),
    layoutPlanning: layoutPlanningSchema,
    layoutRiskPrompts: z.array(layoutRiskPromptSchema).max(8),
    constraintPrompts: z.array(constraintPromptSchema).max(MAX_CONSTRAINT_PROMPTS),
    constraintPlanning: constraintPlanningSchema,
    preferredNextStep: z.enum(["estimate", "save", "request-review"]).optional()
  })
  .superRefine((draft, context) => {
    const style = designStyles.find((item) => item.id === draft.styleId);
    const palette = designPalettes.find((item) => item.id === draft.paletteId);
    if (!style || !palette || palette.styleId !== style.id || !style.paletteIds.includes(palette.id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["paletteId"],
        message: "Palette must belong to the selected style."
      });
    }
    if (!draft.variants.some((variant) => variant.id === draft.selectedVariantId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["selectedVariantId"],
        message: "Selected variant must exist in variants."
      });
    }
    if (draft.startingPoint.kind === "sample" && !draft.startingPoint.sampleTemplateId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startingPoint", "sampleTemplateId"],
        message: "Sample starting points require a sample template."
      });
    }
    if (draft.startingPoint.kind === "local-photo" && !draft.startingPoint.photoUsed) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startingPoint", "photoUsed"],
        message: "Local-photo starting points must record photoUsed."
      });
    }
    for (const item of draft.productShortlist) {
      const candidate = catalogueCandidates.find((candidateItem) => candidateItem.id === item.candidateId);
      if (!candidate || candidate.archetypeId !== item.archetypeId || candidate.category !== item.category) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["productShortlist", item.candidateId],
          message: "Product shortlist candidates must match the governed local catalogue."
        });
      }
    }
  });

export const bathroomDesignHandoffSchema = z.object({
  schemaVersion: z.literal(DESIGN_SCHEMA_VERSION),
  designDraftId: z.string().min(8).max(80),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  bathroomType: bathroomDesignBathroomTypeSchema,
  sampleTemplateId: bathroomDesignTemplateSchema.optional(),
  styleId: bathroomDesignStyleSchema,
  paletteId: bathroomDesignPaletteSchema,
  conceptualSelections: z.array(conceptualSelectionSchema).max(8),
  productShortlist: z.array(catalogueCandidateSelectionSchema).max(MAX_PRODUCT_SHORTLIST),
  cataloguePlanning: cataloguePlanningSchema,
  finishFamilies: z.array(z.string().min(1).max(120)).max(12),
  photoUsed: z.boolean(),
  selectedVariantId: z.string().min(1).max(40),
  allowanceBand: z.enum(["essential", "considered", "premium"]),
  labels: z.object({
    inspirationVisual: z.literal(true),
    approximateLayout: z.literal(true),
    measuredLayout: z.literal(false),
    verifiedProducts: z.literal(false),
    approximatePlanningLayout: z.literal(true),
    measuredPlan: z.literal(false),
    constructionDrawing: z.literal(false),
    planningGuidanceOnly: z.literal(true)
  }),
  layoutPlanning: layoutPlanningSchema,
  layoutRiskPrompts: z.array(layoutRiskPromptSchema).max(8),
  constraintPrompts: z.array(constraintPromptSchema).max(MAX_CONSTRAINT_PROMPTS),
  constraintPlanning: constraintPlanningSchema,
  preferredNextStep: z.enum(["estimate", "save", "request-review"]).optional()
});

export type BathroomDesignDraft = z.infer<typeof bathroomDesignDraftSchema>;
export type BathroomDesignVariant = z.infer<typeof designVariantSchema>;
export type BathroomDesignHandoff = z.infer<typeof bathroomDesignHandoffSchema>;

export function safeParseBathroomDesignDraft(value: unknown) {
  return bathroomDesignDraftSchema.safeParse(value);
}

export function safeParseBathroomDesignHandoff(value: unknown) {
  const parsed = bathroomDesignHandoffSchema.safeParse(value);
  if (!parsed.success) return parsed;
  if (Date.parse(parsed.data.expiresAt) <= Date.now()) {
    return {
      success: false as const,
      error: new z.ZodError([
        {
          code: z.ZodIssueCode.custom,
          path: ["expiresAt"],
          message: "Design handoff has expired."
        }
      ])
    };
  }
  return parsed;
}

export function createDesignDraftId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `design-${crypto.randomUUID()}`;
  }
  return `design-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
