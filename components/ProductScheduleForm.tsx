"use client";

import Link from "next/link";
import React from "react";
import { useMemo, useState } from "react";
import {
  formatAllowanceRange,
  type BathroomSchedule,
  type ProductScheduleInput
} from "@/lib/product-schedule";
import { trackBathroomProductScheduleEvent } from "@/lib/product-schedule-analytics";

type ApiResult =
  | {
      ok: true;
      recordId: string;
      leadId: string | null;
      schedule: BathroomSchedule;
      assumptions: string[];
      warnings: string[];
      quoteReviewFlags: string[];
    }
  | {
      ok: false;
      error: string;
      issues?: Array<{ path: string; message: string }>;
    };

type FormState = ProductScheduleInput & {
  name: string;
  email: string;
  phone: string;
  consentAccepted: boolean;
  company: string;
};

const initialState: FormState = {
  projectType: "renovation",
  bathroomType: "main_bathroom",
  bathroomSize: "standard",
  renovationStage: "early_planning",
  stylePreference: "warm_neutral",
  vanityWidth: "900",
  storagePreference: "drawers",
  basinPreference: "integrated",
  tapwareFinish: "chrome",
  showerConfiguration: "existing_position",
  mirrorPreference: "plain_mirror",
  accessoryFinish: "match_tapware",
  budgetLevel: "mid_range",
  customerType: "homeowner",
  postcode: "",
  timeline: "1_3_months",
  hasExistingQuote: false,
  wantsRenovationHelp: true,
  wantsProductQuote: false,
  wantsQuoteReview: false,
  quoteText: "",
  name: "",
  email: "",
  phone: "",
  consentAccepted: false,
  company: ""
};

const options = {
  projectType: [
    ["renovation", "Renovation"],
    ["new_build", "New build"],
    ["quote_review", "Quote review"],
    ["product_selection", "Product selection"]
  ],
  bathroomType: [
    ["main_bathroom", "Main bathroom"],
    ["ensuite", "Ensuite"],
    ["powder_room", "Powder room"],
    ["laundry_bathroom", "Laundry bathroom"],
    ["apartment_bathroom", "Apartment bathroom"]
  ],
  bathroomSize: [
    ["compact", "Compact"],
    ["standard", "Standard"],
    ["large", "Large"],
    ["unknown", "Not sure"]
  ],
  renovationStage: [
    ["early_planning", "Early planning"],
    ["have_builder_quote", "I have a builder quote"],
    ["ready_for_site_measure", "Ready for site measure"],
    ["under_construction", "Under construction"]
  ],
  stylePreference: [
    ["simple_modern", "Simple modern"],
    ["warm_neutral", "Warm neutral"],
    ["premium_hotel", "Premium hotel"],
    ["classic", "Classic"],
    ["unsure", "Not sure"]
  ],
  vanityWidth: [
    ["under_600", "Under 600mm"],
    ["600_750", "600-750mm"],
    ["900", "900mm"],
    ["1200_plus", "1200mm+"],
    ["unknown", "Not sure"]
  ],
  storagePreference: [
    ["minimal", "Minimal"],
    ["drawers", "Drawers preferred"],
    ["maximum", "Maximum storage"],
    ["unsure", "Not sure"]
  ],
  basinPreference: [
    ["integrated", "Integrated"],
    ["above_counter", "Above counter"],
    ["inset", "Inset"],
    ["unsure", "Not sure"]
  ],
  tapwareFinish: [
    ["chrome", "Chrome"],
    ["matte_black", "Matte black"],
    ["brushed_gold", "Brushed gold"],
    ["brushed_nickel", "Brushed nickel"],
    ["unsure", "Not sure"]
  ],
  showerConfiguration: [
    ["existing_position", "Existing position"],
    ["new_position", "Move shower/plumbing"],
    ["walk_in", "Walk-in shower"],
    ["over_bath", "Over bath"],
    ["unsure", "Not sure"]
  ],
  mirrorPreference: [
    ["plain_mirror", "Plain mirror"],
    ["shaving_cabinet", "Shaving cabinet"],
    ["led_mirror", "LED mirror"],
    ["unsure", "Not sure"]
  ],
  accessoryFinish: [
    ["chrome", "Chrome"],
    ["matte_black", "Matte black"],
    ["brushed_gold", "Brushed gold"],
    ["brushed_nickel", "Brushed nickel"],
    ["match_tapware", "Match tapware"],
    ["unsure", "Not sure"]
  ],
  budgetLevel: [
    ["value", "Value"],
    ["mid_range", "Mid-range"],
    ["premium", "Premium"],
    ["unsure", "Not sure"]
  ],
  customerType: [
    ["homeowner", "Homeowner"],
    ["builder", "Builder"],
    ["designer", "Designer"],
    ["trade", "Trade"],
    ["property_manager", "Property manager"]
  ],
  timeline: [
    ["asap", "ASAP"],
    ["1_3_months", "1-3 months"],
    ["3_6_months", "3-6 months"],
    ["6_plus_months", "6+ months"],
    ["unsure", "Not sure"]
  ]
} as const;

function SelectField({
  label,
  name,
  value,
  values,
  onChange
}: {
  label: string;
  name: keyof FormState;
  value: string;
  values: readonly (readonly [string, string])[];
  onChange: (name: keyof FormState, value: string) => void;
}) {
  return (
    <label>
      <span>{label}</span>
      <select name={name} value={value} onChange={(event) => onChange(name, event.target.value)}>
        {values.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ProductScheduleForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const inputPayload = useMemo(
    (): ProductScheduleInput => ({
      projectType: form.projectType,
      bathroomType: form.bathroomType,
      bathroomSize: form.bathroomSize,
      renovationStage: form.renovationStage,
      stylePreference: form.stylePreference,
      vanityWidth: form.vanityWidth,
      storagePreference: form.storagePreference,
      basinPreference: form.basinPreference,
      tapwareFinish: form.tapwareFinish,
      showerConfiguration: form.showerConfiguration,
      mirrorPreference: form.mirrorPreference,
      accessoryFinish: form.accessoryFinish,
      budgetLevel: form.budgetLevel,
      customerType: form.customerType,
      postcode: form.postcode,
      timeline: form.timeline,
      hasExistingQuote: form.hasExistingQuote,
      wantsRenovationHelp: form.wantsRenovationHelp,
      wantsProductQuote: form.wantsProductQuote,
      wantsQuoteReview: form.wantsQuoteReview,
      quoteText: form.quoteText
    }),
    [form]
  );

  const update = (name: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);
    trackBathroomProductScheduleEvent("bathroom_schedule_started", {
      bathroomType: form.bathroomType,
      budgetLevel: form.budgetLevel
    });

    try {
      const response = await fetch("/api/product-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: inputPayload,
          lead: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            consentAccepted: form.consentAccepted,
            company: form.company
          }
        })
      });
      const payload = (await response.json()) as ApiResult;
      setResult(payload);
    } catch {
      setResult({
        ok: false,
        error: "The product schedule could not be generated right now. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="two-col" style={{ alignItems: "start" }}>
      <form className="panel form-stack" onSubmit={submit}>
        <div>
          <p className="section-kicker">Guided selector</p>
          <h2>Generate Bathroom Product Schedule</h2>
          <p>
            Choose planning inputs for vanity, basin, tapware, mirror and accessories. The output is
            guidance only, not a final quote or purchase order.
          </p>
        </div>

        <fieldset className="form-stack">
          <legend>Project basics</legend>
          <div className="grid two">
            <SelectField label="Project type" name="projectType" value={form.projectType} values={options.projectType} onChange={update} />
            <SelectField label="Bathroom type" name="bathroomType" value={form.bathroomType} values={options.bathroomType} onChange={update} />
            <SelectField label="Bathroom size" name="bathroomSize" value={form.bathroomSize} values={options.bathroomSize} onChange={update} />
            <SelectField label="Renovation stage" name="renovationStage" value={form.renovationStage} values={options.renovationStage} onChange={update} />
            <SelectField label="Style preference" name="stylePreference" value={form.stylePreference} values={options.stylePreference} onChange={update} />
            <SelectField label="Budget level" name="budgetLevel" value={form.budgetLevel} values={options.budgetLevel} onChange={update} />
            <SelectField label="Customer type" name="customerType" value={form.customerType} values={options.customerType} onChange={update} />
            <SelectField label="Timeline" name="timeline" value={form.timeline} values={options.timeline} onChange={update} />
          </div>
        </fieldset>

        <fieldset className="form-stack">
          <legend>Vanity, basin and tapware</legend>
          <div className="grid two">
            <SelectField label="Vanity width" name="vanityWidth" value={form.vanityWidth} values={options.vanityWidth} onChange={update} />
            <SelectField label="Storage preference" name="storagePreference" value={form.storagePreference} values={options.storagePreference} onChange={update} />
            <SelectField label="Basin preference" name="basinPreference" value={form.basinPreference} values={options.basinPreference} onChange={update} />
            <SelectField label="Tapware finish" name="tapwareFinish" value={form.tapwareFinish} values={options.tapwareFinish} onChange={update} />
            <SelectField label="Shower configuration" name="showerConfiguration" value={form.showerConfiguration} values={options.showerConfiguration} onChange={update} />
            <SelectField label="Mirror preference" name="mirrorPreference" value={form.mirrorPreference} values={options.mirrorPreference} onChange={update} />
            <SelectField label="Accessory finish" name="accessoryFinish" value={form.accessoryFinish} values={options.accessoryFinish} onChange={update} />
            <label>
              <span>Postcode</span>
              <input
                inputMode="numeric"
                name="postcode"
                pattern="[0-9]{4}"
                required
                value={form.postcode}
                onChange={(event) => update("postcode", event.target.value)}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="form-stack">
          <legend>Quote and next step</legend>
          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={form.hasExistingQuote}
              onChange={(event) => update("hasExistingQuote", event.target.checked)}
            />
            I already have a builder quote
          </label>
          <label>
            <span>Paste quote product/PC item text for a lightweight gap check (optional)</span>
            <textarea
              rows={5}
              value={form.quoteText}
              onChange={(event) => update("quoteText", event.target.value)}
              placeholder="Paste vanity, tapware, mirror, accessories or PC allowance lines here."
            />
          </label>
          <div className="grid two">
            <label className="checkbox-line">
              <input
                type="checkbox"
                checked={form.wantsRenovationHelp}
                onChange={(event) => update("wantsRenovationHelp", event.target.checked)}
              />
              I want renovation help
            </label>
            <label className="checkbox-line">
              <input
                type="checkbox"
                checked={form.wantsProductQuote}
                onChange={(event) => update("wantsProductQuote", event.target.checked)}
              />
              I want a product pack quote
            </label>
            <label className="checkbox-line">
              <input
                type="checkbox"
                checked={form.wantsQuoteReview}
                onChange={(event) => update("wantsQuoteReview", event.target.checked)}
              />
              I want quote review
            </label>
          </div>
        </fieldset>

        <fieldset className="form-stack">
          <legend>Contact details</legend>
          <div className="grid two">
            <label>
              <span>Name</span>
              <input required value={form.name} onChange={(event) => update("name", event.target.value)} />
            </label>
            <label>
              <span>Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
              />
            </label>
            <label>
              <span>Phone optional</span>
              <input value={form.phone} onChange={(event) => update("phone", event.target.value)} />
            </label>
            <label className="honeypot" aria-hidden="true">
              <span>Company</span>
              <input tabIndex={-1} autoComplete="off" value={form.company} onChange={(event) => update("company", event.target.value)} />
            </label>
          </div>
          <label className="checkbox-line">
            <input
              required
              type="checkbox"
              checked={form.consentAccepted}
              onChange={(event) => update("consentAccepted", event.target.checked)}
            />
            I understand this is planning guidance only and agree to be contacted about this
            bathroom product schedule.
          </label>
        </fieldset>

        {result && !result.ok ? (
          <div className="notice error" role="alert">
            <strong>{result.error}</strong>
            {result.issues?.length ? (
              <ul>
                {result.issues.map((issue) => (
                  <li key={`${issue.path}-${issue.message}`}>{issue.message}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Generating..." : "Generate Bathroom Product Schedule"}
        </button>
      </form>

      <aside className="panel featured">
        {result?.ok ? <ScheduleResult result={result} /> : <EmptyPreview />}
      </aside>
    </div>
  );
}

function EmptyPreview() {
  return (
    <>
      <p className="pill">Planning output preview</p>
      <h2>Builder-ready product schedule preview</h2>
      <p>
        Your schedule will recommend categories for vanity, basin, tapware, mirror or shaving
        cabinet, accessories and product packs.
      </p>
      <ul className="mini-list">
        <li>PC allowance range</li>
        <li>WaterMark/WELS prompts</li>
        <li>Freight and installation risk notes</li>
        <li>Quote-review flags if quote text is supplied</li>
      </ul>
      <p>
        Product recommendations are not checkout items. Site measure, selections, licensed trade
        checks and written scope confirmation are required before contract pricing.
      </p>
    </>
  );
}

function ScheduleResult({ result }: { result: Extract<ApiResult, { ok: true }> }) {
  const { schedule } = result;
  const [copyStatus, setCopyStatus] = useState("");

  async function copyBuilderExport() {
    try {
      await navigator.clipboard.writeText(schedule.builderExport);
      setCopyStatus("Builder-ready planning summary copied.");
    } catch {
      setCopyStatus("Copy unavailable in this browser. Select the summary text instead.");
    }
  }

  return (
    <div className="form-stack">
      <p className="pill">Schedule generated</p>
      <h2>Product schedule planning range</h2>
      <p className="range-preview">
        {formatAllowanceRange(schedule.totalAllowanceLow, schedule.totalAllowanceHigh)}
      </p>
      <p>Confidence: {schedule.confidence}</p>
      <p>{schedule.generatedSummary}</p>

      <div>
        <h3>Recommended categories</h3>
        <div className="grid">
          {schedule.items.map((item) => (
            <article className="card" key={item.id}>
              <h4>{item.recommendedProduct.name}</h4>
              <p>{item.reason}</p>
              <p>
                Planning allowance: {formatAllowanceRange(item.allowanceLow, item.allowanceHigh)}
              </p>
              <p>{item.complianceNote}</p>
              {item.substitutionOptions.length ? (
                <div>
                  <h5>Alternatives to compare</h5>
                  <ul>
                    {item.substitutionOptions.map((option) => (
                      <li key={option.product.id}>
                        <strong>{option.product.name}:</strong> {option.reason} {option.tradeOff}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>

      <div>
        <h3>Product pack comparison</h3>
        <div className="grid">
          {schedule.packComparisons.map((pack) => (
            <article className="card" key={pack.id}>
              <h4>{pack.name}</h4>
              <p>{pack.allowanceRange}</p>
              <p>
                Fit: {pack.scheduleFit.replaceAll("_", " ")} · Allowance:{" "}
                {pack.allowanceAlignment.replaceAll("_", " ")}
              </p>
              <p>{pack.whyItFits}</p>
              <ul>
                {pack.watchouts.map((watchout) => (
                  <li key={watchout}>{watchout}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      {schedule.allowanceReview ? (
        <div>
          <h3>Quote allowance check</h3>
          <p>{schedule.allowanceReview.summary}</p>
          <div className="grid">
            {schedule.allowanceReview.checks.map((check) => (
              <article className="card" key={check.category}>
                <h4>{check.category}</h4>
                <p>Status: {check.status.replaceAll("_", " ")}</p>
                <p>
                  Quote: {check.quotedAmount ? formatAllowanceRange(check.quotedAmount, check.quotedAmount) : "not clear"}
                </p>
                <p>
                  Schedule:{" "}
                  {check.planningLow && check.planningHigh
                    ? formatAllowanceRange(check.planningLow, check.planningHigh)
                    : "not part of this schedule"}
                </p>
                <p>{check.prompt}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <h3>Compliance and risk prompts</h3>
        <ul>
          {[...result.warnings, ...schedule.complianceNotes, ...schedule.freightRiskNotes].map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>

      {schedule.quoteReviewFlags.length ? (
        <div>
          <h3>Quote review flags</h3>
          <ul>
            {schedule.quoteReviewFlags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <h3>Builder-ready planning export</h3>
        <p>
          Use this as a discussion brief only. It is not a purchase order, final pricing or
          compliance certification.
        </p>
        <pre className="summary-box">{schedule.builderExport || schedule.builderReadySummary}</pre>
        <button className="button secondary" type="button" onClick={copyBuilderExport}>
          Copy builder-ready summary
        </button>
        {copyStatus ? <p>{copyStatus}</p> : null}
      </div>

      <div className="actions" style={{ justifyContent: "flex-start" }}>
        {schedule.nextStepCtas.map((cta) => (
          <Link className="button secondary" href={cta.href} key={cta.intent}>
            {cta.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
