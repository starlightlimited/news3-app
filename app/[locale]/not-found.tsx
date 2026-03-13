"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * 語系內 404：當 notFound() 被呼叫時顯示（例如文章不存在、分類不存在）。
 * 會套用 [locale] layout（含 Header），故可沿用導航與樣式。
 */
export default function LocaleNotFound() {
  const t = useTranslations("NotFound");
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="font-serif text-8xl font-bold text-stone-200 dark:text-stone-700">
        {t("code")}
      </p>
      <h1 className="mt-4 font-serif text-xl font-semibold text-stone-900 dark:text-white">
        {t("title")}
      </h1>
      <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
        {t("description")}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-medium text-emerald-800 shadow-sm transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 dark:hover:bg-emerald-900/50"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
