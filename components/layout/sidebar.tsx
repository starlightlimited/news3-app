"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Menu, X, Search } from "lucide-react";
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

function NavDropdown({
  category,
  subCategories,
  isActive,
}: {
  category: Category;
  subCategories: Category[];
  isActive: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => setOpen(false), 150);
  }, []);

  const activeClass = isActive
    ? "bg-slate-900 text-white font-bold"
    : "text-white hover:bg-red-700/80";

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`/category/${category.slug}`}
        className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold tracking-wide uppercase transition-colors ${activeClass}`}
      >
        <span>{category.name || category.slug}</span>
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </Link>
      {open && (
        <div className="absolute left-0 top-full z-50 min-w-48 border-t-2 border-red-600 bg-slate-900 text-white py-2 shadow-xl rounded-b-md">
          {subCategories.map((child) => {
            const childActive =
              pathname === `/category/${child.slug}` ||
              pathname.startsWith(`/category/${child.slug}/`);
            return (
              <Link
                key={child.id}
                href={`/category/${child.slug}`}
                className={`block px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  childActive
                    ? "bg-red-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const toggleMobileSub = useCallback((id: string) => {
    setMobileExpandedCat((prev) => (prev === id ? null : id));
  }, []);

  const roots = categories.filter((c) => c.parent_id === null);
  const childrenOf = (id: string) =>
    categories.filter((c) => c.parent_id === id);

  return (
    <nav className="sticky top-0 z-40 w-full bg-red-600 text-white shadow-md dark:bg-red-700">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Desktop 導航列 */}
        <div className="hidden items-center md:flex flex-wrap">
          <Link
            href="/"
            className={`px-4 py-3 text-sm font-bold tracking-wide uppercase transition-colors ${
              pathname === "/"
                ? "bg-slate-900 text-white"
                : "text-white hover:bg-red-700/80"
            }`}
          >
            {t("home")}
          </Link>

          {roots.map((cat) => {
            const subs = childrenOf(cat.id);
            const subSlugs = subs.map((s) => s.slug);
            const active = isCategoryActive(cat, subSlugs, pathname);

            if (subs.length === 0) {
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`px-4 py-3 text-sm font-bold tracking-wide uppercase transition-colors ${
                    active
                      ? "bg-slate-900 text-white"
                      : "text-white hover:bg-red-700/80"
                  }`}
                >
                  {cat.name || cat.slug}
                </Link>
              );
            }

            return (
              <NavDropdown
                key={cat.id}
                category={cat}
                subCategories={subs}
                isActive={active}
              />
            );
          })}
        </div>

        {/* 桌面端右側 Search 圖標 */}
        <div className="hidden items-center gap-3 md:flex text-white/90 hover:text-white cursor-pointer">
          <Search className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">即時搜尋</span>
        </div>

        {/* 移動端 Header Toggle */}
        <div className="flex w-full items-center justify-between py-2.5 md:hidden">
          <Link href="/" className="font-serif text-lg font-bold text-white uppercase">
            {t("logo")}
          </Link>
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
            className="rounded-md p-1.5 text-white hover:bg-red-700 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* 移動端選單 */}
      {mobileMenuOpen && (
        <div className="border-t border-red-700 bg-red-700 px-4 pb-4 pt-2 md:hidden text-white">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-md px-3 py-2 text-base font-bold ${
                pathname === "/"
                  ? "bg-slate-900 text-white"
                  : "text-white hover:bg-red-800"
              }`}
            >
              {t("home")}
            </Link>

            {roots.map((cat) => {
              const subs = childrenOf(cat.id);
              const subSlugs = subs.map((s) => s.slug);
              const active = isCategoryActive(cat, subSlugs, pathname);
              const isExpanded = mobileExpandedCat === cat.id;

              if (subs.length === 0) {
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-md px-3 py-2 text-base font-bold ${
                      active
                        ? "bg-slate-900 text-white"
                        : "text-white hover:bg-red-800"
                    }`}
                  >
                    {cat.name || cat.slug}
                  </Link>
                );
              }

              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/category/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex-1 rounded-md px-3 py-2 text-base font-bold ${
                        active
                          ? "bg-slate-900 text-white"
                          : "text-white hover:bg-red-800"
                      }`}
                    >
                      {cat.name || cat.slug}
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleMobileSub(cat.id)}
                      className="p-2 text-white/80 hover:text-white"
                    >
                      <ChevronDown
                        className={`size-5 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="ml-4 space-y-1 border-l-2 border-red-500 pl-3">
                      {subs.map((child) => (
                        <Link
                          key={child.id}
                          href={`/category/${child.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block rounded-md px-3 py-1.5 text-sm text-white/90 hover:bg-red-800"
                        >
                          {child.name || child.slug}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 border-t border-red-600 pt-3">
            <div className="flex items-center justify-between px-3 text-xs text-white/90">
              <span>切換語言：</span>
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
