"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type ReactNode } from "react";

type Props = ImageProps & {
  fallback?: ReactNode;
};

/** 封面圖：載入失敗時顯示 fallback，避免裂圖圖示 */
export default function CoverImage({ fallback = null, alt, ...props }: Props) {
  const [ok, setOk] = useState(true);
  if (!ok) return <>{fallback}</>;
  return <Image {...props} alt={alt} onError={() => setOk(false)} />;
}
