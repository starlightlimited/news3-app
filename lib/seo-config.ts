const defaultSiteName =
  process.env.NEXT_PUBLIC_SITE_NAME ?? "億民新聞";
const defaultSiteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
  "億民新聞 - 億萬民聲，權威即時新聞門戶";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

export const defaultRootSeo = {
  meta_title: defaultSiteName,
  meta_description: defaultSiteDescription,
  og_site_name: defaultSiteName,
  og_title: defaultSiteName,
  og_description: defaultSiteDescription,
  theme_color: "#ffffff",
  robots_index: true,
  robots_follow: true,
};

export function getBaseUrl(): string {
  return baseUrl.replace(/\/$/, "");
}

export function buildLocaleUrl(locale: string, pathAfterLocale = ""): string {
  const base = getBaseUrl();
  if (!base) return "";
  const path = pathAfterLocale ? `/${pathAfterLocale}` : "";
  return `${base}/${locale}${path}`;
}

export function getAbsoluteUrl(path: string): string {
  const base = getBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : "";
}

export const orgName =
  process.env.NEXT_PUBLIC_ORG_NAME ?? defaultSiteName;
export const orgUrl =
  (process.env.NEXT_PUBLIC_ORG_URL ?? baseUrl) || undefined;
