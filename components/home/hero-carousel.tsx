"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/lib/api";

type Props = {
  articles: Article[];
};

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
    <div className="group/carousel relative h-64 overflow-hidden rounded-lg border border-stone-200 lg:h-72 dark:border-stone-700">
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {articles.map((article, index) => (
            <div
              key={article.slug}
              className="relative min-w-0 flex-[0_0_100%]"
            >
              {article.cover?.url ? (
                <Image
                  src={article.cover.url}
                  alt={article.cover.alt || article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                  priority={index === 0}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-stone-100 text-xs text-stone-400 dark:bg-stone-800">
                  {t("noCover")}
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/20 to-transparent" />

              <Link
                href={`/article/${article.slug}`}
                className="absolute inset-x-0 bottom-0 p-4 group sm:p-5"
              >
                <div className="flex items-center gap-2">
                  {article.is_breaking && (
                    <span className="rounded bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                      {t("breaking")}
                    </span>
                  )}
                  {article.category && (
                    <span className="text-xs text-emerald-100">
                      {article.category.name}
                    </span>
                  )}
                </div>

                <h2 className="mt-1 line-clamp-2 text-sm font-semibold text-white sm:text-base">
                  {article.title || t("noTitle")}
                </h2>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {articles.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollTo(i);
                        }}
                        aria-label={`第 ${i + 1} 張`}
                        className={`h-1 rounded-full transition-all ${
                          i === current
                            ? "w-4 bg-emerald-400"
                            : "w-1 bg-white/50 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                  {article.published_at && (
                    <time
                      dateTime={article.published_at}
                      className="text-xs text-emerald-200"
                    >
                      {new Date(article.published_at).toLocaleDateString(
                        "zh-TW",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          timeZone: "Asia/Taipei",
                        }
                      )}
                    </time>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {articles.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            aria-label="上一張"
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900/50 text-white transition-all hover:bg-emerald-800/70 active:scale-95 opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="下一張"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900/50 text-white transition-all hover:bg-emerald-800/70 active:scale-95 opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronRight className="size-4" />
          </button>
        </>
      )}
    </div>
  );
}
