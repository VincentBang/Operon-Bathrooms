import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { metadata as adminMetadata } from "../app/admin/leads/page";
import { POST as postBulkQualify } from "../app/api/admin/bulk-qualify-leads/route";
import { GET as getChatbotQualifications } from "../app/api/admin/chatbot-qualifications/route";
import { POST as postLeadResponse } from "../app/api/admin/lead-response/route";
import {
  GET as getManualReviewReport,
  POST as postManualReviewReport
} from "../app/api/admin/manual-review-report/route";
import { POST as postManualReviewPreview } from "../app/api/admin/manual-review-report-preview/route";
import { POST as postManualReviewUpdate } from "../app/api/admin/manual-review-report-update/route";
import { POST as postQualificationUpdate } from "../app/api/admin/qualification-update/route";
import { POST as postQualifyLead } from "../app/api/admin/qualify-lead/route";
import { POST as postResponseTemplate } from "../app/api/admin/response-template/route";

const body = JSON.stringify({ leadType: "request_review", leadId: "missing" });

test("admin leads page is marked noindex and nofollow", () => {
  assert.equal(
    adminMetadata.robots &&
      typeof adminMetadata.robots === "object" &&
      "index" in adminMetadata.robots
      ? adminMetadata.robots.index
      : null,
    false
  );
  assert.equal(
    adminMetadata.robots &&
      typeof adminMetadata.robots === "object" &&
      "follow" in adminMetadata.robots
      ? adminMetadata.robots.follow
      : null,
    false
  );
});

test("admin evidence file retrieval remains locked until private storage is approved", () => {
  const blockedRouteDirs = [
    "app/api/admin/lead-evidence-files",
    "app/api/admin/lead-evidence-download",
    "app/api/admin/evidence-files",
    "app/api/admin/evidence-download",
    "app/api/admin/file-download"
  ];

  for (const routeDir of blockedRouteDirs) {
    assert.equal(
      existsSync(join(process.cwd(), routeDir)),
      false,
      `${routeDir} must stay absent while storage is locked`
    );
  }

  const dashboard = readFileSync(
    join(process.cwd(), "components/AdminLeadsDashboard.tsx"),
    "utf8"
  );
  assert.doesNotMatch(
    dashboard,
    /signedUrl|signed_url|publicUrl|public_url|storage_path|object_path/i
  );
  assert.doesNotMatch(
    dashboard,
    /download evidence|download file|file download|signed download/i
  );
});

test("remaining admin endpoints reject unauthenticated requests", async () => {
  process.env.OPERON_BATHROOMS_ADMIN_TOKEN = "boundary-admin-token";

  const checks: Array<[string, () => Promise<Response>]> = [
    [
      "bulk qualify",
      () =>
        postBulkQualify(
          new Request("http://localhost/api/admin/bulk-qualify-leads", {
            method: "POST",
            body: "{}"
          })
        )
    ],
    [
      "chatbot qualifications",
      () =>
        getChatbotQualifications(
          new Request("http://localhost/api/admin/chatbot-qualifications")
        )
    ],
    [
      "lead response",
      () =>
        postLeadResponse(
          new Request("http://localhost/api/admin/lead-response", {
            method: "POST",
            body
          })
        )
    ],
    [
      "manual report get",
      () =>
        getManualReviewReport(
          new Request(
            "http://localhost/api/admin/manual-review-report?leadType=request_review&leadId=missing"
          )
        )
    ],
    [
      "manual report post",
      () =>
        postManualReviewReport(
          new Request("http://localhost/api/admin/manual-review-report", {
            method: "POST",
            body
          })
        )
    ],
    [
      "manual report preview",
      () =>
        postManualReviewPreview(
          new Request(
            "http://localhost/api/admin/manual-review-report-preview",
            { method: "POST", body }
          )
        )
    ],
    [
      "manual report update",
      () =>
        postManualReviewUpdate(
          new Request(
            "http://localhost/api/admin/manual-review-report-update",
            {
              method: "POST",
              body: JSON.stringify({
                reportId: "missing",
                reportStatus: "reviewed"
              })
            }
          )
        )
    ],
    [
      "qualification update",
      () =>
        postQualificationUpdate(
          new Request("http://localhost/api/admin/qualification-update", {
            method: "POST",
            body
          })
        )
    ],
    [
      "qualify lead",
      () =>
        postQualifyLead(
          new Request("http://localhost/api/admin/qualify-lead", {
            method: "POST",
            body
          })
        )
    ],
    [
      "response template",
      () =>
        postResponseTemplate(
          new Request("http://localhost/api/admin/response-template", {
            method: "POST",
            body
          })
        )
    ]
  ];

  for (const [label, request] of checks) {
    const response = await request();
    assert.equal(response.status, 401, `${label} should reject missing token`);
  }
});
