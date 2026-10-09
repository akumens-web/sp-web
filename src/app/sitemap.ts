import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { routing } from "@/i18n/routing";
export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${site.url}/${locale}`,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${site.url}/${l}`]),
      ),
    },
  }));
}
