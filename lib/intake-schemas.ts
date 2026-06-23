import { z } from "zod";
import { attributionSchema } from "./attribution";

const requiredText = z.string().trim().min(2);
const optionalText = z.string().trim().optional().or(z.literal(""));
const email = z.string().trim().email();
const yesNoUnclear = z.enum(["yes", "no", "unclear"]);
const accepted = z.boolean().refine((value) => value, "Required acknowledgement");

export const quoteReviewSchema = z.object({
  contact: z.object({
    name: requiredText,
    email,
    phone: optionalText,
    suburb: requiredText,
    propertyType: z.enum(["house", "townhouse", "apartment-strata", "duplex", "other"])
  }),
  quote: z.object({
    amount: z.coerce.number().min(1),
    builderName: optionalText,
    builderLicence: optionalText,
    quoteDate: optionalText,
    gstStatus: z.enum(["included", "excluded", "unclear"]),
    depositRequested: z.coerce.number().min(0),
    timeline: z.enum(["clear", "unclear", "urgent", "not-stated"]),
    hbcMentioned: yesNoUnclear
  }),
  risk: z.object({
    buildingAge: z.enum(["post-2000", "1980-2000", "pre-1980", "unknown"]),
    leaksOrMould: yesNoUnclear,
    suspectedAsbestos: yesNoUnclear,
    strataApprovalRequired: yesNoUnclear,
    accessConstraints: yesNoUnclear,
    layoutOrServiceChanges: yesNoUnclear
  }),
  scope: z.record(z.boolean()),
  allowances: z.object({
    pcSumsPresent: yesNoUnclear,
    provisionalSumsPresent: yesNoUnclear,
    tileAllowanceAmount: optionalText,
    fixtureAllowanceAmount: optionalText,
    exclusionsClearlyListed: yesNoUnclear
  }),
  upload: z.object({
    fileName: optionalText,
    fileType: optionalText,
    fileSize: z.coerce.number().max(10_000_000).optional()
  }),
  consent: z.object({
    privacyAccepted: accepted,
    termsAccepted: accepted,
    guidanceAccepted: accepted
  }),
  company: optionalText,
  attribution: attributionSchema.optional()
});

export const reviewRequestSchema = z.object({
  name: requiredText,
  email,
  phone: optionalText,
  suburb: requiredText,
  propertyType: z.enum(["house", "townhouse", "apartment-strata", "duplex", "other"]),
  bathroomType: z.enum(["main-bathroom", "ensuite", "powder-room", "laundry-bathroom", "other"]),
  projectStage: z.enum(["early-ideas", "planning", "has-plans", "has-builder-quote"]),
  budgetRange: z.enum(["under-25k", "25k-40k", "40k-60k", "60k-plus", "unsure"]),
  timeline: z.enum(["planning", "one-to-three-months", "three-to-six-months", "urgent"]),
  hasPhotosPlans: z.boolean(),
  hasBuilderQuote: z.boolean(),
  preferredNextStep: z.enum(["email-review", "phone-call", "site-measure", "not-sure"]),
  message: z.string().trim().min(10),
  privacyAccepted: accepted,
  termsAccepted: accepted,
  company: optionalText,
  attribution: attributionSchema.optional()
});

export const siteMeasureSchema = z.object({
  name: requiredText,
  email,
  phone: z.string().trim().min(8),
  suburb: requiredText,
  propertyAddress: optionalText,
  propertyType: z.enum(["house", "townhouse", "apartment-strata", "duplex", "other"]),
  preferredTimeWindow: z.enum(["weekday-morning", "weekday-afternoon", "saturday", "flexible"]),
  accessNotes: optionalText,
  parkingLiftStairsNotes: optionalText,
  strataApprovalStatus: z.enum(["not-required", "not-started", "in-progress", "approved", "unknown"]),
  knownIssues: optionalText,
  message: z.string().trim().min(5),
  privacyAccepted: accepted,
  termsAccepted: accepted,
  company: optionalText,
  attribution: attributionSchema.optional()
});

export type QuoteReviewInput = z.infer<typeof quoteReviewSchema>;
export type ReviewRequestInput = z.infer<typeof reviewRequestSchema>;
export type SiteMeasureInput = z.infer<typeof siteMeasureSchema>;
