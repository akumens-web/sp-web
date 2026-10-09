function resolveSiteOrigin(value: string | undefined): string {
  const configured = value?.trim() || "http://localhost:3000";
  const candidate = configured.includes("://")
    ? configured
    : `https://${configured}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be a domain or HTTP(S) origin, for example https://patrol.example.",
    );
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must contain only an HTTP(S) origin, without credentials, paths, query parameters or fragments.",
    );
  }
  return url.origin;
}
export const site = {
  name: "SHAWARMA PATROL",
  url: resolveSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL),
};
