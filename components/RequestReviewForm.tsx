"use client";

import React from "react";
import { useState } from "react";
import { readAttribution } from "@/lib/attribution";
import { ReviewRequestInput, reviewRequestSchema, SiteMeasureInput, siteMeasureSchema } from "@/lib/intake-schemas";

const reviewInitial: ReviewRequestInput = {
  name: "",
  email: "",
  phone: "",
  suburb: "",
  propertyType: "house",
  bathroomType: "main-bathroom",
  projectStage: "planning",
  budgetRange: "unsure",
  timeline: "planning",
  hasPhotosPlans: false,
  hasBuilderQuote: false,
  preferredNextStep: "email-review",
  message: "",
  privacyAccepted: false,
  termsAccepted: false,
  company: ""
};

const measureInitial: SiteMeasureInput = {
  name: "",
  email: "",
  phone: "",
  suburb: "",
  propertyAddress: "",
  propertyType: "house",
  preferredTimeWindow: "flexible",
  accessNotes: "",
  parkingLiftStairsNotes: "",
  strataApprovalStatus: "unknown",
  knownIssues: "",
  message: "",
  privacyAccepted: false,
  termsAccepted: false,
  company: ""
};

export function RequestReviewForm() {
  const [input, setInput] = useState(reviewInitial);
  const [status, setStatus] = useState("");

  async function submit() {
    if (input.company) return;
    const parsed = reviewRequestSchema.safeParse(input);
    if (!parsed.success) {
      setStatus(parsed.error.issues[0]?.message ?? "Please complete the required fields.");
      return;
    }
    const response = await fetch("/api/request-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...parsed.data, attribution: readAttribution("/request-review") })
    });
    if (!response.ok) {
      setStatus("The request could not be sent. Please check the required fields.");
      return;
    }
    setStatus(
      "Request received. Operon will review your scope, project stage, photos/plans status and preferred next step. Prepare photos, plans, quote documents if available, and access notes. This is not contract pricing."
    );
  }

  return (
    <div className="panel form-stack">
      <SharedFields input={input} setInput={setInput} />
      <div className="form-grid">
        <Select value={input.bathroomType} onChange={(value) => setInput((current) => ({ ...current, bathroomType: value as ReviewRequestInput["bathroomType"] }))} options={["main-bathroom", "ensuite", "powder-room", "laundry-bathroom", "other"]} label="Bathroom type" />
        <Select value={input.projectStage} onChange={(value) => setInput((current) => ({ ...current, projectStage: value as ReviewRequestInput["projectStage"] }))} options={["early-ideas", "planning", "has-plans", "has-builder-quote"]} label="Project stage" />
        <Select value={input.budgetRange} onChange={(value) => setInput((current) => ({ ...current, budgetRange: value as ReviewRequestInput["budgetRange"] }))} options={["under-25k", "25k-40k", "40k-60k", "60k-plus", "unsure"]} label="Budget range" />
        <Select value={input.timeline} onChange={(value) => setInput((current) => ({ ...current, timeline: value as ReviewRequestInput["timeline"] }))} options={["planning", "one-to-three-months", "three-to-six-months", "urgent"]} label="Timeline" />
        <Select value={input.preferredNextStep} onChange={(value) => setInput((current) => ({ ...current, preferredNextStep: value as ReviewRequestInput["preferredNextStep"] }))} options={["email-review", "phone-call", "site-measure", "not-sure"]} label="Preferred next step" />
      </div>
      <div className="check-grid">
        <Check label="I have photos or plans" checked={input.hasPhotosPlans} onChange={(value) => setInput((current) => ({ ...current, hasPhotosPlans: value }))} />
        <Check label="I have a builder quote" checked={input.hasBuilderQuote} onChange={(value) => setInput((current) => ({ ...current, hasBuilderQuote: value }))} />
      </div>
      <textarea aria-label="Message" placeholder="Message" value={input.message} onChange={(event) => setInput((current) => ({ ...current, message: event.target.value }))} />
      <Honeypot value={input.company} onChange={(value) => setInput((current) => ({ ...current, company: value }))} />
      <Consent values={input} onChange={(key, value) => setInput((current) => ({ ...current, [key]: value }))} />
      <button onClick={submit}>Request scope review</button>
      {status ? <p className="notice" role="status">{status}</p> : null}
    </div>
  );
}

export function SiteMeasureForm() {
  const [input, setInput] = useState(measureInitial);
  const [status, setStatus] = useState("");

  async function submit() {
    if (input.company) return;
    const parsed = siteMeasureSchema.safeParse(input);
    if (!parsed.success) {
      setStatus(parsed.error.issues[0]?.message ?? "Please complete the required fields.");
      return;
    }
    const response = await fetch("/api/site-measure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...parsed.data, attribution: readAttribution("/site-measure") })
    });
    if (!response.ok) {
      setStatus("The site-measure request could not be sent. Please check the required fields.");
      return;
    }
    setStatus(
      "Site-measure request received. Prepare photos, plans, quote documents, strata/access details, preferred selections and known issue notes. Contract pricing requires site inspection, selections, licensed trade checks and written scope confirmation."
    );
  }

  return (
    <div className="panel form-stack">
      <SharedFields input={input} setInput={setInput} requirePhone />
      <div className="form-grid">
        <input aria-label="Property address optional" placeholder="Property address optional" value={input.propertyAddress} onChange={(event) => setInput((current) => ({ ...current, propertyAddress: event.target.value }))} />
        <Select value={input.preferredTimeWindow} onChange={(value) => setInput((current) => ({ ...current, preferredTimeWindow: value as SiteMeasureInput["preferredTimeWindow"] }))} options={["weekday-morning", "weekday-afternoon", "saturday", "flexible"]} label="Preferred time window" />
        <Select value={input.strataApprovalStatus} onChange={(value) => setInput((current) => ({ ...current, strataApprovalStatus: value as SiteMeasureInput["strataApprovalStatus"] }))} options={["not-required", "not-started", "in-progress", "approved", "unknown"]} label="Strata approval status" />
      </div>
      <textarea aria-label="Access notes" placeholder="Access notes" value={input.accessNotes} onChange={(event) => setInput((current) => ({ ...current, accessNotes: event.target.value }))} />
      <textarea aria-label="Parking lift stairs notes" placeholder="Parking/lift/stairs notes" value={input.parkingLiftStairsNotes} onChange={(event) => setInput((current) => ({ ...current, parkingLiftStairsNotes: event.target.value }))} />
      <textarea aria-label="Known issues" placeholder="Known issues" value={input.knownIssues} onChange={(event) => setInput((current) => ({ ...current, knownIssues: event.target.value }))} />
      <textarea aria-label="Message" placeholder="Message" value={input.message} onChange={(event) => setInput((current) => ({ ...current, message: event.target.value }))} />
      <Honeypot value={input.company} onChange={(value) => setInput((current) => ({ ...current, company: value }))} />
      <Consent values={input} onChange={(key, value) => setInput((current) => ({ ...current, [key]: value }))} />
      <button onClick={submit}>Request site measure</button>
      {status ? <p className="notice" role="status">{status}</p> : null}
    </div>
  );
}

function SharedFields<T extends { name: string; email: string; phone?: string; suburb: string; propertyType: string }>(
  { input, setInput, requirePhone = false }: { input: T; setInput: React.Dispatch<React.SetStateAction<T>>; requirePhone?: boolean }
) {
  return (
    <div className="form-grid">
      <input aria-label="Name" placeholder="Name" value={input.name} onChange={(event) => setInput((current) => ({ ...current, name: event.target.value }))} />
      <input aria-label="Email" placeholder="Email" type="email" value={input.email} onChange={(event) => setInput((current) => ({ ...current, email: event.target.value }))} />
      <input aria-label={requirePhone ? "Phone" : "Phone optional"} placeholder={requirePhone ? "Phone" : "Phone optional"} value={input.phone ?? ""} onChange={(event) => setInput((current) => ({ ...current, phone: event.target.value }))} />
      <input aria-label="Suburb" placeholder="Suburb" value={input.suburb} onChange={(event) => setInput((current) => ({ ...current, suburb: event.target.value }))} />
      <Select value={input.propertyType} onChange={(value) => setInput((current) => ({ ...current, propertyType: value }))} options={["house", "townhouse", "apartment-strata", "duplex", "other"]} label="Property type" />
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label>{label}<select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>;
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="check-row"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span>{label}</span></label>;
}

function Consent<T extends { privacyAccepted: boolean; termsAccepted: boolean }>({ values, onChange }: { values: T; onChange: (key: "privacyAccepted" | "termsAccepted", value: boolean) => void }) {
  return <div className="check-grid"><Check label="I acknowledge the privacy policy." checked={values.privacyAccepted} onChange={(value) => onChange("privacyAccepted", value)} /><Check label="I acknowledge the terms and guidance-only nature of this request." checked={values.termsAccepted} onChange={(value) => onChange("termsAccepted", value)} /></div>;
}

function Honeypot({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
  return <label className="honeypot">Company<input tabIndex={-1} autoComplete="off" value={value ?? ""} onChange={(event) => onChange(event.target.value)} /></label>;
}
