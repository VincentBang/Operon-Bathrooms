import { NextResponse } from "next/server";
import {
  prepareAndSendBathroomNotifications,
  publicNotificationSummary,
  responseStatusForNotification
} from "@/lib/bathroom-notifications";
import { siteMeasureSchema } from "@/lib/intake-schemas";
import { storeStructuredLead, updateLeadResponse } from "@/lib/lead-store";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = siteMeasureSchema.safeParse(body);

  if (!parsed.success || parsed.data.company) {
    return NextResponse.json({ error: "Invalid site measure request" }, { status: 400 });
  }

  const riskFlags = [
    parsed.data.propertyType === "apartment-strata" ? "Apartment/strata access or class 2 screening may be required." : "",
    parsed.data.strataApprovalStatus !== "not-required" && parsed.data.strataApprovalStatus !== "approved"
      ? "Strata approval status should be confirmed."
      : "",
    parsed.data.parkingLiftStairsNotes ? "Access, parking, lift or stairs notes supplied." : "",
    parsed.data.knownIssues ? "Known issue notes supplied for site review." : ""
  ].filter(Boolean);

  const stored = await storeStructuredLead({
    leadType: "site_measure",
    sourceRoute: "/site-measure",
    payload: { ...parsed.data, company: undefined },
    riskFlags,
    scoringResult: {
      preferredTimeWindow: parsed.data.preferredTimeWindow,
      strataApprovalStatus: parsed.data.strataApprovalStatus
    },
    privacyAccepted: parsed.data.privacyAccepted,
    termsAccepted: parsed.data.termsAccepted,
    guidanceAccepted: parsed.data.termsAccepted,
    attribution: parsed.data.attribution,
    request,
    contact: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      suburb: parsed.data.suburb,
      propertyType: parsed.data.propertyType
    },
    timeline: parsed.data.preferredTimeWindow,
    recommendedNextStep: "Book site measure"
  });

  if (!stored.ok) {
    return NextResponse.json({ error: "Lead storage failed" }, { status: 500 });
  }

  const notification = await prepareAndSendBathroomNotifications(stored.lead);
  await updateLeadResponse(
    "site_measure",
    stored.lead.id,
    {
      responseStatus: responseStatusForNotification(notification),
      notificationSentAt: notification.adminNotificationSentAt,
      acknowledgementSentAt: notification.customerAcknowledgementSentAt,
      notificationResult: notification
    },
    "notification_prepared"
  );

  return NextResponse.json({
    ok: true,
    stored: stored.stored,
    leadId: stored.lead.id,
    responsePriority: stored.lead.responsePriority,
    responseDueAt: stored.lead.responseDueAt,
    ...publicNotificationSummary(notification)
  });
}
