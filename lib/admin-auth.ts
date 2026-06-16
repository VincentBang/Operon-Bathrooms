export function validateAdminRequest(request: Request) {
  const configured = process.env.OPERON_BATHROOMS_ADMIN_TOKEN;
  if (!configured) return { ok: false, status: 503, error: "Admin token is not configured" };

  const url = new URL(request.url);
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const supplied = bearer || url.searchParams.get("token") || "";

  if (supplied !== configured) return { ok: false, status: 401, error: "Unauthorised" };
  return { ok: true, status: 200, error: "" };
}
