import { NextResponse } from "next/server";
import { z } from "zod";
import { validateAdminRequest } from "@/lib/admin-auth";
import { leadStatuses } from "@/lib/lead-workflow";
import { updateLeadResponse } from "@/lib/lead-store";

const schema = z.object({
  leadType: z.enum(["estimate", "quote_review", "request_review", "site_measure"]),
  leadId: z.string().min(1),
  status: z.enum(leadStatuses as [string, ...string[]]).optional(),
  internalNotes: z.string().max(4000).optional(),
  internal_notes: z.string().max(4000).optional()
});

export async function POST(request: Request) {
  const auth = validateAdminRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid lead update" }, { status: 400 });

  const lead = await updateLeadResponse(
    parsed.data.leadType,
    parsed.data.leadId,
    {
      status: parsed.data.status,
      internalNotes: parsed.data.internalNotes ?? parsed.data.internal_notes,
      lastContactedAt: parsed.data.status === "contacted" ? new Date().toISOString() : undefined
    },
    "admin_lead_update"
  );

  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  return NextResponse.json({ ok: true, lead });
}
