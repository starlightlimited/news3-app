import { getLocale, getTranslations } from "next-intl/server";
import { ChevronRight, Clock, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { fetchHomepage, type Article, type CategorySection } from "@/lib/api";
import HeroCarousel from "@/components/home/hero-carousel";
import CoverImage from "@/components/ui/cover-image";
import { formatArticleDate } from "@/lib/format-date";

// ── 1. Tailnews 清新白底焦點大圖卡片（Editorial Featured Hero） ────────────────────

function FeaturedHero({
  article,
  breaking,
}: {
  article: Article;
  breaking: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6 flex flex-col justify-between h-full">
      <Link href={`/article/${article.slug}`} className="group block space-y-4">
        {/* 精美大圖容器 */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-2xs">
          {article.cover?.url ? (
            <CoverImage
              src={article.cover.url}
              alt={article.cover.alt || article.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
              fallback={
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                  無封面圖
                </div>
              }
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
              無封面圖
            </div>
          )}

          {/* 角標 Badge */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {article.is_breaking && (
              <span className="rounded-md bg-red-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
                {breaking}
              </span>
            )}
            {article.category && (
              <span className="rounded-md bg-blue-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
                {article.category.name}
              </span>
            )}
          </div>
        </div>

        {/* 標題與摘要 */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>頭條焦點</span>
            {article.published_at && (
              <span className="text-slate-400 font-normal">
                • {formatArticleDate(article.published_at)}
              </span>
            )}
          </div>

          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-black text-slate-900 group-hover:text-red-600 dark:text-white dark:group-hover:text-red-500 transition-colors leading-snug">
            {article.title || "（無標題）"}
          </h2>

          {article.excerpt && (
            <p className="line-clamp-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {article.excerpt}
            </p>
          )}
        </div>
      </Link>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-400">閱讀完整新聞報導</span>
        <Link
          href={`/article/${article.slug}`}
          className="font-bold text-red-600 hover:text-red-700 dark:text-red-400 inline-flex items-center gap-0.5"
        >
          查看全文 →
        </Link>
      </div>
    </div>
  );
}

// ── 2. Tailnews 分類區塊（Category Section） ──────────────────────────────────

function CategorySectionBlock({
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

  const topArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      {/* Tailnews 標誌性分類 Header */}
      <div className="relative mb-6 flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="h-6 w-2 rounded-full bg-red-600" />
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase font-serif">
            {category.name}
          </h2>
        </div>
        <Link
          href={`/category/${category.slug}`}
          className="group flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
        >
          <span>{moreLink}</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
        {/* 底部高亮線 */}
        <div className="absolute -bottom-0.5 left-0 h-[3px] w-20 bg-red-600 rounded-full" />
      </div>

      {/* 第一篇：突出主圖卡片 */}
      {topArticle && (
        <Link
          href={`/article/${topArticle.slug}`}
          className="group grid grid-cols-1 gap-5 sm:grid-cols-12 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 sm:col-span-6 border border-slate-100 dark:border-slate-800">
            {topArticle.cover?.url ? (
              <CoverImage
                src={topArticle.cover.url}
                alt={topArticle.cover.alt || topArticle.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 400px"
                fallback={
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    {noCover}
                  </div>
                }
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                {noCover}
              </div>
            )}
            {topArticle.is_breaking && (
              <span className="absolute top-2 left-2 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                {breaking}
              </span>
            )}
          </div>
          <div className="flex flex-col justify-center sm:col-span-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded-xs">
                {category.name}
              </span>
              {topArticle.published_at && (
                <span className="text-xs text-slate-400">
                  • {formatArticleDate(topArticle.published_at)}
                </span>
              )}
            </div>
            <h3 className="font-serif line-clamp-2 text-base font-bold text-slate-900 group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400 transition-colors leading-snug sm:text-lg">
              {topArticle.title}
            </h3>
            {topArticle.excerpt && (
              <p className="mt-2 line-clamp-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {topArticle.excerpt}
              </p>
            )}
          </div>
        </Link>
      )}

      {/* 後續文章：2 列網格卡片 */}
      {otherArticles.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {otherArticles.map((a) => (
            <Link
              key={a.slug}
              href={`/article/${a.slug}`}
              className="group flex gap-3.5 rounded-xl p-3 border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/40 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
            >
              {a.cover?.url ? (
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                  <CoverImage
                    src={a.cover.url}
                    alt={a.cover.alt || a.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="96px"
                    fallback={
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                        {noCover}
                      </div>
                    }
                  />
                </div>
              ) : (
                <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400 dark:bg-slate-800">
                  {noCover}
                </div>
              )}
              <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                <h4 className="line-clamp-2 text-xs font-bold text-slate-800 group-hover:text-red-600 dark:text-slate-200 dark:group-hover:text-red-400 transition-colors leading-snug sm:text-sm font-serif">
                  {a.title}
                </h4>
                <time
                  dateTime={a.published_at ?? ""}
                  className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1"
                >
                  <Clock className="h-3 w-3 text-slate-400" />
                  {formatArticleDate(a.published_at)}
                </time>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

// ── 3. Tailnews 熱門文章 Sidebar Widget ──────────────────────────────────────────

function HotArticlesWidget({
  title,
  articles,
}: {
  title: string;
  articles: Article[];
}) {
  if (articles.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      {/* Widget Header */}
      <div className="relative mb-5 flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="h-6 w-2 rounded-full bg-red-600" />
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase font-serif">
            {title}
          </h2>
        </div>
        <TrendingUp className="h-4 w-4 text-red-600" />
        <div className="absolute -bottom-0.5 left-0 h-[3px] w-16 bg-red-600 rounded-full" />
      </div>

      {/* 熱門文章列表 */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {articles.map((article, idx) => {
          const rank = idx + 1;
          const isTopThree = rank <= 3;

          return (
            <Link
              key={article.slug}
              href={`/article/${article.slug}`}
              className="group flex items-start gap-3.5 py-3.5 first:pt-0 last:pb-0"
            >
              {/* 序號 Badge */}
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-black ${
                  isTopThree
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {rank}
              </span>

              {/* 文章標題與元數據 */}
              <div className="min-w-0 flex-1">
                {article.category && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                    {article.category.name}
                  </span>
                )}
                <h3 className="line-clamp-2 text-xs font-bold text-slate-800 group-hover:text-red-600 dark:text-slate-200 dark:group-hover:text-red-400 transition-colors leading-snug sm:text-sm font-serif">
                  {article.title}
                </h3>
                {article.published_at && (
                  <time
                    dateTime={article.published_at}
                    className="mt-1 block text-[11px] text-slate-400 dark:text-slate-500"
                  >
                    {formatArticleDate(article.published_at)}
                  </time>
                )}
              </div>

              {/* 前 2 名附帶縮略圖 */}
              {rank <= 2 && article.cover?.url && (
                <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                  <CoverImage
                    src={article.cover.url}
                    alt={article.cover.alt || article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="64px"
                    fallback={null}
                  />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ── 4. 主頁面（HomePage） ────────────────────────────────────────────────────────

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
        <p className="text-slate-500 dark:text-slate-400">{t("emptyHint")}</p>
      </div>
    );
  }

  const moreLink = t("moreLink");
  const noCover = tCommon("noCover");
  const breaking = tCommon("breaking");

  // 匯集熱門文章（優先取 hero 中剩餘文章或從各分類區塊中挑選）
  const hotArticles =
    hero.length > 1
      ? hero.slice(1, 7)
      : sections.flatMap((s) => s.articles).slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 1. Tailnews 三欄報刊大首屏 (Featured Editorial Hero + News List Grid) */}
        <section className="mb-10">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {featuredArticle && (
              <div
                className={
                  carouselArticles.length > 0
                    ? "lg:col-span-7"
                    : "lg:col-span-12"
                }
              >
                <FeaturedHero article={featuredArticle} breaking={breaking} />
              </div>
            )}
            {carouselArticles.length > 0 && (
              <div
                className={
                  featuredArticle
                    ? "lg:col-span-5"
                    : "lg:col-span-12"
                }
              >
                <HeroCarousel articles={carouselArticles} />
              </div>
            )}
          </div>
        </section>

        {/* 2. 主兩欄佈局（Main Content + Sidebar） */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* 左側主區域 */}
          <div className="space-y-10 lg:col-span-8">
            {sections.length > 0 ? (
              sections.map((s) => (
                <CategorySectionBlock
                  key={s.category.id}
                  section={s}
                  moreLink={moreLink}
                  noCover={noCover}
                  breaking={breaking}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                {t("emptyHint")}
              </div>
            )}
          </div>

          {/* 右側 Sidebar 側邊欄 */}
          <aside className="space-y-8 lg:col-span-4">
            <HotArticlesWidget
              title={t("hotArticles")}
              articles={hotArticles}
            />

            {/* 側邊欄 Tailnews 廣告卡片 */}
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-100/80 p-6 text-center text-slate-400 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="block text-xs font-bold uppercase tracking-widest text-slate-400">
                贊助廣告區域 ADVERTISEMENT
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
