import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fetchCategories } from "@/lib/api";

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("Header");
  const categories = await fetchCategories(locale);
  const roots = categories.filter((c) => c.parent_id === null);

  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-stone-200 bg-stone-900 text-stone-300 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* 品牌與簡介 */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="block font-serif text-2xl font-bold tracking-tight text-white">
                {t("logo")}
              </span>
              <span className="mt-1 block text-xs font-semibold uppercase tracking-widest text-amber-500">
                {t("tagline")}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-stone-400">
              貓兄弟新聞提供最新、最快的即時新聞與深度報導，涵蓋科技、財經、生活等多個領域，為您帶來全方位的資訊視野。
            </p>
          </div>

          {/* 快捷導航 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              快捷導航
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-white hover:underline"
                >
                  {t("home")}
                </Link>
              </li>
              {roots.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="transition-colors hover:text-white hover:underline"
                  >
                    {cat.name || cat.slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 新聞分類 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              熱門分類
            </h3>
            <ul className="space-y-2 text-sm">
              {roots.length > 5
                ? roots.slice(5, 10).map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="transition-colors hover:text-white hover:underline"
                      >
                        {cat.name || cat.slug}
                      </Link>
                    </li>
                  ))
                : roots.slice(0, 5).map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="transition-colors hover:text-white hover:underline"
                      >
                        {cat.name || cat.slug}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>

          {/* 關於與條款 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              關於與條款
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="cursor-pointer transition-colors hover:text-white">
                  關於我們
                </span>
              </li>
              <li>
                <span className="cursor-pointer transition-colors hover:text-white">
                  聯絡我們
                </span>
              </li>
              <li>
                <span className="cursor-pointer transition-colors hover:text-white">
                  服務條款
                </span>
              </li>
              <li>
                <span className="cursor-pointer transition-colors hover:text-white">
                  隱私政策
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部分隔線與版權聲明 */}
        <div className="mt-12 border-t border-stone-800 pt-8 text-center text-xs text-stone-500">
          <p>
            © {year} {t("logo")}. 版權所有，不得轉載。
          </p>
        </div>
      </div>
    </footer>
  );
}
