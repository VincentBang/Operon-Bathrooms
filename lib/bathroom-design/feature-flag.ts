export function isBathroomDesignStudioEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO === "true";
}

export function isBathroomDesignStudioDiscoverable() {
  return (
    isBathroomDesignStudioEnabled() &&
    process.env.NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY === "public"
  );
}
