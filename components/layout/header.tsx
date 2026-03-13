import { getLocale, getTranslations } from "next-intl/server";
import Sidebar from "./sidebar";
import type { Category } from "./sidebar";
import { fetchCategories } from "@/lib/api";

/**
 * news3-app：左側邊欄佈局，與 news1/news2 頂部導航完全不同
 */
export default async function Header() {
  const locale = await getLocale();
  const categories = await fetchCategories(locale);

  return (
    <header className="fixed left-0 top-0 z-40 h-screen w-56 shrink-0">
      <Sidebar categories={categories as Category[]} />
    </header>
  );
}
