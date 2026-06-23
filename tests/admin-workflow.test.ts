import assert from "node:assert/strict";
import test from "node:test";
import { GET as getAdminChatbotQualifications } from "../app/api/admin/chatbot-qualifications/route";
import { GET as getAdminLeads } from "../app/api/admin/leads/route";
import { POST as postBulkQualify } from "../app/api/admin/bulk-qualify-leads/route";
import { GET as getManualReviewReport, POST as postManualReviewReport } from "../app/api/admin/manual-review-report/route";
import { POST as postManualReviewPreview } from "../app/api/admin/manual-review-report-preview/route";
import { POST as postManualReviewUpdate } from "../app/api/admin/manual-review-report-update/route";
import { POST as postQualificationUpdate } from "../app/api/admin/qualification-update/route";
import { POST as postResponseTemplate } from "../app/api/admin/response-template/route";
import { POST as postChatbotQualification } from "../app/api/chatbot-qualification/route";
import { storeStructuredLead } from "../lib/lead-store";

const token = "workflow-admin-token";

function useLocalStores() {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "";
  process.env.OPERON_BATHROOMS_ADMIN_TOKEN = token;
}

function authedRequest(url: string, init: RequestInit = {}) {
  return new Request(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers || {})
    }
  });
}

async function json<T = Record<string, unknown>>(response: Response) {
  return (await response.json()) as T;
}

test("authorized admin workflow reads, qualifies and prepares safe manual review outputs", async () => {
  useLocalStores();
  const marker = globalThis.crypto.randomUUID();
  const email = `workflow-${marker}@example.com`;
  const stored = await storeStructuredLead({
    leadType: "quote_review",
    sourceRoute: "/quote/review",
    payload: {
      name: "Workflow Test",
      email,
      phone: "0400000001",
      suburb: "Bondi",
      propertyType: "apartment-strata",
      quote: {
        amount: 52000,
        builderName: "Example Builder",
        builderLicence: "",
        quoteDate: "",
        gstStatus: "unclear",
        depositRequested: 50,
        timeline: "unclear"
      },
      risk: {
        leaksOrMould: true,
        suspectedAsbestos: true,
        strataApprovalRequired: true,
        accessConstraints: true,
        layoutOrServiceChanges: true
      },
      scope: {
        demolitionIncluded: false,
        rubbishRemovalIncluded: false,
        waterproofingIncluded: false,
        waterproofingCertificateMentioned: false,
        plumbingRelocationIncluded: false,
        electricalIncluded: false
      },
      allowances: {
        pcSumsPresent: false,
        provisionalSumsPresent: false,
        exclusionsClearlyListed: "no"
      },
      upload: {
        fileName: "",
        fileType: "",
        fileSize: 0
      }
    },
    riskFlags: [
      "Apartment / strata approval should be clarified.",
      "Suspected asbestos should be assessed before demolition.",
      "Known leak or mould should be reviewed before committing.",
      "Deposit request should be clarified before signing.",
      "Waterproofing scope or certificate is unclear."
    ],
    scoringResult: {
      clarityScore: 42,
      missingInclusions: ["waterproofing", "rubbish removal", "demolition"],
      allowanceRisk: "high",
      questionsToAsk: ["Confirm waterproofing certificate in writing.", "Clarify exclusions and allowances."],
      compliancePrompts: ["Clarify deposit request before committing; confirm in writing."]
    },
    quoteClarityScore: 42,
    quoteAmount: 52000,
    privacyAccepted: true,
    termsAccepted: true,
    guidanceAccepted: true,
    request: new Request("http://localhost/quote/review?utm_source=workflow-test")
  });
  assert.equal(stored.storage, "local");
  assert.equal(stored.lead.contact.email, email);

  useLocalStores();
  const list = await getAdminLeads(new Request(`http://localhost/api/admin/leads?token=${token}&leadType=quote_review&search=${email}`));
  const listBody = await json<{
    ok: boolean;
    leads: Array<{ id: string; contact: { email?: string }; manualReviewRequired?: boolean; riskLevel?: string }>;
    summary: { quoteReviewLeads: number; highRiskLeads: number };
  }>(list);
  assert.equal(list.status, 200);
  assert.equal(listBody.ok, true);
  assert.ok(listBody.leads.some((lead) => lead.id === stored.lead.id && lead.contact.email === email));
  assert.ok(listBody.summary.quoteReviewLeads >= 1);
  assert.ok(listBody.summary.highRiskLeads >= 1);

  useLocalStores();
  const manualReviewList = await getAdminLeads(
    new Request(`http://localhost/api/admin/leads?token=${token}&view=manual-review&search=${email}`)
  );
  const manualReviewBody = await json<{ leads: Array<{ id: string }> }>(manualReviewList);
  assert.equal(manualReviewList.status, 200);
  assert.ok(manualReviewBody.leads.some((lead) => lead.id === stored.lead.id));

  useLocalStores();
  const bulk = await postBulkQualify(
    authedRequest("http://localhost/api/admin/bulk-qualify-leads", {
      method: "POST",
      body: JSON.stringify({ leadType: "quote_review", limit: 5 })
    })
  );
  const bulkBody = await json<{ ok: boolean; counts: { processed: number; errors: number } }>(bulk);
  assert.equal(bulk.status, 200);
  assert.equal(bulkBody.ok, true);
  assert.equal(bulkBody.counts.errors, 0);
  assert.ok(Number.isInteger(bulkBody.counts.processed));

  useLocalStores();
  const template = await postResponseTemplate(
    authedRequest("http://localhost/api/admin/response-template", {
      method: "POST",
      body: JSON.stringify({ leadType: stored.lead.leadType, leadId: stored.lead.id })
    })
  );
  const templateBody = await json<{
    ok: boolean;
    templates: { emailBody: string; smsCallScript: string; missingInfoQuestions: string[] };
  }>(template);
  assert.equal(template.status, 200);
  assert.match(templateBody.templates.emailBody, /planning guidance only/i);
  assert.match(templateBody.templates.emailBody, /site measure/i);
  assert.doesNotMatch(templateBody.templates.emailBody, /final price|fixed price|binding quote|labour rate|margin/i);
  assert.ok(templateBody.templates.missingInfoQuestions.length >= 1);

  useLocalStores();
  const preview = await postManualReviewPreview(
    authedRequest("http://localhost/api/admin/manual-review-report-preview", {
      method: "POST",
      body: JSON.stringify({ leadType: stored.lead.leadType, leadId: stored.lead.id })
    })
  );
  const previewBody = await json<{
    ok: boolean;
    persisted: boolean;
    report: { leadId: string; reportConfidence: string; manualReviewRequired: boolean; customerFollowUpQuestions: string[] };
  }>(preview);
  assert.equal(preview.status, 200);
  assert.equal(previewBody.persisted, false);
  assert.equal(previewBody.report.leadId, stored.lead.id);
  assert.equal(previewBody.report.manualReviewRequired, true);
  assert.ok(previewBody.report.customerFollowUpQuestions.length >= 1);

  useLocalStores();
  const generated = await postManualReviewReport(
    authedRequest("http://localhost/api/admin/manual-review-report", {
      method: "POST",
      body: JSON.stringify({ leadType: stored.lead.leadType, leadId: stored.lead.id, regenerate: true })
    })
  );
  const generatedBody = await json<{
    ok: boolean;
    persisted: boolean;
    report: { reportId: string; reportStatus: string; copyTemplates: { customerFollowUpMessage: string } };
  }>(generated);
  assert.equal(generated.status, 200);
  assert.equal(generatedBody.persisted, true);
  assert.equal(generatedBody.report.reportStatus, "generated");
  assert.match(generatedBody.report.copyTemplates.customerFollowUpMessage, /planning guidance only/i);
  assert.doesNotMatch(JSON.stringify(generatedBody.report), /service_role|SUPABASE_SERVICE_ROLE_KEY|rate card|margin/i);

  useLocalStores();
  const getReport = await getManualReviewReport(
    new Request(
      `http://localhost/api/admin/manual-review-report?token=${token}&leadType=${stored.lead.leadType}&leadId=${stored.lead.id}`
    )
  );
  const getReportBody = await json<{ ok: boolean; persisted: boolean; report: { reportId: string } }>(getReport);
  assert.equal(getReport.status, 200);
  assert.equal(getReportBody.persisted, true);
  assert.equal(getReportBody.report.reportId, generatedBody.report.reportId);

  useLocalStores();
  const reportUpdate = await postManualReviewUpdate(
    authedRequest("http://localhost/api/admin/manual-review-report-update", {
      method: "POST",
      body: JSON.stringify({
        reportId: generatedBody.report.reportId,
        reportStatus: "reviewed",
        internalReviewNote: "Reviewed in local workflow QA."
      })
    })
  );
  const reportUpdateBody = await json<{ ok: boolean; report: { reportStatus: string; internalReviewNotes: string[] } }>(reportUpdate);
  assert.equal(reportUpdate.status, 200);
  assert.equal(reportUpdateBody.report.reportStatus, "reviewed");
  assert.ok(reportUpdateBody.report.internalReviewNotes.some((note) => note.includes("local workflow QA")));

  useLocalStores();
  const qualificationUpdate = await postQualificationUpdate(
    authedRequest("http://localhost/api/admin/qualification-update", {
      method: "POST",
      body: JSON.stringify({
        leadType: stored.lead.leadType,
        leadId: stored.lead.id,
        leadFitTier: "needs_review",
        qualificationStatus: "manual_review_needed",
        urgency: "urgent",
        riskLevel: "critical",
        evidenceQuality: "thin",
        manualReviewRequired: true,
        recommendedNextAction: "prepare_manual_quote_review",
        qualificationNotes: "Keep in manual review until quote evidence is complete."
      })
    })
  );
  const qualificationUpdateBody = await json<{
    ok: boolean;
    lead: { qualificationStatus: string; manualReviewRequired: boolean; recommendedNextAction: string; qualificationNotes: string };
  }>(qualificationUpdate);
  assert.equal(qualificationUpdate.status, 200);
  assert.equal(qualificationUpdateBody.lead.qualificationStatus, "manual_review_needed");
  assert.equal(qualificationUpdateBody.lead.manualReviewRequired, true);
  assert.equal(qualificationUpdateBody.lead.recommendedNextAction, "prepare_manual_quote_review");
  assert.match(qualificationUpdateBody.lead.qualificationNotes, /manual review/i);
});

test("authorized admin workflow can read chatbot qualifications and open follow-up tasks", async () => {
  useLocalStores();
  const marker = globalThis.crypto.randomUUID();
  const email = `chat-workflow-${marker}@example.com`;
  const handoff = await postChatbotQualification(
    new Request("http://localhost/api/chatbot-qualification", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-operon-chat-session": `workflow-${marker}` },
      body: JSON.stringify({
        name: "Chat Workflow",
        email,
        phone: "0400000002",
        suburb: "Randwick",
        preferredNextStep: "site_measure",
        message: "Apartment bathroom has waterproofing uncertainty and a suspected leak near the shower.",
        highRiskTopics: ["apartment / strata", "waterproofing uncertainty", "known leak or mould"],
        privacyAccepted: true,
        termsAccepted: true,
        guidanceAccepted: true,
        attribution: {
          sourceRoute: "/chatbot",
          landingPage: "/bathroom-renovation-cost-sydney",
          referrer: "",
          utmSource: "workflow-test",
          utmMedium: "qa",
          utmCampaign: "admin-workflow",
          utmContent: "",
          utmTerm: ""
        }
      })
    })
  );
  const handoffBody = await json<{
    ok: boolean;
    qualificationId: string;
    followUpTaskId: string;
    manualReviewRequired: boolean;
    message: string;
  }>(handoff);
  assert.equal(handoff.status, 200);
  assert.equal(handoffBody.ok, true);
  assert.equal(handoffBody.manualReviewRequired, true);
  assert.match(handoffBody.message, /planning context only/i);

  useLocalStores();
  const unauth = await getAdminChatbotQualifications(new Request("http://localhost/api/admin/chatbot-qualifications"));
  assert.equal(unauth.status, 401);

  useLocalStores();
  const admin = await getAdminChatbotQualifications(new Request(`http://localhost/api/admin/chatbot-qualifications?token=${token}`));
  const adminBody = await json<{
    ok: boolean;
    qualifications: Array<{ id: string; contactInfo: { email: string }; manualReviewRequired: boolean; riskFlags: string[] }>;
    tasks: Array<{ id: string; chatbotQualificationId: string; status: string; priority: string }>;
    summary: { totalQualifications: number; manualReviewNeeded: number; openFollowUps: number; urgentFollowUps: number };
  }>(admin);
  assert.equal(admin.status, 200);
  assert.equal(adminBody.ok, true);
  assert.ok(adminBody.summary.totalQualifications >= 1);
  assert.ok(adminBody.summary.manualReviewNeeded >= 1);
  assert.ok(adminBody.summary.openFollowUps >= 1);
  assert.ok(
    adminBody.qualifications.some(
      (qualification) =>
        qualification.id === handoffBody.qualificationId &&
        qualification.contactInfo.email === email &&
        qualification.manualReviewRequired === true &&
        qualification.riskFlags.some((flag) => /waterproofing|leak|strata/i.test(flag))
    )
  );
  assert.ok(
    adminBody.tasks.some(
      (task) =>
        task.id === handoffBody.followUpTaskId &&
        task.chatbotQualificationId === handoffBody.qualificationId &&
        ["open", "in_progress"].includes(task.status) &&
        ["urgent", "high"].includes(task.priority)
    )
  );
});
