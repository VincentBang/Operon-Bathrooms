export type ProductRiskLevel = "low" | "medium" | "high";

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  type: string;
  room: "bathroom" | "ensuite" | "laundry-bathroom";
  risk_level: ProductRiskLevel;
  strategic_fit_score: number;
  default_margin_range: string;
  freight_risk: ProductRiskLevel;
  warranty_risk: ProductRiskLevel;
  compliance_risk: ProductRiskLevel;
};

export type ProductCandidate = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  brand: string;
  supplier: string;
  product_type: string;
  finish: string;
  material: string;
  dimensions: string;
  width?: number;
  depth?: number;
  height?: number;
  wall_hung: boolean;
  floorstanding: boolean;
  soft_close: boolean;
  basin_type?: string;
  tap_hole_count?: number;
  price_min: number;
  price_max: number;
  estimated_margin: string;
  watermark_required: boolean;
  watermark_status: "required" | "not_required" | "confirm_before_order";
  wels_required: boolean;
  wels_rating?: string;
  electrical_compliance_required: boolean;
  compliance_notes: string[];
  installation_notes: string[];
  freight_risk: ProductRiskLevel;
  warranty_risk: ProductRiskLevel;
  active: boolean;
  recommended: boolean;
};

export type ProductPack = {
  id: string;
  name: string;
  slug: string;
  categoryRecommendations: string[];
  allowanceLow: number;
  allowanceHigh: number;
  riskNotes: string[];
  complianceNotes: string[];
  bestFor: string[];
};

export const bathroomProductCategories: ProductCategory[] = [
  {
    id: "cat_vanity",
    name: "Vanities",
    slug: "vanities",
    type: "joinery",
    room: "bathroom",
    risk_level: "medium",
    strategic_fit_score: 95,
    default_margin_range: "private",
    freight_risk: "medium",
    warranty_risk: "medium",
    compliance_risk: "low"
  },
  {
    id: "cat_basin",
    name: "Basins",
    slug: "basins",
    type: "fixture",
    room: "bathroom",
    risk_level: "low",
    strategic_fit_score: 88,
    default_margin_range: "private",
    freight_risk: "low",
    warranty_risk: "low",
    compliance_risk: "low"
  },
  {
    id: "cat_basin_mixer",
    name: "Basin mixers",
    slug: "basin-mixers",
    type: "tapware",
    room: "bathroom",
    risk_level: "medium",
    strategic_fit_score: 92,
    default_margin_range: "private",
    freight_risk: "low",
    warranty_risk: "medium",
    compliance_risk: "medium"
  },
  {
    id: "cat_shower_mixer",
    name: "Shower mixers",
    slug: "shower-mixers",
    type: "tapware",
    room: "bathroom",
    risk_level: "medium",
    strategic_fit_score: 86,
    default_margin_range: "private",
    freight_risk: "low",
    warranty_risk: "medium",
    compliance_risk: "medium"
  },
  {
    id: "cat_shower_rail",
    name: "Shower rails",
    slug: "shower-rails",
    type: "tapware",
    room: "bathroom",
    risk_level: "medium",
    strategic_fit_score: 84,
    default_margin_range: "private",
    freight_risk: "low",
    warranty_risk: "medium",
    compliance_risk: "medium"
  },
  {
    id: "cat_shower_head",
    name: "Shower heads",
    slug: "shower-heads",
    type: "tapware",
    room: "bathroom",
    risk_level: "medium",
    strategic_fit_score: 80,
    default_margin_range: "private",
    freight_risk: "low",
    warranty_risk: "medium",
    compliance_risk: "medium"
  },
  {
    id: "cat_mirror",
    name: "Mirrors",
    slug: "mirrors",
    type: "mirror",
    room: "bathroom",
    risk_level: "low",
    strategic_fit_score: 82,
    default_margin_range: "private",
    freight_risk: "medium",
    warranty_risk: "low",
    compliance_risk: "low"
  },
  {
    id: "cat_led_mirror",
    name: "LED mirrors",
    slug: "led-mirrors",
    type: "electrical-mirror",
    room: "bathroom",
    risk_level: "high",
    strategic_fit_score: 65,
    default_margin_range: "private",
    freight_risk: "medium",
    warranty_risk: "high",
    compliance_risk: "high"
  },
  {
    id: "cat_shaving_cabinet",
    name: "Shaving cabinets",
    slug: "shaving-cabinets",
    type: "storage",
    room: "bathroom",
    risk_level: "medium",
    strategic_fit_score: 90,
    default_margin_range: "private",
    freight_risk: "medium",
    warranty_risk: "medium",
    compliance_risk: "low"
  },
  {
    id: "cat_accessories",
    name: "Bathroom accessory packs",
    slug: "bathroom-accessory-packs",
    type: "accessory",
    room: "bathroom",
    risk_level: "low",
    strategic_fit_score: 78,
    default_margin_range: "private",
    freight_risk: "low",
    warranty_risk: "low",
    compliance_risk: "low"
  },
  {
    id: "cat_linear_drain",
    name: "Linear drains",
    slug: "linear-drains",
    type: "drainage",
    room: "bathroom",
    risk_level: "high",
    strategic_fit_score: 64,
    default_margin_range: "private",
    freight_risk: "medium",
    warranty_risk: "medium",
    compliance_risk: "high"
  },
  {
    id: "cat_waste",
    name: "Wastes",
    slug: "wastes",
    type: "drainage",
    room: "bathroom",
    risk_level: "medium",
    strategic_fit_score: 70,
    default_margin_range: "private",
    freight_risk: "low",
    warranty_risk: "low",
    compliance_risk: "medium"
  },
  {
    id: "cat_niche",
    name: "Niches",
    slug: "niches",
    type: "wet-area-detail",
    room: "bathroom",
    risk_level: "high",
    strategic_fit_score: 62,
    default_margin_range: "private",
    freight_risk: "low",
    warranty_risk: "medium",
    compliance_risk: "high"
  }
];

export const bathroomProductCandidates: ProductCandidate[] = [
  {
    id: "vanity_compact_wall_hung",
    name: "Compact wall-hung vanity category",
    slug: "compact-wall-hung-vanity",
    category_id: "cat_vanity",
    brand: "Curated supplier range",
    supplier: "private",
    product_type: "wall-hung vanity",
    finish: "white or timber-look",
    material: "moisture-resistant cabinet with ceramic or stone-look top",
    dimensions: "600-750mm width typical",
    width: 600,
    depth: 460,
    height: 550,
    wall_hung: true,
    floorstanding: false,
    soft_close: true,
    basin_type: "inset or above-counter",
    tap_hole_count: 1,
    price_min: 850,
    price_max: 1800,
    estimated_margin: "private",
    watermark_required: false,
    watermark_status: "not_required",
    wels_required: false,
    electrical_compliance_required: false,
    compliance_notes: ["Confirm wall support and fixing method before ordering."],
    installation_notes: ["Wall-hung vanities require suitable wall framing and trade confirmation."],
    freight_risk: "medium",
    warranty_risk: "medium",
    active: true,
    recommended: true
  },
  {
    id: "vanity_drawer_standard",
    name: "Drawer vanity category",
    slug: "drawer-vanity",
    category_id: "cat_vanity",
    brand: "Curated supplier range",
    supplier: "private",
    product_type: "floorstanding or wall-hung drawer vanity",
    finish: "white, timber-look, matte neutral",
    material: "moisture-resistant cabinet",
    dimensions: "750-1200mm width typical",
    width: 900,
    depth: 460,
    height: 850,
    wall_hung: false,
    floorstanding: true,
    soft_close: true,
    basin_type: "integrated or above-counter",
    tap_hole_count: 1,
    price_min: 1200,
    price_max: 2600,
    estimated_margin: "private",
    watermark_required: false,
    watermark_status: "not_required",
    wels_required: false,
    electrical_compliance_required: false,
    compliance_notes: ["Confirm final dimensions against site measure before order."],
    installation_notes: ["Drawer clearances should be checked against waste and plumbing positions."],
    freight_risk: "medium",
    warranty_risk: "medium",
    active: true,
    recommended: true
  },
  {
    id: "vanity_premium_fluted",
    name: "Premium fluted or stone-look vanity category",
    slug: "premium-fluted-stone-look-vanity",
    category_id: "cat_vanity",
    brand: "Curated supplier range",
    supplier: "private",
    product_type: "premium vanity",
    finish: "fluted timber-look, stone-look, satin neutral",
    material: "premium cabinet and top",
    dimensions: "900-1500mm width typical",
    width: 1200,
    depth: 460,
    height: 850,
    wall_hung: false,
    floorstanding: true,
    soft_close: true,
    basin_type: "above-counter or integrated",
    tap_hole_count: 0,
    price_min: 2200,
    price_max: 5200,
    estimated_margin: "private",
    watermark_required: false,
    watermark_status: "not_required",
    wels_required: false,
    electrical_compliance_required: false,
    compliance_notes: ["Confirm lead time, warranty terms and site access before selection."],
    installation_notes: ["Premium/heavy vanities may need access and lifting review."],
    freight_risk: "high",
    warranty_risk: "medium",
    active: true,
    recommended: true
  },
  {
    id: "basin_ceramic_standard",
    name: "Standard ceramic basin category",
    slug: "standard-ceramic-basin",
    category_id: "cat_basin",
    brand: "Curated supplier range",
    supplier: "private",
    product_type: "ceramic basin",
    finish: "gloss white",
    material: "ceramic",
    dimensions: "compact to standard",
    width: 420,
    depth: 420,
    height: 140,
    wall_hung: false,
    floorstanding: false,
    soft_close: false,
    basin_type: "above-counter or inset",
    tap_hole_count: 0,
    price_min: 180,
    price_max: 650,
    estimated_margin: "private",
    watermark_required: false,
    watermark_status: "not_required",
    wels_required: false,
    electrical_compliance_required: false,
    compliance_notes: ["Confirm waste compatibility with vanity and tapware selection."],
    installation_notes: ["Basin shape affects bench space and tap reach."],
    freight_risk: "low",
    warranty_risk: "low",
    active: true,
    recommended: true
  },
  {
    id: "basin_stone_look",
    name: "Premium stone-look basin category",
    slug: "premium-stone-look-basin",
    category_id: "cat_basin",
    brand: "Curated supplier range",
    supplier: "private",
    product_type: "above-counter basin",
    finish: "stone-look or matte ceramic",
    material: "ceramic or composite",
    dimensions: "standard",
    width: 450,
    depth: 450,
    height: 140,
    wall_hung: false,
    floorstanding: false,
    soft_close: false,
    basin_type: "above-counter",
    tap_hole_count: 0,
    price_min: 450,
    price_max: 1200,
    estimated_margin: "private",
    watermark_required: false,
    watermark_status: "not_required",
    wels_required: false,
    electrical_compliance_required: false,
    compliance_notes: ["Confirm cleaning, warranty and waste compatibility before selection."],
    installation_notes: ["Above-counter basin height affects vanity usability."],
    freight_risk: "medium",
    warranty_risk: "medium",
    active: true,
    recommended: true
  },
  {
    id: "tapware_chrome_standard",
    name: "Chrome WaterMark/WELS tapware category",
    slug: "chrome-watermark-wels-tapware",
    category_id: "cat_basin_mixer",
    brand: "Curated supplier range",
    supplier: "private",
    product_type: "basin mixer",
    finish: "chrome",
    material: "brass body",
    dimensions: "standard basin mixer",
    wall_hung: false,
    floorstanding: false,
    soft_close: false,
    price_min: 180,
    price_max: 650,
    estimated_margin: "private",
    watermark_required: true,
    watermark_status: "confirm_before_order",
    wels_required: true,
    wels_rating: "Confirm rating before order",
    electrical_compliance_required: false,
    compliance_notes: ["Confirm WaterMark and WELS status before ordering tapware."],
    installation_notes: ["Confirm tap reach and basin compatibility."],
    freight_risk: "low",
    warranty_risk: "medium",
    active: true,
    recommended: true
  },
  {
    id: "tapware_finish_upgrade",
    name: "Matte black or brushed gold tapware category",
    slug: "matte-black-brushed-gold-tapware",
    category_id: "cat_basin_mixer",
    brand: "Curated supplier range",
    supplier: "private",
    product_type: "finish-upgrade tapware",
    finish: "matte black or brushed gold",
    material: "brass body with specialty finish",
    dimensions: "standard basin mixer",
    wall_hung: false,
    floorstanding: false,
    soft_close: false,
    price_min: 350,
    price_max: 1300,
    estimated_margin: "private",
    watermark_required: true,
    watermark_status: "confirm_before_order",
    wels_required: true,
    wels_rating: "Confirm rating before order",
    electrical_compliance_required: false,
    compliance_notes: ["Confirm WaterMark and WELS status before ordering tapware."],
    installation_notes: ["Specialty finishes need care instructions and warranty confirmation."],
    freight_risk: "low",
    warranty_risk: "medium",
    active: true,
    recommended: true
  },
  {
    id: "mirror_standard",
    name: "Standard bathroom mirror category",
    slug: "standard-bathroom-mirror",
    category_id: "cat_mirror",
    brand: "Curated supplier range",
    supplier: "private",
    product_type: "mirror",
    finish: "polished edge or framed",
    material: "mirror glass",
    dimensions: "600-1200mm width typical",
    width: 900,
    depth: 35,
    height: 900,
    wall_hung: true,
    floorstanding: false,
    soft_close: false,
    price_min: 180,
    price_max: 850,
    estimated_margin: "private",
    watermark_required: false,
    watermark_status: "not_required",
    wels_required: false,
    electrical_compliance_required: false,
    compliance_notes: ["Confirm size, fixing method and clearances before order."],
    installation_notes: ["Check tile setout and wall fixing before installation."],
    freight_risk: "medium",
    warranty_risk: "low",
    active: true,
    recommended: true
  },
  {
    id: "mirror_led",
    name: "LED mirror category",
    slug: "led-mirror",
    category_id: "cat_led_mirror",
    brand: "Curated supplier range",
    supplier: "private",
    product_type: "LED mirror",
    finish: "backlit or front-lit",
    material: "mirror glass with electrical component",
    dimensions: "600-1200mm width typical",
    width: 900,
    depth: 45,
    height: 900,
    wall_hung: true,
    floorstanding: false,
    soft_close: false,
    price_min: 550,
    price_max: 1800,
    estimated_margin: "private",
    watermark_required: false,
    watermark_status: "not_required",
    wels_required: false,
    electrical_compliance_required: true,
    compliance_notes: ["Electrical compliance and installation location must be confirmed by a licensed electrician."],
    installation_notes: ["Confirm power location, IP suitability, warranty and access before order."],
    freight_risk: "medium",
    warranty_risk: "high",
    active: true,
    recommended: true
  },
  {
    id: "shaving_cabinet_recessed",
    name: "Shaving cabinet category",
    slug: "shaving-cabinet",
    category_id: "cat_shaving_cabinet",
    brand: "Curated supplier range",
    supplier: "private",
    product_type: "shaving cabinet",
    finish: "mirror front",
    material: "cabinet with mirror doors",
    dimensions: "600-1200mm width typical",
    width: 900,
    depth: 150,
    height: 800,
    wall_hung: true,
    floorstanding: false,
    soft_close: true,
    price_min: 650,
    price_max: 2200,
    estimated_margin: "private",
    watermark_required: false,
    watermark_status: "not_required",
    wels_required: false,
    electrical_compliance_required: false,
    compliance_notes: ["Confirm wall depth, fixing and services before recessing a shaving cabinet."],
    installation_notes: ["Recessed installation can affect framing and services."],
    freight_risk: "medium",
    warranty_risk: "medium",
    active: true,
    recommended: true
  },
  {
    id: "accessory_pack_standard",
    name: "Standard accessory pack category",
    slug: "standard-accessory-pack",
    category_id: "cat_accessories",
    brand: "Curated supplier range",
    supplier: "private",
    product_type: "towel rail, robe hook, toilet roll holder",
    finish: "chrome, matte black, brushed gold or brushed nickel",
    material: "metal accessories",
    dimensions: "mixed",
    wall_hung: true,
    floorstanding: false,
    soft_close: false,
    price_min: 220,
    price_max: 950,
    estimated_margin: "private",
    watermark_required: false,
    watermark_status: "not_required",
    wels_required: false,
    electrical_compliance_required: false,
    compliance_notes: ["Confirm accessory locations before waterproofing and tiling setout."],
    installation_notes: ["Accessory fixing should avoid waterproofing damage and hidden services."],
    freight_risk: "low",
    warranty_risk: "low",
    active: true,
    recommended: true
  }
];

export const bathroomProductPacks: ProductPack[] = [
  {
    id: "pack_standard_ensuite",
    name: "Standard Ensuite Vanity + Basin + Mixer Pack",
    slug: "standard-ensuite-vanity-basin-mixer-pack",
    categoryRecommendations: ["Compact vanity", "Ceramic basin", "Chrome basin mixer"],
    allowanceLow: 1500,
    allowanceHigh: 3300,
    riskNotes: ["Confirm vanity width, wall support and plumbing positions before order."],
    complianceNotes: ["Confirm WaterMark and WELS status for tapware."],
    bestFor: ["ensuite", "small bathroom", "limited budget"]
  },
  {
    id: "pack_premium_bathroom",
    name: "Premium Bathroom Vanity + Basin + Mixer Pack",
    slug: "premium-bathroom-vanity-basin-mixer-pack",
    categoryRecommendations: ["Premium vanity", "Stone-look basin", "Finish-upgrade tapware"],
    allowanceLow: 3600,
    allowanceHigh: 8000,
    riskNotes: ["Premium finishes can increase lead time, freight risk and warranty review needs."],
    complianceNotes: ["Confirm WaterMark/WELS for tapware and installation requirements before order."],
    bestFor: ["premium", "main bathroom", "design-led renovation"]
  },
  {
    id: "pack_apartment_compact",
    name: "Apartment Bathroom Compact Pack",
    slug: "apartment-bathroom-compact-pack",
    categoryRecommendations: ["Compact vanity", "Ceramic basin", "Standard mirror", "Accessory pack"],
    allowanceLow: 1900,
    allowanceHigh: 4300,
    riskNotes: ["Apartment projects need access, strata and service-location checks."],
    complianceNotes: ["Online selection does not confirm strata, Class 2 or waterproofing requirements."],
    bestFor: ["apartment", "strata", "compact bathroom"]
  },
  {
    id: "pack_brushed_gold_accessory",
    name: "Brushed Gold Bathroom Accessory Pack",
    slug: "brushed-gold-bathroom-accessory-pack",
    categoryRecommendations: ["Brushed gold towel rail", "Brushed gold robe hooks", "Brushed gold toilet roll holder"],
    allowanceLow: 420,
    allowanceHigh: 1200,
    riskNotes: ["Specialty finishes should be checked for cleaning and warranty requirements."],
    complianceNotes: ["Confirm fixing locations before tiling and waterproofing details are closed."],
    bestFor: ["brushed gold", "premium finish"]
  },
  {
    id: "pack_matte_black_tapware",
    name: "Matte Black Bathroom Tapware Pack",
    slug: "matte-black-bathroom-tapware-pack",
    categoryRecommendations: ["Matte black basin mixer", "Matte black shower mixer", "Matte black shower rail"],
    allowanceLow: 950,
    allowanceHigh: 3200,
    riskNotes: ["Specialty tapware finishes may need extra care and warranty review."],
    complianceNotes: ["Confirm WaterMark and WELS status before ordering tapware."],
    bestFor: ["matte black", "modern style"]
  },
  {
    id: "pack_builder_pc",
    name: "Builder-Grade Bathroom PC Item Pack",
    slug: "builder-grade-bathroom-pc-item-pack",
    categoryRecommendations: ["Standard vanity", "Ceramic basin", "Chrome tapware", "Standard mirror", "Accessory pack"],
    allowanceLow: 2500,
    allowanceHigh: 5600,
    riskNotes: ["Useful for checking whether PC items in a quote are realistic enough for the intended finish."],
    complianceNotes: ["WaterMark/WELS and site checks still need written confirmation."],
    bestFor: ["builder quote review", "PC allowance check"]
  },
  {
    id: "pack_premium_upgrade",
    name: "Premium Finish Bathroom Upgrade Pack",
    slug: "premium-finish-bathroom-upgrade-pack",
    categoryRecommendations: ["Premium vanity", "Stone-look basin", "LED mirror or shaving cabinet", "Specialty tapware"],
    allowanceLow: 5200,
    allowanceHigh: 12000,
    riskNotes: ["Premium finish packs need lead-time, warranty, access and electrical review where relevant."],
    complianceNotes: ["Electrical, WaterMark and WELS checks must be confirmed before ordering."],
    bestFor: ["premium", "feature bathroom", "designer finish"]
  }
];
