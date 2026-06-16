import { NextResponse } from "next/server";
import { z } from "zod";
import { validateAdminRequest } from "@/lib/admin-auth";
import { generateManualReviewReport } from "@/lib/manual-review-report-store";

const schema = z.object({
  leadType: z.enum(["estimate", "quote_review", "request_review", "site_measure"]),
  leadId: z.string().min(1)
});

export async function POST(request: Request) {
  const auth = validateAdminRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid manual review report preview request" }, { status: 400 });

  const generated = await generateManualReviewReport(parsed.data.leadType, parsed.data.leadId, { persist: false });
  if (!generated) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  return NextResponse.json({ ok: true, report: generated.report, persisted: false });
}
