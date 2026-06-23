import { NextResponse } from "next/server";
import { z } from "zod";
import { validateAdminRequest } from "@/lib/admin-auth";
import { BathroomLeadType, leadStatuses, responsePriorities, responseStatuses } from "@/lib/lead-workflow";
import { updateLeadResponse } from "@/lib/lead-store";

const schema = z.object({
  leadType: z.enum(["estimate", "quote_review", "request_review", "site_measure"]),
  leadId: z.string().min(1),
  responseStatus: z.enum(responseStatuses as [string, ...string[]]).optional(),
  status: z.enum(leadStatuses as [string, ...string[]]).optional(),
  responsePriority: z.enum(responsePriorities as [string, ...string[]]).optional(),
  firstResponseAt: z.string().datetime().nullable().optional(),
  lastContactedAt: z.string().datetime().nullable().optional(),
  responseDueAt: z.string().datetime().nullable().optional(),
  followUpAt: z.string().datetime().nullable().optional(),
  internalNotes: z.string().max(4000).optional(),
  markContacted: z.boolean().optional()
});

export async function POST(request: Request) {
  const auth = validateAdminRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid response update" }, { status: 400 });

  const now = new Date().toISOString();
  const nextStatus = parsed.data.markContacted ? "contacted" : parsed.data.responseStatus;
  const lead = await updateLeadResponse(
    parsed.data.leadType as BathroomLeadType,
    parsed.data.leadId,
    {
      status: parsed.data.status,
      responseStatus: nextStatus as never,
      responsePriority: parsed.data.responsePriority as never,
      responseDueAt: parsed.data.responseDueAt,
      followUpAt: parsed.data.followUpAt,
      firstResponseAt: parsed.data.firstResponseAt ?? (parsed.data.markContacted ? now : undefined),
      lastContactedAt: parsed.data.lastContactedAt ?? (parsed.data.markContacted ? now : undefined),
      internalNotes: parsed.data.internalNotes
    },
    "admin_response_update"
  );

  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  return NextResponse.json({ ok: true, lead });
}
