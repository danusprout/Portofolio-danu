const DEFAULT_LOCAL_URL = "http://localhost:3000";

function normalizeSiteUrl(url?: string) {
  if (!url) return DEFAULT_LOCAL_URL;

  const trimmedUrl = url.trim().replace(/\/+$/, "");
  if (!trimmedUrl) return DEFAULT_LOCAL_URL;

  if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
}

export function getSiteUrl() {
  return normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.SITE_URL ??
      process.env.VERCEL_PROJECT_PRODUCTION_URL ??
      process.env.VERCEL_URL
  );
}

export function getSiteOrigin() {
  return new URL(getSiteUrl()).origin;
}
