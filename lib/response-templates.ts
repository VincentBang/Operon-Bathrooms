import { NormalizedLead, suggestedNextActions } from "./lead-workflow";

export type ResponseTemplateBundle = {
  emailSubject: string;
  emailBody: string;
  smsCallScript: string;
  internalProjectSummary: string;
  missingInfoQuestions: string[];
};

function firstName(name?: string) {
  return name?.trim().split(/\s+/)[0] || "there";
}

function readable(value?: string) {
  return value ? value.replaceAll("-", " ") : "not supplied";
}

function riskSentence(lead: NormalizedLead) {
  if (!lead.riskFlags.length) return "I did not see major risk flags from the details supplied online.";
  return `The online details flagged a few items to clarify: ${lead.riskFlags.slice(0, 4).join("; ")}.`;
}

function qualificationPrompts(lead: NormalizedLead) {
  const prompts: string[] = [];
  const missing = lead.missingEvidence.join(" ").toLowerCase();
  const risk = lead.riskFlags.join(" ").toLowerCase();
  if (missing.includes("photo")) {
    prompts.push(
      "Please send clear photos of the whole bathroom, shower area, vanity, toilet, floor and wall tiles, ceiling/ventilation, access path, and any visible leaks or mould."
    );
  }
  if (missing.includes("quote")) {
    prompts.push(
      "Please send the full quote PDF, inclusions/exclusions, PC/provisional sums, GST status, deposit request and builder licence details if available."
    );
  }
  if (risk.includes("strata") || missing.includes("strata")) {
    prompts.push(
      "Please confirm whether the property is strata, whether Owners Corporation approval has been requested, and whether by-laws or renovation requirements apply."
    );
  }
  if (risk.includes("asbestos") || missing.includes("asbestos")) {
    prompts.push(
      "Please share the property age and any known asbestos reports. Operon can note the risk, but specialist assessment is required before disturbance."
    );
  }
  if (lead.recommendedNextAction === "clarify_budget") {
    prompts.push("Please confirm the budget range and whether the scope is a full renovation, partial refresh, or repair-only request.");
  }
  if (lead.recommendedNextAction === "book_site_measure") {
    prompts.push("Please confirm preferred inspection windows, parking/lift/stairs/access notes, and any photos or plans you already have.");
  }
  return prompts;
}

export function buildResponseTemplates(lead: NormalizedLead): ResponseTemplateBundle {
  const name = firstName(lead.contact.name);
  const suburb = lead.suburb || lead.contact.suburb || "your suburb";
  const bathroomType = readable(lead.bathroomType);
  const safeDisclaimer =
    "This is general planning guidance only, not a final quote, legal advice or a compliance guarantee. Contract pricing needs a site measure, selections, licensed trade checks and written scope confirmation.";

  if (lead.leadType === "quote_review") {
    const missing = Array.isArray(lead.scoringResult.missingInclusions)
      ? lead.scoringResult.missingInclusions.map(String).slice(0, 4)
      : [];
    const prompts = qualificationPrompts(lead);
    return {
      emailSubject: `Operon Bathrooms quote review - ${suburb}`,
      emailBody: [
        `Hi ${name},`,
        "",
        "Thanks for sending through your bathroom quote review details. I will review the quote for missing inclusions, allowance risk, PC/provisional sums, waterproofing and trade-scope clarity, deposit/HBCF prompts, exclusions and next-step readiness.",
        lead.quoteClarityScore !== undefined ? `Your preliminary quote clarity score was ${lead.quoteClarityScore}/100.` : "",
        missing.length ? `Early items to clarify include: ${missing.join("; ")}.` : "",
        "Please send the full quote PDF if it was not attached, plus inclusions/exclusions, drawings or photos, and any licence or insurance details you have been given.",
        prompts.length ? prompts.join("\n") : "",
        "",
        safeDisclaimer,
        "",
        "Regards,",
        "Operon Bathrooms"
      ]
        .filter(Boolean)
        .join("\n"),
      smsCallScript: `Hi ${name}, it is Operon Bathrooms. I received your bathroom quote review request for ${suburb}. Could you send the full quote PDF, inclusions/exclusions and any photos or drawings? I will use that to give planning guidance only before you commit.`,
      internalProjectSummary: buildInternalSummary(lead),
      missingInfoQuestions: [
        "Can you send the full quote PDF or images?",
        "Are inclusions, exclusions, PC sums and provisional sums listed clearly?",
        "Does the quote mention waterproofing evidence or certificates?",
        "Are demolition, rubbish removal, plumbing and electrical scope written clearly?",
        ...prompts
      ]
    };
  }

  if (lead.leadType === "request_review") {
    const prompts = qualificationPrompts(lead);
    return {
      emailSubject: `Operon Bathrooms scope review - ${suburb}`,
      emailBody: [
        `Hi ${name},`,
        "",
        "Thanks for requesting a bathroom scope review. I will look at the project stage, likely scope, budget range, photos or plans if available, and the best next step.",
        "If you have photos, plans, rough measurements, strata notes or a builder quote, please send them through.",
        "It would also help to know whether your priority is budget certainty, scope clarity, quote comparison or booking a site measure.",
        prompts.length ? prompts.join("\n") : "",
        "",
        safeDisclaimer,
        "",
        "Regards,",
        "Operon Bathrooms"
      ].join("\n"),
      smsCallScript: `Hi ${name}, it is Operon Bathrooms. I received your bathroom scope review request for ${suburb}. Could you send photos, plans or rough measurements, and tell me whether you need budget clarity, scope clarity or a site measure?`,
      internalProjectSummary: buildInternalSummary(lead),
      missingInfoQuestions: [
        "Can you send photos or plans?",
        "Do you have rough room measurements?",
        "Is your priority budget certainty, scope clarity, quote comparison or site measure?",
        "Do strata rules or access constraints apply?",
        ...prompts
      ]
    };
  }

  if (lead.leadType === "site_measure") {
    const prompts = qualificationPrompts(lead);
    return {
      emailSubject: `Operon Bathrooms site measure - ${suburb}`,
      emailBody: [
        `Hi ${name},`,
        "",
        `Thanks for requesting a bathroom site measure for ${suburb}.`,
        "A site measure helps confirm room dimensions, access, waterproofing clues, substrate and falls, plumbing/electrical access, ventilation, strata/access constraints and any known issues.",
        "Please confirm your preferred inspection windows, access notes, parking/lift/stairs details, strata approval status, and any known leaks, mould or asbestos concerns.",
        prompts.length ? prompts.join("\n") : "",
        "",
        safeDisclaimer,
        "",
        "Regards,",
        "Operon Bathrooms"
      ].join("\n"),
      smsCallScript: `Hi ${name}, it is Operon Bathrooms. I received your site measure request for ${suburb}. Could you confirm preferred inspection windows, access/parking details, strata status and any known leak, mould or asbestos concerns?`,
      internalProjectSummary: buildInternalSummary(lead),
      missingInfoQuestions: [
        "What inspection windows suit you?",
        "What parking, lift, stairs or access constraints should we know?",
        "What is the strata approval status?",
        "Are there known leaks, mould, asbestos concerns or ventilation issues?",
        ...prompts
      ]
    };
  }

  const prompts = qualificationPrompts(lead);
  return {
    emailSubject: `Operon Bathrooms planning estimate - ${suburb}`,
    emailBody: [
      `Hi ${name},`,
      "",
      `Thanks for completing the bathroom planning estimate for ${bathroomType} in ${suburb}.`,
      lead.estimateRange ? `The online planning range shown was ${lead.estimateRange}.` : "",
      riskSentence(lead),
      "Could you send 3-5 useful photos of the bathroom, access path and any existing problem areas?",
      "Please also let me know whether strata requirements apply, whether you already have a quote, and whether you have preferred fixtures or finishes in mind.",
      `Suggested next step: ${lead.recommendedNextStep || "confirm scope and decide whether a site measure is the right next step."}`,
      prompts.length ? prompts.join("\n") : "",
      "",
      safeDisclaimer,
      "",
      "Regards,",
      "Operon Bathrooms"
    ]
      .filter(Boolean)
      .join("\n"),
    smsCallScript: `Hi ${name}, it is Operon Bathrooms. I received your planning estimate for ${suburb}. Could you send 3-5 bathroom photos and let me know if strata, an existing quote or fixture preferences apply? The estimate is planning guidance only before site review.`,
    internalProjectSummary: buildInternalSummary(lead),
    missingInfoQuestions: [
      "Can you send 3-5 photos of the bathroom and access path?",
      "Do strata requirements apply?",
      "Do you already have a builder quote?",
      "Have you chosen preferred fixtures, tiles or finish level?",
      ...prompts
    ]
  };
}

function buildInternalSummary(lead: NormalizedLead) {
  return [
    `Lead type: ${lead.leadType.replaceAll("_", " ")}`,
    `Name: ${lead.contact.name || "not supplied"}`,
    `Email: ${lead.contact.email || "not supplied"}`,
    `Phone: ${lead.contact.phone || "not supplied"}`,
    `Suburb: ${lead.suburb || lead.contact.suburb || "not supplied"}`,
    `Property: ${readable(lead.propertyType || lead.contact.propertyType)}`,
    lead.estimateRange ? `Planning range: ${lead.estimateRange}` : "",
    lead.confidenceScore !== undefined ? `Confidence: ${lead.confidenceScore}/100` : "",
    lead.quoteClarityScore !== undefined ? `Quote clarity: ${lead.quoteClarityScore}/100` : "",
    `Priority: ${lead.responsePriority}`,
    lead.leadFitTier ? `Fit tier: ${readable(lead.leadFitTier)}` : "",
    lead.riskLevel ? `Risk level: ${readable(lead.riskLevel)}` : "",
    lead.evidenceQuality ? `Evidence quality: ${readable(lead.evidenceQuality)}` : "",
    lead.recommendedNextAction ? `Recommended next action: ${readable(lead.recommendedNextAction)}` : "",
    `Response due: ${lead.responseDueAt || "not set"}`,
    `Suggested actions: ${suggestedNextActions(lead).join("; ")}`,
    lead.riskFlags.length ? `Risk flags: ${lead.riskFlags.join("; ")}` : "Risk flags: none supplied",
    `Source: ${lead.sourceRoute}`,
    `UTM: ${[lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ") || "none"}`
  ]
    .filter(Boolean)
    .join("\n");
}
