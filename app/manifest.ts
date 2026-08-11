import type { MetadataRoute } from "next";
import { defaultRootSeo } from "@/lib/seo-config";
import { routing } from "@/i18n/routing";
import { fetchSiteSeo } from "@/lib/api";

/**
 * 生成 PWA manifest，供瀏覽器與搜尋引擎使用。
 * 站點名稱固定用前台 defaultRootSeo；其餘欄位優先後台 SEO。
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const defaultLocale = routing.defaultLocale;
  const seo = await fetchSiteSeo(defaultLocale);

  const name = defaultRootSeo.meta_title;
  const description = defaultRootSeo.meta_description;
  const themeColor = seo?.theme_color || defaultRootSeo.theme_color;
  const startUrl = `/${defaultLocale}`;

  const icons: MetadataRoute.Manifest["icons"] = [];
  if (seo?.favicon_url) {
    icons.push({ src: seo.favicon_url, sizes: "any", type: "image/x-icon" });
  }
  if (seo?.apple_touch_icon_url) {
    icons.push({
      src: seo.apple_touch_icon_url,
      sizes: "180x180",
      type: "image/png",
      purpose: "any",
    });
  }
  if (icons.length === 0) {
    icons.push({ src: "/icon", sizes: "512x512", type: "image/png" });
    icons.push({ src: "/apple-icon", sizes: "180x180", type: "image/png" });
  }

  return {
    name,
    short_name: name,
    description,
    start_url: startUrl,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: themeColor,
    lang: defaultLocale === "zh-hk" ? "zh-Hant" : defaultLocale,
    icons,
  };
}
