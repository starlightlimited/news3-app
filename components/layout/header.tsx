import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import Sidebar from "./sidebar";
import type { Category } from "./sidebar";
import { fetchCategories, fetchArticles } from "@/lib/api";
import LocaleSwitcher from "./locale-switcher";
import { Flame } from "lucide-react";

function getFormattedDate(locale: string) {
  const now = new Date();
  if (locale === "zh-hk") {
    const days = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const dayName = days[now.getDay()];
    return `${year}年${month}月${date}日 ${dayName}`;
  }
  return now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function Header() {
  const locale = await getLocale();
  const t = await getTranslations("Header");
  const categories = await fetchCategories(locale);
  const formattedDate = getFormattedDate(locale);

  // 獲取最新突發/焦點動態用於 Top Ticker 跑馬燈
  const { articles: breakingArticles } = await fetchArticles({
    locale,
    limit: 5,
  });

  return (
    <header className="w-full bg-white text-slate-900 border-b border-slate-200 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 shadow-xs">
      {/* 1. Tailnews 頂部即時跑馬燈與實用工具欄 Top Utility Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          {/* 左側：即時快訊 Ticker */}
          <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
            <span className="shrink-0 inline-flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded-xs font-bold text-[11px] uppercase tracking-wider">
              <Flame className="w-3 h-3 animate-pulse" />
              即時新聞
            </span>
            {breakingArticles.length > 0 ? (
              <Link
                href={`/article/${breakingArticles[0].slug}`}
                className="truncate block text-slate-300 font-medium hover:text-white transition-colors"
              >
                {breakingArticles[0].title}
              </Link>
            ) : (
              <span className="text-slate-400">歡迎來到億民新聞</span>
            )}
          </div>

          {/* 右側：日期與語言切換 */}
          <div className="flex items-center gap-4 shrink-0 text-slate-400">
            <time className="hidden sm:inline font-mono" suppressHydrationWarning>
              {formattedDate}
            </time>
            <div className="h-3 w-px bg-slate-700 hidden sm:block" />
            <LocaleSwitcher />
          </div>
        </div>
      </div>

      {/* 2. Tailnews 經典大報頭 Branding Banner */}
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

          {/* 右側報刊風格廣告 Banner 占位 (Tailnews Signature) */}
          <div className="hidden md:flex items-center justify-center bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-md px-6 py-3 text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>TAILNEWS 廣告推廣區域</span>
          </div>
        </div>
      </div>

      {/* 3. Tailnews 醒目紅色主導航欄 Main Navigation Bar */}
      <Sidebar categories={categories as Category[]} />
    </header>
  );
}
