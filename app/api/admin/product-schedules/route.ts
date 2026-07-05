import { NextResponse } from "next/server";
import { z } from "zod";
import { validateAdminRequest } from "@/lib/admin-auth";
import {
  listBathroomProductSchedules,
  updateBathroomProductScheduleRecord,
  type StoredBathroomProductSchedule
} from "@/lib/product-schedule-store";
import { formatAllowanceRange } from "@/lib/product-schedule";

const updateSchema = z.object({
  recordId: z.string().min(1),
  adminStatus: z.enum(["new", "reviewed", "contacted", "follow_up_needed", "closed"]).optional(),
  followUpStatus: z.enum(["not_started", "requested", "in_progress", "completed", "not_required"]).optional(),
  internalNotes: z.string().max(4000).optional()
});

function allowanceFlagSummary(record: StoredBathroomProductSchedule) {
  return (
    record.schedule.allowanceReview?.checks
      .filter((check) => check.status !== "within_planning_range")
      .map((check) => `${check.category}: ${check.status.replaceAll("_", " ")}`) ?? []
  );
}

function substitutionSummary(record: StoredBathroomProductSchedule) {
  return record.schedule.items
    .filter((item) => item.substitutionOptions?.length)
    .map((item) => ({
      category: item.category,
      selected: item.recommendedProduct.name,
      alternatives: (item.substitutionOptions ?? []).map((option) => option.product.name)
    }));
}

function toAdminRecord(record: StoredBathroomProductSchedule) {
  const packComparisons =
    record.schedule.packComparisons ??
    record.schedule.recommendedPacks.map((pack) => ({
      id: pack.id,
      name: pack.name,
      allowanceRange: pack.allowanceRange,
      scheduleFit: "review",
      allowanceAlignment: "similar_to_schedule",
      watchouts: [...pack.riskNotes, ...pack.complianceNotes]
    }));
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt ?? record.createdAt,
    adminStatus: record.adminStatus ?? "new",
    followUpStatus: record.followUpStatus ?? "not_started",
    source: record.source,
    contact: record.lead
      ? {
          name: record.lead.name,
          email: record.lead.email,
          phone: record.lead.phone
        }
      : null,
    postcode: record.schedule.postcode,
    bathroomType: record.schedule.bathroomType,
    budgetLevel: record.schedule.budgetLevel,
    timeline: record.schedule.timeline,
    confidence: record.schedule.confidence,
    allowanceRange: formatAllowanceRange(record.schedule.totalAllowanceLow, record.schedule.totalAllowanceHigh),
    requested: {
      productQuote: record.input?.wantsProductQuote ?? false,
      quoteReview: record.input?.wantsQuoteReview ?? record.input?.hasExistingQuote ?? false,
      renovationHelp: record.input?.wantsRenovationHelp ?? false
    },
    packInterests: packComparisons.map((pack) => ({
      id: pack.id,
      name: pack.name,
      allowanceRange: pack.allowanceRange,
      scheduleFit: pack.scheduleFit,
      allowanceAlignment: pack.allowanceAlignment,
      watchouts: pack.watchouts
    })),
    allowanceFlags: allowanceFlagSummary(record),
    substitutionNotes: substitutionSummary(record),
    riskFlags: [
      ...record.schedule.complianceNotes,
      ...record.schedule.freightRiskNotes,
      ...(record.schedule.allowanceReview?.quoteRiskPrompts ?? [])
    ],
    builderExport: record.schedule.builderExport || record.schedule.builderReadySummary,
    internalNotes: record.internalNotes ?? ""
  };
}

export async function GET(request: Request) {
  const auth = validateAdminRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const records = (await listBathroomProductSchedules()).map(toAdminRecord);
  const summary = {
    totalSchedules: records.length,
    newSchedules: records.filter((record) => record.adminStatus === "new").length,
    productQuoteRequests: records.filter((record) => record.requested.productQuote).length,
    quoteReviewRequests: records.filter((record) => record.requested.quoteReview).length,
    followUpNeeded: records.filter((record) => record.adminStatus === "follow_up_needed" || record.followUpStatus === "requested").length,
    allowanceFlagged: records.filter((record) => record.allowanceFlags.length).length
  };

  return NextResponse.json({ ok: true, records, summary });
}

export async function POST(request: Request) {
  const auth = validateAdminRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product schedule admin update" }, { status: 400 });
  }

  const updated = await updateBathroomProductScheduleRecord(parsed.data.recordId, {
    adminStatus: parsed.data.adminStatus,
    followUpStatus: parsed.data.followUpStatus,
    internalNotes: parsed.data.internalNotes
  });
  if (!updated) return NextResponse.json({ error: "Product schedule record not found" }, { status: 404 });

  return NextResponse.json({ ok: true, record: toAdminRecord(updated) });
}
