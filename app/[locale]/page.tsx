import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { fetchHomepage, type Article, type CategorySection } from "@/lib/api";
import HeroCarousel from "@/components/home/hero-carousel";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Taipei",
  });
}

// ── 焦點主圖（雜誌風格，emerald 配色）───────────────────────────────────────────────

function FeaturedHero({
  article,
  breaking,
}: {
  article: Article;
  breaking: string;
}) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group relative block aspect-[2/1] w-full overflow-hidden rounded-lg border border-stone-200 sm:aspect-[3/1] dark:border-stone-700"
    >
      {article.cover?.url ? (
        <Image
          src={article.cover.url}
          alt={article.cover.alt || article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, 896px"
          priority
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-stone-100 dark:bg-stone-800" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-900/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          {article.is_breaking && (
            <span className="rounded bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white">
              {breaking}
            </span>
          )}
          {article.category && (
            <span className="text-xs text-emerald-200">
              {article.category.name}
            </span>
          )}
        </div>
        <h2 className="mt-1.5 line-clamp-2 font-serif text-lg font-bold text-white sm:text-xl md:text-2xl">
          {article.title}
        </h2>
        <time
          dateTime={article.published_at ?? ""}
          className="mt-1 block text-xs text-emerald-200/90"
        >
          {formatDate(article.published_at)}
        </time>
      </div>
    </Link>
  );
}

// ── 文章卡片（雜誌風格）───────────────────────────────────────────────────────────────

function ArticleCard({
  article,
  noCover,
  breaking,
}: {
  article: Article;
  noCover: string;
  breaking: string;
}) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex gap-4 py-4 first:pt-0 last:pb-0"
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
          <time
            dateTime={article.published_at ?? ""}
            className="text-xs text-stone-500 dark:text-stone-400"
          >
            {formatDate(article.published_at)}
          </time>
        </div>
        <h3 className="mt-0.5 line-clamp-2 font-serif text-sm font-medium text-stone-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-0.5 line-clamp-1 text-xs text-stone-500 dark:text-stone-400">
            {article.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}

// ── 分類區塊 ────────────────────────────────────────────────────────────────────

function CategorySection({
  section,
  moreLink,
  noCover,
  breaking,
}: {
  section: CategorySection;
  moreLink: string;
  noCover: string;
  breaking: string;
}) {
  const { category, articles } = section;
  if (articles.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between border-b border-emerald-200 pb-2 dark:border-emerald-800">
        <h2 className="font-serif text-sm font-semibold text-emerald-800 dark:text-emerald-300">
          {category.name}
        </h2>
        <Link
          href={`/category/${category.slug}`}
          className="text-xs font-medium text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200"
        >
          {moreLink}
        </Link>
      </div>
      <div className="divide-y divide-stone-100 dark:divide-stone-800">
        {articles.map((a) => (
          <ArticleCard
            key={a.slug}
            article={a}
            noCover={noCover}
            breaking={breaking}
          />
        ))}
      </div>
    </section>
  );
}

// ── 主頁面 ────────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("HomePage");
  const tCommon = await getTranslations("Common");
  const { hero, sections } = await fetchHomepage(locale);

  const featuredArticle = hero[0] ?? null;
  const carouselArticles = hero.slice(1, 6);
  const hasContent = hero.length > 0 || sections.length > 0;

  if (!hasContent) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-stone-500 dark:text-stone-400">{t("emptyHint")}</p>
      </div>
    );
  }

  const moreLink = t("moreLink");
  const noCover = tCommon("noCover");
  const breaking = tCommon("breaking");

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* 焦點主圖 */}
        {featuredArticle && (
          <section className="mb-10">
            <FeaturedHero article={featuredArticle} breaking={breaking} />
          </section>
        )}

        {/* 熱門輪播 */}
        {carouselArticles.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 font-serif text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              {t("hotArticles")}
            </h2>
            <HeroCarousel articles={carouselArticles} />
          </section>
        )}

        {/* 分類區塊 */}
        {sections.length > 0 && (
          <div className="space-y-10">
            {sections.map((s) => (
              <CategorySection
                key={s.category.id}
                section={s}
                moreLink={moreLink}
                noCover={noCover}
                breaking={breaking}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
