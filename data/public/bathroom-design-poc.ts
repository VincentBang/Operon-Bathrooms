export type BathroomDesignBathroomType =
  | "main-bathroom"
  | "ensuite"
  | "small-bathroom"
  | "apartment-bathroom"
  | "laundry-bathroom-combination";

export type BathroomDesignStyleId =
  | "warm-contemporary"
  | "calm-coastal"
  | "modern-minimal"
  | "natural-spa"
  | "classic-refined"
  | "urban-apartment";

export type BathroomDesignAllowanceBand = "essential" | "considered" | "premium";

export type BathroomDesignTemplate = {
  id: "compact-rectangle" | "galley-ensuite" | "apartment-wet-zone";
  name: string;
  description: string;
  bestFor: BathroomDesignBathroomType[];
};

export type BathroomDesignPalette = {
  id: string;
  styleId: BathroomDesignStyleId;
  name: string;
  summary: string;
  colours: {
    base: string;
    surface: string;
    accent: string;
    metal: string;
  };
  finishFamilies: string[];
};

export type BathroomDesignStyle = {
  id: BathroomDesignStyleId;
  name: string;
  description: string;
  paletteIds: [string, string];
};

export type ConceptualProductArchetype = {
  id: string;
  name: string;
  category: string;
  note: string;
};

export type BathroomCatalogueCandidate = {
  id: string;
  archetypeId: string;
  category: string;
  label: string;
  finishFamily: string;
  planningUse: string;
  evidencePrompt: string;
  styleAffinity: BathroomDesignStyleId[];
  bathroomTypeFit: BathroomDesignBathroomType[];
  verificationStatus: "catalogue-candidate";
};

export const bathroomTypes: { id: BathroomDesignBathroomType; name: string; note: string }[] = [
  { id: "main-bathroom", name: "Main bathroom", note: "Family-friendly planning preferences." },
  { id: "ensuite", name: "Ensuite", note: "Compact private bathroom direction." },
  { id: "small-bathroom", name: "Small bathroom", note: "Space-conscious concept choices." },
  { id: "apartment-bathroom", name: "Apartment bathroom", note: "Strata/access-aware planning prompts." },
  {
    id: "laundry-bathroom-combination",
    name: "Laundry/bathroom combination",
    note: "Dual-use wet-area inspiration."
  }
];

export const sampleTemplates: BathroomDesignTemplate[] = [
  {
    id: "compact-rectangle",
    name: "Compact rectangle",
    description: "A simple fictional bathroom shell for fast visual direction.",
    bestFor: ["main-bathroom", "small-bathroom", "apartment-bathroom"]
  },
  {
    id: "galley-ensuite",
    name: "Galley ensuite",
    description: "A narrow fictional ensuite-style sample with a vanity and shower sequence.",
    bestFor: ["ensuite", "small-bathroom"]
  },
  {
    id: "apartment-wet-zone",
    name: "Apartment wet-zone",
    description: "A fictional apartment bathroom sample for access and strata-aware prompts.",
    bestFor: ["apartment-bathroom", "laundry-bathroom-combination"]
  }
];

export const designStyles: BathroomDesignStyle[] = [
  {
    id: "warm-contemporary",
    name: "Warm Contemporary",
    description: "Soft neutrals, brushed metals and warm timber-look accents.",
    paletteIds: ["warm-contemporary-clay", "warm-contemporary-sage"]
  },
  {
    id: "calm-coastal",
    name: "Calm Coastal",
    description: "Light surfaces, relaxed texture and muted ocean-influenced tones.",
    paletteIds: ["calm-coastal-salt", "calm-coastal-drift"]
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Quiet contrast, clean lines and low-visual-noise finishes.",
    paletteIds: ["modern-minimal-mono", "modern-minimal-stone"]
  },
  {
    id: "natural-spa",
    name: "Natural Spa",
    description: "Stone, soft green, timber-look warmth and calm surface transitions.",
    paletteIds: ["natural-spa-moss", "natural-spa-sandstone"]
  },
  {
    id: "classic-refined",
    name: "Classic Refined",
    description: "Balanced light/dark contrast, framed details and polished finishes.",
    paletteIds: ["classic-refined-marble", "classic-refined-porcelain"]
  },
  {
    id: "urban-apartment",
    name: "Urban Apartment",
    description: "Compact, durable and darker accent-ready for apartment settings.",
    paletteIds: ["urban-apartment-graphite", "urban-apartment-brick"]
  }
];

export const designPalettes: BathroomDesignPalette[] = [
  {
    id: "warm-contemporary-clay",
    styleId: "warm-contemporary",
    name: "Clay and brushed nickel",
    summary: "Warm clay tile, soft white walls and brushed nickel accents.",
    colours: { base: "#f6eee4", surface: "#d7a27d", accent: "#6f8b80", metal: "#b9b0a5" },
    finishFamilies: ["clay-look wall tile", "soft white vanity", "brushed nickel tapware"]
  },
  {
    id: "warm-contemporary-sage",
    styleId: "warm-contemporary",
    name: "Sage and warm oak",
    summary: "Sage feature tone, warm oak-look storage and quiet stone-look floor.",
    colours: { base: "#eef1e9", surface: "#a9b99e", accent: "#c59b6d", metal: "#9a8f7d" },
    finishFamilies: ["sage feature tile", "oak-look vanity", "stone-look floor tile"]
  },
  {
    id: "calm-coastal-salt",
    styleId: "calm-coastal",
    name: "Salt white and sea glass",
    summary: "Soft white, pale aqua and satin chrome for a relaxed bathroom mood.",
    colours: { base: "#f8f7f2", surface: "#cce2df", accent: "#7ea5a1", metal: "#c7c9c8" },
    finishFamilies: ["soft white wall tile", "sea-glass feature", "satin chrome tapware"]
  },
  {
    id: "calm-coastal-drift",
    styleId: "calm-coastal",
    name: "Driftwood and shell",
    summary: "Shell-toned tile, driftwood-look vanity and muted blue-grey accent.",
    colours: { base: "#f0eadf", surface: "#b8a892", accent: "#7f9aa5", metal: "#b7b0a8" },
    finishFamilies: ["shell porcelain tile", "driftwood-look vanity", "blue-grey accent"]
  },
  {
    id: "modern-minimal-mono",
    styleId: "modern-minimal",
    name: "Soft mono",
    summary: "Soft white, charcoal linework and low-sheen fixtures.",
    colours: { base: "#f5f5f1", surface: "#d7d8d2", accent: "#303a3b", metal: "#1f2728" },
    finishFamilies: ["large-format neutral tile", "charcoal accent", "matte black tapware"]
  },
  {
    id: "modern-minimal-stone",
    styleId: "modern-minimal",
    name: "Stone and linen",
    summary: "Linen walls, stone-look floors and restrained warm-grey metal.",
    colours: { base: "#ede8dc", surface: "#b8b2a6", accent: "#6f726d", metal: "#8b8174" },
    finishFamilies: ["linen wall tile", "stone-look floor tile", "warm-grey tapware"]
  },
  {
    id: "natural-spa-moss",
    styleId: "natural-spa",
    name: "Moss and river stone",
    summary: "Gentle moss accent, stone-look surfaces and timber-look warmth.",
    colours: { base: "#eceee6", surface: "#87987b", accent: "#b8b2a0", metal: "#9b8d78" },
    finishFamilies: ["moss feature tile", "river-stone floor", "timber-look vanity"]
  },
  {
    id: "natural-spa-sandstone",
    styleId: "natural-spa",
    name: "Sandstone and eucalyptus",
    summary: "Sandstone-look tile with eucalyptus muted green and soft brushed metal.",
    colours: { base: "#efe3d0", surface: "#d5bd94", accent: "#768c76", metal: "#a69b87" },
    finishFamilies: ["sandstone-look tile", "eucalyptus accent", "brushed warm metal"]
  },
  {
    id: "classic-refined-marble",
    styleId: "classic-refined",
    name: "Marble and chrome",
    summary: "Marble-look surfaces, soft grey joinery and polished chrome accents.",
    colours: { base: "#f7f6f1", surface: "#d9d9d4", accent: "#6b6e73", metal: "#c8cdd0" },
    finishFamilies: ["marble-look tile", "soft grey vanity", "polished chrome tapware"]
  },
  {
    id: "classic-refined-porcelain",
    styleId: "classic-refined",
    name: "Porcelain and warm brass",
    summary: "Classic porcelain tone with subtle warm brass and deep green accent.",
    colours: { base: "#fbf8ef", surface: "#d8c9b3", accent: "#264d46", metal: "#b08b4f" },
    finishFamilies: ["porcelain wall tile", "deep green accent", "warm brass tapware"]
  },
  {
    id: "urban-apartment-graphite",
    styleId: "urban-apartment",
    name: "Graphite and concrete",
    summary: "Graphite accents, concrete-look surfaces and compact black fixtures.",
    colours: { base: "#e5e2da", surface: "#8b8c85", accent: "#2f383b", metal: "#202626" },
    finishFamilies: ["concrete-look tile", "graphite accent", "matte black fixtures"]
  },
  {
    id: "urban-apartment-brick",
    styleId: "urban-apartment",
    name: "Brick and warm grey",
    summary: "Warm grey base with brick-toned feature and dark bronze detail.",
    colours: { base: "#e8e2d8", surface: "#a35f48", accent: "#585f5a", metal: "#665248" },
    finishFamilies: ["warm grey tile", "brick-toned feature", "dark bronze fixtures"]
  }
];

export const conceptualProductArchetypes: ConceptualProductArchetype[] = [
  {
    id: "wall-hung-vanity",
    name: "Wall-hung vanity archetype",
    category: "vanity",
    note: "Conceptual product only; not a verified SKU."
  },
  {
    id: "floor-standing-vanity",
    name: "Floor-standing vanity archetype",
    category: "vanity",
    note: "Conceptual product only; not a verified SKU."
  },
  {
    id: "back-to-wall-toilet",
    name: "Back-to-wall toilet archetype",
    category: "toilet",
    note: "Conceptual product only; not a verified SKU."
  },
  {
    id: "freestanding-bath",
    name: "Freestanding bath archetype",
    category: "bath",
    note: "Conceptual product only; not a verified SKU."
  },
  {
    id: "walk-in-shower-screen",
    name: "Walk-in shower screen archetype",
    category: "shower",
    note: "Conceptual product only; not a verified SKU."
  },
  {
    id: "mirrored-shaving-cabinet",
    name: "Mirrored shaving cabinet archetype",
    category: "storage",
    note: "Conceptual product only; not a verified SKU."
  }
];

export const catalogueCandidates: BathroomCatalogueCandidate[] = [
  {
    id: "candidate-wall-hung-vanity-warm-oak",
    archetypeId: "wall-hung-vanity",
    category: "vanity",
    label: "Wall-hung vanity candidate, warm timber-look",
    finishFamily: "warm timber-look vanity",
    planningUse: "Keeps floor area visually lighter for standard bathrooms and ensuites.",
    evidencePrompt: "Confirm wall structure, plumbing set-out and storage size during site review.",
    styleAffinity: ["warm-contemporary", "natural-spa", "calm-coastal"],
    bathroomTypeFit: ["main-bathroom", "ensuite", "small-bathroom", "apartment-bathroom"],
    verificationStatus: "catalogue-candidate"
  },
  {
    id: "candidate-floor-standing-vanity-classic",
    archetypeId: "floor-standing-vanity",
    category: "vanity",
    label: "Floor-standing vanity candidate, framed profile",
    finishFamily: "framed vanity profile",
    planningUse: "Supports a more classic or storage-heavy design direction.",
    evidencePrompt: "Confirm width, waste location, tapware set-out and drawer clearance.",
    styleAffinity: ["classic-refined", "warm-contemporary"],
    bathroomTypeFit: ["main-bathroom", "laundry-bathroom-combination"],
    verificationStatus: "catalogue-candidate"
  },
  {
    id: "candidate-back-to-wall-toilet-compact",
    archetypeId: "back-to-wall-toilet",
    category: "toilet",
    label: "Back-to-wall toilet candidate, compact profile",
    finishFamily: "compact white ceramic toilet",
    planningUse: "A common planning direction for cleaner lines and easier floor cleaning.",
    evidencePrompt: "Confirm waste set-out, water point and clearances before selection.",
    styleAffinity: ["warm-contemporary", "calm-coastal", "modern-minimal", "classic-refined", "urban-apartment"],
    bathroomTypeFit: ["main-bathroom", "ensuite", "small-bathroom", "apartment-bathroom"],
    verificationStatus: "catalogue-candidate"
  },
  {
    id: "candidate-walk-in-screen-clear",
    archetypeId: "walk-in-shower-screen",
    category: "shower",
    label: "Walk-in shower screen candidate, clear glass",
    finishFamily: "clear glass shower screen",
    planningUse: "Keeps the shower zone visually open in compact and standard layouts.",
    evidencePrompt: "Confirm falls, waterproofing extent, screen fixing and splash control on site.",
    styleAffinity: ["warm-contemporary", "calm-coastal", "modern-minimal", "natural-spa", "urban-apartment"],
    bathroomTypeFit: ["main-bathroom", "ensuite", "small-bathroom", "apartment-bathroom"],
    verificationStatus: "catalogue-candidate"
  },
  {
    id: "candidate-freestanding-bath-soft-edge",
    archetypeId: "freestanding-bath",
    category: "bath",
    label: "Freestanding bath candidate, soft-edge form",
    finishFamily: "soft-edge white bath",
    planningUse: "A premium-feel planning direction for larger bathroom layouts.",
    evidencePrompt: "Confirm room size, access path, floor structure, plumbing and cleaning clearances.",
    styleAffinity: ["natural-spa", "classic-refined", "calm-coastal"],
    bathroomTypeFit: ["main-bathroom"],
    verificationStatus: "catalogue-candidate"
  },
  {
    id: "candidate-mirrored-shaving-cabinet-recessed",
    archetypeId: "mirrored-shaving-cabinet",
    category: "storage",
    label: "Mirrored shaving cabinet candidate, recessed look",
    finishFamily: "mirrored storage cabinet",
    planningUse: "Adds storage while keeping the vanity wall visually calm.",
    evidencePrompt: "Confirm wall depth, wiring, lighting and door swing clearances.",
    styleAffinity: ["warm-contemporary", "modern-minimal", "classic-refined", "urban-apartment"],
    bathroomTypeFit: ["main-bathroom", "ensuite", "small-bathroom", "apartment-bathroom"],
    verificationStatus: "catalogue-candidate"
  },
  {
    id: "candidate-matte-black-fixture-family",
    archetypeId: "walk-in-shower-screen",
    category: "tapware",
    label: "Matte black fixture family candidate",
    finishFamily: "matte black tapware and trim",
    planningUse: "Creates a stronger contrast direction for minimal or apartment concepts.",
    evidencePrompt: "Confirm compatibility across mixer, rail, wastes, screen trim and accessories.",
    styleAffinity: ["modern-minimal", "urban-apartment"],
    bathroomTypeFit: ["main-bathroom", "ensuite", "small-bathroom", "apartment-bathroom"],
    verificationStatus: "catalogue-candidate"
  },
  {
    id: "candidate-brushed-warm-metal-family",
    archetypeId: "wall-hung-vanity",
    category: "tapware",
    label: "Brushed warm metal fixture family candidate",
    finishFamily: "brushed warm metal tapware and trim",
    planningUse: "Supports warmer contemporary, spa and classic palettes.",
    evidencePrompt: "Confirm finish compatibility across tapware, wastes, trims and accessories.",
    styleAffinity: ["warm-contemporary", "natural-spa", "classic-refined"],
    bathroomTypeFit: ["main-bathroom", "ensuite", "small-bathroom"],
    verificationStatus: "catalogue-candidate"
  }
];

export function palettesForStyle(styleId: BathroomDesignStyleId) {
  return designPalettes.filter((palette) => palette.styleId === styleId);
}

export function findPalette(paletteId: string) {
  return designPalettes.find((palette) => palette.id === paletteId);
}

export function findStyle(styleId: string) {
  return designStyles.find((style) => style.id === styleId);
}

export function findTemplate(templateId: string | undefined) {
  return sampleTemplates.find((template) => template.id === templateId);
}

export function findCatalogueCandidate(candidateId: string) {
  return catalogueCandidates.find((candidate) => candidate.id === candidateId);
}

export function candidatesForDesign(
  styleId: BathroomDesignStyleId,
  bathroomType: BathroomDesignBathroomType
) {
  return catalogueCandidates.filter(
    (candidate) =>
      candidate.styleAffinity.includes(styleId) &&
      candidate.bathroomTypeFit.includes(bathroomType)
  );
}
