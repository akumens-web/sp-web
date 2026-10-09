"use client";
import { useEffect } from "react";
export function LocaleRedirect({ locales }: { locales: string[] }) {
  useEffect(() => {
    const saved = document.cookie
      .split("; ")
      .find((c) => c.startsWith("NEXT_LOCALE="))
      ?.slice("NEXT_LOCALE=".length);
    const detected = navigator.languages
      .map((l) => l.split("-")[0].toLowerCase())
      .find((l) => locales.includes(l));
    const locale = saved && locales.includes(saved) ? saved : detected || "en";
    window.location.replace(
      `/${locale}/${window.location.search}${window.location.hash}`,
    );
  }, [locales]);
  return (
    <main className="container section">
      <h1>SHAWARMA PATROL</h1>
      <nav className="hero-buttons" aria-label="Українська / Русский / English">
        {locales.map((locale) => (
          <a
            key={locale}
            className="button"
            href={`/${locale}/`}
            lang={locale}
            hrefLang={locale}
          >
            {(
              { uk: "Українська", ru: "Русский", en: "English" } as Record<
                string,
                string
              >
            )[locale] || locale}
          </a>
        ))}
      </nav>
    </main>
  );
}
