"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-Hant">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-2xl font-bold">系統發生錯誤</h1>
          <p className="text-sm text-stone-500">
            {error.message || "請稍後再試"}
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
          >
            重試
          </button>
        </div>
      </body>
    </html>
  );
}
