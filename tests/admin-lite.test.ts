import assert from "node:assert/strict";
import test from "node:test";
import { GET as getLeadDetail } from "../app/api/admin/lead-detail/route";
import { POST as postEvidenceUpdate } from "../app/api/admin/evidence-update/route";
import { POST as postLeadUpdate } from "../app/api/admin/lead-update/route";
import { POST as postNotificationPreview } from "../app/api/admin/notification-preview/route";
import { storeStructuredLead } from "../lib/lead-store";

const token = "test-admin-token";

function useLocalLeadStore() {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "";
}

async function createLead() {
  process.env.OPERON_BATHROOMS_ADMIN_TOKEN = token;
  useLocalLeadStore();
  const stored = await storeStructuredLead({
    leadType: "request_review",
    sourceRoute: "/request-review",
    payload: {
      name: "Admin Test",
      email: "admin-test@example.com",
      phone: "0400000000",
      suburb: "Marrickville",
      propertyType: "house",
      bathroomType: "main-bathroom",
      projectStage: "planning",
      budgetRange: "25k-40k",
      timeline: "one-to-three-months",
      hasPhotosPlans: false,
      hasBuilderQuote: false,
      preferredNextStep: "email-review",
      message: "Need help checking scope before talking to builders."
    },
    riskFlags: ["Photos or plans may improve review confidence."],
    scoringResult: { preferredNextStep: "email-review" },
    privacyAccepted: true,
    termsAccepted: true,
    guidanceAccepted: true,
    request: new Request("http://localhost/request-review")
  });
  return stored.lead;
}

test("admin-lite endpoints require token and support detail, notification preview and updates", async () => {
  const lead = await createLead();

  useLocalLeadStore();
  const unauth = await getLeadDetail(new Request(`http://localhost/api/admin/lead-detail?leadType=${lead.leadType}&leadId=${lead.id}`));
  assert.equal(unauth.status, 401);

  useLocalLeadStore();
  const detail = await getLeadDetail(
    new Request(`http://localhost/api/admin/lead-detail?token=${token}&leadType=${lead.leadType}&leadId=${lead.id}`)
  );
  const detailBody = await detail.json();
  assert.equal(detail.status, 200);
  assert.equal(detailBody.lead.contact.email, "admin-test@example.com");

  useLocalLeadStore();
  const preview = await postNotificationPreview(
    new Request("http://localhost/api/admin/notification-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ leadType: lead.leadType, leadId: lead.id })
    })
  );
  const previewBody = await preview.json();
  assert.equal(preview.status, 200);
  assert.equal(previewBody.notification.notificationPrepared, true);
  assert.match(previewBody.notification.customerAcknowledgementPayload.text, /planning guidance only/i);

  useLocalLeadStore();
  const invalid = await postLeadUpdate(
    new Request("http://localhost/api/admin/lead-update", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ leadType: lead.leadType, leadId: lead.id, status: "bad_status" })
    })
  );
  assert.equal(invalid.status, 400);

  useLocalLeadStore();
  const update = await postLeadUpdate(
    new Request("http://localhost/api/admin/lead-update", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ leadType: lead.leadType, leadId: lead.id, status: "reviewed", internalNotes: "Plain text note only" })
    })
  );
  const updateBody = await update.json();
  assert.equal(update.status, 200);
  assert.equal(updateBody.lead.status, "reviewed");
  assert.equal(updateBody.lead.internalNotes, "Plain text note only");

  useLocalLeadStore();
  const badEvidence = await postEvidenceUpdate(
    new Request("http://localhost/api/admin/evidence-update", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ leadType: lead.leadType, leadId: lead.id, evidenceKey: "quotePdf", evidenceStatus: "received" })
    })
  );
  assert.equal(badEvidence.status, 400);

  useLocalLeadStore();
  const evidence = await postEvidenceUpdate(
    new Request("http://localhost/api/admin/evidence-update", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ leadType: lead.leadType, leadId: lead.id, evidenceKey: "photosPlans", evidenceStatus: "requested" })
    })
  );
  const evidenceBody = await evidence.json();
  assert.equal(evidence.status, 200);
  assert.equal(evidenceBody.lead.evidenceChecklist.photosPlans, "requested");
});
