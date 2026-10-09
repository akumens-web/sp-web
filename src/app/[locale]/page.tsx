import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Landing } from "@/components/landing";
import { site } from "@/config/site";
import { routing } from "@/i18n/routing";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(site.url),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries([
        ...routing.locales.map((l) => [l, `/${l}`]),
        ["x-default", "/"],
      ]),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `/${locale}`,
      siteName: site.name,
      type: "website",
      locale: { uk: "uk_UA", ru: "ru_RU", en: "en_US" }[locale],
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => ({ uk: "uk_UA", ru: "ru_RU", en: "en_US" })[l]),
      images: [
        {
          url: "/brand/social-preview.png",
          width: 1200,
          height: 630,
          alt: site.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/brand/social-preview.png"],
    },
    icons: { icon: "/brand/favicon.svg" },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Landing />;
}
