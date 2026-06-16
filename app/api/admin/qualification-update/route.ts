import { NextResponse } from "next/server";
import { z } from "zod";
import { validateAdminRequest } from "@/lib/admin-auth";
import {
  evidenceQualities,
  leadFitTiers,
  projectValueBands,
  qualificationStatuses,
  recommendedNextActions,
  riskLevels,
  urgencyLevels
} from "@/lib/lead-workflow";
import { updateLeadResponse } from "@/lib/lead-store";

const schema = z.object({
  leadType: z.enum(["estimate", "quote_review", "request_review", "site_measure"]),
  leadId: z.string().min(1),
  leadFitTier: z.enum(leadFitTiers as [string, ...string[]]).optional(),
  qualificationStatus: z.enum(qualificationStatuses as [string, ...string[]]).optional(),
  urgency: z.enum(urgencyLevels as [string, ...string[]]).optional(),
  projectValueBand: z.enum(projectValueBands as [string, ...string[]]).optional(),
  riskLevel: z.enum(riskLevels as [string, ...string[]]).optional(),
  evidenceQuality: z.enum(evidenceQualities as [string, ...string[]]).optional(),
  manualReviewRequired: z.boolean().optional(),
  recommendedNextAction: z.enum(recommendedNextActions as [string, ...string[]]).optional(),
  qualificationNotes: z.string().max(4000).optional()
});

export async function POST(request: Request) {
  const auth = validateAdminRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid qualification update" }, { status: 400 });

  const now = new Date().toISOString();
  const lead = await updateLeadResponse(
    parsed.data.leadType,
    parsed.data.leadId,
    {
      leadFitTier: parsed.data.leadFitTier as never,
      qualificationStatus: parsed.data.qualificationStatus as never,
      urgency: parsed.data.urgency as never,
      projectValueBand: parsed.data.projectValueBand as never,
      riskLevel: parsed.data.riskLevel as never,
      evidenceQuality: parsed.data.evidenceQuality as never,
      manualReviewRequired: parsed.data.manualReviewRequired,
      recommendedNextAction: parsed.data.recommendedNextAction as never,
      qualificationNotes: parsed.data.qualificationNotes,
      qualificationUpdatedAt: now,
      qualificationUpdatedBy: "admin"
    },
    "qualification_override"
  );

  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  return NextResponse.json({ ok: true, lead });
}
