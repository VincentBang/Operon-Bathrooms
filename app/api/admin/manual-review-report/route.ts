import { NextResponse } from "next/server";
import { z } from "zod";
import { validateAdminRequest } from "@/lib/admin-auth";
import { generateManualReviewReport, getLatestManualReviewReport } from "@/lib/manual-review-report-store";

const schema = z.object({
  leadType: z.enum(["estimate", "quote_review", "request_review", "site_measure"]),
  leadId: z.string().min(1),
  regenerate: z.boolean().optional()
});

export async function GET(request: Request) {
  const auth = validateAdminRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const url = new URL(request.url);
  const parsed = schema.safeParse({
    leadType: url.searchParams.get("leadType") || url.searchParams.get("lead_type"),
    leadId: url.searchParams.get("leadId") || url.searchParams.get("id")
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid manual review report request" }, { status: 400 });

  const report = await getLatestManualReviewReport(parsed.data.leadType, parsed.data.leadId);
  if (!report) return NextResponse.json({ ok: true, report: null, persisted: false });
  return NextResponse.json({ ok: true, report, persisted: true });
}

export async function POST(request: Request) {
  const auth = validateAdminRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid manual review report request" }, { status: 400 });

  const generated = await generateManualReviewReport(parsed.data.leadType, parsed.data.leadId, {
    persist: true,
    generatedBy: "admin",
    supersedeExisting: parsed.data.regenerate === true
  });
  if (!generated) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  return NextResponse.json({ ok: true, report: generated.report, persisted: generated.persisted });
}
