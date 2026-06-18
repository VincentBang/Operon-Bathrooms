"use client";

import React from "react";
import { useMemo, useState } from "react";
import { readAttribution } from "@/lib/attribution";
import { QuoteReviewInput, quoteReviewSchema } from "@/lib/intake-schemas";
import { QuoteReviewResult } from "@/lib/quote-review";

const checklist = [
  ["demolition", "Demolition included"],
  ["rubbishRemoval", "Rubbish removal included"],
  ["waterproofing", "Waterproofing included"],
  ["waterproofingCertificate", "Waterproofing certificate mentioned"],
  ["floorTiling", "Floor tiling included"],
  ["wallTiling", "Wall tiling included"],
  ["screedFallsDrainage", "Screed/falls/drainage included"],
  ["plumbingRoughIn", "Plumbing rough-in included"],
  ["plumbingRelocation", "Plumbing relocation included"],
  ["electrical", "Electrical included"],
  ["ventilation", "Exhaust fan / ventilation included"],
  ["showerScreen", "Shower screen included"],
  ["vanity", "Vanity included"],
  ["toilet", "Toilet included"],
  ["tapware", "Tapware included"],
  ["mirrorCabinet", "Mirror/shaving cabinet included"],
  ["accessories", "Accessories included"],
  ["painting", "Painting included"],
  ["heating", "Underfloor heating / heated towel rail included"]
] as const;

const initialScope = Object.fromEntries(checklist.map(([key]) => [key, false]));

const initial: QuoteReviewInput = {
  contact: { name: "", email: "", phone: "", suburb: "", propertyType: "house" },
  quote: {
    amount: 1,
    builderName: "",
    builderLicence: "",
    quoteDate: "",
    gstStatus: "unclear",
    depositRequested: 0,
    timeline: "not-stated",
    hbcMentioned: "unclear"
  },
  risk: {
    buildingAge: "unknown",
    leaksOrMould: "unclear",
    suspectedAsbestos: "unclear",
    strataApprovalRequired: "unclear",
    accessConstraints: "unclear",
    layoutOrServiceChanges: "unclear"
  },
  scope: initialScope,
  allowances: {
    pcSumsPresent: "unclear",
    provisionalSumsPresent: "unclear",
    tileAllowanceAmount: "",
    fixtureAllowanceAmount: "",
    exclusionsClearlyListed: "unclear"
  },
  upload: { fileName: "", fileType: "", fileSize: 0 },
  consent: { privacyAccepted: false, termsAccepted: false, guidanceAccepted: false },
  company: ""
};

export function QuoteReviewForm() {
  const [input, setInput] = useState<QuoteReviewInput>(initial);
  const [result, setResult] = useState<QuoteReviewResult | null>(null);
  const [message, setMessage] = useState("");
  const preview = useMemo(() => quoteReviewSchema.safeParse(input), [input]);

  function setContact(key: keyof QuoteReviewInput["contact"], value: string) {
    setInput((current) => ({ ...current, contact: { ...current.contact, [key]: value } }));
  }

  function setQuote(key: keyof QuoteReviewInput["quote"], value: string | number) {
    setInput((current) => ({ ...current, quote: { ...current.quote, [key]: value } }));
  }

  function setRisk(key: keyof QuoteReviewInput["risk"], value: string) {
    setInput((current) => ({ ...current, risk: { ...current.risk, [key]: value } }));
  }

  function setAllowance(key: keyof QuoteReviewInput["allowances"], value: string) {
    setInput((current) => ({ ...current, allowances: { ...current.allowances, [key]: value } }));
  }

  async function submit() {
    const parsed = quoteReviewSchema.safeParse(input);
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Please complete the required fields.");
      return;
    }
    const response = await fetch("/api/quote-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { ...parsed.data, attribution: readAttribution("/quote/review") }
      })
    });
    const body = (await response.json()) as { ok?: boolean; result?: QuoteReviewResult; error?: string };
    if (!response.ok || !body.result) {
      setMessage(body.error ?? "The quote review could not be prepared. Please check your answers.");
      return;
    }
    setResult(body.result);
    setMessage(
      "Preliminary quote review prepared. Request received. Operon will review missing inclusions, allowance risk, compliance prompts and questions to ask. This is general planning guidance only."
    );
  }

  return (
    <div className="panel form-stack">
      <FormSection title="Contact details">
        <input aria-label="Name" placeholder="Name" value={input.contact.name} onChange={(event) => setContact("name", event.target.value)} />
        <input aria-label="Email" placeholder="Email" type="email" value={input.contact.email} onChange={(event) => setContact("email", event.target.value)} />
        <input aria-label="Phone optional" placeholder="Phone optional" value={input.contact.phone} onChange={(event) => setContact("phone", event.target.value)} />
        <input aria-label="Suburb" placeholder="Suburb" value={input.contact.suburb} onChange={(event) => setContact("suburb", event.target.value)} />
        <select aria-label="Property type" value={input.contact.propertyType} onChange={(event) => setContact("propertyType", event.target.value)}>
          <option value="house">House</option><option value="townhouse">Townhouse</option><option value="apartment-strata">Apartment strata</option><option value="duplex">Duplex</option><option value="other">Other</option>
        </select>
      </FormSection>

      <FormSection title="Quote basics">
        <input aria-label="Quote amount" placeholder="Quote amount" type="number" value={input.quote.amount} onChange={(event) => setQuote("amount", Number(event.target.value))} />
        <input aria-label="Builder or company optional" placeholder="Builder/company optional" value={input.quote.builderName} onChange={(event) => setQuote("builderName", event.target.value)} />
        <input aria-label="Builder licence optional" placeholder="Builder licence optional" value={input.quote.builderLicence} onChange={(event) => setQuote("builderLicence", event.target.value)} />
        <input aria-label="Quote date optional" placeholder="Quote date optional" type="date" value={input.quote.quoteDate} onChange={(event) => setQuote("quoteDate", event.target.value)} />
        <Select value={input.quote.gstStatus} onChange={(value) => setQuote("gstStatus", value)} options={["included", "excluded", "unclear"]} label="GST status" />
        <input aria-label="Deposit requested" placeholder="Deposit requested" type="number" value={input.quote.depositRequested} onChange={(event) => setQuote("depositRequested", Number(event.target.value))} />
        <Select value={input.quote.timeline} onChange={(value) => setQuote("timeline", value)} options={["clear", "unclear", "urgent", "not-stated"]} label="Project timeline" />
        <Select value={input.quote.hbcMentioned} onChange={(value) => setQuote("hbcMentioned", value)} options={["yes", "no", "unclear"]} label="HBCF mentioned" />
      </FormSection>

      <FormSection title="Property / risk">
        <Select value={input.risk.buildingAge} onChange={(value) => setRisk("buildingAge", value)} options={["post-2000", "1980-2000", "pre-1980", "unknown"]} label="Building age" />
        {(["leaksOrMould", "suspectedAsbestos", "strataApprovalRequired", "accessConstraints", "layoutOrServiceChanges"] as const).map((field) => (
          <Select key={field} value={input.risk[field]} onChange={(value) => setRisk(field, value)} options={["yes", "no", "unclear"]} label={field.replace(/([A-Z])/g, " $1")} />
        ))}
      </FormSection>

      <div>
        <h3>Scope checklist</h3>
        <div className="check-grid">
          {checklist.map(([key, label]) => (
            <label className="check-row" key={key}>
              <input
                type="checkbox"
                checked={Boolean(input.scope[key])}
                onChange={(event) =>
                  setInput((current) => ({
                    ...current,
                    scope: { ...current.scope, [key]: event.target.checked }
                  }))
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <FormSection title="Allowances">
        <Select value={input.allowances.pcSumsPresent} onChange={(value) => setAllowance("pcSumsPresent", value)} options={["yes", "no", "unclear"]} label="PC sums present" />
        <Select value={input.allowances.provisionalSumsPresent} onChange={(value) => setAllowance("provisionalSumsPresent", value)} options={["yes", "no", "unclear"]} label="Provisional sums present" />
        <input aria-label="Tile allowance optional" placeholder="Tile allowance optional" value={input.allowances.tileAllowanceAmount} onChange={(event) => setAllowance("tileAllowanceAmount", event.target.value)} />
        <input aria-label="Fixture allowance optional" placeholder="Fixture allowance optional" value={input.allowances.fixtureAllowanceAmount} onChange={(event) => setAllowance("fixtureAllowanceAmount", event.target.value)} />
        <Select value={input.allowances.exclusionsClearlyListed} onChange={(value) => setAllowance("exclusionsClearlyListed", value)} options={["yes", "no", "unclear"]} label="Exclusions clearly listed" />
      </FormSection>

      <div>
        <h3>Upload quote optional</h3>
        <p>PDF/image upload is checked locally for type and size. Public file storage is not enabled in this MVP.</p>
        <input
          type="file"
          aria-label="Upload quote PDF or image optional"
          accept="application/pdf,image/png,image/jpeg,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            if (!["application/pdf", "image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 10_000_000) {
              setMessage("Upload placeholder accepts PDF/JPG/PNG/WebP files up to 10MB.");
              return;
            }
            setInput((current) => ({ ...current, upload: { fileName: file.name, fileType: file.type, fileSize: file.size } }));
          }}
        />
      </div>

      <Consent
        values={input.consent}
        onChange={(key, value) => setInput((current) => ({ ...current, consent: { ...current.consent, [key]: value } }))}
      />
      <Honeypot value={input.company} onChange={(value) => setInput((current) => ({ ...current, company: value }))} />
      <button onClick={submit}>Review quote clarity</button>
      {message ? <p className="notice" role="status">{message}</p> : null}
      {!preview.success ? <p className="muted">Complete required fields to prepare the review.</p> : null}
      {result ? <QuoteReviewOutput result={result} /> : null}
    </div>
  );
}

function QuoteReviewOutput({ result }: { result: QuoteReviewResult }) {
  return (
    <div className="result-stack">
      <h2>Preliminary quote review</h2>
      <p className="estimate-range">{result.clarityScore}/100</p>
      <p>This is structured planning guidance only, not legal advice or a replacement for written scope confirmation.</p>
      <ResultList title="Missing or unclear inclusions" items={result.missingInclusions} />
      <ResultList title="Allowance risk" items={result.allowanceRisk} />
      <ResultList title="Compliance prompts" items={result.compliancePrompts} />
      <ResultList title="High-risk flags" items={result.highRiskFlags} />
      <ResultList title="Questions to ask before signing" items={result.questionsToAsk} />
      <div className="notice"><strong>Recommended next step</strong><p>{result.recommendedNextStep}</p></div>
      <div className="card">
        <h3>Conversion paths</h3>
        <ul>
          <li>If you are unsure, request a scope review before committing.</li>
          <li>If access and selections are ready, request site measure.</li>
          <li>If high-risk flags appear, request manual review before signing or paying a deposit.</li>
        </ul>
      </div>
    </div>
  );
}

function Honeypot({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
  return (
    <label className="honeypot">
      Company
      <input
        tabIndex={-1}
        autoComplete="off"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function ResultList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <ul>{(items.length ? items : ["No immediate item from the supplied answers."]).map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <fieldset><legend>{title}</legend><div className="form-grid">{children}</div></fieldset>;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label>{label}<select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>;
}

function Consent({ values, onChange }: { values: QuoteReviewInput["consent"]; onChange: (key: keyof QuoteReviewInput["consent"], value: boolean) => void }) {
  return (
    <div className="check-grid">
      <label className="check-row"><input type="checkbox" checked={values.privacyAccepted} onChange={(event) => onChange("privacyAccepted", event.target.checked)} /><span>I acknowledge the privacy policy.</span></label>
      <label className="check-row"><input type="checkbox" checked={values.termsAccepted} onChange={(event) => onChange("termsAccepted", event.target.checked)} /><span>I acknowledge the terms.</span></label>
      <label className="check-row"><input type="checkbox" checked={values.guidanceAccepted} onChange={(event) => onChange("guidanceAccepted", event.target.checked)} /><span>I understand this is general planning guidance only.</span></label>
    </div>
  );
}
