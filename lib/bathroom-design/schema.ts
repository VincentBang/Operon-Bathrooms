import { z } from "zod";
import {
  bathroomTypes,
  conceptualProductArchetypes,
  designPalettes,
  designStyles,
  sampleTemplates
} from "@/data/public/bathroom-design-poc";

export const DESIGN_SCHEMA_VERSION = "0.2" as const;
export const MAX_DESIGN_VARIANTS = 3;
export const MAX_LAYOUT_ZONES = 8;
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
