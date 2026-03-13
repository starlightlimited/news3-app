import Link from "next/link";

/**
 * 全局 404：未匹配到任何路由時顯示（例如 /random、/api/xxx 等）。
 * 語系內 404（如文章不存在）使用 app/[locale]/not-found.tsx。
 */
export default function GlobalNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="font-serif text-6xl font-bold text-stone-300 dark:text-stone-600">
        404
      </h1>
      <p className="mt-2 text-stone-500 dark:text-stone-400">NOT FOUND</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
      >
        BACK TO HOME
      </Link>
    </div>
  );
}
