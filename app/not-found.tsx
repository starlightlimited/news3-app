import Link from "next/link";

/**
 * 全局 404：未匹配到任何路由時顯示。
 * 語系內 404 使用 app/[locale]/not-found.tsx。
 */
export default function GlobalNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="font-serif text-6xl font-bold text-stone-300 dark:text-stone-600">
        404
      </h1>
      <p className="mt-2 text-stone-500 dark:text-stone-400">找不到頁面</p>
      <Link
        href="/zh-hk"
        className="mt-6 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
      >
        返回首頁
      </Link>
    </div>
  );
}
