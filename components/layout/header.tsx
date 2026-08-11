import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import Sidebar from "./sidebar";
import type { Category } from "./sidebar";
import { fetchCategories, fetchArticles } from "@/lib/api";
import { formatHeaderDate } from "@/lib/format-date";
import BreakingTicker from "./breaking-ticker";
import { Flame } from "lucide-react";

export default async function Header() {
  const locale = await getLocale();
  const t = await getTranslations("Header");
  const categories = await fetchCategories(locale);
  const formattedDate = formatHeaderDate();

  const { articles: latestArticles } = await fetchArticles({
    locale,
    limit: 20,
  });
  const breakingArticles = latestArticles
    .filter((a) => a.is_breaking)
    .slice(0, 5);

  return (
    <header className="w-full bg-white text-slate-900 border-b border-slate-200 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 shadow-xs">
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
            <span className="shrink-0 inline-flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded-xs font-bold text-[11px] uppercase tracking-wider">
              <Flame className="w-3 h-3 animate-pulse" />
              {t("breakingNews")}
            </span>
            {breakingArticles.length > 0 ? (
              <BreakingTicker
                articles={breakingArticles.map((a) => ({
                  slug: a.slug,
                  title: a.title,
                }))}
              />
            ) : (
              <span className="text-slate-400">{t("welcome")}</span>
            )}
          </div>

          <div className="flex items-center gap-4 shrink-0 text-slate-400">
            <time
              className="hidden sm:inline font-mono"
              dateTime={new Intl.DateTimeFormat("en-CA", {
                timeZone: "Asia/Hong_Kong",
              }).format(new Date())}
            >
              {formattedDate}
            </time>
          </div>
        </div>
      </div>

      <div className="py-5 sm:py-6 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 shadow-xs transition-transform group-hover:scale-105">
              <Image
                src="/icon.png"
                alt="億民新聞 Logo Icon"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <div className="relative h-8 w-44 sm:h-10 sm:w-56">
                <Image
                  src="/logo.png"
                  alt="億民新聞 EMIN NEWS"
                  fill
                  className="object-contain object-left dark:invert"
                  priority
                />
              </div>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
                {t("tagline")}
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center justify-center bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-md px-6 py-3 text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>{t("adSlot")}</span>
          </div>
        </div>
      </div>

      <Sidebar categories={categories as Category[]} />
    </header>
  );
}
