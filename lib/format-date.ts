const HK_TZ = "Asia/Hong_Kong";

/** 文章/列表日期（香港時區） */
export function formatArticleDate(
  iso: string | null,
  style: "short" | "long" = "short"
): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  if (style === "long") {
    return date.toLocaleDateString("zh-HK", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: HK_TZ,
    });
  }
  return date.toLocaleDateString("zh-HK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: HK_TZ,
  });
}

/** 頂欄今日日期（香港時區） */
export function formatHeaderDate(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: HK_TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).formatToParts(new Date());

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const weekdayMap: Record<string, string> = {
    Sun: "星期日",
    Mon: "星期一",
    Tue: "星期二",
    Wed: "星期三",
    Thu: "星期四",
    Fri: "星期五",
    Sat: "星期六",
  };
  const dayName = weekdayMap[get("weekday")] ?? "";
  return `${year}年${month}月${day}日 ${dayName}`;
}

/** 安全解析分頁 page，非法值回落為 1 */
export function parsePage(pageStr?: string): number {
  const n = Number.parseInt(pageStr ?? "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}
