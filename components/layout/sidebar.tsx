"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import LocaleSwitcher from "./locale-switcher";

export type Category = {
  id: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
  name: string;
};

function isCategoryActive(cat: Category, subSlugs: string[], pathname: string) {
  const catPath = `/category/${cat.slug}`;
  return (
    pathname === catPath ||
    pathname.startsWith(catPath + "/") ||
    subSlugs.some((s) => {
      const p = `/category/${s}`;
      return pathname === p || pathname.startsWith(p + "/");
    })
  );
}

function NavItem({
  category,
  subCategories,
  isActive,
}: {
  category: Category;
  subCategories: Category[];
  isActive: boolean;
}) {
  const pathname = usePathname();
  const hasChildren = subCategories.length > 0;
  const [open, setOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter() {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setOpen(true);
  }
  function handleMouseLeave() {
    leaveTimer.current = setTimeout(() => setOpen(false), 150);
  }

  const activeClass = isActive
    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white";

  if (!hasChildren) {
    return (
      <Link
        href={`/category/${category.slug}`}
        className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeClass}`}
      >
        {category.name || category.slug}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        className={`flex cursor-default items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeClass}`}
      >
        {category.name || category.slug}
        <ChevronDown
          className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </span>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-36 rounded-lg border border-stone-200 bg-white py-1 shadow-lg dark:border-stone-700 dark:bg-stone-900">
          {subCategories.map((child) => {
            const childActive =
              pathname === `/category/${child.slug}` ||
              pathname.startsWith(`/category/${child.slug}/`);
            return (
              <Link
                key={child.id}
                href={`/category/${child.slug}`}
                className={`block px-3 py-2 text-sm transition-colors ${
                  childActive
                    ? "bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
                }`}
              >
                {child.name || child.slug}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const t = useTranslations("Header");
  const roots = categories.filter((c) => c.parent_id === null);
  const childrenOf = (id: string) =>
    categories.filter((c) => c.parent_id === id);

  return (
    <aside className="flex w-56 flex-col border-r border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
      <Link
        href="/"
        className="border-b border-stone-200 p-4 dark:border-stone-800"
      >
        <span className="block text-lg font-bold text-emerald-700 dark:text-emerald-400">
          {t("logo")}
        </span>
        <span className="mt-0.5 block text-[10px] uppercase tracking-wider text-stone-500">
          {t("tagline")}
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto p-3">
        <Link
          href="/"
          className={`mb-1 block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            pathname === "/"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
              : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
          }`}
        >
          {t("home")}
        </Link>
        {roots.map((cat) => {
          const subs = childrenOf(cat.id);
          const subSlugs = subs.map((s) => s.slug);
          const active = isCategoryActive(cat, subSlugs, pathname);
          return (
            <NavItem
              key={cat.id}
              category={cat}
              subCategories={subs}
              isActive={active}
            />
          );
        })}
      </nav>

      <div className="border-t border-stone-200 p-3 dark:border-stone-800">
        <LocaleSwitcher />
      </div>
    </aside>
  );
}
