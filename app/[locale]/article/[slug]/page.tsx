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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const article = await fetchArticleBySlug(slug, locale);

  if (!article) notFound();

  const tArt = await getTranslations("ArticlePage");
  const tCommon = await getTranslations("Common");
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
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 麵包屑 / 分類 */}
      {article.category && (
        <div className="mb-4">
          <Link
            href={`/category/${article.category.slug}`}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200"
          >
            {article.category.name}
          </Link>
        </div>
      )}

      {/* 標籤 */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {article.is_breaking && (
          <span className="rounded bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
            {tCommon("breaking")}
          </span>
        )}
        {article.is_pinned && (
          <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            {tCommon("pinned")}
          </span>
        )}
      </div>

      {/* 標題 */}
      <header className="mb-6">
        <h1 className="font-serif text-2xl font-bold leading-tight text-stone-900 dark:text-white sm:text-3xl">
          {article.title}
        </h1>
        {article.subtitle && (
          <p className="mt-2 font-serif text-lg text-stone-600 dark:text-stone-400">
            {article.subtitle}
          </p>
        )}
        <time
          dateTime={article.published_at ?? ""}
          className="mt-3 block text-sm text-stone-500 dark:text-stone-400"
        >
          {article.published_at
            ? new Date(article.published_at).toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "Asia/Taipei",
              })
            : null}
        </time>
      </header>

      {/* 封面圖 */}
      {article.cover?.url && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800">
          <Image
            src={article.cover.url}
            alt={article.cover.alt || article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
        </div>
      )}

      {/* 正文 */}
      {article.body ? (
        <div
          className="article-body max-w-none text-stone-700 dark:text-stone-300 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-semibold [&_p]:mt-3 [&_p]:leading-relaxed [&_a]:text-emerald-600 [&_a]:underline [&_a]:hover:text-emerald-800 dark:[&_a]:text-emerald-400 dark:[&_a]:hover:text-emerald-200 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_img]:rounded-lg [&_img]:max-w-full"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
      ) : (
        <p className="text-stone-500 dark:text-stone-400">{tArt("noBody")}</p>
      )}
    </article>
  );
}
