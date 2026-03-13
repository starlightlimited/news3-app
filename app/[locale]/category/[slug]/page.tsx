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

function ArticleCard({
  article,
  breaking,
  pinned,
  noTitle,
  noCover,
}: {
  article: Article;
  breaking: string;
  pinned: string;
  noTitle: string;
  noCover: string;
}) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex gap-4 border-b border-stone-200 py-4 last:border-0 dark:border-stone-800"
    >
      {article.cover?.url ? (
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800">
          <Image
            src={article.cover.url}
            alt={article.cover.alt || article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="112px"
          />
        </div>
      ) : (
        <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-md border border-stone-200 bg-stone-100 text-[10px] text-stone-400 dark:border-stone-700 dark:bg-stone-800">
          {noCover}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {article.is_breaking && (
            <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {breaking}
            </span>
          )}
          {article.is_pinned && (
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              {pinned}
            </span>
          )}
          <time
            dateTime={article.published_at ?? ""}
            className="text-xs text-stone-500 dark:text-stone-400"
          >
            {article.published_at
              ? new Date(article.published_at).toLocaleDateString("zh-TW", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  timeZone: "Asia/Taipei",
                })
              : null}
          </time>
        </div>
        <h2 className="mt-0.5 line-clamp-2 font-serif text-sm font-medium text-stone-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
          {article.title || noTitle}
        </h2>
        {article.excerpt && (
          <p className="mt-0.5 line-clamp-1 text-xs text-stone-500 dark:text-stone-400">
            {article.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}

function Pagination({
  slug,
  page,
  totalPages,
  prevPage,
  nextPage,
  pageOf,
}: {
  slug: string;
  page: number;
  totalPages: number;
  prevPage: string;
  nextPage: string;
  pageOf: (p: number, t: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-4 pt-8"
      aria-label="分頁"
    >
      {page > 1 && (
        <Link
          href={`/category/${slug}?page=${page - 1}`}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200"
        >
          ← {prevPage}
        </Link>
      )}
      <span className="text-sm text-stone-500 dark:text-stone-400">
        {pageOf(page, totalPages)}
      </span>
      {page < totalPages && (
        <Link
          href={`/category/${slug}?page=${page + 1}`}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200"
        >
          {nextPage} →
        </Link>
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
  const { articles, total, total_pages } = articlesData;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* 分類頭部 */}
      <div className="mb-8 space-y-1 border-b border-emerald-200 pb-6 dark:border-emerald-800">
        <h1 className="font-serif text-2xl font-bold text-emerald-800 dark:text-emerald-300">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {category.description}
          </p>
        )}
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {tCat("totalArticles", { total })}
        </p>
      </div>

      {/* 文章列表 */}
      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <p className="text-stone-500 dark:text-stone-400">
            {tCat("emptyCategory")}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              breaking={tCommon("breaking")}
              pinned={tCommon("pinned")}
              noTitle={tCommon("noTitle")}
              noCover={tCommon("noCover")}
            />
          ))}
        </div>
      )}

      <Pagination
        slug={slug}
        page={page}
        totalPages={total_pages}
        prevPage={tCommon("prevPage")}
        nextPage={tCommon("nextPage")}
        pageOf={(p, tot) => tCommon("pageOf", { page: p, total: tot })}
      />
    </div>
  );
}
