import { NextResponse } from "next/server";
import { z } from "zod";
import { validateAdminRequest } from "@/lib/admin-auth";
import { listStoredLeads, qualifyStoredLead } from "@/lib/lead-store";

const schema = z.object({
  leadType: z.enum(["estimate", "quote_review", "request_review", "site_measure"]).optional(),
  status: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  limit: z.coerce.number().min(1).max(25).default(10)
});

export async function POST(request: Request) {
  const auth = validateAdminRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid bulk qualification request" }, { status: 400 });

  const leads = await listStoredLeads();
  const from = parsed.data.dateFrom ? new Date(parsed.data.dateFrom).getTime() : null;
  const to = parsed.data.dateTo ? new Date(parsed.data.dateTo).getTime() : null;
  const selected = leads
    .filter((lead) => !parsed.data.leadType || lead.leadType === parsed.data.leadType)
    .filter((lead) => !parsed.data.status || lead.status === parsed.data.status)
    .filter((lead) => lead.qualificationStatus === "unreviewed" || !lead.leadFitTier)
    .filter((lead) => {
      const created = new Date(lead.createdAt).getTime();
      if (from && created < from) return false;
      if (to && created > to) return false;
      return true;
    })
    .slice(0, parsed.data.limit);

  const counts = {
    processed: 0,
    strong_fit: 0,
    good_fit: 0,
    needs_review: 0,
    weak_fit: 0,
    not_fit: 0,
    manual_review_needed: 0,
    errors: 0
  };

  for (const lead of selected) {
    const updated = await qualifyStoredLead(lead.leadType, lead.id, "admin_bulk");
    if (!updated) {
      counts.errors += 1;
      continue;
    }
    counts.processed += 1;
    if (updated.leadFitTier) counts[updated.leadFitTier] += 1;
    if (updated.manualReviewRequired || updated.qualificationStatus === "manual_review_needed") counts.manual_review_needed += 1;
  }

  return NextResponse.json({ ok: true, counts });
}
