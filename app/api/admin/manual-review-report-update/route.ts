import { NextResponse } from "next/server";
import { z } from "zod";
import { validateAdminRequest } from "@/lib/admin-auth";
import { updateManualReviewReport } from "@/lib/manual-review-report-store";

const statuses = ["draft", "generated", "reviewed", "superseded", "archived"] as const;

const schema = z.object({
  reportId: z.string().min(1),
  reportStatus: z.enum(statuses).optional(),
  internalReviewNote: z.string().max(4000).optional()
});

export async function POST(request: Request) {
  const auth = validateAdminRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid manual review report update" }, { status: 400 });

  const report = await updateManualReviewReport(parsed.data.reportId, {
    reportStatus: parsed.data.reportStatus,
    internalReviewNote: parsed.data.internalReviewNote,
    reviewedBy: "admin"
  });
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });
  return NextResponse.json({ ok: true, report });
}
