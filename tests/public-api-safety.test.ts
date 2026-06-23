import assert from "node:assert/strict";
import test from "node:test";
import { POST as postChatbotQualification } from "../app/api/chatbot-qualification/route";
import { POST as postQuoteReview } from "../app/api/quote-review/route";
import { POST as postRequestReview } from "../app/api/request-review/route";
import { POST as postSiteMeasure } from "../app/api/site-measure/route";

function useLocalStorageOnly() {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "";
  process.env.RESEND_API_KEY = "";
  process.env.OPERON_BATHROOMS_ADMIN_EMAIL = "";
  process.env.OPERON_BATHROOMS_FROM_EMAIL = "";
}

function assertPublicResponseIsSafe(payload: unknown) {
  const json = JSON.stringify(payload).toLowerCase();
  assert.doesNotMatch(json, /internalnotes|internal_notes|qualificationnotes|qualification_notes/);
  assert.doesNotMatch(json, /leadfitscore|lead_fit_score|leadfittier|lead_fit_tier/);
  assert.doesNotMatch(json, /manualreviewreport|manual_review_report|reportbody|report_body/);
  assert.doesNotMatch(json, /service_role|service role key|supplier cost|labou?r rate|margin logic|rate card/);
  assert.doesNotMatch(json, /publicurl|public_url|signedurl|signed_url|storage_path|bucket|\.supabase\.co\/storage/i);
}

test("public quote review response stays customer-safe", async () => {
  useLocalStorageOnly();
  const response = await postQuoteReview(
    new Request("http://localhost/api/quote-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: {
          contact: {
            name: "Public Quote Test",
            email: "quote-public@example.com",
            phone: "0400000000",
            suburb: "Marrickville",
            propertyType: "apartment-strata"
          },
          quote: {
            amount: 42000,
            builderName: "Example Builder",
            builderLicence: "",
            quoteDate: "",
            gstStatus: "unclear",
            depositRequested: 15000,
            timeline: "unclear",
            hbcMentioned: "unclear"
          },
          risk: {
            buildingAge: "pre-1980",
            leaksOrMould: "yes",
            suspectedAsbestos: "unclear",
            strataApprovalRequired: "yes",
            accessConstraints: "yes",
            layoutOrServiceChanges: "yes"
          },
          scope: {
            demolition: false,
            rubbishRemoval: false,
            waterproofing: false,
            waterproofingCertificate: false,
            floorTiling: true,
            wallTiling: true,
            screedFallsDrainage: false,
            plumbingRoughIn: false,
            plumbingRelocation: true,
            electrical: false,
            ventilation: false
          },
          allowances: {
            pcSumsPresent: "unclear",
            provisionalSumsPresent: "unclear",
            tileAllowanceAmount: "",
            fixtureAllowanceAmount: "",
            exclusionsClearlyListed: "unclear"
          },
          upload: {
            fileName: "quote.pdf",
            fileType: "application/pdf",
            fileSize: 1000,
            publicUrl: "https://example.supabase.co/storage/v1/object/public/bathroom-quotes/quote.pdf",
            signedUrl: "https://example.supabase.co/storage/v1/object/sign/bathroom-quotes/quote.pdf",
            storagePath: "bathroom-quotes/private/quote.pdf",
            bucket: "bathroom-quotes"
          },
          consent: { privacyAccepted: true, termsAccepted: true, guidanceAccepted: true },
          company: "",
          attribution: {
            sourceRoute: "/quote/review",
            landingPage: "/bathroom-quote-sydney",
            referrer: "",
            utmSource: "test",
            utmMedium: "local",
            utmCampaign: "api_safety",
            utmContent: "quote_review",
            utmTerm: "bathroom quote"
          }
        }
      })
    })
  );
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.ok(body.result);
  assertPublicResponseIsSafe(body);
});

test("public request review and site measure responses stay customer-safe", async () => {
  useLocalStorageOnly();
  const requestReview = await postRequestReview(
    new Request("http://localhost/api/request-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Public Request Test",
        email: "request-public@example.com",
        phone: "0400000000",
        suburb: "Bondi",
        propertyType: "house",
        bathroomType: "main-bathroom",
        projectStage: "planning",
        budgetRange: "40k-60k",
        timeline: "one-to-three-months",
        hasPhotosPlans: true,
        hasBuilderQuote: false,
        preferredNextStep: "email-review",
        message: "Please review the bathroom renovation scope before I commit.",
        privacyAccepted: true,
        termsAccepted: true,
        company: ""
      })
    })
  );
  const requestBody = await requestReview.json();
  assert.equal(requestReview.status, 200);
  assert.equal(requestBody.ok, true);
  assertPublicResponseIsSafe(requestBody);

  const siteMeasure = await postSiteMeasure(
    new Request("http://localhost/api/site-measure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Public Measure Test",
        email: "measure-public@example.com",
        phone: "0400000000",
        suburb: "Randwick",
        propertyAddress: "",
        propertyType: "apartment-strata",
        preferredTimeWindow: "flexible",
        accessNotes: "Lift booking may be needed.",
        parkingLiftStairsNotes: "Street parking only.",
        strataApprovalStatus: "unknown",
        knownIssues: "Possible mould near shower.",
        message: "I want to prepare for a site measure.",
        privacyAccepted: true,
        termsAccepted: true,
        company: ""
      })
    })
  );
  const measureBody = await siteMeasure.json();
  assert.equal(siteMeasure.status, 200);
  assert.equal(measureBody.ok, true);
  assertPublicResponseIsSafe(measureBody);
});

test("public lead route survives email provider failure without leaking secrets", async () => {
  useLocalStorageOnly();
  const previousFetch = globalThis.fetch;
  process.env.RESEND_API_KEY = "test-resend-secret-should-not-leak";
  process.env.OPERON_BATHROOMS_ADMIN_EMAIL = "admin@example.com";
  process.env.OPERON_BATHROOMS_FROM_EMAIL = "bathrooms@example.com";
  process.env.OPERON_BATHROOMS_NOTIFICATION_MODE = "send";
  globalThis.fetch = (async () => new Response("{}", { status: 500 })) as typeof fetch;

  try {
    const response = await postRequestReview(
      new Request("http://localhost/api/request-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Provider Failure Test",
          email: "provider-failure@example.com",
          phone: "0400000000",
          suburb: "Ryde",
          propertyType: "house",
          bathroomType: "main-bathroom",
          projectStage: "planning",
          budgetRange: "40k-60k",
          timeline: "one-to-three-months",
          hasPhotosPlans: true,
          hasBuilderQuote: false,
          preferredNextStep: "email-review",
          message: "Please review my scope even if email provider delivery fails.",
          privacyAccepted: true,
          termsAccepted: true,
          company: ""
        })
      })
    );
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.notificationPrepared, true);
    assert.equal(body.adminNotificationSent, false);
    assert.equal(body.customerAcknowledgementSent, false);
    assert.match(body.notificationWarning, /provider returned a delivery error/i);
    assert.doesNotMatch(JSON.stringify(body), /test-resend-secret-should-not-leak|authorization|bearer/i);
    assertPublicResponseIsSafe(body);
  } finally {
    globalThis.fetch = previousFetch;
    useLocalStorageOnly();
  }
});

test("public chatbot handoff response stays customer-safe and rejects honeypot", async () => {
  useLocalStorageOnly();
  const spam = await postChatbotQualification(
    new Request("http://localhost/api/chatbot-qualification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Spam",
        email: "spam@example.com",
        suburb: "Sydney",
        preferredNextStep: "scope_review",
        message: "Please call me.",
        privacyAccepted: true,
        termsAccepted: true,
        guidanceAccepted: true,
        company: "bot"
      })
    })
  );
  assert.equal(spam.status, 400);

  const response = await postChatbotQualification(
    new Request("http://localhost/api/chatbot-qualification", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-operon-chat-session": "api-safety-session" },
      body: JSON.stringify({
        name: "Chat Public Test",
        email: "chat-public@example.com",
        phone: "0400000000",
        suburb: "Coogee",
        preferredNextStep: "manual_review",
        message: "My apartment bathroom quote has unclear waterproofing and deposit wording.",
        highRiskTopics: ["apartment / strata", "waterproofing uncertainty", "deposit concern"],
        privacyAccepted: true,
        termsAccepted: true,
        guidanceAccepted: true,
        company: ""
      })
    })
  );
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.manualReviewRequired, true);
  assertPublicResponseIsSafe(body);
});
