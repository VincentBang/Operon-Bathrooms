import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import {
  evidenceQualities,
  isOverdue,
  leadStatuses,
  leadFitTiers,
  projectValueBands,
  qualificationStatuses,
  recommendedNextActions,
  responsePriorities,
  responseStatuses,
  riskLevels,
  urgencyLevels
} from "@/lib/lead-workflow";
import { listStoredLeads } from "@/lib/lead-store";
import { ManualReviewReport } from "@/lib/bathroom-manual-review-report";
import { listManualReviewReports } from "@/lib/manual-review-report-store";

export async function GET(request: Request) {
  const auth = validateAdminRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const url = new URL(request.url);
  const storedLeads = await listStoredLeads();
  const reports = await listManualReviewReports();
  const latestReportByLead = new Map<string, ManualReviewReport>();
  reports
    .sort((a, b) => b.reportGeneratedAt.localeCompare(a.reportGeneratedAt))
    .forEach((report) => {
      const key = `${report.leadType}:${report.leadId}`;
      if (!latestReportByLead.has(key)) latestReportByLead.set(key, report);
    });
  const leads = storedLeads.map((lead) => {
    const report = latestReportByLead.get(`${lead.leadType}:${lead.id}`);
    return report
      ? {
          ...lead,
          manualReviewReportStatus: report.reportStatus,
          manualReviewReportGeneratedAt: report.reportGeneratedAt,
          manualReviewReportConfidence: report.reportConfidence,
          manualReviewReportRecommendedAdminStatus: report.recommendedAdminStatus,
          manualReviewReportDoNotQuoteReasons: report.doNotQuoteReasons
        }
      : lead;
  });
  const responseStatus = url.searchParams.get("responseStatus");
  const responsePriority = url.searchParams.get("responsePriority");
  const leadType = url.searchParams.get("leadType") || url.searchParams.get("lead_type");
  const status = url.searchParams.get("status");
  const limit = Math.min(Number(url.searchParams.get("limit") || 100), 250);
  const dateFrom = url.searchParams.get("dateFrom") || url.searchParams.get("date_from");
  const dateTo = url.searchParams.get("dateTo") || url.searchParams.get("date_to");
  const suburb = url.searchParams.get("suburb");
  const source = url.searchParams.get("source") || url.searchParams.get("utm");
  const search = url.searchParams.get("search");
  const overdueOnly = url.searchParams.get("overdue") === "true";
  const notificationFailed = url.searchParams.get("notificationFailed") === "true";
  const acknowledgementMissing = url.searchParams.get("acknowledgementMissing") === "true";
  const view = url.searchParams.get("view");
  const fitTier = url.searchParams.get("fitTier");
  const qualificationStatus = url.searchParams.get("qualificationStatus");
  const urgency = url.searchParams.get("urgency");
  const projectValueBand = url.searchParams.get("projectValueBand");
  const riskLevel = url.searchParams.get("riskLevel");
  const evidenceQuality = url.searchParams.get("evidenceQuality");
  const manualReviewRequired = url.searchParams.get("manualReviewRequired") === "true";
  const recommendedNextAction = url.searchParams.get("recommendedNextAction");
  const notFit = url.searchParams.get("notFit") === "true";
  const readyForSiteMeasure = url.searchParams.get("readyForSiteMeasure") === "true";
  const readyForQuoteReview = url.searchParams.get("readyForQuoteReview") === "true";
  const reportStatus = url.searchParams.get("reportStatus");
  const reportConfidence = url.searchParams.get("reportConfidence");
  const reportNotGenerated = url.searchParams.get("reportNotGenerated") === "true";
  const doNotQuote = url.searchParams.get("doNotQuote") === "true";
  const awaitingEvidence = url.searchParams.get("awaitingEvidence") === "true";

  const filtered = leads.filter((lead) => {
    if (leadType && lead.leadType !== leadType) return false;
    if (status && leadStatuses.includes(status as never) && lead.status !== status) return false;
    if (dateFrom && new Date(lead.createdAt).getTime() < new Date(dateFrom).getTime()) return false;
    if (dateTo && new Date(lead.createdAt).getTime() > new Date(dateTo).getTime()) return false;
    if (suburb && !(lead.suburb || lead.contact.suburb || "").toLowerCase().includes(suburb.toLowerCase())) return false;
    if (source) {
      const sourceText = [lead.sourceRoute, lead.landingPage, lead.utmSource, lead.utmMedium, lead.utmCampaign, lead.utmContent, lead.utmTerm]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!sourceText.includes(source.toLowerCase())) return false;
    }
    if (search) {
      const haystack = [lead.contact.name, lead.contact.email, lead.contact.phone, lead.suburb, lead.contact.suburb]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search.toLowerCase())) return false;
    }
    if (responseStatus && responseStatuses.includes(responseStatus as never) && lead.responseStatus !== responseStatus) {
      return false;
    }
    if (responsePriority && responsePriorities.includes(responsePriority as never) && lead.responsePriority !== responsePriority) {
      return false;
    }
    if (overdueOnly && !isOverdue(lead)) return false;
    if (notificationFailed && !lead.notificationResult?.notificationErrors.length) return false;
    if (acknowledgementMissing && lead.acknowledgementSentAt) return false;
    if (view === "manual-review") {
      const lowQuote = lead.quoteClarityScore !== undefined && lead.quoteClarityScore < 65;
      const lowEstimate = lead.confidenceScore !== undefined && lead.confidenceScore < 58;
      const highRisk = lead.riskLevel === "high" || lead.riskLevel === "critical";
      const blocksNextStep = lead.evidenceQuality === "missing" || lead.evidenceQuality === "thin";
      if (!lead.manualReviewRequired && lead.leadFitTier !== "needs_review" && !highRisk && !lowQuote && !lowEstimate && !blocksNextStep) {
        return false;
      }
    }
    if (fitTier && leadFitTiers.includes(fitTier as never) && lead.leadFitTier !== fitTier) return false;
    if (qualificationStatus && qualificationStatuses.includes(qualificationStatus as never) && lead.qualificationStatus !== qualificationStatus) {
      return false;
    }
    if (urgency && urgencyLevels.includes(urgency as never) && lead.urgency !== urgency) return false;
    if (projectValueBand && projectValueBands.includes(projectValueBand as never) && lead.projectValueBand !== projectValueBand) {
      return false;
    }
    if (riskLevel && riskLevels.includes(riskLevel as never) && lead.riskLevel !== riskLevel) return false;
    if (evidenceQuality && evidenceQualities.includes(evidenceQuality as never) && lead.evidenceQuality !== evidenceQuality) return false;
    if (manualReviewRequired && !lead.manualReviewRequired) return false;
    if (recommendedNextAction && recommendedNextActions.includes(recommendedNextAction as never) && lead.recommendedNextAction !== recommendedNextAction) {
      return false;
    }
    if (notFit && lead.qualificationStatus !== "not_fit" && lead.leadFitTier !== "not_fit") return false;
    if (readyForSiteMeasure && lead.qualificationStatus !== "ready_for_site_measure") return false;
    if (readyForQuoteReview && lead.qualificationStatus !== "ready_for_quote_review") return false;
    if (reportStatus && lead.manualReviewReportStatus !== reportStatus) return false;
    if (reportConfidence && lead.manualReviewReportConfidence !== reportConfidence) return false;
    if (reportNotGenerated && lead.manualReviewReportStatus) return false;
    if (doNotQuote && !lead.manualReviewReportDoNotQuoteReasons?.length) return false;
    if (awaitingEvidence && lead.qualificationStatus !== "evidence_requested" && lead.evidenceQuality !== "missing" && lead.evidenceQuality !== "thin") return false;
    return true;
  }).slice(0, limit);

  const summary = {
    totalLeads: leads.length,
    newLeads: leads.filter((lead) => lead.status === "new").length,
    estimateLeads: leads.filter((lead) => lead.leadType === "estimate").length,
    quoteReviewLeads: leads.filter((lead) => lead.leadType === "quote_review").length,
    requestReviewLeads: leads.filter((lead) => lead.leadType === "request_review").length,
    siteMeasureLeads: leads.filter((lead) => lead.leadType === "site_measure").length,
    highRiskLeads: leads.filter((lead) => lead.riskLevel === "high" || lead.riskLevel === "critical" || lead.riskFlags.length >= 3).length,
    notificationNotSent: leads.filter(
      (lead) => !lead.notificationResult?.adminNotificationSent && !lead.notificationResult?.customerAcknowledgementSent
    ).length,
    newUnresponded: leads.filter((lead) => lead.responseStatus === "not_started").length,
    urgentResponseDue: leads.filter((lead) => lead.responsePriority === "urgent" || isOverdue(lead)).length,
    notificationFailures: leads.filter((lead) => lead.notificationResult?.notificationErrors.length).length,
    siteMeasuresAwaitingContact: leads.filter(
      (lead) => lead.leadType === "site_measure" && !["contacted", "booked", "site_measure_booked", "closed"].includes(lead.responseStatus)
    ).length,
    quoteReviewsAwaitingReview: leads.filter(
      (lead) => lead.leadType === "quote_review" && !["contacted", "awaiting_customer", "closed"].includes(lead.responseStatus)
    ).length,
    unreviewedLeads: leads.filter((lead) => lead.qualificationStatus === "unreviewed" || !lead.leadFitTier).length,
    manualReviewNeeded: leads.filter((lead) => lead.manualReviewRequired || lead.qualificationStatus === "manual_review_needed").length,
    qualifiedLeads: leads.filter((lead) => lead.qualificationStatus === "qualified" || lead.qualificationStatus === "system_qualified").length,
    highRiskHighValue: leads.filter(
      (lead) => (lead.riskLevel === "high" || lead.riskLevel === "critical") && (lead.projectValueBand === "high" || lead.projectValueBand === "premium")
    ).length,
    evidenceMissing: leads.filter((lead) => lead.evidenceQuality === "missing" || lead.evidenceQuality === "thin").length,
    readyForSiteMeasure: leads.filter((lead) => lead.qualificationStatus === "ready_for_site_measure").length,
    readyForQuoteReview: leads.filter((lead) => lead.qualificationStatus === "ready_for_quote_review").length,
    notFit: leads.filter((lead) => lead.qualificationStatus === "not_fit" || lead.leadFitTier === "not_fit").length
  };

  return NextResponse.json({ ok: true, leads: filtered, summary });
}
