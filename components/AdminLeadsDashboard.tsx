"use client";

import { useEffect, useMemo, useState } from "react";
import { getEvidenceLabel } from "@/lib/evidence-labels";
import {
  evidenceStatuses,
  evidenceQualities,
  leadFitTiers,
  leadStatuses,
  NormalizedLead,
  projectValueBands,
  qualificationStatuses,
  recommendedNextActions,
  responsePriorities,
  responseStatuses,
  riskLevels,
  urgencyLevels
} from "@/lib/lead-workflow";
import { ManualReviewReport } from "@/lib/bathroom-manual-review-report";
import { ResponseTemplateBundle } from "@/lib/response-templates";

type Summary = {
  totalLeads: number;
  newLeads: number;
  estimateLeads: number;
  quoteReviewLeads: number;
  requestReviewLeads: number;
  siteMeasureLeads: number;
  highRiskLeads: number;
  notificationNotSent: number;
  newUnresponded: number;
  urgentResponseDue: number;
  notificationFailures: number;
  siteMeasuresAwaitingContact: number;
  quoteReviewsAwaitingReview: number;
  unreviewedLeads: number;
  manualReviewNeeded: number;
  qualifiedLeads: number;
  highRiskHighValue: number;
  evidenceMissing: number;
  readyForSiteMeasure: number;
  readyForQuoteReview: number;
  notFit: number;
};

type ReportResponse = {
  ok: boolean;
  report: ManualReviewReport | null;
  persisted: boolean;
};

const emptySummary: Summary = {
  totalLeads: 0,
  newLeads: 0,
  estimateLeads: 0,
  quoteReviewLeads: 0,
  requestReviewLeads: 0,
  siteMeasureLeads: 0,
  highRiskLeads: 0,
  notificationNotSent: 0,
  newUnresponded: 0,
  urgentResponseDue: 0,
  notificationFailures: 0,
  siteMeasuresAwaitingContact: 0,
  quoteReviewsAwaitingReview: 0,
  unreviewedLeads: 0,
  manualReviewNeeded: 0,
  qualifiedLeads: 0,
  highRiskHighValue: 0,
  evidenceMissing: 0,
  readyForSiteMeasure: 0,
  readyForQuoteReview: 0,
  notFit: 0
};

function label(value?: string | null) {
  return value ? value.replaceAll("_", " ").replaceAll("-", " ") : "not supplied";
}

function yesNo(value?: boolean) {
  return value ? "yes" : "no";
}

function notificationLabel(lead: NormalizedLead) {
  const result = lead.notificationResult;
  if (result?.adminNotificationSent) return "admin sent";
  if (result?.notificationPrepared) {
    if (!result.notificationMode) return "prepared only";
    return result.notificationMode === "send" ? "not sent" : `${result.notificationMode} only`;
  }
  return "not configured";
}

function acknowledgementLabel(lead: NormalizedLead) {
  const result = lead.notificationResult;
  if (result?.customerAcknowledgementSent) return "sent";
  if (result?.customerAcknowledgementPrepared) {
    if (!result.notificationMode) return "prepared only";
    return result.notificationMode === "send" ? "not sent" : `${result.notificationMode} only`;
  }
  return "not configured";
}

export function AdminLeadsDashboard() {
  const [token, setToken] = useState("");
  const [leads, setLeads] = useState<NormalizedLead[]>([]);
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");
  const [templates, setTemplates] = useState<ResponseTemplateBundle | null>(null);
  const [notificationPreview, setNotificationPreview] = useState<string | null>(null);
  const [manualReviewReport, setManualReviewReport] = useState<ManualReviewReport | null>(null);
  const [reportPersisted, setReportPersisted] = useState(false);
  const [reportNote, setReportNote] = useState("");
  const [qualificationNote, setQualificationNote] = useState("");
  const [filters, setFilters] = useState({
    view: "",
    leadType: "",
    status: "",
    suburb: "",
    source: "",
    search: "",
    responseStatus: "",
    responsePriority: "",
    fitTier: "",
    qualificationStatus: "",
    urgency: "",
    projectValueBand: "",
    riskLevel: "",
    evidenceQuality: "",
    recommendedNextAction: "",
    manualReviewRequired: false,
    overdue: false,
    notificationFailed: false,
    notFit: false,
    readyForSiteMeasure: false,
    readyForQuoteReview: false,
    reportStatus: "",
    reportConfidence: "",
    reportNotGenerated: false,
    doNotQuote: false,
    awaitingEvidence: false
  });

  const selected = useMemo(
    () => leads.find((lead) => `${lead.leadType}:${lead.id}` === selectedId) || leads[0],
    [leads, selectedId]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryToken = params.get("token") || window.localStorage.getItem("operonBathroomsAdminToken") || "";
    const view = params.get("view") || "";
    setToken(queryToken);
    if (view) setFilters((current) => ({ ...current, view }));
  }, []);

  useEffect(() => {
    if (!token) return;
    window.localStorage.setItem("operonBathroomsAdminToken", token);
    void loadLeads(token);
  }, [token]);

  useEffect(() => {
    if (!token || !selected) return;
    void loadManualReviewReport(selected);
  }, [selected?.id, selected?.leadType, token]);

  async function loadLeads(nextToken = token) {
    const params = new URLSearchParams({ token: nextToken });
    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        if (value) params.set(key, "true");
      } else if (value) {
        params.set(key, value);
      }
    });
    const response = await fetch(`/api/admin/leads?${params.toString()}`);
    const json = await response.json();
    if (!response.ok) {
      setMessage(json.error || "Unable to load leads");
      return;
    }
    setLeads(json.leads);
    setSummary(json.summary);
    setMessage("");
  }

  function mergeLead(nextLead: NormalizedLead) {
    setLeads((current) => current.map((lead) => (lead.id === nextLead.id && lead.leadType === nextLead.leadType ? nextLead : lead)));
  }

  async function adminPost(path: string, body: Record<string, unknown>) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error || "Admin action failed");
    return json;
  }

  async function loadTemplates(lead = selected) {
    if (!lead) return;
    try {
      const json = await adminPost("/api/admin/response-template", { leadType: lead.leadType, leadId: lead.id });
      setTemplates(json.templates);
      setMessage("Response templates prepared.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to generate templates");
    }
  }

  async function loadNotificationPreview(lead = selected) {
    if (!lead) return;
    try {
      const json = await adminPost("/api/admin/notification-preview", { leadType: lead.leadType, leadId: lead.id });
      setNotificationPreview(
        [
          json.notification.adminNotificationPayload.subject,
          "",
          json.notification.adminNotificationPayload.text,
          "",
          "--- Customer acknowledgement ---",
          json.notification.customerAcknowledgementPayload.text
        ].join("\n")
      );
      setMessage("Notification preview prepared.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to prepare notification preview");
    }
  }

  async function loadManualReviewReport(lead = selected) {
    if (!lead) return;
    try {
      const params = new URLSearchParams({ token, leadType: lead.leadType, leadId: lead.id });
      const response = await fetch(`/api/admin/manual-review-report?${params.toString()}`);
      const json = (await response.json()) as ReportResponse & { error?: string };
      if (!response.ok) throw new Error(json.error || "Unable to load manual review report");
      setManualReviewReport(json.report);
      setReportPersisted(json.persisted);
      setMessage(json.report ? "Manual review report loaded." : "No manual review report generated yet.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load manual review report");
    }
  }

  async function generateManualReviewReport(regenerate = false) {
    if (!selected) return;
    try {
      const json = (await adminPost("/api/admin/manual-review-report", {
        leadType: selected.leadType,
        leadId: selected.id,
        regenerate
      })) as ReportResponse;
      setManualReviewReport(json.report);
      setReportPersisted(json.persisted);
      setMessage(json.persisted ? "Manual review report generated." : "Report preview generated; persistence unavailable.");
      await loadLeads();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to generate manual review report");
    }
  }

  async function previewManualReviewReport() {
    if (!selected) return;
    try {
      const json = (await adminPost("/api/admin/manual-review-report-preview", {
        leadType: selected.leadType,
        leadId: selected.id
      })) as ReportResponse;
      setManualReviewReport(json.report);
      setReportPersisted(false);
      setMessage("Manual review report preview prepared.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to preview manual review report");
    }
  }

  async function updateManualReviewReportStatus(reportStatus: string) {
    if (!manualReviewReport) return;
    try {
      const json = (await adminPost("/api/admin/manual-review-report-update", {
        reportId: manualReviewReport.reportId,
        reportStatus,
        internalReviewNote: reportNote
      })) as ReportResponse;
      setManualReviewReport(json.report);
      setReportPersisted(true);
      setMessage("Manual review report updated.");
      await loadLeads();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update manual review report");
    }
  }

  async function updateLead(path: string, patch: Record<string, unknown>, success: string) {
    if (!selected) return;
    try {
      const json = await adminPost(path, { leadType: selected.leadType, leadId: selected.id, ...patch });
      mergeLead(json.lead);
      setMessage(success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update lead");
    }
  }

  async function bulkQualify() {
    try {
      const json = await adminPost("/api/admin/bulk-qualify-leads", { limit: 10 });
      setMessage(`Bulk qualification processed ${json.counts.processed} leads.`);
      await loadLeads();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to bulk qualify leads");
    }
  }

  async function copyText(text: string, copiedMessage: string) {
    await navigator.clipboard.writeText(text);
    setMessage(copiedMessage);
  }

  return (
    <section className="page-section">
      <div className="container">
        <p className="pill">Admin only</p>
        <h1>Bathroom leads</h1>
        <p className="lead">
          Lead response, qualification and manual review workflow. This page is token-protected,
          noindex and excluded from public navigation.
        </p>

        <div className="panel admin-login">
          <label>
            Admin token
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              type="password"
              placeholder="Enter configured admin token"
            />
          </label>
          <button onClick={() => loadLeads()}>Load leads</button>
          <button className="secondary" onClick={bulkQualify}>Run qualification on unreviewed</button>
          {message ? <p className="notice">{message}</p> : null}
        </div>

        <div className="grid four">
          <SummaryCard title="Total leads" value={summary.totalLeads ?? leads.length} />
          <SummaryCard title="New leads" value={summary.newLeads ?? 0} />
          <SummaryCard title="Estimates" value={summary.estimateLeads ?? 0} />
          <SummaryCard title="Quote reviews" value={summary.quoteReviewLeads ?? 0} />
          <SummaryCard title="Request reviews" value={summary.requestReviewLeads ?? 0} />
          <SummaryCard title="Site measures" value={summary.siteMeasureLeads ?? 0} />
          <SummaryCard title="High risk" value={summary.highRiskLeads ?? 0} />
          <SummaryCard title="Notification not sent" value={summary.notificationNotSent ?? 0} />
          <SummaryCard title="Unreviewed" value={summary.unreviewedLeads} />
          <SummaryCard title="Manual review" value={summary.manualReviewNeeded} />
          <SummaryCard title="Evidence missing" value={summary.evidenceMissing} />
          <SummaryCard title="Ready site measure" value={summary.readyForSiteMeasure} />
          <SummaryCard title="Ready quote review" value={summary.readyForQuoteReview} />
          <SummaryCard title="Qualified" value={summary.qualifiedLeads} />
          <SummaryCard title="High-risk high-value" value={summary.highRiskHighValue} />
          <SummaryCard title="Not fit" value={summary.notFit} />
        </div>

        <div className="panel admin-filters">
          <select value={filters.leadType} onChange={(event) => setFilters((current) => ({ ...current, leadType: event.target.value }))}>
            <option value="">All lead types</option>
            <option value="estimate">Estimate</option>
            <option value="quote_review">Quote review</option>
            <option value="request_review">Request review</option>
            <option value="site_measure">Site measure</option>
          </select>
          <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
            <option value="">All statuses</option>
            {leadStatuses.map((status) => <option value={status} key={status}>{label(status)}</option>)}
          </select>
          <select
            value={filters.responseStatus}
            onChange={(event) => setFilters((current) => ({ ...current, responseStatus: event.target.value }))}
          >
            <option value="">All response statuses</option>
            {responseStatuses.map((status) => <option value={status} key={status}>{label(status)}</option>)}
          </select>
          <select
            value={filters.responsePriority}
            onChange={(event) => setFilters((current) => ({ ...current, responsePriority: event.target.value }))}
          >
            <option value="">All response priorities</option>
            {responsePriorities.map((priority) => <option value={priority} key={priority}>{label(priority)}</option>)}
          </select>
          <input
            placeholder="Suburb"
            value={filters.suburb}
            onChange={(event) => setFilters((current) => ({ ...current, suburb: event.target.value }))}
          />
          <input
            placeholder="Source or UTM"
            value={filters.source}
            onChange={(event) => setFilters((current) => ({ ...current, source: event.target.value }))}
          />
          <input
            placeholder="Search name/email/phone"
            value={filters.search}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
          />
          <select value={filters.view} onChange={(event) => setFilters((current) => ({ ...current, view: event.target.value }))}>
            <option value="">All views</option>
            <option value="manual-review">Manual review queue</option>
          </select>
          <select value={filters.fitTier} onChange={(event) => setFilters((current) => ({ ...current, fitTier: event.target.value }))}>
            <option value="">All fit tiers</option>
            {leadFitTiers.map((tier) => <option value={tier} key={tier}>{label(tier)}</option>)}
          </select>
          <select
            value={filters.qualificationStatus}
            onChange={(event) => setFilters((current) => ({ ...current, qualificationStatus: event.target.value }))}
          >
            <option value="">All qualification statuses</option>
            {qualificationStatuses.map((status) => <option value={status} key={status}>{label(status)}</option>)}
          </select>
          <select value={filters.riskLevel} onChange={(event) => setFilters((current) => ({ ...current, riskLevel: event.target.value }))}>
            <option value="">All risk levels</option>
            {riskLevels.map((risk) => <option value={risk} key={risk}>{label(risk)}</option>)}
          </select>
          <select value={filters.urgency} onChange={(event) => setFilters((current) => ({ ...current, urgency: event.target.value }))}>
            <option value="">All urgency levels</option>
            {urgencyLevels.map((urgency) => <option value={urgency} key={urgency}>{label(urgency)}</option>)}
          </select>
          <select
            value={filters.projectValueBand}
            onChange={(event) => setFilters((current) => ({ ...current, projectValueBand: event.target.value }))}
          >
            <option value="">All value bands</option>
            {projectValueBands.map((band) => <option value={band} key={band}>{label(band)}</option>)}
          </select>
          <select
            value={filters.evidenceQuality}
            onChange={(event) => setFilters((current) => ({ ...current, evidenceQuality: event.target.value }))}
          >
            <option value="">All evidence quality</option>
            {evidenceQualities.map((quality) => <option value={quality} key={quality}>{label(quality)}</option>)}
          </select>
          <select
            value={filters.reportStatus}
            onChange={(event) => setFilters((current) => ({ ...current, reportStatus: event.target.value }))}
          >
            <option value="">All report statuses</option>
            {["draft", "generated", "reviewed", "superseded", "archived"].map((status) => <option value={status} key={status}>{label(status)}</option>)}
          </select>
          <select
            value={filters.reportConfidence}
            onChange={(event) => setFilters((current) => ({ ...current, reportConfidence: event.target.value }))}
          >
            <option value="">All report confidence</option>
            {["high", "medium", "low"].map((confidence) => <option value={confidence} key={confidence}>{label(confidence)}</option>)}
          </select>
          <select
            value={filters.recommendedNextAction}
            onChange={(event) => setFilters((current) => ({ ...current, recommendedNextAction: event.target.value }))}
          >
            <option value="">All next actions</option>
            {recommendedNextActions.map((action) => <option value={action} key={action}>{label(action)}</option>)}
          </select>
          <label className="check-row">
            <input
              type="checkbox"
              checked={filters.manualReviewRequired}
              onChange={(event) => setFilters((current) => ({ ...current, manualReviewRequired: event.target.checked }))}
            />
            Manual review
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={filters.notFit}
              onChange={(event) => setFilters((current) => ({ ...current, notFit: event.target.checked }))}
            />
            Not fit
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={filters.readyForSiteMeasure}
              onChange={(event) => setFilters((current) => ({ ...current, readyForSiteMeasure: event.target.checked }))}
            />
            Ready site measure
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={filters.readyForQuoteReview}
              onChange={(event) => setFilters((current) => ({ ...current, readyForQuoteReview: event.target.checked }))}
            />
            Ready quote review
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={filters.reportNotGenerated}
              onChange={(event) => setFilters((current) => ({ ...current, reportNotGenerated: event.target.checked }))}
            />
            Report not generated
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={filters.doNotQuote}
              onChange={(event) => setFilters((current) => ({ ...current, doNotQuote: event.target.checked }))}
            />
            Do not quote
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={filters.awaitingEvidence}
              onChange={(event) => setFilters((current) => ({ ...current, awaitingEvidence: event.target.checked }))}
            />
            Awaiting evidence
          </label>
          <button onClick={() => loadLeads()}>Apply filters</button>
        </div>

        <div className="admin-grid">
          <div className="panel">
            <h2>{filters.view === "manual-review" ? "Manual review queue" : "Lead list"}</h2>
            <div className="admin-list">
              {leads.map((lead) => (
                <button
                  className="admin-row"
                  key={`${lead.leadType}:${lead.id}`}
                  onClick={() => {
                    setSelectedId(`${lead.leadType}:${lead.id}`);
                    setQualificationNote(lead.qualificationNotes || "");
                    setTemplates(null);
                    setNotificationPreview(null);
                    setManualReviewReport(null);
                    setReportPersisted(false);
                  }}
                >
                  <strong>{lead.contact.name || "Unnamed lead"}</strong>
                  <span>{label(lead.leadType)} · {lead.suburb || "suburb not supplied"}</span>
                  <span>{label(lead.leadFitTier)} · score {lead.leadFitScore ?? "n/a"} · {label(lead.riskLevel)}</span>
                  <span>{label(lead.evidenceQuality)} evidence · {lead.missingEvidence.length} missing</span>
                  <span>{label(lead.recommendedNextAction)} · {label(lead.qualificationStatus)}</span>
                  <span>Notify {notificationLabel(lead)} · ack {acknowledgementLabel(lead)}</span>
                  <span>{label(lead.responsePriority)} · {label(lead.responseStatus)} · due {lead.responseDueAt || "not set"}</span>
                  <span>Last contacted {lead.lastContactedAt || "not yet"}</span>
                  <span>
                    Report {label(lead.manualReviewReportStatus)} · {label(lead.manualReviewReportConfidence)}
                    {lead.manualReviewReportDoNotQuoteReasons?.length ? " · do not quote" : ""}
                  </span>
                </button>
              ))}
              {!leads.length ? <p>No leads match the current filters.</p> : null}
            </div>
          </div>

          {selected ? (
            <div className="panel">
              <h2>Lead detail</h2>
              <div className="score-row">
                <span className="pill">{label(selected.leadFitTier)}</span>
                <span className="pill">Score {selected.leadFitScore ?? "n/a"}</span>
                <span className="pill">{label(selected.riskLevel)} risk</span>
                <span className="pill">{label(selected.urgency)}</span>
              </div>

              <div className="grid two">
                <Detail title="Contact" items={[selected.contact.name, selected.contact.email, selected.contact.phone, selected.suburb, selected.propertyType]} />
                <Detail title="Admin status" items={[
                  `Status: ${label(selected.status)}`,
                  `Response: ${label(selected.responseStatus)}`,
                  `Priority: ${label(selected.responsePriority)}`,
                  `Response due: ${selected.responseDueAt || "not set"}`,
                  `First response: ${selected.firstResponseAt || "not set"}`,
                  `Last contacted: ${selected.lastContactedAt || "not set"}`,
                  `Follow up: ${selected.followUpAt || "not set"}`,
                  `Last updated: ${selected.updatedAt || "not set"}`,
                  `Notification prepared: ${yesNo(selected.notificationResult?.notificationPrepared)}`,
                  `Admin notification prepared: ${yesNo(selected.notificationResult?.adminNotificationPrepared)}`,
                  `Admin notification sent: ${yesNo(selected.notificationResult?.adminNotificationSent)}`,
                  `Customer acknowledgement prepared: ${yesNo(selected.notificationResult?.customerAcknowledgementPrepared)}`,
                  `Customer acknowledgement sent: ${yesNo(selected.notificationResult?.customerAcknowledgementSent)}`,
                  `Notification mode: ${label(selected.notificationResult?.notificationMode)}`,
                  `Provider: ${label(selected.notificationResult?.provider)}`,
                  `Admin sent at: ${selected.notificationResult?.adminNotificationSentAt || "not set"}`,
                  `Customer ack sent at: ${selected.notificationResult?.customerAcknowledgementSentAt || "not set"}`,
                  `Warnings: ${selected.notificationResult?.notificationWarnings?.join("; ") || "none"}`,
                  `Errors: ${selected.notificationResult?.notificationErrors?.join("; ") || "none"}`
                ]} />
                <Detail
                  title="Qualification"
                  items={[
                    `Status: ${label(selected.qualificationStatus)}`,
                    `Value band: ${label(selected.projectValueBand)}`,
                    `Evidence: ${label(selected.evidenceQuality)}`,
                    `Manual review: ${selected.manualReviewRequired ? "yes" : "no"}`,
                    `Next action: ${label(selected.recommendedNextAction)}`
                  ]}
                />
                <Detail
                  title="Lead signals"
                  items={[
                    selected.estimateRange,
                    selected.confidenceScore !== undefined ? `Confidence ${selected.confidenceScore}/100` : "",
                    selected.quoteClarityScore !== undefined ? `Clarity ${selected.quoteClarityScore}/100` : "",
                    selected.recommendedNextStep
                  ]}
                />
                <Detail
                  title="Attribution"
                  items={[selected.sourceRoute, selected.landingPage, selected.referrer, [selected.utmSource, selected.utmMedium, selected.utmCampaign].filter(Boolean).join(" / ")]}
                />
              </div>

              <div className="notice">
                <strong>Qualification summary</strong>
                <p>{selected.qualificationSummary || "Run qualification to prepare a decision-ready summary."}</p>
              </div>

              <Detail title="Manual review reasons" items={selected.manualReviewReason.length ? selected.manualReviewReason : ["No manual review reasons recorded"]} />
              <Detail title="Missing evidence" items={selected.missingEvidence.length ? selected.missingEvidence : ["No missing evidence recorded"]} />
              <Detail title="Disqualification flags" items={selected.disqualificationFlags.length ? selected.disqualificationFlags : ["No disqualification flags recorded"]} />
              <Detail title="Risk flags" items={selected.riskFlags.length ? selected.riskFlags : ["No risk flags supplied"]} />
              <Detail title="Compliance prompts" items={
                Array.isArray(selected.scoringResult.compliancePrompts)
                  ? selected.scoringResult.compliancePrompts.map(String)
                  : ["No compliance prompts recorded"]
              } />
              <Detail title="Upload metadata" items={
                selected.payload.upload && typeof selected.payload.upload === "object"
                  ? Object.entries(selected.payload.upload as Record<string, unknown>).map(([key, value]) => `${key}: ${String(value || "not supplied")}`)
                  : ["No upload metadata supplied"]
              } />

              <div className="panel">
                <h2>Manual Review Report</h2>
                <div className="admin-actions">
                  <button onClick={() => generateManualReviewReport(false)}>Generate report</button>
                  <button className="secondary" onClick={() => generateManualReviewReport(true)}>Regenerate report</button>
                  <button className="secondary" onClick={previewManualReviewReport}>Preview without saving</button>
                  <button className="ghost" onClick={() => loadManualReviewReport()}>Load latest report</button>
                  <button
                    className="secondary"
                    onClick={() => updateManualReviewReportStatus("reviewed")}
                    disabled={!manualReviewReport}
                  >
                    Mark report reviewed
                  </button>
                </div>
                {manualReviewReport ? (
                  <>
                    <div className="score-row">
                      <span className="pill">{label(manualReviewReport.reportStatus)}</span>
                      <span className="pill">{label(manualReviewReport.reportConfidence)} confidence</span>
                      <span className="pill">{reportPersisted ? "persisted" : "preview only"}</span>
                    </div>
                    <p className="lead">{manualReviewReport.headlineSummary}</p>
                    <div className="grid two">
                      <Detail
                        title="Report status"
                        items={[
                          `Generated: ${manualReviewReport.reportGeneratedAt}`,
                          `Reviewed: ${manualReviewReport.reportReviewedAt || "not reviewed"}`,
                          `Version: ${manualReviewReport.reportVersion}`,
                          `Recommended action: ${label(manualReviewReport.recommendedNextAction)}`,
                          `Recommended admin status: ${label(manualReviewReport.recommendedAdminStatus)}`,
                          `Template key: ${label(manualReviewReport.recommendedResponseTemplateKey)}`,
                          `Manual review required: ${manualReviewReport.manualReviewRequired ? "yes" : "no"}`
                        ]}
                      />
                      <Detail title="Lead snapshot" items={Object.entries(manualReviewReport.leadSnapshot).map(([key, value]) => `${label(key)}: ${String(value || "not supplied")}`)} />
                      <Detail title="Project summary" items={manualReviewReport.projectSummary} />
                      <Detail title="Qualification summary" items={manualReviewReport.qualificationSummary} />
                      <Detail title="Risk summary" items={manualReviewReport.riskSummary} />
                      <Detail title="Compliance summary" items={manualReviewReport.compliancePromptSummary} />
                      <Detail title="Evidence received" items={manualReviewReport.evidenceSummary.received.length ? manualReviewReport.evidenceSummary.received : ["None recorded"]} />
                      <Detail title="Evidence missing" items={manualReviewReport.evidenceSummary.missing.length ? manualReviewReport.evidenceSummary.missing : ["No missing evidence recorded"]} />
                      <Detail title="Customer questions" items={manualReviewReport.customerFollowUpQuestions} />
                      <Detail title="Do-not-quote reasons" items={manualReviewReport.doNotQuoteReasons.length ? manualReviewReport.doNotQuoteReasons : ["No do-not-quote reasons"]} />
                      <Detail title="Next-step checklist" items={manualReviewReport.nextStepChecklist} />
                      <Detail title="Internal review notes" items={manualReviewReport.internalReviewNotes} />
                    </div>
                    {manualReviewReport.quoteReviewSummary ? <Detail title="Quote review summary" items={manualReviewReport.quoteReviewSummary} /> : null}
                    <div className="notice">
                      <strong>Site-measure readiness</strong>
                      <p>{manualReviewReport.siteMeasureReadiness}</p>
                    </div>
                    <div className="admin-actions">
                      <button onClick={() => copyText(manualReviewReport.copyTemplates.internalProjectSummary, "Internal summary copied.")}>Copy internal summary</button>
                      <button className="secondary" onClick={() => copyText(manualReviewReport.copyTemplates.customerFollowUpMessage, "Customer questions copied.")}>Copy customer follow-up questions</button>
                      <button className="secondary" onClick={() => copyText(manualReviewReport.copyTemplates.siteMeasureChecklist, "Site-measure checklist copied.")}>Copy site-measure checklist</button>
                      {manualReviewReport.leadType === "quote_review" ? (
                        <button className="secondary" onClick={() => copyText(manualReviewReport.copyTemplates.quoteReviewChecklist, "Quote-review checklist copied.")}>Copy quote-review checklist</button>
                      ) : null}
                    </div>
                    <label>
                      Internal report note
                      <textarea value={reportNote} onChange={(event) => setReportNote(event.target.value)} />
                    </label>
                  </>
                ) : (
                  <p className="muted">Generate or load an internal manual review report for this lead.</p>
                )}
              </div>

              <div className="panel">
                <h2>Submitted payload</h2>
                <pre className="admin-copy">{JSON.stringify(selected.payload, null, 2)}</pre>
              </div>

              <div className="admin-actions">
                <button onClick={() => updateLead("/api/admin/qualify-lead", {}, "Qualification refreshed.")}>Run qualification</button>
                <button className="secondary" onClick={() => updateLead("/api/admin/qualification-update", { qualificationStatus: "qualified", leadFitTier: "good_fit" }, "Lead marked qualified.")}>Mark qualified</button>
                <button className="secondary" onClick={() => updateLead("/api/admin/qualification-update", { qualificationStatus: "not_fit", leadFitTier: "not_fit" }, "Lead marked not fit.")}>Mark not fit</button>
                <button className="secondary" onClick={() => updateLead("/api/admin/qualification-update", { qualificationStatus: "ready_for_site_measure", recommendedNextAction: "book_site_measure" }, "Ready for site measure.")}>Ready for site measure</button>
                <button className="secondary" onClick={() => updateLead("/api/admin/qualification-update", { qualificationStatus: "ready_for_quote_review", recommendedNextAction: "prepare_manual_quote_review" }, "Ready for manual quote review.")}>Ready for quote review</button>
                <button className="secondary" onClick={() => updateLead("/api/admin/qualification-update", { qualificationStatus: "evidence_requested" }, "Evidence requested.")}>Mark evidence requested</button>
                <button className="secondary" onClick={() => updateLead("/api/admin/qualification-update", { qualificationStatus: "evidence_received" }, "Evidence received.")}>Mark evidence received</button>
                <button className="secondary" onClick={() => updateLead("/api/admin/qualification-update", { manualReviewRequired: true, qualificationStatus: "manual_review_needed" }, "Manual review required.")}>Require manual review</button>
                <button className="secondary" onClick={() => updateLead("/api/admin/qualification-update", { manualReviewRequired: false }, "Manual review cleared.")}>Clear manual review</button>
                <button className="ghost" onClick={() => loadTemplates()}>Prepare response copy</button>
                <button className="ghost" onClick={() => loadNotificationPreview()}>Preview notification</button>
              </div>

              <div className="panel">
                <h2>Override qualification</h2>
                <div className="form-grid">
                  <SelectControl
                    labelText="Fit tier"
                    value={selected.leadFitTier || ""}
                    options={leadFitTiers}
                    onChange={(value) => updateLead("/api/admin/qualification-update", { leadFitTier: value }, "Fit tier updated.")}
                  />
                  <SelectControl
                    labelText="Risk level"
                    value={selected.riskLevel || ""}
                    options={riskLevels}
                    onChange={(value) => updateLead("/api/admin/qualification-update", { riskLevel: value }, "Risk level updated.")}
                  />
                  <SelectControl
                    labelText="Urgency"
                    value={selected.urgency || ""}
                    options={urgencyLevels}
                    onChange={(value) => updateLead("/api/admin/qualification-update", { urgency: value }, "Urgency updated.")}
                  />
                  <SelectControl
                    labelText="Project value band"
                    value={selected.projectValueBand || ""}
                    options={projectValueBands}
                    onChange={(value) => updateLead("/api/admin/qualification-update", { projectValueBand: value }, "Value band updated.")}
                  />
                  <SelectControl
                    labelText="Evidence quality"
                    value={selected.evidenceQuality || ""}
                    options={evidenceQualities}
                    onChange={(value) => updateLead("/api/admin/qualification-update", { evidenceQuality: value }, "Evidence quality updated.")}
                  />
                  <SelectControl
                    labelText="Next action"
                    value={selected.recommendedNextAction || ""}
                    options={recommendedNextActions}
                    onChange={(value) => updateLead("/api/admin/qualification-update", { recommendedNextAction: value }, "Next action updated.")}
                  />
                  <SelectControl
                    labelText="Qualification status"
                    value={selected.qualificationStatus || ""}
                    options={qualificationStatuses}
                    onChange={(value) => updateLead("/api/admin/qualification-update", { qualificationStatus: value }, "Qualification status updated.")}
                  />
                </div>
                <label>
                  Qualification note
                  <textarea value={qualificationNote} onChange={(event) => setQualificationNote(event.target.value)} />
                </label>
                <button
                  className="secondary"
                  onClick={() => updateLead("/api/admin/qualification-update", { qualificationNotes: qualificationNote }, "Qualification note saved.")}
                >
                  Save qualification note
                </button>
              </div>

              <div className="panel">
                <h2>Evidence checklist</h2>
                <div className="admin-list">
                  {Object.entries(selected.evidenceChecklist || {}).map(([key, status]) => (
                    <div className="admin-evidence-row" key={key}>
                      <strong>{getEvidenceLabel(key)}</strong>
                      <select
                        value={status}
                        onChange={(event) =>
                          updateLead(
                            "/api/admin/evidence-update",
                            { evidenceKey: key, evidenceStatus: event.target.value },
                            "Evidence status updated."
                          )
                        }
                      >
                        {evidenceStatuses.map((nextStatus) => <option value={nextStatus} key={nextStatus}>{label(nextStatus)}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-actions">
                <button onClick={() => updateLead("/api/admin/lead-response-update", { markContacted: true }, "Lead marked contacted.")}>Mark contacted/responded</button>
                <button className="secondary" onClick={() => updateLead("/api/admin/lead-update", { status: "reviewed" }, "Lead marked reviewed.")}>Mark reviewed</button>
                <button className="secondary" onClick={() => updateLead("/api/admin/lead-update", { status: "qualified" }, "Lead status qualified.")}>Status qualified</button>
                <button className="secondary" onClick={() => updateLead("/api/admin/lead-update", { status: "not_fit" }, "Lead status not fit.")}>Status not fit</button>
                <button className="secondary" onClick={() => updateLead("/api/admin/lead-response-update", { responseStatus: "awaiting_customer" }, "Marked awaiting customer.")}>Mark awaiting customer</button>
                <button className="secondary" onClick={() => updateLead("/api/admin/lead-response-update", { responseStatus: "follow_up_needed" }, "Follow up needed.")}>Follow up needed</button>
                <button className="secondary" onClick={() => updateLead("/api/admin/lead-response-update", { responseStatus: "booked" }, "Booked.")}>Mark booked</button>
              </div>

              <label>
                Internal notes
                <textarea defaultValue={selected.internalNotes} onBlur={(event) => updateLead("/api/admin/lead-response-update", { internalNotes: event.target.value }, "Internal notes saved.")} />
              </label>

              {templates ? (
                <div className="panel">
                  <h2>Copy response</h2>
                  <div className="admin-actions">
                    <button onClick={() => copyText(`${templates.emailSubject}\n\n${templates.emailBody}`, "Email copied.")}>Copy first response email</button>
                    <button className="secondary" onClick={() => copyText(templates.smsCallScript, "SMS/call script copied.")}>Copy SMS/call script</button>
                    <button className="secondary" onClick={() => copyText(templates.internalProjectSummary, "Internal summary copied.")}>Copy internal project summary</button>
                    <button className="secondary" onClick={() => copyText(templates.missingInfoQuestions.join("\n"), "Questions copied.")}>Copy questions to ask customer</button>
                  </div>
                  <pre className="admin-copy">{templates.emailBody}</pre>
                </div>
              ) : null}
              {notificationPreview ? (
                <div className="panel">
                  <h2>Notification preview</h2>
                  <pre className="admin-copy">{notificationPreview}</pre>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="card">
      <p className="section-kicker">{title}</p>
      <strong className="range-preview">{value}</strong>
    </div>
  );
}

function Detail({ title, items }: { title: string; items: Array<string | number | undefined> }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <ul>
        {items.filter(Boolean).map((item) => <li key={String(item)}>{item}</li>)}
      </ul>
    </div>
  );
}

function SelectControl({
  labelText,
  value,
  options,
  onChange
}: {
  labelText: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {labelText}
      <select value={value} onChange={(event) => event.target.value && onChange(event.target.value)}>
        <option value="">Choose...</option>
        {options.map((option) => <option value={option} key={option}>{label(option)}</option>)}
      </select>
    </label>
  );
}
