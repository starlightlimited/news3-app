import type { MetadataRoute } from "next";
import { getAbsoluteUrl, getBaseUrl } from "@/lib/seo-config";
import { routing } from "@/i18n/routing";
import { fetchCategories, fetchArticles } from "@/lib/api";

/**
 * 動態生成 sitemap.xml，供搜尋引擎抓取。
 * 包含各語系首頁、分類頁、文章詳情頁。
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    return [];
  }

  const now = new Date();
  const defaultLocale = routing.defaultLocale;

  const [categories, firstPage] = await Promise.all([
    fetchCategories(defaultLocale),
    fetchArticles({ locale: defaultLocale, page: 1, limit: 1 }),
  ]);

  const totalArticles = firstPage.total;
  const limit = 50;
  const totalPages = Math.ceil(totalArticles / limit);

  const articleChunks = await Promise.all(
    Array.from({ length: totalPages }, (_, i) =>
      fetchArticles({ locale: defaultLocale, page: i + 1, limit })
    )
  );
  const articles = articleChunks.flatMap((res) => res.articles);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({
      url: getAbsoluteUrl(`/${locale}`),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    });

    for (const cat of categories) {
      entries.push({
        url: getAbsoluteUrl(`/${locale}/category/${cat.slug}`),
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.8,
      });
    }

    for (const art of articles) {
      entries.push({
        url: getAbsoluteUrl(`/${locale}/article/${art.slug}`),
        lastModified: art.published_at ? new Date(art.published_at) : now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
