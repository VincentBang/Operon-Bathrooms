import { createClient } from "@supabase/supabase-js";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildManualReviewReport, ManualReviewReport, ManualReviewReportStatus } from "./bathroom-manual-review-report";
import { BathroomLeadType } from "./lead-workflow";
import { getStoredLead } from "./lead-store";

const localReportPath = path.join(process.cwd(), ".local", "bathroom-manual-review-reports.json");
let localReportQueue = Promise.resolve();

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

async function readLocalReports() {
  try {
    const raw = await readFile(localReportPath, "utf8");
    return JSON.parse(raw) as ManualReviewReport[];
  } catch {
    return [];
  }
}

async function writeLocalReports(reports: ManualReviewReport[]) {
  await mkdir(path.dirname(localReportPath), { recursive: true });
  await writeFile(localReportPath, JSON.stringify(reports, null, 2));
}

function toRow(report: ManualReviewReport, generatedBy = "admin") {
  return {
    id: report.reportId,
    created_at: report.reportGeneratedAt,
    updated_at: report.reportGeneratedAt,
    lead_type: report.leadType,
    lead_id: report.leadId,
    report_version: report.reportVersion,
    report_status: report.reportStatus,
    report_confidence: report.reportConfidence,
    headline_summary: report.headlineSummary,
    recommended_next_action: report.recommendedNextAction,
    recommended_admin_status: report.recommendedAdminStatus,
    manual_review_required: report.manualReviewRequired,
    do_not_quote_reasons: report.doNotQuoteReasons,
    missing_evidence: report.evidenceSummary.missing,
    customer_follow_up_questions: report.customerFollowUpQuestions,
    report_payload: report,
    generated_by: generatedBy,
    reviewed_at: report.reportStatus === "reviewed" ? new Date().toISOString() : null,
    reviewed_by: report.reportStatus === "reviewed" ? generatedBy : null
  };
}

function fromRow(row: Record<string, unknown>) {
  const payload = row.report_payload as ManualReviewReport;
  if (!payload) return payload;
  return {
    ...payload,
    reportStatus: (row.report_status as ManualReviewReportStatus) || payload.reportStatus,
    reportReviewedAt: (row.reviewed_at as string | null) || payload.reportReviewedAt || null,
    reportReviewedBy: (row.reviewed_by as string | null) || payload.reportReviewedBy || null
  };
}

export async function listManualReviewReports() {
  const supabase = client();
  if (!supabase) {
    await localReportQueue;
    return readLocalReports();
  }
  const { data, error } = await supabase
    .from("bathroom_manual_review_reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error || !data) return [];
  return data.map((row) => fromRow(row as Record<string, unknown>)).filter(Boolean);
}

export async function getLatestManualReviewReport(leadType: BathroomLeadType, leadId: string) {
  const reports = await listManualReviewReports();
  return reports
    .filter((report) => report.leadType === leadType && report.leadId === leadId)
    .sort((a, b) => b.reportGeneratedAt.localeCompare(a.reportGeneratedAt))[0] || null;
}

export async function generateManualReviewReport(
  leadType: BathroomLeadType,
  leadId: string,
  options: { persist?: boolean; generatedBy?: string; supersedeExisting?: boolean } = {}
) {
  const lead = await getStoredLead(leadType, leadId);
  if (!lead) return null;
  const previous = await getLatestManualReviewReport(leadType, leadId);
  const report = buildManualReviewReport(lead, { version: previous ? previous.reportVersion + 1 : 1 });
  if (options.persist === false) return { report, persisted: false };

  const supabase = client();
  if (!supabase) {
    localReportQueue = localReportQueue.then(async () => {
      const reports = await readLocalReports();
      const nextReports = options.supersedeExisting
        ? reports.map((item) =>
            item.leadType === leadType && item.leadId === leadId && item.reportStatus !== "reviewed"
              ? { ...item, reportStatus: "superseded" as ManualReviewReportStatus }
              : item
          )
        : reports;
      nextReports.unshift(report);
      await writeLocalReports(nextReports);
    });
    await localReportQueue;
    return { report, persisted: true };
  }

  if (options.supersedeExisting && previous && previous.reportStatus !== "reviewed") {
    await supabase
      .from("bathroom_manual_review_reports")
      .update({ report_status: "superseded", updated_at: new Date().toISOString() })
      .eq("id", previous.reportId);
  }
  const { error } = await supabase.from("bathroom_manual_review_reports").insert(toRow(report, options.generatedBy));
  if (error) return { report, persisted: false };
  return { report, persisted: true };
}

export async function updateManualReviewReport(
  reportId: string,
  patch: { reportStatus?: ManualReviewReportStatus; internalReviewNote?: string; reviewedBy?: string }
) {
  const now = new Date().toISOString();
  const supabase = client();
  if (!supabase) {
    localReportQueue = localReportQueue.then(async () => {
      const reports = await readLocalReports();
      const index = reports.findIndex((report) => report.reportId === reportId);
      if (index === -1) return;
      const report = reports[index];
      const reviewed = patch.reportStatus === "reviewed";
      reports[index] = {
        ...report,
        reportStatus: patch.reportStatus || report.reportStatus,
        reportReviewedAt: reviewed ? now : report.reportReviewedAt || null,
        reportReviewedBy: reviewed ? patch.reviewedBy || "admin" : report.reportReviewedBy || null,
        internalReviewNotes: patch.internalReviewNote
          ? [...report.internalReviewNotes, patch.internalReviewNote]
          : report.internalReviewNotes
      };
      await writeLocalReports(reports);
    });
    await localReportQueue;
    const reports = await readLocalReports();
    return reports.find((report) => report.reportId === reportId) || null;
  }

  const current = (await listManualReviewReports()).find((report) => report.reportId === reportId);
  if (!current) return null;
  const next = {
    ...current,
    reportStatus: patch.reportStatus || current.reportStatus,
    reportReviewedAt: patch.reportStatus === "reviewed" ? now : current.reportReviewedAt || null,
    reportReviewedBy: patch.reportStatus === "reviewed" ? patch.reviewedBy || "admin" : current.reportReviewedBy || null,
    internalReviewNotes: patch.internalReviewNote
      ? [...current.internalReviewNotes, patch.internalReviewNote]
      : current.internalReviewNotes
  };
  const { error } = await supabase
    .from("bathroom_manual_review_reports")
    .update({
      report_status: next.reportStatus,
      report_payload: next,
      updated_at: now,
      reviewed_at: next.reportStatus === "reviewed" ? now : null,
      reviewed_by: next.reportStatus === "reviewed" ? patch.reviewedBy || "admin" : null
    })
    .eq("id", reportId);
  if (error) return null;
  return next;
}
