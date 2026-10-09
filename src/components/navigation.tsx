"use client";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
export function LanguageSwitcher() {
  const locale = useLocale();
  const path = usePathname();
  const t = useTranslations("nav");
  return (
    <div className="languages" aria-label={t("language")}>
      {(["uk", "ru", "en"] as const).map((l) => (
        <a
          key={l}
          href={path.replace(/^\/(uk|ru|en)/, `/${l}`)}
          lang={l}
          hrefLang={l}
          aria-current={l === locale ? "page" : undefined}
          onClick={() => {
            document.cookie = `NEXT_LOCALE=${l}; Path=/; Max-Age=31536000; SameSite=Lax`;
          }}
        >
          {l === "uk" ? "UA" : l.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
export function Navigation() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className={`navigation ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <a href="#home" className="wordmark" aria-label="Shawarma Patrol">
          <span className="brand-mark" aria-hidden="true">
            ϟ
          </span>
          <span>
            SHAWARMA
            <br />
            PATROL<span className="brand-dot">.</span>
          </span>
        </a>
        <nav aria-label={t("menu")} className="desktop-nav">
          {["about", "journey", "projects", "media"].map((id) => (
            <a key={id} href={`#${id}`}>
              {t(id)}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <LanguageSwitcher />
          <a className="button small desktop-cta" href="#join">
            {t("join")}
            <ArrowUpRight size={16} />
          </a>
          <button
            id="menu-toggle"
            className="menu-toggle"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t(open ? "close" : "menu")}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" className="mobile-menu" aria-label={t("menu")}>
          {["about", "journey", "projects", "media", "join"].map((id) => (
            <a key={id} onClick={() => setOpen(false)} href={`#${id}`}>
              {t(id)}
              <ArrowUpRight size={18} />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
