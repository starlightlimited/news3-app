import type { MetadataRoute } from "next";
import { getAbsoluteUrl, getBaseUrl } from "@/lib/seo-config";

/**
 * 生成 robots.txt，供搜尋引擎爬蟲讀取。
 * 允許抓取全站，並提供 sitemap 位址。
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    ...(baseUrl && {
      host: baseUrl,
      sitemap: getAbsoluteUrl("/sitemap.xml"),
    }),
  };
}
