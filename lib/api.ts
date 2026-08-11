// 统一的后台 API 请求工具

const ADMIN_URL = (process.env.ADMIN_API_URL ?? "").replace(/\/$/, "");
const SITE_DOMAIN = process.env.SITE_DOMAIN;

function adminFetch(
  path: string,
  params: Record<string, string>,
  revalidate = 30
) {
  if (!ADMIN_URL || !SITE_DOMAIN) {
    console.warn("[API] adminFetch 跳過：缺少 ADMIN_API_URL 或 SITE_DOMAIN", {
      hasAdmin: !!ADMIN_URL,
      hasDomain: !!SITE_DOMAIN,
    });
    return Promise.resolve(null);
  }
  const qs = new URLSearchParams({ domain: SITE_DOMAIN, ...params }).toString();
  const url = `${ADMIN_URL}${path}?${qs}`;
  return fetch(url, { next: { revalidate } })
    .then(async (r) => {
      if (!r.ok) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[API] 後台回應非 200", { url, status: r.status });
        }
        return null;
      }
      const contentType = r.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[API] 後台回傳非 JSON，請確認 ADMIN_API_URL 指向後台位址。",
            ADMIN_URL
          );
        }
        return null;
      }
      try {
        return await r.json();
      } catch {
        if (process.env.NODE_ENV === "development") {
          console.warn("[API] 後台回傳無法解析為 JSON", url);
        }
        return null;
      }
    })
    .catch((err) => {
      if (process.env.NODE_ENV === "development") {
        console.warn("[API] 後台請求失敗", url, err);
      }
      return null;
    });
}

export type Category = {
  id: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
  name: string;
  description: string;
  meta_title: string;
  meta_description: string;
  locale_data: Record<string, { name?: string; description?: string }>;
};

export async function fetchCategories(locale: string): Promise<Category[]> {
  const json = await adminFetch("/api/categories", { locale }, 60);
  return Array.isArray(json?.categories) ? json.categories : [];
}

export async function fetchCategoryBySlug(
  slug: string,
  locale: string
): Promise<Category | null> {
  const categories = await fetchCategories(locale);
  return categories.find((c) => c.slug === slug) ?? null;
}

export type ArticleCover = {
  url: string;
  width: number | null;
  height: number | null;
  alt: string;
};

export type Article = {
  slug: string;
  is_breaking: boolean;
  is_pinned: boolean;
  published_at: string | null;
  title: string;
  subtitle: string;
  excerpt: string;
  cover: ArticleCover | null;
  category: { slug: string; name: string } | null;
};

export type ArticlesResponse = {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};

export async function fetchArticles(params: {
  locale: string;
  category_slug?: string;
  page?: number;
  limit?: number;
}): Promise<ArticlesResponse> {
  const { locale, category_slug, page = 1, limit = 20 } = params;
  const extra: Record<string, string> = {
    locale,
    page: String(page),
    limit: String(limit),
  };
  if (category_slug) extra.category_slug = category_slug;

  const json = await adminFetch("/api/articles", extra, 30);
  const articles = Array.isArray(json?.articles) ? json.articles : [];
  const total = Number(json?.total) || 0;
  const safePage = Number(json?.page) || page;
  const safeLimit = Number(json?.limit) || limit;
  const total_pages =
    Number(json?.total_pages) ||
    (safeLimit > 0 ? Math.ceil(total / safeLimit) : 0);

  return {
    articles,
    total,
    page: safePage,
    limit: safeLimit,
    total_pages,
  };
}

export type ArticleDetail = Article & {
  body: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  canonical_url: string;
  hreflang_url: string;
  robots_index: boolean;
  robots_follow: boolean;
  alternate_urls?: Record<string, string>;
};

export async function fetchArticleBySlug(
  slug: string,
  locale: string
): Promise<ArticleDetail | null> {
  const path = `/api/articles/${encodeURIComponent(slug)}`;
  const json = await adminFetch(path, { locale }, 30);
  if (!json || typeof json !== "object" || !json.slug) return null;
  return {
    ...json,
    body: typeof json.body === "string" ? json.body : "",
    title: typeof json.title === "string" ? json.title : "",
  } as ArticleDetail;
}

export type HomeCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
};

export type CategorySection = {
  category: HomeCategory;
  articles: Article[];
};

export type HomepageData = {
  hero: Article[];
  sections: CategorySection[];
};

export async function fetchHomepage(locale: string): Promise<HomepageData> {
  const json = await adminFetch("/api/homepage", { locale }, 30);
  const hero = Array.isArray(json?.hero) ? json.hero : [];
  const rawSections = Array.isArray(json?.sections) ? json.sections : [];
  const sections: CategorySection[] = rawSections
    .filter(
      (s: CategorySection) => s?.category && typeof s.category === "object"
    )
    .map((s: CategorySection) => ({
      category: s.category,
      articles: Array.isArray(s.articles) ? s.articles : [],
    }));
  return { hero, sections };
}

export type SiteSeoData = {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_site_name: string;
  og_title: string;
  og_description: string;
  canonical_url: string;
  favicon_url: string;
  apple_touch_icon_url: string;
  theme_color: string;
  mask_icon_url: string;
  mask_icon_color: string;
  og_image_url: string;
  og_image_width: number;
  og_image_height: number;
  og_type: string;
  twitter_site: string;
  twitter_creator: string;
  twitter_card_type: string;
  google_verification: string;
  bing_verification: string;
  robots_index: boolean;
  robots_follow: boolean;
  locales: string[];
  alternate_urls?: Record<string, string>;
};

export async function fetchSiteSeo(
  locale: string
): Promise<SiteSeoData | null> {
  const json = await adminFetch("/api/site-seo", { locale }, 60);
  return json ?? null;
}
