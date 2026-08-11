import { defineRouting } from "next-intl/routing";

/** 後台目前僅支援 zh-hk，前台語系與其對齊 */
export const routing = defineRouting({
  locales: ["zh-hk"],
  defaultLocale: "zh-hk",
  localePrefix: "always",
});

export const localeNames: Record<string, string> = {
  "zh-hk": "繁",
};
