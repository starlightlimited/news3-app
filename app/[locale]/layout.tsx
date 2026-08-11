import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { fetchSiteSeo } from "@/lib/api";
import {
  defaultRootSeo,
  getBaseUrl,
  buildLocaleUrl,
} from "@/lib/seo-config";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await fetchSiteSeo(locale);

  const title = defaultRootSeo.meta_title;
  const description =
    seo?.meta_description || defaultRootSeo.meta_description;
  const ogTitle = defaultRootSeo.og_title;
  const ogDesc = seo?.og_description || description;
  const siteName = defaultRootSeo.og_site_name;
  const canonical =
    seo?.canonical_url?.trim() ||
    (getBaseUrl() ? buildLocaleUrl(locale) : undefined);
  const languages =
    seo?.alternate_urls && Object.keys(seo.alternate_urls).length > 0
      ? seo.alternate_urls
      : getBaseUrl()
        ? Object.fromEntries(
            routing.locales.map((loc) => [loc, buildLocaleUrl(loc)])
          )
        : undefined;

  return {
    metadataBase: getBaseUrl() ? new URL(getBaseUrl()) : undefined,
    title,
    description,
    keywords: seo?.meta_keywords || undefined,
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "website",
      locale: locale === "zh-hk" ? "zh_HK" : locale,
      siteName,
      title: ogTitle,
      description: ogDesc,
      ...(seo?.og_image_url && {
        images: [
          {
            url: seo.og_image_url,
            width: seo.og_image_width,
            height: seo.og_image_height,
            alt: siteName,
          },
        ],
      }),
    },
    twitter: {
      card:
        (seo?.twitter_card_type as "summary" | "summary_large_image") ||
        "summary_large_image",
      ...(seo?.twitter_site && { site: seo.twitter_site }),
      ...(seo?.twitter_creator && { creator: seo.twitter_creator }),
      title: ogTitle,
      description: ogDesc,
    },
    robots: {
      index: seo?.robots_index ?? defaultRootSeo.robots_index,
      follow: seo?.robots_follow ?? defaultRootSeo.robots_follow,
    },
    alternates: {
      ...(canonical && { canonical }),
      ...(languages && Object.keys(languages).length > 0 && { languages }),
    },
    icons: {
      icon: seo?.favicon_url || undefined,
      apple: seo?.apple_touch_icon_url || undefined,
    },
    verification: {
      ...(seo?.google_verification && { google: seo.google_verification }),
      ...(seo?.bing_verification && {
        other: { "msvalidate.01": seo.bing_verification },
      }),
    },
  };
}

export async function generateViewport({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const seo = await fetchSiteSeo(locale);
  const themeColor = seo?.theme_color || defaultRootSeo.theme_color;
  return { themeColor };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "zh-hk")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <div
      className={`${playfair.variable} ${sourceSans.variable} flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100`}
    >
      <NextIntlClientProvider messages={messages}>
        <Header />
        <main className="flex-1 min-w-0">{children}</main>
        <Footer />
      </NextIntlClientProvider>
    </div>
  );
}
