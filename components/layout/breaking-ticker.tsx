"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

type Item = { slug: string; title: string };

export default function BreakingTicker({ articles }: { articles: Item[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [articles]);

  useEffect(() => {
    if (articles.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % articles.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [articles]);

  const article = articles[index] ?? articles[0];
  if (!article) return null;

  return (
    <Link
      href={`/article/${article.slug}`}
      className="block truncate text-slate-300 font-medium transition-colors hover:text-white"
    >
      {article.title}
    </Link>
  );
}
