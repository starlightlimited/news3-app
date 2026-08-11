import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fetchCategories } from "@/lib/api";

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("Header");
  const tFooter = await getTranslations("Footer");
  const categories = await fetchCategories(locale);
  const roots = categories.filter((c) => c.parent_id === null);
  const quickNav = roots.slice(0, 5);
  const moreCats = roots.slice(5, 10);

  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-stone-200 bg-stone-900 text-stone-300 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 gap-8 md:grid-cols-2 ${
            moreCats.length > 0 ? "lg:grid-cols-3" : "lg:grid-cols-2"
          }`}
        >
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
              {tFooter("about")}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {tFooter("quickNav")}
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
              {quickNav.map((cat) => (
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

          {moreCats.length > 0 && (
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                {tFooter("hotCategories")}
              </h3>
              <ul className="space-y-2 text-sm">
                {moreCats.map((cat) => (
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
          )}
        </div>

        <div className="mt-12 border-t border-stone-800 pt-8 text-center text-xs text-stone-500">
          <p>
            © {year} {t("logo")}. {tFooter("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
