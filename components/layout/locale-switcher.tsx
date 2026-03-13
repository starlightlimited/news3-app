"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("LocaleSwitcher");
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (next: string) => {
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="flex gap-1">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => handleSwitch(l)}
          type="button"
          aria-label={t(l)}
          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
            locale === l
              ? "bg-emerald-600 text-white"
              : "text-stone-500 hover:text-stone-900 dark:hover:text-white"
          }`}
        >
          {t(l)}
        </button>
      ))}
    </div>
  );
}
