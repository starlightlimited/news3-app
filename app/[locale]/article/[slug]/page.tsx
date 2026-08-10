import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { fetchArticleBySlug } from "@/lib/api";
import { getBaseUrl, buildLocaleUrl, orgName, orgUrl } from "@/lib/seo-config";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const article = await fetchArticleBySlug(slug, locale);

  if (!article) return {};

  const title = article.meta_title || article.title;
  const description = article.meta_description || article.excerpt;
  const ogImage = article.og_image_url || article.cover?.url;

  return {
    title,
    description,
    openGraph: {
      title: article.og_title || title,
      description: article.og_description || description,
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    robots: {
      index: article.robots_index,
      follow: article.robots_follow,
    },
    alternates: {
      ...(article.canonical_url && { canonical: article.canonical_url }),
      ...(article.alternate_urls &&
        Object.keys(article.alternate_urls).length > 0 && {
          languages: article.alternate_urls,
        }),
    },
  };
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Taipei",
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const article = await fetchArticleBySlug(slug, locale);

  if (!article) notFound();

  const tArt = await getTranslations("ArticlePage");
  const tCommon = await getTranslations("Common");
  const tHeader = await getTranslations("Header");

  const articleUrl = getBaseUrl()
    ? buildLocaleUrl(locale, `article/${article.slug}`)
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.meta_description || article.excerpt,
    ...(article.cover?.url && { image: article.cover.url }),
    datePublished: article.published_at ?? undefined,
    ...(articleUrl && {
      mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    }),
    ...(orgUrl &&
      orgName && {
        publisher: {
          "@type": "Organization",
          name: orgName,
          url: orgUrl,
        },
      }),
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 麵包屑 Breadcrumbs */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
        <Link
          href="/"
          className="transition-colors hover:text-red-600 dark:hover:text-red-400"
        >
          {tHeader("home")}
        </Link>
        <span>/</span>
        {article.category && (
          <>
            <Link
              href={`/category/${article.category.slug}`}
              className="transition-colors hover:text-red-600 dark:hover:text-red-400"
            >
              {article.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="line-clamp-1 max-w-[200px] font-semibold text-stone-800 sm:max-w-xs dark:text-stone-200">
          {article.title}
        </span>
      </nav>

      {/* 分類 Badge & 標籤 */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {article.category && (
          <Link
            href={`/category/${article.category.slug}`}
            className="inline-block rounded-md bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-sm transition-colors hover:bg-red-700"
          >
            {article.category.name}
          </Link>
        )}
        {article.is_breaking && (
          <span className="animate-pulse rounded-md bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            {tCommon("breaking")}
          </span>
        )}
        {article.is_pinned && (
          <span className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            {tCommon("pinned")}
          </span>
        )}
      </div>

      {/* 文章 Header */}
      <header className="mb-8 border-b border-stone-200 pb-6 dark:border-stone-800">
        <h1 className="font-serif text-3xl font-extrabold leading-tight tracking-tight text-stone-900 sm:text-4xl md:text-5xl dark:text-stone-50">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="mt-4 rounded-r-md border-l-4 border-red-600 bg-stone-100/70 py-2 pl-4 font-serif text-lg font-normal leading-relaxed text-stone-700 sm:text-xl dark:bg-stone-900/70 dark:text-stone-300">
            {article.subtitle}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between gap-4 text-xs font-medium text-stone-500 dark:text-stone-400">
          <time
            dateTime={article.published_at ?? ""}
            className="flex items-center gap-1.5"
          >
            <svg
              className="h-4 w-4 text-red-600 dark:text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 0v4m-9 4h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formatDate(article.published_at)}
          </time>
        </div>
      </header>

      {/* 封面圖 */}
      {article.cover?.url && (
        <figure className="mb-10">
          <div className="w-full overflow-hidden rounded-xl border border-stone-200/80 bg-stone-100 shadow-md dark:border-stone-800 dark:bg-stone-900">
            <Image
              src={article.cover.url}
              alt={article.cover.alt || article.title}
              width={article.cover.width || 1200}
              height={article.cover.height || 675}
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
          {article.cover.alt && (
            <figcaption className="mt-2.5 text-center font-serif text-xs italic text-stone-500 dark:text-stone-400">
              ▲ {article.cover.alt}
            </figcaption>
          )}
        </figure>
      )}

      {/* 文章正文 (`article-body`) */}
      {article.body ? (
        <div
          className="article-body max-w-none text-stone-800 dark:text-stone-200 [&_p:first-of-type]:text-lg [&_p:first-of-type]:font-medium [&_p:first-of-type]:leading-relaxed [&_p:first-of-type]:text-stone-900 dark:[&_p:first-of-type]:text-stone-100 [&_p]:mt-5 [&_p]:leading-loose [&_h1]:font-serif [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-stone-900 dark:[&_h1]:text-stone-50 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:border-b-2 [&_h2]:border-red-600 [&_h2]:pb-2 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-stone-900 dark:[&_h2]:text-stone-50 [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-stone-900 dark:[&_h3]:text-stone-100 [&_blockquote]:my-6 [&_blockquote]:rounded-r-lg [&_blockquote]:border-l-4 [&_blockquote]:border-red-600 [&_blockquote]:bg-stone-100 [&_blockquote]:p-5 [&_blockquote]:font-serif [&_blockquote]:italic [&_blockquote]:text-stone-700 dark:[&_blockquote]:bg-stone-900/80 dark:[&_blockquote]:text-stone-300 [&_a]:font-semibold [&_a]:text-red-600 [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:hover:text-red-800 dark:[&_a]:text-red-400 dark:[&_a]:hover:text-red-300 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-2 [&_img]:my-6 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:shadow-md"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
      ) : (
        <p className="py-12 text-center text-stone-500 dark:text-stone-400">
          {tArt("noBody")}
        </p>
      )}
    </article>
  );
}
