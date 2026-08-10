"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/lib/api";

type Props = {
  articles: Article[];
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("zh-HK", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    timeZone: "Asia/Hong_Kong",
  });
}

export default function HeroCarousel({ articles }: Props) {
  const t = useTranslations("Common");
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: false },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const [current, setCurrent] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  if (articles.length === 0) return null;

  return (
    <div className="group/carousel relative h-full rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6 flex flex-col justify-between">
      {/* 頂部組件標題 */}
      <div className="relative mb-4 flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-red-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white font-serif">
            熱點精選輪播
          </h3>
        </div>
        <span className="text-[11px] font-mono font-bold text-slate-400">
          {current + 1} / {articles.length}
        </span>
        <div className="absolute -bottom-0.5 left-0 h-[3px] w-14 bg-red-600 rounded-full" />
      </div>

      {/* 輪播核心 */}
      <div ref={emblaRef} className="h-full w-full overflow-hidden flex-1">
        <div className="flex h-full">
          {articles.map((article, index) => (
            <div
              key={article.slug}
              className="group min-w-0 flex-[0_0_100%] flex flex-col justify-between"
            >
              <Link
                href={`/article/${article.slug}`}
                className="block space-y-3"
              >
                {/* 封面圖 */}
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                  {article.cover?.url ? (
                    <Image
                      src={article.cover.url}
                      alt={article.cover.alt || article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 400px"
                      priority={index === 0}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      {t("noCover")}
                    </div>
                  )}

                  {/* 標籤 */}
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    {article.is_breaking && (
                      <span className="rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        {t("breaking")}
                      </span>
                    )}
                    {article.category && (
                      <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        {article.category.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* 標題與摘要 */}
                <div className="space-y-1.5">
                  <h4 className="font-serif line-clamp-2 text-base font-bold text-slate-900 group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400 transition-colors leading-snug sm:text-lg">
                    {article.title || t("noTitle")}
                  </h4>
                  {article.excerpt && (
                    <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </Link>

              {/* 日期與指示器 */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                {article.published_at ? (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-red-500" />
                    <time dateTime={article.published_at}>
                      {formatDate(article.published_at)}
                    </time>
                  </div>
                ) : (
                  <span />
                )}

                {/* 控制點 */}
                <div className="flex items-center gap-1.5">
                  {articles.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo(i);
                      }}
                      aria-label={`跳至第 ${i + 1} 張`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === current
                          ? "w-5 bg-red-600"
                          : "w-1.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 前後按鈕 */}
      {articles.length > 1 && (
        <div className="mt-3 pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="上一張"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="下一張"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
