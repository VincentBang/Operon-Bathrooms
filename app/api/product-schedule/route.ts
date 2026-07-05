import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import {
  createProductScheduleLead,
  generateBathroomProductSchedule,
  productScheduleInputSchema,
  productScheduleLeadSchema,
  type ProductScheduleLeadInput
} from "@/lib/product-schedule";
import { trackBathroomProductScheduleEvent } from "@/lib/product-schedule-analytics";
import { storeBathroomProductSchedule } from "@/lib/product-schedule-store";

const requestSchema = z
  .object({
    input: productScheduleInputSchema,
    lead: productScheduleLeadSchema.optional().nullable()
  })
  .or(productScheduleInputSchema.extend({ lead: productScheduleLeadSchema.optional().nullable() }));

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = requestSchema.parse(body);
    const input = "input" in payload ? payload.input : payload;
    const lead: ProductScheduleLeadInput | null =
      "lead" in payload && payload.lead ? payload.lead : null;

    if (lead?.company) {
      return NextResponse.json({ ok: false, error: "Unable to process this request." }, { status: 400 });
    }

    const result = generateBathroomProductSchedule(input);
    const createdLead = createProductScheduleLead(input, lead, result.schedule);
    const stored = await storeBathroomProductSchedule(result.schedule, lead);
    const completionEvent = trackBathroomProductScheduleEvent("bathroom_schedule_completed", {
      bathroomType: input.bathroomType,
      budgetLevel: input.budgetLevel,
      hasLead: Boolean(createdLead)
    });

    return NextResponse.json({
      ok: true,
      stored: true,
      recordId: stored.id,
      leadId: createdLead?.id ?? null,
      schedule: result.schedule,
      assumptions: result.assumptions,
      warnings: result.warnings,
      quoteReviewFlags: result.schedule.quoteReviewFlags,
      event: completionEvent
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Check the highlighted product schedule fields and try again.",
          issues: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    console.error("Bathroom product schedule submission failed", error);
    return NextResponse.json(
      {
        ok: false,
        error: "The product schedule could not be generated right now. Please try again."
      },
      { status: 500 }
    );
  }
}
