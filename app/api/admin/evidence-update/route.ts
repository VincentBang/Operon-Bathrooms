import { NextResponse } from "next/server";
import { z } from "zod";
import { validateAdminRequest } from "@/lib/admin-auth";
import { evidenceKeysForLeadType } from "@/lib/bathroom-lead-qualification";
import { EvidenceStatus, evidenceStatuses } from "@/lib/lead-workflow";
import { updateEvidenceStatus } from "@/lib/lead-store";

const schema = z.object({
  leadType: z.enum(["estimate", "quote_review", "request_review", "site_measure"]),
  leadId: z.string().min(1),
  evidenceKey: z.string().min(2),
  evidenceStatus: z.enum(evidenceStatuses as [string, ...string[]])
});

export async function POST(request: Request) {
  const auth = validateAdminRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid evidence update" }, { status: 400 });
  if (!evidenceKeysForLeadType(parsed.data.leadType).includes(parsed.data.evidenceKey)) {
    return NextResponse.json({ error: "Invalid evidence update" }, { status: 400 });
  }

  const lead = await updateEvidenceStatus(
    parsed.data.leadType,
    parsed.data.leadId,
    parsed.data.evidenceKey,
    parsed.data.evidenceStatus as EvidenceStatus,
    "admin"
  );

  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  return NextResponse.json({ ok: true, lead });
}
