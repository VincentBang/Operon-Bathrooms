import { NextResponse } from "next/server";
import {
  prepareAndSendBathroomNotifications,
  publicNotificationSummary,
  responseStatusForNotification
} from "@/lib/bathroom-notifications";
import { reviewRequestSchema } from "@/lib/intake-schemas";
import { storeStructuredLead, updateLeadResponse } from "@/lib/lead-store";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = reviewRequestSchema.safeParse(body);

  if (!parsed.success || parsed.data.company) {
    return NextResponse.json({ error: "Invalid review request" }, { status: 400 });
  }

  const riskFlags = [
    parsed.data.propertyType === "apartment-strata" ? "Apartment/strata review may be required." : "",
    parsed.data.hasBuilderQuote ? "Builder quote exists; quote review may be the next best step." : "",
    parsed.data.hasPhotosPlans ? "" : "Photos or plans may improve review confidence."
  ].filter(Boolean);

  const stored = await storeStructuredLead({
    leadType: "request_review",
    sourceRoute: "/request-review",
    payload: { ...parsed.data, company: undefined },
    riskFlags,
    scoringResult: {
      preferredNextStep: parsed.data.preferredNextStep,
      hasBuilderQuote: parsed.data.hasBuilderQuote,
      hasPhotosPlans: parsed.data.hasPhotosPlans
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
    bathroomType: parsed.data.bathroomType,
    timeline: parsed.data.timeline,
    recommendedNextStep: parsed.data.preferredNextStep
  });

  if (!stored.ok) {
    return NextResponse.json({ error: "Lead storage failed" }, { status: 500 });
  }

  const notification = await prepareAndSendBathroomNotifications(stored.lead);
  await updateLeadResponse(
    "request_review",
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
