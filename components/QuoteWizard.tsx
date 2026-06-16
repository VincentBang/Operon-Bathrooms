"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { readAttribution } from "@/lib/attribution";
import {
  defaultWizardInput,
  EstimateResult,
  QuoteWizardInput,
  quoteWizardSchema
} from "@/lib/estimate-schema";

type Step = {
  title: string;
  render: (input: QuoteWizardInput, update: UpdateFn) => React.ReactNode;
};

type UpdateFn = <K extends keyof QuoteWizardInput>(key: K, value: QuoteWizardInput[K]) => void;

const choice = (label: string, value: string) => ({ label, value });

function SelectField({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const steps: Step[] = [
  {
    title: "Project basics",
    render: (input, update) => (
      <div className="form-grid">
        <SelectField
          label="Project type"
          value={input.projectType}
          onChange={(value) => update("projectType", value as QuoteWizardInput["projectType"])}
          options={[
            choice("Full bathroom", "full-bathroom"),
            choice("Ensuite", "ensuite"),
            choice("Small bathroom", "small-bathroom")
          ]}
        />
        <SelectField
          label="Timeline"
          value={input.timeline}
          onChange={(value) => update("timeline", value as QuoteWizardInput["timeline"])}
          options={[
            choice("Planning only", "planning"),
            choice("1 to 3 months", "one-to-three-months"),
            choice("Ready now", "ready-now")
          ]}
        />
      </div>
    )
  },
  {
    title: "Property type & suburb",
    render: (input, update) => (
      <div className="form-grid">
        <SelectField
          label="Property type"
          value={input.propertyType}
          onChange={(value) => update("propertyType", value as QuoteWizardInput["propertyType"])}
          options={[
            choice("House", "house"),
            choice("Apartment", "apartment"),
            choice("Townhouse", "townhouse"),
            choice("Duplex", "duplex")
          ]}
        />
        <label>
          Sydney suburb
          <input
            value={input.suburb}
            onChange={(event) => update("suburb", event.target.value)}
            placeholder="e.g. Marrickville"
          />
        </label>
      </div>
    )
  },
  {
    title: "Home age & condition",
    render: (input, update) => (
      <div className="form-grid">
        <SelectField
          label="Home age"
          value={input.homeAge}
          onChange={(value) => update("homeAge", value as QuoteWizardInput["homeAge"])}
          options={[
            choice("Post 2000", "post-2000"),
            choice("1980 to 2000", "1980-2000"),
            choice("Pre 1980", "pre-1980"),
            choice("Unknown", "unknown")
          ]}
        />
        <SelectField
          label="Existing condition"
          value={input.condition}
          onChange={(value) => update("condition", value as QuoteWizardInput["condition"])}
          options={[choice("Good", "good"), choice("Average", "average"), choice("Poor", "poor")]}
        />
      </div>
    )
  },
  {
    title: "Room size & layout",
    render: (input, update) => (
      <div className="form-grid">
        <SelectField
          label="Room size"
          value={input.roomSize}
          onChange={(value) => update("roomSize", value as QuoteWizardInput["roomSize"])}
          options={[choice("Small", "small"), choice("Standard", "standard"), choice("Large", "large")]}
        />
        <SelectField
          label="Layout change"
          value={input.layoutChange}
          onChange={(value) => update("layoutChange", value as QuoteWizardInput["layoutChange"])}
          options={[
            choice("Keep current layout", "keep"),
            choice("Minor changes", "minor"),
            choice("Move wet area", "move-wet-area")
          ]}
        />
      </div>
    )
  },
  {
    title: "Plumbing & electrical",
    render: (input, update) => (
      <div className="form-grid">
        <SelectField
          label="Plumbing scope"
          value={input.plumbingScope}
          onChange={(value) => update("plumbingScope", value as QuoteWizardInput["plumbingScope"])}
          options={[
            choice("Like for like", "like-for-like"),
            choice("Some upgrades", "some-upgrades"),
            choice("Major upgrades", "major-upgrades")
          ]}
        />
        <SelectField
          label="Electrical scope"
          value={input.electricalScope}
          onChange={(value) => update("electricalScope", value as QuoteWizardInput["electricalScope"])}
          options={[
            choice("Like for like", "like-for-like"),
            choice("New lights or GPO", "new-lights-gpo"),
            choice("Major upgrades", "major-upgrades")
          ]}
        />
      </div>
    )
  },
  {
    title: "Ventilation & waterproofing",
    render: (input, update) => (
      <div className="form-grid">
        <SelectField
          label="Ventilation"
          value={input.ventilationScope}
          onChange={(value) => update("ventilationScope", value as QuoteWizardInput["ventilationScope"])}
          options={[
            choice("Existing seems OK", "existing-ok"),
            choice("Upgrade needed", "upgrade-needed"),
            choice("Unknown", "unknown")
          ]}
        />
        <SelectField
          label="Waterproofing complexity"
          value={input.waterproofingComplexity}
          onChange={(value) =>
            update("waterproofingComplexity", value as QuoteWizardInput["waterproofingComplexity"])
          }
          options={[
            choice("Standard", "standard"),
            choice("Complex", "complex"),
            choice("Unknown", "unknown")
          ]}
        />
      </div>
    )
  },
  {
    title: "Tiling & surfaces",
    render: (input, update) => (
      <SelectField
        label="Tiling scope"
        value={input.tilingScope}
        onChange={(value) => update("tilingScope", value as QuoteWizardInput["tilingScope"])}
        options={[
          choice("Partial height", "partial-height"),
          choice("Floor to ceiling", "floor-to-ceiling")
        ]}
      />
    )
  },
  {
    title: "Fixtures & fittings",
    render: (input, update) => (
      <SelectField
        label="Fixture level"
        value={input.fixtureLevel}
        onChange={(value) => update("fixtureLevel", value as QuoteWizardInput["fixtureLevel"])}
        options={[choice("Budget", "budget"), choice("Mid", "mid"), choice("Premium", "premium")]}
      />
    )
  },
  {
    title: "Access & strata/asbestos",
    render: (input, update) => (
      <div className="form-grid">
        <SelectField
          label="Access"
          value={input.access}
          onChange={(value) => update("access", value as QuoteWizardInput["access"])}
          options={[choice("Easy", "easy"), choice("Limited", "limited"), choice("Difficult", "difficult")]}
        />
        <SelectField
          label="Asbestos concern"
          value={input.asbestosConcern}
          onChange={(value) => update("asbestosConcern", value as QuoteWizardInput["asbestosConcern"])}
          options={[choice("No", "no"), choice("Possible", "possible"), choice("Known", "known")]}
        />
        <label>
          <span>Strata property</span>
          <select
            value={input.strata ? "yes" : "no"}
            onChange={(event) => update("strata", event.target.value === "yes")}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
      </div>
    )
  },
  {
    title: "Contact details",
    render: (input, update) => (
      <div className="form-grid">
        {(["name", "email", "phone"] as const).map((field) => (
          <label key={field}>
            {field === "name" ? "Name" : field === "email" ? "Email" : "Phone"}
            <input
              value={input.contact[field]}
              onChange={(event) =>
                update("contact", { ...input.contact, [field]: event.target.value })
              }
              type={field === "email" ? "email" : "text"}
            />
          </label>
        ))}
      </div>
    )
  }
];

export function QuoteWizard() {
  const [input, setInput] = useState<QuoteWizardInput>(defaultWizardInput);
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const activeStep = steps[stepIndex];
  const parsed = useMemo(() => quoteWizardSchema.safeParse(input), [input]);

  const update: UpdateFn = (key, value) => {
    setInput((current) => ({ ...current, [key]: value }));
    setError("");
  };

  async function submitEstimate() {
    const validation = quoteWizardSchema.safeParse(input);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "Please check your answers.");
      return;
    }

    setIsLoading(true);
    setError("");
    const response = await fetch("/api/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data)
    });

    if (!response.ok) {
      setError("The estimate could not be prepared. Please try again.");
      setIsLoading(false);
      return;
    }

    const nextResult = (await response.json()) as EstimateResult;
    setResult(nextResult);
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: validation.data,
        result: nextResult,
        attribution: readAttribution("/quote")
      })
    });
    setIsLoading(false);
  }

  async function downloadPdf() {
    if (!result) return;
    const response = await fetch("/api/estimate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, result })
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "operon-bathrooms-planning-estimate.pdf";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (result) {
    return (
      <div className="quote-shell">
        <aside className="panel">
          <p className="pill">{result.confidenceLabel} confidence</p>
          <p>{result.confidenceScore}/100 confidence score</p>
          <button className="secondary" onClick={() => setResult(null)}>
            Edit answers
          </button>
        </aside>
        <section className="panel featured">
          <p className="pill">Planning estimate only</p>
          <h2>Your indicative range</h2>
          <p className="estimate-range">{result.range.label}</p>
          <p>
            This is planning guidance only. It is not contract pricing, a contract, legal advice or a
            commitment to complete the work for this amount.
          </p>
          <div className="grid">
            <ResultList title="Scope summary" items={result.scopeSummary} />
            <ResultList title="Assumptions" items={result.assumptions} />
            <ResultList title="Exclusions" items={result.exclusions} />
          </div>
          <ResultList title="Risk flags" items={result.riskFlags.length ? result.riskFlags : ["No major risk flags from the supplied answers."]} />
          <ResultList title="Compliance prompts" items={result.compliancePrompts} />
          <div className="notice">
            <strong>Recommended next step</strong>
            <p>{result.recommendedNextStep}</p>
          </div>
          <div className="actions" style={{ justifyContent: "flex-start" }}>
            <button onClick={downloadPdf}>Download PDF</button>
            <Link className="button secondary" href="/quote/review">
              Review my bathroom quote
            </Link>
            <Link className="button secondary" href="/site-measure">
              Request site measure
            </Link>
            <Link className="button ghost" href="/request-review">
              Request scope review
            </Link>
            <Link className="button ghost" href="/bathroom-renovation-cost-sydney">
              Read cost guide
            </Link>
            <a
              className="button secondary"
              href={`mailto:${input.contact.email}?subject=Operon Bathrooms planning estimate&body=${encodeURIComponent(
                `Your guidance-only planning estimate range is ${result.range.label}. Please book a site review before relying on contract pricing.`
              )}`}
            >
              Email estimate
            </a>
          </div>
          {result.riskFlags.length ? (
            <div className="notice">
              <strong>High-risk path</strong>
              <p>
                Risk flags are present. Request manual review before committing, signing or paying
                a deposit.
              </p>
              <Link className="button secondary" href="/request-review">
                Request manual review before committing
              </Link>
            </div>
          ) : null}
        </section>
      </div>
    );
  }

  return (
    <div className="quote-shell">
      <aside className="panel steps">
        <ol className="step-list">
          {steps.map((step, index) => (
            <li className={index === stepIndex ? "active" : ""} key={step.title}>
              {index + 1}. {step.title}
            </li>
          ))}
          <li className={!result && parsed.success ? "active" : ""}>11. Estimate output</li>
        </ol>
      </aside>
      <section className="panel">
        <p className="pill">Step {stepIndex + 1} of {steps.length}</p>
        <h2>{activeStep.title}</h2>
        {activeStep.render(input, update)}
        {error ? <p className="notice">{error}</p> : null}
        <div className="actions">
          <button
            className="secondary"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
          >
            Back
          </button>
          {stepIndex < steps.length - 1 ? (
            <button onClick={() => setStepIndex((current) => current + 1)}>Next</button>
          ) : (
            <button onClick={submitEstimate} disabled={isLoading}>
              {isLoading ? "Preparing..." : "Prepare estimate"}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function ResultList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
