import DOMPurify from "isomorphic-dompurify";

/** 清洗文章正文 HTML，防止儲存型 XSS */
export function sanitizeArticleHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
}

/** 安全序列化 JSON-LD，避免 </script> 打斷腳本 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
