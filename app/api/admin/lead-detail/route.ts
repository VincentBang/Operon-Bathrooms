import { NextResponse } from "next/server";
import { z } from "zod";
import { validateAdminRequest } from "@/lib/admin-auth";
import { getStoredLead } from "@/lib/lead-store";

const schema = z.object({
  leadType: z.enum(["estimate", "quote_review", "request_review", "site_measure"]),
  leadId: z.string().min(1)
});

export async function GET(request: Request) {
  const auth = validateAdminRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const url = new URL(request.url);
  const parsed = schema.safeParse({
    leadType: url.searchParams.get("leadType") || url.searchParams.get("lead_type"),
    leadId: url.searchParams.get("leadId") || url.searchParams.get("id")
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid lead detail request" }, { status: 400 });

  const lead = await getStoredLead(parsed.data.leadType, parsed.data.leadId);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  return NextResponse.json({ ok: true, lead });
}
