"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-serif text-2xl font-bold text-stone-800 dark:text-stone-100">
        頁面載入失敗
      </h1>
      <p className="text-sm text-stone-500 dark:text-stone-400">
        請稍後再試，或返回首頁繼續瀏覽。
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          重試
        </button>
        <Link
          href="/"
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-900"
        >
          返回首頁
        </Link>
      </div>
    </div>
  );
}
