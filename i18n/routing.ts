import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh-hk", "en"],
  defaultLocale: "zh-hk",
  localePrefix: "always",
});

export const localeNames: Record<string, string> = {
  "zh-hk": "繁",
  en: "EN",
};
