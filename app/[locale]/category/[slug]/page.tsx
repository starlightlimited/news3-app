import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  fetchCategoryBySlug,
  fetchArticles,
  type Article,
} from "@/lib/api";
import { getBaseUrl, buildLocaleUrl } from "@/lib/seo-config";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const category = await fetchCategoryBySlug(slug, locale);

  if (!category) return {};

  const title = category.meta_title || category.name;
  const description = category.meta_description || category.description;
  const pathSegment = `category/${slug}`;
  const canonical = getBaseUrl()
    ? buildLocaleUrl(locale, pathSegment)
    : undefined;
  const languages = getBaseUrl()
    ? Object.fromEntries(
        routing.locales.map((loc) => [loc, buildLocaleUrl(loc, pathSegment)])
      )
    : undefined;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: locale === "zh-hk" ? "zh_HK" : locale,
      title,
      description,
    },
    alternates: {
      ...(canonical && { canonical }),
      ...(languages && Object.keys(languages).length > 0 && { languages }),
    },
    robots: { index: true, follow: true },
  };
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Taipei",
  });
}

// ── 焦點頭條卡片（网格首位突出展示） ──────────────────────────────────────────

function FeaturedArticleCard({
  article,
  categoryName,
  breaking,
  pinned,
  noTitle,
}: {
  article: Article;
  categoryName: string;
  breaking: string;
  pinned: string;
  noTitle: string;
}) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group relative mb-8 block overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
    >
      <div className="grid gap-0 md:grid-cols-12">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100 md:col-span-7 md:aspect-auto md:h-full dark:bg-stone-800">
          {article.cover?.url ? (
            <Image
              src={article.cover.url}
              alt={article.cover.alt || article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 600px"
              priority
            />
          ) : (
            <div className="flex h-full w-full min-h-[220px] items-center justify-center text-xs text-stone-400">
              無封面
            </div>
          )}
          <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              {categoryName}
            </span>
            {article.is_breaking && (
              <span className="rounded bg-red-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm animate-pulse">
                {breaking}
              </span>
            )}
            {article.is_pinned && (
              <span className="rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                {pinned}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between p-5 sm:p-6 md:col-span-5">
          <div>
            <div className="mb-2 text-xs font-medium text-stone-500 dark:text-stone-400">
              {formatDate(article.published_at)}
            </div>
            <h2 className="font-serif text-xl font-bold leading-snug text-stone-900 transition-colors group-hover:text-red-600 sm:text-2xl dark:text-stone-50 dark:group-hover:text-red-400">
              {article.title || noTitle}
            </h2>
            {article.excerpt && (
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                {article.excerpt}
              </p>
            )}
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-red-600 dark:text-red-400">
            閱讀全文 <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── 經典橫向圖文卡片 ──────────────────────────────────────────────────────────

function StandardArticleCard({
  article,
  categoryName,
  breaking,
  pinned,
  noTitle,
  noCover,
}: {
  article: Article;
  categoryName: string;
  breaking: string;
  pinned: string;
  noTitle: string;
  noCover: string;
}) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex flex-col gap-4 rounded-xl border border-stone-200/80 bg-white p-4 transition-all duration-300 hover:border-red-500/50 hover:shadow-md sm:flex-row sm:items-center dark:border-stone-800 dark:bg-stone-900 dark:hover:border-red-500/50"
    >
      {article.cover?.url ? (
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100 sm:h-28 sm:w-44 dark:border-stone-800 dark:bg-stone-800">
          <Image
            src={article.cover.url}
            alt={article.cover.alt || article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 176px"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] w-full shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-stone-100 text-xs text-stone-400 sm:h-28 sm:w-44 dark:border-stone-800 dark:bg-stone-800">
          {noCover}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-stone-100 px-2 py-0.5 text-[11px] font-bold text-red-600 border border-stone-200 dark:bg-stone-800 dark:text-red-400 dark:border-stone-700">
            {categoryName}
          </span>
          {article.is_breaking && (
            <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {breaking}
            </span>
          )}
          {article.is_pinned && (
            <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
              {pinned}
            </span>
          )}
          <time
            dateTime={article.published_at ?? ""}
            className="text-xs text-stone-400 dark:text-stone-500"
          >
            {formatDate(article.published_at)}
          </time>
        </div>

        <h2 className="mt-2 line-clamp-2 font-serif text-base font-bold text-stone-900 transition-colors group-hover:text-red-600 sm:text-lg dark:text-stone-100 dark:group-hover:text-red-400">
          {article.title || noTitle}
        </h2>

        {article.excerpt && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
            {article.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}

// ── Tailnews 頁碼組件 ──────────────────────────────────────────────────────────

function Pagination({
  slug,
  page,
  totalPages,
  prevPage,
  nextPage,
}: {
  slug: string;
  page: number;
  totalPages: number;
  prevPage: string;
  nextPage: string;
}) {
  if (totalPages <= 1) return null;

  // 生成智能頁碼數組 (如 [1, 2, 3, '...', 10])
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 3) {
        end = 4;
      } else if (page >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-1.5 sm:gap-2"
      aria-label="分頁導航"
    >
      {/* 上一頁按鈕 */}
      {page > 1 ? (
        <Link
          href={`/category/${slug}?page=${page - 1}`}
          className="flex h-9 items-center justify-center rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 transition-all hover:border-red-600 hover:text-red-600 dark:border-stone-700 dark:text-stone-300 dark:hover:border-red-500 dark:hover:text-red-400"
        >
          ← {prevPage}
        </Link>
      ) : (
        <span className="flex h-9 cursor-not-allowed items-center justify-center rounded-lg border border-stone-200 px-3 text-xs font-medium text-stone-300 dark:border-stone-800 dark:text-stone-700">
          ← {prevPage}
        </span>
      )}

      {/* 頁碼數字按鈕 */}
      <div className="flex items-center gap-1">
        {pages.map((p, idx) => {
          if (typeof p === "string") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-9 w-8 items-center justify-center text-xs text-stone-400"
              >
                ...
              </span>
            );
          }

          const isCurrent = p === page;
          return isCurrent ? (
            <span
              key={p}
              className="flex h-9 min-w-[36px] items-center justify-center rounded-lg border-2 border-red-600 bg-red-600 px-2.5 text-xs font-bold text-white shadow-sm"
            >
              {p}
            </span>
          ) : (
            <Link
              key={p}
              href={`/category/${slug}?page=${p}`}
              className="flex h-9 min-w-[36px] items-center justify-center rounded-lg border border-stone-300 px-2.5 text-xs font-semibold text-stone-700 transition-all hover:border-red-600 hover:text-red-600 dark:border-stone-700 dark:text-stone-300 dark:hover:border-red-500 dark:hover:text-red-400"
            >
              {p}
            </Link>
          );
        })}
      </div>

      {/* 下一頁按鈕 */}
      {page < totalPages ? (
        <Link
          href={`/category/${slug}?page=${page + 1}`}
          className="flex h-9 items-center justify-center rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 transition-all hover:border-red-600 hover:text-red-600 dark:border-stone-700 dark:text-stone-300 dark:hover:border-red-500 dark:hover:text-red-400"
        >
          {nextPage} →
        </Link>
      ) : (
        <span className="flex h-9 cursor-not-allowed items-center justify-center rounded-lg border border-stone-200 px-3 text-xs font-medium text-stone-300 dark:border-stone-800 dark:text-stone-700">
          {nextPage} →
        </span>
      )}
    </nav>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10));
  const locale = await getLocale();

  const [category, articlesData] = await Promise.all([
    fetchCategoryBySlug(slug, locale),
    fetchArticles({ locale, category_slug: slug, page }),
  ]);

  if (!category) notFound();

  const tCat = await getTranslations("CategoryPage");
  const tCommon = await getTranslations("Common");
  const tHeader = await getTranslations("Header");
  const { articles, total, total_pages } = articlesData;

  const featuredArticle = page === 1 && articles.length > 0 ? articles[0] : null;
  const listArticles = page === 1 ? articles.slice(1) : articles;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* 麵包屑 Nav */}
      <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
        <Link
          href="/"
          className="transition-colors hover:text-red-600 dark:hover:text-red-400"
        >
          {tHeader("home")}
        </Link>
        <span>/</span>
        <span className="font-semibold text-stone-800 dark:text-stone-200">
          {category.name}
        </span>
      </nav>

      {/* 分類頭部 Category Header */}
      <div className="mb-8 border-b-2 border-red-600 pb-5 dark:border-red-500">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-7 w-2 rounded-full bg-red-600" />
            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
              {category.name}
            </h1>
          </div>
          <span className="rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-300">
            {tCat("totalArticles", { total })}
          </span>
        </div>
        {category.description && (
          <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
            {category.description}
          </p>
        )}
      </div>

      {/* 文章列表 */}
      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-stone-300 py-24 text-center dark:border-stone-800">
          <p className="text-stone-500 dark:text-stone-400">
            {tCat("emptyCategory")}
          </p>
        </div>
      ) : (
        <div>
          {/* 第1頁的首篇大焦點文章 */}
          {featuredArticle && (
            <FeaturedArticleCard
              article={featuredArticle}
              categoryName={category.name}
              breaking={tCommon("breaking")}
              pinned={tCommon("pinned")}
              noTitle={tCommon("noTitle")}
            />
          )}

          {/* 普通卡片列表 */}
          {listArticles.length > 0 && (
            <div className="space-y-4">
              {listArticles.map((article) => (
                <StandardArticleCard
                  key={article.slug}
                  article={article}
                  categoryName={category.name}
                  breaking={tCommon("breaking")}
                  pinned={tCommon("pinned")}
                  noTitle={tCommon("noTitle")}
                  noCover={tCommon("noCover")}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tailnews 分頁 */}
      <Pagination
        slug={slug}
        page={page}
        totalPages={total_pages}
        prevPage={tCommon("prevPage")}
        nextPage={tCommon("nextPage")}
      />
    </div>
  );
}
