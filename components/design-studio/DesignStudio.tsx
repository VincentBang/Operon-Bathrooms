"use client";

import Link from "next/link";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  bathroomTypes,
  conceptualProductArchetypes,
  designPalettes,
  designStyles,
  findPalette,
  palettesForStyle,
  sampleTemplates
} from "@/data/public/bathroom-design-poc";
import { createEstimateHandoff, writeEstimateHandoff } from "@/lib/bathroom-design/handoff";
import {
  DESIGN_SCHEMA_VERSION,
  REQUIRED_TRUST_LABELS,
  createDesignDraftId,
  BathroomDesignDraft
} from "@/lib/bathroom-design/schema";
import { writeLocalDesignDraft } from "@/lib/bathroom-design/storage";
import { trackDesignStudioEvent } from "@/lib/bathroom-design/events";
import { getLayoutRiskPrompts } from "@/lib/bathroom-design/layout-risk";
import { BeforeAfterSlider } from "@/components/design-studio/BeforeAfterSlider";
import { ApproximateLayoutPreview } from "@/components/design-studio/ApproximateLayoutPreview";
import { ConceptPreview } from "@/components/design-studio/ConceptPreview";
import { DesignSummary, getDesignSummaryText } from "@/components/design-studio/DesignSummary";

type Step = "type" | "start" | "layout" | "style" | "palette" | "concepts" | "result";
type LayoutPlanning = BathroomDesignDraft["layoutPlanning"];
type FixtureZone = LayoutPlanning["fixtureZones"][number];

const stepOrder: Step[] = ["type", "start", "layout", "style", "palette", "concepts", "result"];
const stepLabels: Record<Step, string> = {
  type: "Bathroom type",
  start: "Starting point",
  layout: "Approximate layout",
  style: "Style direction",
  palette: "Palette",
  concepts: "Concepts",
  result: "Planning brief"
};
const roomShapeOptions: Array<{ id: LayoutPlanning["roomShape"]; label: string; note: string }> = [
  { id: "rectangle", label: "Rectangle", note: "Simple four-wall bathroom shape." },
  { id: "l-shape", label: "L-shape", note: "Planning shape with a return or nib wall." },
  { id: "galley", label: "Galley", note: "Narrow room with fixtures along one or both sides." },
  { id: "open-zone", label: "Open zone", note: "Larger wet-area or combined-function planning zone." },
  { id: "unknown", label: "Not sure", note: "Keep this unclear until site measure or review." }
];
const sizeBandOptions: Array<{ id: LayoutPlanning["sizeBand"]; label: string; note: string }> = [
  { id: "compact", label: "Compact", note: "Small bathroom or tight ensuite planning band." },
  { id: "standard", label: "Standard", note: "Typical main bathroom or ensuite planning band." },
  { id: "large", label: "Large", note: "Larger bathroom, laundry-bathroom or bath-inclusive layout." },
  { id: "unknown", label: "Not sure", note: "Use when measurements are not available." }
];
const entryPositionOptions: Array<{ id: LayoutPlanning["entryPosition"]; label: string; note: string }> = [
  { id: "north-wall", label: "Top wall", note: "Door entry is roughly on the top wall of the plan." },
  { id: "east-wall", label: "Right wall", note: "Door entry is roughly on the right wall." },
  { id: "south-wall", label: "Bottom wall", note: "Door entry is roughly on the bottom wall." },
  { id: "west-wall", label: "Left wall", note: "Door entry is roughly on the left wall." },
  { id: "unknown", label: "Not sure", note: "Keep entry position unclear for now." }
];
const fixturePositionOptions: Array<{ id: FixtureZone["approximatePosition"]; label: string }> = [
  { id: "north-wall", label: "Top wall" },
  { id: "east-wall", label: "Right wall" },
  { id: "south-wall", label: "Bottom wall" },
  { id: "west-wall", label: "Left wall" },
  { id: "centre", label: "Centre" },
  { id: "corner", label: "Corner" },
  { id: "entry-side", label: "Entry side" },
  { id: "window-side", label: "Window side" },
  { id: "unknown", label: "Not sure" }
];
const fixtureStatusOptions: Array<{ id: FixtureZone["status"]; label: string }> = [
  { id: "existing", label: "Existing" },
  { id: "planned", label: "Planned" },
  { id: "unclear", label: "Unclear" }
];
const serviceChangeOptions: Array<{ id: FixtureZone["serviceChange"]; label: string }> = [
  { id: "keep", label: "Keep" },
  { id: "relocate", label: "Relocate" },
  { id: "new", label: "New" },
  { id: "remove", label: "Remove" },
  { id: "unclear", label: "Unclear" }
];

function allowanceForStyle(styleId: string): BathroomDesignDraft["allowanceBand"] {
  if (styleId === "classic-refined" || styleId === "natural-spa") return "premium";
  if (styleId === "modern-minimal" || styleId === "urban-apartment") return "considered";
  return "essential";
}

function createVariants(paletteId: string) {
  return [
    {
      id: "balanced-concept",
      name: "Balanced concept",
      summary: "Even mix of surface, joinery and fixture emphasis.",
      paletteId,
      emphasis: "balanced" as const
    },
    {
      id: "surface-led-concept",
      name: "Surface-led concept",
      summary: "Tile and wall finish carry more of the visual direction.",
      paletteId,
      emphasis: "surface-led" as const
    },
    {
      id: "fixture-led-concept",
      name: "Fixture-led concept",
      summary: "Vanity, tapware and screen choices create the stronger accent.",
      paletteId,
      emphasis: "fixture-led" as const
    }
  ];
}

function createSelections(styleId: string, paletteId: string) {
  const palette = findPalette(paletteId);
  const finishFamilies = palette?.finishFamilies ?? [];
  const preferred =
    styleId === "classic-refined"
      ? ["floor-standing-vanity", "back-to-wall-toilet", "mirrored-shaving-cabinet"]
      : styleId === "natural-spa"
        ? ["wall-hung-vanity", "walk-in-shower-screen", "freestanding-bath"]
        : ["wall-hung-vanity", "back-to-wall-toilet", "walk-in-shower-screen"];

  return preferred.map((id, index) => {
    const archetype = conceptualProductArchetypes.find((item) => item.id === id) ?? conceptualProductArchetypes[0];
    return {
      archetypeId: archetype.id,
      label: archetype.name,
      finishFamily: finishFamilies[index % Math.max(1, finishFamilies.length)] ?? "conceptual finish family",
      verifiedProduct: false as const
    };
  });
}

function createDefaultFixtureZones(bathroomType: BathroomDesignDraft["bathroomType"]): LayoutPlanning["fixtureZones"] {
  const fixtureZones: LayoutPlanning["fixtureZones"] = [
    {
      fixtureType: "shower",
      label: "Shower zone",
      approximatePosition: bathroomType === "small-bathroom" ? "north-wall" : "corner",
      status: "existing",
      serviceChange: "unclear"
    },
    {
      fixtureType: "vanity",
      label: "Vanity zone",
      approximatePosition: "entry-side",
      status: "existing",
      serviceChange: "unclear"
    },
    {
      fixtureType: "toilet",
      label: "Toilet zone",
      approximatePosition: "west-wall",
      status: "existing",
      serviceChange: "unclear"
    }
  ];

  if (bathroomType === "laundry-bathroom-combination") {
    fixtureZones.push({
      fixtureType: "laundry",
      label: "Laundry appliance zone",
      approximatePosition: "south-wall",
      status: "planned",
      serviceChange: "unclear"
    });
  }

  return fixtureZones;
}

function createDefaultLayoutPlanning(
  bathroomType: BathroomDesignDraft["bathroomType"],
  roomShape: LayoutPlanning["roomShape"],
  sizeBand: LayoutPlanning["sizeBand"],
  entryPosition: LayoutPlanning["entryPosition"],
  fixtureZones: LayoutPlanning["fixtureZones"]
): LayoutPlanning {
  return {
    roomShape,
    sizeBand,
    entryPosition,
    fixtureZones,
    constraints: {
      strataOrClass2: bathroomType === "apartment-bathroom",
      accessLimitations: false,
      waterproofingUncertainty: true,
      drainageOrFallsConcern: true,
      ventilationConcern: false,
      suspectedAsbestos: false
    },
    labels: {
      approximatePlanningLayout: true,
      measuredPlan: false,
      constructionDrawing: false,
      planningGuidanceOnly: true
    }
  };
}

export function DesignStudio() {
  const [step, setStep] = useState<Step>("type");
  const [bathroomType, setBathroomType] = useState<BathroomDesignDraft["bathroomType"]>("main-bathroom");
  const [startingKind, setStartingKind] = useState<"sample" | "local-photo">("sample");
  const [sampleTemplateId, setSampleTemplateId] = useState(sampleTemplates[0].id);
  const [styleId, setStyleId] = useState(designStyles[0].id);
  const [paletteId, setPaletteId] = useState(designStyles[0].paletteIds[0]);
  const [selectedVariantId, setSelectedVariantId] = useState("balanced-concept");
  const [roomShape, setRoomShape] = useState<LayoutPlanning["roomShape"]>("rectangle");
  const [sizeBand, setSizeBand] = useState<LayoutPlanning["sizeBand"]>("standard");
  const [entryPosition, setEntryPosition] = useState<LayoutPlanning["entryPosition"]>("south-wall");
  const [fixtureZones, setFixtureZones] = useState<LayoutPlanning["fixtureZones"]>(() => createDefaultFixtureZones("main-bathroom"));
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoUsed, setPhotoUsed] = useState(false);
  const [overlay, setOverlay] = useState(55);
  const [savedMessage, setSavedMessage] = useState("");
  const [draftId] = useState(createDesignDraftId);
  const [createdAt] = useState(() => new Date().toISOString());

  useEffect(() => {
    trackDesignStudioEvent("design_studio_viewed");
  }, []);

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  const stylePalettes = palettesForStyle(styleId);
  const variants = useMemo(() => createVariants(paletteId), [paletteId]);
  const layoutPlanning = useMemo(
    () => createDefaultLayoutPlanning(bathroomType, roomShape, sizeBand, entryPosition, fixtureZones),
    [bathroomType, entryPosition, fixtureZones, roomShape, sizeBand]
  );
  const layoutRiskPrompts = useMemo(() => getLayoutRiskPrompts(layoutPlanning), [layoutPlanning]);
  const draft = useMemo<BathroomDesignDraft>(() => {
    const now = new Date().toISOString();
    return {
      schemaVersion: DESIGN_SCHEMA_VERSION,
      id: draftId,
      createdAt,
      updatedAt: now,
      mode: "quick",
      bathroomType,
      startingPoint: {
        kind: startingKind,
        sampleTemplateId: startingKind === "sample" ? sampleTemplateId : undefined,
        photoUsed
      },
      styleId,
      paletteId,
      variants,
      selectedVariantId,
      conceptualSelections: createSelections(styleId, paletteId),
      allowanceBand: allowanceForStyle(styleId),
      labels: REQUIRED_TRUST_LABELS,
      layoutPlanning,
      layoutRiskPrompts,
      preferredNextStep: "estimate"
    };
  }, [
    bathroomType,
    createdAt,
    draftId,
    paletteId,
    photoUsed,
    sampleTemplateId,
    selectedVariantId,
    startingKind,
    styleId,
    variants,
    layoutPlanning,
    layoutRiskPrompts
  ]);

  function goTo(nextStep: Step) {
    setStep(nextStep);
    if (nextStep === "concepts") {
      trackDesignStudioEvent("concept_generated", {
        draftId,
        payload: { bathroomType, styleId, paletteId, photoUsed, allowanceBand: draft.allowanceBand }
      });
    }
    if (nextStep === "result") {
      trackDesignStudioEvent("design_studio_completed", { draftId, payload: { selectedVariantId } });
    }
  }

  function chooseStyle(nextStyleId: typeof styleId) {
    const nextPaletteId = designStyles.find((style) => style.id === nextStyleId)?.paletteIds[0] ?? designPalettes[0].id;
    setStyleId(nextStyleId);
    setPaletteId(nextPaletteId);
    setSelectedVariantId("balanced-concept");
    trackDesignStudioEvent("style_selected", { draftId, payload: { styleId: nextStyleId } });
  }

  function choosePalette(nextPaletteId: string) {
    setPaletteId(nextPaletteId);
    setSelectedVariantId("balanced-concept");
    trackDesignStudioEvent("palette_selected", { draftId, payload: { paletteId: nextPaletteId } });
  }

  function handlePhoto(file: File | null) {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    if (!file) {
      setPhotoUrl(null);
      setPhotoUsed(false);
      setStartingKind("sample");
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    setPhotoUrl(nextUrl);
    setPhotoUsed(true);
    setStartingKind("local-photo");
  }

  function chooseBathroomType(nextBathroomType: BathroomDesignDraft["bathroomType"]) {
    setBathroomType(nextBathroomType);
    setFixtureZones(createDefaultFixtureZones(nextBathroomType));
    if (nextBathroomType === "small-bathroom") {
      setRoomShape("galley");
      setSizeBand("compact");
    } else if (nextBathroomType === "laundry-bathroom-combination") {
      setRoomShape("open-zone");
      setSizeBand("large");
    } else {
      setRoomShape("rectangle");
      setSizeBand("standard");
    }
    trackDesignStudioEvent("bathroom_type_selected", {
      draftId,
      payload: { bathroomType: nextBathroomType }
    });
  }

  function updateFixtureZone(index: number, patch: Partial<FixtureZone>) {
    setFixtureZones((zones) =>
      zones.map((zone, zoneIndex) => (zoneIndex === index ? { ...zone, ...patch } : zone))
    );
  }

  async function saveDraft() {
    writeLocalDesignDraft(draft, window.localStorage);
    setSavedMessage("Saved locally on this device. The source image was not saved.");
    trackDesignStudioEvent("design_saved_local", { draftId });
  }

  async function copySummary() {
    await navigator.clipboard.writeText(getDesignSummaryText(draft));
    setSavedMessage("Design summary copied. It does not include image data or commercial calculations.");
  }

  function printBrief() {
    trackDesignStudioEvent("design_brief_printed", { draftId });
    window.print();
  }

  function startEstimate() {
    const handoff = createEstimateHandoff(draft);
    writeEstimateHandoff(handoff, window.sessionStorage);
    trackDesignStudioEvent("estimate_handoff_started", { draftId });
    window.location.href = "/quote?designContext=1";
  }

  const stepIndex = stepOrder.indexOf(step);

  return (
    <section className="page-section design-studio-page">
      <div className="container">
        <p className="pill">Feature-flagged planning preview</p>
        <h1>Operon Bathroom Design Studio</h1>
        <p className="lead">
          Create a planning-only inspiration brief with approximate layout notes, conceptual
          selections and safe handoff into the estimate flow. Outputs are not measured plans,
          specifications, quotes or construction documents.
        </p>
        <div className="notice">
          <strong>Before contract pricing</strong>
          <p>
            Site measure, selections, licensed-trade checks and written scope confirmation are
            required before contract pricing.
          </p>
        </div>
        <TrustLabels />

        <div className="design-studio-shell">
          <aside className="panel steps">
            <ol className="step-list">
              {stepOrder.map((item, index) => (
                <li aria-current={item === step ? "step" : undefined} className={item === step ? "active" : ""} key={item}>
                  {index + 1}. {stepLabels[item]}
                </li>
              ))}
            </ol>
          </aside>

          <div className="panel featured">
            <p className="pill">Step {stepIndex + 1} of {stepOrder.length}</p>
            {step === "type" ? (
              <>
                <h2>Choose the bathroom type.</h2>
                <div className="choice-grid">
                  {bathroomTypes.map((item) => (
                    <button
                      className={bathroomType === item.id ? "choice-card selected" : "choice-card"}
                      key={item.id}
                      onClick={() => chooseBathroomType(item.id)}
                      type="button"
                    >
                      <strong>{item.name}</strong>
                      <span>{item.note}</span>
                    </button>
                  ))}
                </div>
                <StepActions next={() => goTo("start")} />
              </>
            ) : null}

            {step === "start" ? (
              <>
                <h2>Pick a starting point.</h2>
                <div className="grid">
                  {sampleTemplates.map((template) => (
                    <button
                      className={startingKind === "sample" && sampleTemplateId === template.id ? "choice-card selected" : "choice-card"}
                      key={template.id}
                      onClick={() => {
                        setStartingKind("sample");
                        setSampleTemplateId(template.id);
                        setPhotoUsed(false);
                      }}
                      type="button"
                    >
                      <strong>{template.name}</strong>
                      <span>{template.description}</span>
                    </button>
                  ))}
                </div>
                <div className="notice">
                  <strong>Optional local photo</strong>
                  <p>
                    Your selected image stays in browser memory for this session only. It is not
                    uploaded, stored in localStorage, sent to Supabase or included in analytics.
                  </p>
                  <label>
                    Select local bathroom reference image
                    <input accept="image/png,image/jpeg,image/webp" type="file" onChange={(event) => handlePhoto(event.target.files?.[0] ?? null)} />
                  </label>
                </div>
                <BeforeAfterSlider imageUrl={photoUrl} overlayLabel="Concept overlay" value={overlay} onChange={setOverlay} />
                <StepActions back={() => goTo("type")} next={() => goTo("layout")} />
              </>
            ) : null}

            {step === "layout" ? (
              <>
                <h2>Set the approximate layout starting point.</h2>
                <p className="muted">
                  These choices are broad planning bands only. They are not measured dimensions or
                  construction drawings, and they do not confirm whether a layout can be built.
                </p>
                <fieldset>
                  <legend>Approximate room shape</legend>
                  <div className="choice-grid compact">
                    {roomShapeOptions.map((option) => (
                      <button
                        className={roomShape === option.id ? "choice-card selected" : "choice-card"}
                        key={option.id}
                        onClick={() => setRoomShape(option.id)}
                        type="button"
                      >
                        <strong>{option.label}</strong>
                        <span>{option.note}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend>Approximate size band</legend>
                  <div className="choice-grid compact">
                    {sizeBandOptions.map((option) => (
                      <button
                        className={sizeBand === option.id ? "choice-card selected" : "choice-card"}
                        key={option.id}
                        onClick={() => setSizeBand(option.id)}
                        type="button"
                      >
                        <strong>{option.label}</strong>
                        <span>{option.note}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend>Approximate door entry</legend>
                  <div className="choice-grid compact">
                    {entryPositionOptions.map((option) => (
                      <button
                        className={entryPosition === option.id ? "choice-card selected" : "choice-card"}
                        key={option.id}
                        onClick={() => setEntryPosition(option.id)}
                        type="button"
                      >
                        <strong>{option.label}</strong>
                        <span>{option.note}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <div className="notice">
                  <strong>Approximate planning layout</strong>
                  <p>
                    The planner records shape and size bands only. Site measure, selections,
                    licensed-trade checks and written scope confirmation are required before
                    contract pricing.
                  </p>
                </div>
                <ApproximateLayoutPreview layout={draft.layoutPlanning} />
                <FixtureZoneControls zones={fixtureZones} onChange={updateFixtureZone} />
                <StepActions back={() => goTo("start")} next={() => goTo("style")} />
              </>
            ) : null}

            {step === "style" ? (
              <>
                <h2>Select a style direction.</h2>
                <div className="choice-grid">
                  {designStyles.map((style) => (
                    <button
                      className={styleId === style.id ? "choice-card selected" : "choice-card"}
                      key={style.id}
                      onClick={() => chooseStyle(style.id)}
                      type="button"
                    >
                      <strong>{style.name}</strong>
                      <span>{style.description}</span>
                    </button>
                  ))}
                </div>
                <StepActions back={() => goTo("layout")} next={() => goTo("palette")} />
              </>
            ) : null}

            {step === "palette" ? (
              <>
                <h2>Choose one of the two approved palettes.</h2>
                <div className="grid two">
                  {stylePalettes.map((palette) => (
                    <button
                      className={paletteId === palette.id ? "palette-card selected" : "palette-card"}
                      key={palette.id}
                      onClick={() => choosePalette(palette.id)}
                      type="button"
                    >
                      <span className="swatches" aria-hidden="true">
                        {Object.values(palette.colours).map((colour) => (
                          <span key={colour} style={{ background: colour }} />
                        ))}
                      </span>
                      <strong>{palette.name}</strong>
                      <span>{palette.summary}</span>
                    </button>
                  ))}
                </div>
                <StepActions back={() => goTo("style")} next={() => goTo("concepts")} />
              </>
            ) : null}

            {step === "concepts" ? (
              <>
                <h2>Compare inspiration concepts.</h2>
                <p className="muted">
                  These are deterministic inspiration visuals using local style data. They are not
                  measured layouts or verified products.
                </p>
                <div className="concept-grid">
                  {variants.map((variant) => (
                    <ConceptPreview
                      key={variant.id}
                      palette={findPalette(paletteId) ?? designPalettes[0]}
                      variant={variant}
                      selected={selectedVariantId === variant.id}
                      onSelect={() => {
                        setSelectedVariantId(variant.id);
                        trackDesignStudioEvent("variant_compared", { draftId, payload: { selectedVariantId: variant.id } });
                      }}
                    />
                  ))}
                </div>
                <StepActions back={() => goTo("palette")} next={() => goTo("result")} nextLabel="Create brief" />
              </>
            ) : null}

            {step === "result" ? (
              <>
                <h2>Your planning brief.</h2>
                <TrustLabels />
                <DesignSummary draft={draft} />
                <div className="actions result-actions">
                  <button onClick={saveDraft} type="button">Save locally</button>
                  <button className="secondary" onClick={copySummary} type="button">Copy design summary</button>
                  <button className="secondary" onClick={printBrief} type="button">Print brief</button>
                  <button onClick={startEstimate} type="button">Start planning estimate</button>
                  <Link className="button ghost" href="/request-review">Request scope review</Link>
                </div>
                {savedMessage ? <p className="notice">{savedMessage}</p> : null}
                <StepActions back={() => goTo("concepts")} />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FixtureZoneControls({
  zones,
  onChange
}: {
  zones: LayoutPlanning["fixtureZones"];
  onChange: (index: number, patch: Partial<FixtureZone>) => void;
}) {
  return (
    <fieldset className="fixture-zone-controls">
      <legend>Fixture-zone placement</legend>
      <p className="muted">
        Adjust broad fixture positions and service-change intent only. These controls do not create
        measured plans, construction drawings or confirmed trade scope.
      </p>
      <div className="fixture-zone-grid">
        {zones.map((zone, index) => (
          <div className="fixture-zone-card" key={`${zone.fixtureType}-${zone.label}`}>
            <h3>{zone.label}</h3>
            <label>
              Approximate position
              <select
                aria-label={`${zone.label} approximate position`}
                value={zone.approximatePosition}
                onChange={(event) =>
                  onChange(index, { approximatePosition: event.target.value as FixtureZone["approximatePosition"] })
                }
              >
                {fixturePositionOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </label>
            <label>
              Zone status
              <select
                aria-label={`${zone.label} status`}
                value={zone.status}
                onChange={(event) => onChange(index, { status: event.target.value as FixtureZone["status"] })}
              >
                {fixtureStatusOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </label>
            <label>
              Service change
              <select
                aria-label={`${zone.label} service change`}
                value={zone.serviceChange}
                onChange={(event) =>
                  onChange(index, { serviceChange: event.target.value as FixtureZone["serviceChange"] })
                }
              >
                {serviceChangeOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

function StepActions({ back, next, nextLabel = "Next" }: { back?: () => void; next?: () => void; nextLabel?: string }) {
  return (
    <div className="actions">
      {back ? <button className="secondary" onClick={back} type="button">Back</button> : null}
      {next ? <button onClick={next} type="button">{nextLabel}</button> : null}
    </div>
  );
}

function TrustLabels() {
  return (
    <div className="trust-label-grid" aria-label="Design output labels">
      <span>Inspiration visual: conceptual appearance only</span>
      <span>Approximate layout: not measured or independently verified</span>
      <span>Measured layout: unavailable in this planning preview</span>
      <span>Verified product: unavailable without a future verified catalogue</span>
      <span>Conceptual product: visual archetype only, not a confirmed SKU</span>
      <span>Planning estimate: range-based guidance only</span>
      <span>Confirmed written scope: requires human review and site measure</span>
    </div>
  );
}
