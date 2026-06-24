import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToString } from "react-dom/server";
import { metadata as designStudioMetadata } from "../app/design-studio/page";
import sitemap from "../app/sitemap";
import {
  catalogueCandidates,
  conceptualProductArchetypes,
  designPalettes,
  designStyles,
  sampleTemplates
} from "../data/public/bathroom-design-poc";
import { DesignStudio, FixtureZoneControls } from "../components/design-studio/DesignStudio";
import { ApproximateLayoutPreview } from "../components/design-studio/ApproximateLayoutPreview";
import { getDesignSummaryText } from "../components/design-studio/DesignSummary";
import { getLayoutRiskPrompts } from "../lib/bathroom-design/layout-risk";
import {
  BathroomDesignDraft,
  MAX_LAYOUT_ZONES,
  REQUIRED_TRUST_LABELS,
  bathroomDesignDraftSchema,
  safeParseBathroomDesignHandoff
} from "../lib/bathroom-design/schema";
import {
  DESIGN_DRAFT_STORAGE_KEY,
  designDraftContainsForbiddenPersistence,
  readLocalDesignDraft,
  writeLocalDesignDraft
} from "../lib/bathroom-design/storage";
import {
  createEstimateHandoff,
  mapHandoffToQuoteDefaults,
  readEstimateHandoff
} from "../lib/bathroom-design/handoff";

function memoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    dump: () => Object.fromEntries(store)
  };
}

function validDraft(overrides: Partial<BathroomDesignDraft> = {}): BathroomDesignDraft {
  const now = "2026-06-23T00:00:00.000Z";
  return {
    schemaVersion: "0.3",
    id: "design-test-draft",
    createdAt: now,
    updatedAt: now,
    mode: "quick",
    bathroomType: "main-bathroom",
    startingPoint: {
      kind: "sample",
      sampleTemplateId: sampleTemplates[0].id,
      photoUsed: false
    },
    styleId: "warm-contemporary",
    paletteId: "warm-contemporary-clay",
    variants: [
      {
        id: "balanced-concept",
        name: "Balanced concept",
        summary: "A deterministic concept.",
        paletteId: "warm-contemporary-clay",
        emphasis: "balanced"
      },
      {
        id: "surface-led-concept",
        name: "Surface-led concept",
        summary: "A deterministic concept.",
        paletteId: "warm-contemporary-clay",
        emphasis: "surface-led"
      }
    ],
    selectedVariantId: "balanced-concept",
    conceptualSelections: [
      {
        archetypeId: "wall-hung-vanity",
        label: "Wall-hung vanity archetype",
        finishFamily: "clay-look wall tile",
        verifiedProduct: false
      }
    ],
    productShortlist: [
      {
        candidateId: "candidate-wall-hung-vanity-warm-oak",
        archetypeId: "wall-hung-vanity",
        category: "vanity",
        label: "Wall-hung vanity candidate, warm timber-look",
        finishFamily: "warm timber-look vanity",
        planningUse: "Keeps floor area visually lighter for standard bathrooms and ensuites.",
        evidencePrompt: "Confirm wall structure, plumbing set-out and storage size during site review.",
        verificationStatus: "catalogue-candidate",
        verifiedProduct: false,
        confirmedSku: false,
        supplierFeed: false,
        pricingIncluded: false
      }
    ],
    cataloguePlanning: {
      mode: "curated-candidates",
      liveSupplierFeed: false,
      verifiedSku: false,
      pricing: false,
      procurement: false,
      planningGuidanceOnly: true,
      requiresHumanSelectionCheck: true
    },
    allowanceBand: "essential",
    labels: REQUIRED_TRUST_LABELS,
    layoutPlanning: {
      roomShape: "rectangle",
      sizeBand: "standard",
      entryPosition: "south-wall",
      fixtureZones: [
        {
          fixtureType: "shower",
          label: "Shower zone",
          approximatePosition: "corner",
          status: "existing",
          serviceChange: "unclear"
        },
        {
          fixtureType: "vanity",
          label: "Vanity zone",
          approximatePosition: "entry-side",
          status: "existing",
          serviceChange: "keep"
        }
      ],
      constraints: {
        strataOrClass2: false,
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
    },
    layoutRiskPrompts: [],
    preferredNextStep: "estimate",
    ...overrides
  };
}

test("bathroom design schema accepts valid drafts and rejects invalid enum values", () => {
  assert.equal(bathroomDesignDraftSchema.safeParse(validDraft()).success, true);
  assert.equal(
    bathroomDesignDraftSchema.safeParse({ ...validDraft(), bathroomType: "powder-room" }).success,
    false
  );
});

test("saved local design draft never includes image blob or base64 fields", () => {
  const storage = memoryStorage();
  const draft = validDraft({
    startingPoint: { kind: "local-photo", photoUsed: true }
  });
  writeLocalDesignDraft(draft, storage);

  const raw = storage.dump()[DESIGN_DRAFT_STORAGE_KEY];
  assert.ok(raw);
  assert.doesNotMatch(raw, /base64|data:image|blob:|photoData|imageUrl|file/i);
  assert.equal(readLocalDesignDraft(storage)?.startingPoint.photoUsed, true);
  assert.equal(designDraftContainsForbiddenPersistence({ photoData: "base64" }), true);
});

test("feature flag hides design studio from sitemap when disabled and includes it when enabled", () => {
  const previous = process.env.NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO;
  try {
    delete process.env.NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO;
    assert.equal(sitemap().some((entry) => entry.url.endsWith("/design-studio")), false);
    process.env.NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO = "true";
    assert.equal(sitemap().some((entry) => entry.url.endsWith("/design-studio")), true);
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO;
    else process.env.NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO = previous;
  }
});

test("design studio route metadata stays noindex while feature-flagged", () => {
  const robots = designStudioMetadata.robots;
  assert.equal(typeof robots === "object" && robots !== null && "index" in robots ? robots.index : true, false);
  assert.equal(typeof robots === "object" && robots !== null && "follow" in robots ? robots.follow : true, false);
  assert.match(String(designStudioMetadata.title), /Planning Preview/i);
});

test("each style exposes exactly two approved palettes", () => {
  assert.equal(designStyles.length, 6);
  assert.equal(designPalettes.length, 12);
  for (const style of designStyles) {
    const palettes = designPalettes.filter((palette) => palette.styleId === style.id);
    assert.equal(palettes.length, 2);
    assert.deepEqual(
      palettes.map((palette) => palette.id),
      style.paletteIds
    );
  }
});

test("variant comparison never exceeds three variants", () => {
  assert.equal(bathroomDesignDraftSchema.safeParse(validDraft()).success, true);
  const tooMany = validDraft({
    variants: [
      ...validDraft().variants,
      {
        id: "fixture-led-concept",
        name: "Fixture-led concept",
        summary: "A deterministic concept.",
        paletteId: "warm-contemporary-clay",
        emphasis: "fixture-led"
      },
      {
        id: "extra-concept",
        name: "Extra concept",
        summary: "Should be rejected.",
        paletteId: "warm-contemporary-clay",
        emphasis: "balanced"
      }
    ]
  });
  assert.equal(bathroomDesignDraftSchema.safeParse(tooMany).success, false);
});

test("phase 2 layout planning contract rejects measured-plan drift and oversized zones", () => {
  assert.equal(bathroomDesignDraftSchema.safeParse(validDraft()).success, true);
  assert.equal(
    bathroomDesignDraftSchema.safeParse({
      ...validDraft(),
      layoutPlanning: {
        ...validDraft().layoutPlanning,
        labels: { ...validDraft().layoutPlanning.labels, measuredPlan: true }
      }
    }).success,
    false
  );

  const tooManyZones = Array.from({ length: MAX_LAYOUT_ZONES + 1 }, (_, index) => ({
    fixtureType: "storage" as const,
    label: `Storage zone ${index + 1}`,
    approximatePosition: "unknown" as const,
    status: "planned" as const,
    serviceChange: "unclear" as const
  }));
  assert.equal(
    bathroomDesignDraftSchema.safeParse({
      ...validDraft(),
      layoutPlanning: { ...validDraft().layoutPlanning, fixtureZones: tooManyZones }
    }).success,
    false
  );
});

test("estimate handoff serialises only allowlisted non-price fields and maps quote defaults", () => {
  const handoff = createEstimateHandoff(validDraft(), new Date("2026-06-23T00:00:00.000Z"));
  assert.deepEqual(Object.keys(handoff).sort(), [
    "allowanceBand",
    "bathroomType",
    "cataloguePlanning",
    "conceptualSelections",
    "createdAt",
    "designDraftId",
    "expiresAt",
    "finishFamilies",
    "labels",
    "layoutPlanning",
    "layoutRiskPrompts",
    "paletteId",
    "photoUsed",
    "preferredNextStep",
    "productShortlist",
    "sampleTemplateId",
    "schemaVersion",
    "selectedVariantId",
    "styleId",
    "updatedAt"
  ]);
  assert.doesNotMatch(JSON.stringify(handoff), /finalPrice|priceAmount|quoteTotal|rateCard|margin|supplierCost|labou?rRate/i);
  assert.deepEqual(mapHandoffToQuoteDefaults(handoff), {
    projectType: "full-bathroom",
    fixtureLevel: "budget"
  });
});

test("layout-risk prompt context is preserved in local draft and estimate handoff safely", () => {
  const storage = memoryStorage();
  const riskyLayout = {
    ...validDraft().layoutPlanning,
    entryPosition: "unknown" as const,
    fixtureZones: [
      {
        fixtureType: "toilet" as const,
        label: "Toilet zone",
        approximatePosition: "west-wall" as const,
        status: "existing" as const,
        serviceChange: "relocate" as const
      }
    ]
  };
  const layoutRiskPrompts = getLayoutRiskPrompts(riskyLayout);
  const draft = validDraft({ layoutPlanning: riskyLayout, layoutRiskPrompts });
  writeLocalDesignDraft(draft, storage);

  const saved = readLocalDesignDraft(storage);
  assert.equal(saved?.layoutRiskPrompts.length, layoutRiskPrompts.length);
  assert.equal(saved?.layoutRiskPrompts.some((prompt) => prompt.id === "service-relocate-toilet"), true);

  const handoff = createEstimateHandoff(draft, new Date("2026-06-23T00:00:00.000Z"));
  assert.equal(handoff.layoutRiskPrompts.some((prompt) => prompt.id === "service-relocate-toilet"), true);
  assert.doesNotMatch(JSON.stringify(handoff.layoutRiskPrompts), /score|points|rank|price|rate|margin|supplierCost|labou?rRate/i);
});

test("invalid or expired handoff data is ignored safely", () => {
  const storage = memoryStorage();
  storage.setItem("operon:bathroom-design:quote-handoff:v0.3", "{\"bad\":true}");
  assert.equal(readEstimateHandoff(storage), null);

  const expired = createEstimateHandoff(validDraft(), new Date("2020-01-01T00:00:00.000Z"));
  assert.equal(safeParseBathroomDesignHandoff(expired).success, false);
});

test("required trust labels and brief disclaimers render", () => {
  const html = renderToString(<DesignStudio />);
  assert.match(html, /Inspiration visual/);
  assert.match(html, /Measured layout: unavailable/);
  assert.match(html, /Verified product: unavailable/);
  assert.match(html, /Catalogue candidate/);
  assert.match(html, /not measured plans, specifications, quotes or construction documents/i);
  assert.match(html, /aria-current="step"/);

  const summary = getDesignSummaryText(validDraft());
  assert.match(summary, /not a quote, measured plan, specification, contract or construction document/i);
  assert.match(summary, /Catalogue candidates are not confirmed SKUs/);
  assert.match(summary, /Approximate room shape: rectangle/);
});

test("core design flow renders semantic buttons and no real supplier or rate data", () => {
  const html = renderToString(<DesignStudio />);
  assert.match(html, /<button/);
  assert.match(html, /Main bathroom/);
  assert.match(html, /Step <!-- -->1<!-- --> of <!-- -->8/);

  const publicData = JSON.stringify({ designStyles, designPalettes, conceptualProductArchetypes, catalogueCandidates });
  assert.doesNotMatch(publicData, /Reece|IKEA|Bunnings|supplierCost|labou?rRate|rateCard|margin|AUD|\$|skuCode|supplierId/i);
});

test("phase 2 room-shape and size inputs render bounded planning-only choices", () => {
  const html = renderToString(<DesignStudio />);
  assert.match(html, /Step <!-- -->1<!-- --> of <!-- -->8/);
  assert.doesNotMatch(html, /measured dimensions/i);
  assert.match(html, /not measured plans, specifications, quotes or construction documents/i);
});

test("phase 3 product catalogue candidates stay bounded and non-commercial", () => {
  assert.ok(catalogueCandidates.length >= 6);
  const publicData = JSON.stringify(catalogueCandidates);
  assert.match(publicData, /catalogue-candidate/);
  assert.doesNotMatch(publicData, /supplierCost|supplierId|skuCode|retailPrice|tradePrice|priceAmount|AUD|\$/i);

  const draft = validDraft();
  assert.equal(bathroomDesignDraftSchema.safeParse(draft).success, true);
  assert.equal(draft.productShortlist[0].verifiedProduct, false);
  assert.equal(draft.productShortlist[0].confirmedSku, false);
  assert.equal(draft.productShortlist[0].supplierFeed, false);
  assert.equal(draft.productShortlist[0].pricingIncluded, false);

  const invalid = validDraft({
    productShortlist: [
      {
        ...draft.productShortlist[0],
        category: "changed-category"
      }
    ]
  });
  assert.equal(bathroomDesignDraftSchema.safeParse(invalid).success, false);
});

test("phase 2 approximate layout preview is accessible and avoids measured CAD claims", () => {
  const html = renderToString(<ApproximateLayoutPreview layout={validDraft().layoutPlanning} />);
  assert.match(html, /Approximate planning layout/);
  assert.match(html, /role="img"/);
  assert.match(html, /Shower/);
  assert.match(html, /Vanity/);
  assert.match(html, /Not a measured plan, construction drawing, compliance check or build-ready layout/);
  assert.match(html, /Site measure, selections, licensed-trade checks and written scope confirmation/);
  assert.doesNotMatch(html, /CAD|blueprint|dimensioned|final price|compliant design/i);
});

test("phase 2 fixture-zone controls render bounded placement fields without free-text scope", () => {
  const html = renderToString(
    <FixtureZoneControls zones={validDraft().layoutPlanning.fixtureZones} onChange={() => undefined} />
  );
  assert.match(html, /Fixture-zone placement/);
  assert.match(html, /Approximate position/);
  assert.match(html, /Service change/);
  assert.match(html, /<select/);
  assert.match(html, /do not create measured plans, construction drawings or confirmed trade scope/i);
  assert.doesNotMatch(html, /<textarea|CAD|blueprint|dimensioned|supplierCost|labou?rRate|margin|final price/i);
});

test("phase 2 layout-risk prompts use safe planning-only guidance", () => {
  const prompts = getLayoutRiskPrompts({
    ...validDraft().layoutPlanning,
    roomShape: "unknown",
    sizeBand: "compact",
    entryPosition: "unknown",
    constraints: {
      ...validDraft().layoutPlanning.constraints,
      strataOrClass2: true,
      suspectedAsbestos: true
    },
    fixtureZones: [
      {
        fixtureType: "toilet",
        label: "Toilet zone",
        approximatePosition: "west-wall",
        status: "unclear",
        serviceChange: "relocate"
      },
      {
        fixtureType: "shower",
        label: "Shower zone",
        approximatePosition: "north-wall",
        status: "planned",
        serviceChange: "new"
      }
    ]
  });
  const promptText = JSON.stringify(prompts);
  assert.ok(prompts.some((prompt) => prompt.id === "layout-unknown"));
  assert.ok(prompts.some((prompt) => prompt.id === "strata-class-2"));
  assert.ok(prompts.some((prompt) => prompt.id === "suspected-asbestos"));
  assert.ok(prompts.some((prompt) => prompt.id === "service-relocate-toilet"));
  assert.match(promptText, /Clarify|Confirm|site review|licensed trade checks/i);
  assert.doesNotMatch(promptText, /illegal|certified|guaranteed|compliant design|final price|fixed price|quote approved/i);
});

test("design summary includes layout planning checks without compliance or pricing promises", () => {
  const summary = getDesignSummaryText(
    validDraft({
      layoutPlanning: {
        ...validDraft().layoutPlanning,
        entryPosition: "unknown",
        fixtureZones: [
          {
            fixtureType: "toilet",
            label: "Toilet zone",
            approximatePosition: "west-wall",
            status: "existing",
            serviceChange: "relocate"
          }
        ]
      },
      layoutRiskPrompts: [
        {
          id: "service-relocate-toilet",
          level: "site-review",
          title: "Toilet zone relocation to review",
          message: "Service relocation may affect plumbing, drainage, electrical or waterproofing scope. Confirm this through site review and licensed trade checks.",
          nextStep: "site-measure"
        }
      ]
    })
  );
  assert.match(summary, /Planning checks:/);
  assert.match(summary, /Toilet zone relocation to review/);
  assert.match(summary, /Site measure, selections, licensed-trade checks and written scope confirmation/);
  assert.doesNotMatch(summary, /certified|guaranteed|compliant design|final price|fixed price/i);
});
