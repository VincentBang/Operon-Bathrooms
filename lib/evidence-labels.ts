export const evidenceLabels: Record<string, string> = {
  photos: "Bathroom photos",
  roughDimensions: "Rough dimensions",
  bathroomType: "Bathroom type",
  propertyType: "Property type",
  budget: "Budget or quote amount",
  timeline: "Timeline",
  layoutDetails: "Layout change details",
  strataStatus: "Strata status",
  accessNotes: "Access notes",
  knownIssues: "Known leaks, mould or asbestos",
  preferredFinishes: "Preferred finishes",
  quotePdf: "Quote PDF or image",
  inclusionsExclusions: "Inclusions and exclusions",
  pcSums: "PC sums",
  provisionalSums: "Provisional sums",
  builderDetails: "Builder/company details",
  builderLicence: "Builder licence number",
  quoteDate: "Quote date",
  gstStatus: "GST status",
  depositRequested: "Deposit requested",
  photosPlans: "Photos or plans",
  projectStage: "Project stage",
  preferredNextStep: "Preferred next step",
  messageScope: "Message or scope details",
  addressOrSuburb: "Address or suburb",
  phone: "Phone number",
  preferredWindow: "Preferred time window",
  parkingLiftStairs: "Parking, lift or stairs notes"
};

export function getEvidenceLabel(key: string) {
  return evidenceLabels[key] || key.replaceAll(/([A-Z])/g, " $1").toLowerCase();
}
