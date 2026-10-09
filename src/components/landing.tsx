import { getTranslations } from "next-intl/server";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Swords,
  Users,
  Code2,
  Bot,
  Layers3,
  ChartNoAxesCombined,
  MessageCircle,
  Send,
  Youtube,
  Twitch,
  Shield,
  Radio,
} from "lucide-react";
import { games, currentGame } from "@/data/games";
import { projects } from "@/data/projects";
import { socials } from "@/data/socials";
import { Reveal } from "./reveal";
import { Navigation, LanguageSwitcher } from "./navigation";
const projectIcons = { bot: Bot, layers: Layers3, chart: ChartNoAxesCombined };
const socialIcons: Record<string, typeof MessageCircle> = {
  discord: MessageCircle,
  telegram: Send,
  youtube: Youtube,
  twitch: Twitch,
};
type Translate = Awaited<ReturnType<typeof getTranslations>>;
function Hero({ t }: { t: Translate }) {
  return (
    <section id="home" className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-art" aria-hidden="true">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="emblem">
          <span>ϟ</span>
        </div>
        <div className="orbital-label">SP / ϟ / 001</div>
        <div className="signal-dot" />
      </div>
      <div className="container hero-content">
        <p className="eyebrow">
          <span className="live-dot" />
          {t("hero.eyebrow")}
        </p>
        <h1>
          SHAWARMA
          <br />
          <span>
            PATROL<span className="title-dot">.</span>
          </span>
        </h1>
        <h2>
          {t("hero.line1")}
          <br />
          <span>{t("hero.line2")}</span>
        </h2>
        <p className="hero-description">{t("hero.description")}</p>
        <div className="hero-buttons">
          <a className="button" href="#join">
            {t("nav.join")}
            <ArrowUpRight size={19} />
          </a>
          <a className="button ghost" href="#journey">
            {t("hero.story")}
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
      <div className="hero-bottom container">
        <a href="#about">
          <ArrowDown size={16} />
          {t("hero.scroll")}
        </a>
        <span>
          {t("hero.badge")}
          <span className="tiny-cross">✦</span>
        </span>
      </div>
    </section>
  );
}
function About({ t }: { t: Translate }) {
  return (
    <section id="about" className="section container">
      <Reveal>
        <p className="eyebrow">{t("about.eyebrow")}</p>
        <div className="section-intro">
          <h2>
            {t("about.title")}
            <br />
            <span className="muted">{t("about.accent")}</span>
          </h2>
          <p>{t("about.description")}</p>
        </div>
        <div className="about-grid">
          {[
            { id: "combat", Icon: Swords },
            { id: "people", Icon: Users },
            { id: "build", Icon: Code2 },
          ].map(({ id, Icon }, i) => (
            <article key={id} className="about-card">
              <span className="card-number">0{i + 1}</span>
              <Icon className="accent-icon" size={27} />
              <h3>{t(`about.cards.${id}`)}</h3>
              <p>{t(`about.cards.${id}Text`)}</p>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
function Journey({ t }: { t: Translate }) {
  return (
    <section id="journey" className="section journey-section">
      <div className="container">
        <Reveal>
          <p className="eyebrow">{t("journey.eyebrow")}</p>
          <div className="section-intro">
            <h2>{t("journey.title")}</h2>
            <p>{t("journey.description")}</p>
          </div>
        </Reveal>
        <div className="timeline">
          {games.map((game, i) => (
            <Reveal
              key={game.id}
              className={`journey-row ${game.isCurrent ? "is-current" : ""} ${i === 0 ? "is-origin" : ""}`}
            >
              <div className="journey-index">
                <span>0{i + 1}</span>
                <div className="timeline-node" />
              </div>
              <article
                className="journey-entry"
                style={{ "--game-accent": game.accent } as React.CSSProperties}
              >
                <div className="journey-heading">
                  <h3>{game.name}</h3>
                  <span className="status">
                    {game.isCurrent && <span className="live-dot" />}
                    {t(`journey.${game.status}`)}
                  </span>
                </div>
                <p>{t(`journey.games.${game.id}`)}</p>
                {game.externalUrl && (
                  <a
                    className="text-link"
                    href={game.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {game.name}
                    <ArrowUpRight size={15} />
                  </a>
                )}
                {game.isCurrent && (
                  <a
                    className="chapter-link"
                    href="#current"
                    aria-label={t("current.eyebrow")}
                  >
                    <ArrowDown size={20} />
                  </a>
                )}
              </article>
            </Reveal>
          ))}
          <div className="journey-row unknown">
            <div className="journey-index">
              <span>06</span>
              <div className="timeline-node" />
            </div>
            <article className="journey-entry">
              <p className="unknown-title">
                {t("journey.next")}
                <span className="scan-cursor" aria-hidden="true" />
              </p>
              <p>{t("journey.nextText")}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
function CurrentGame({ t }: { t: Translate }) {
  return (
    <section id="current" className="section container">
      <Reveal className="current-panel">
        <div className="current-art" aria-hidden="true">
          <Shield strokeWidth={0.65} />
          <span className="current-orbit" />
        </div>
        <div className="current-copy">
          <p className="eyebrow">{t("current.eyebrow")}</p>
          <p className="faction">
            <Shield size={14} />
            {t("current.faction")}
          </p>
          <h2>
            {t("current.title")}
            <br />
            <span className="cyan">{t("current.accent")}</span>
          </h2>
          <h3>{currentGame.name}</h3>
          <p>{t("current.description")}</p>
          <div className="tags">
            {(t.raw("current.tags") as string[]).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <a className="button cyan-button" href="#join">
            {t("current.cta")}
            <ArrowUpRight size={18} />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
function ProjectGrid({ t }: { t: Translate }) {
  return (
    <section id="projects" className="section container">
      <Reveal>
        <p className="eyebrow">{t("projects.eyebrow")}</p>
        <div className="section-intro">
          <h2>
            {t("projects.title")}
            <br />
            <span className="muted">{t("projects.accent")}</span>
          </h2>
          <p>{t("projects.description")}</p>
        </div>
        <div className="project-grid">
          {projects.map((project, i) => {
            const Icon = projectIcons[project.icon];
            return (
              <article className={`project-card project-${i}`} key={project.id}>
                <div className="project-top">
                  <div className="project-symbol">
                    <Icon size={32} strokeWidth={1.4} />
                  </div>
                  <span className="card-number">SP / 0{i + 1}</span>
                </div>
                <span className="project-status">
                  <span className="live-dot" />
                  {t(`projects.${project.status}`)}
                </span>
                <h3>{project.name}</h3>
                <p>{t(`projects.${project.id}`)}</p>
                <div className="tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>
                      {t.has(`projects.tags.${tag}`)
                        ? t(`projects.tags.${tag}`)
                        : tag}
                    </span>
                  ))}
                </div>
                {project.url && (
                  <a
                    className="text-link"
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("projects.visit")}
                    <ArrowUpRight size={16} />
                  </a>
                )}
                {project.repositoryUrl && (
                  <a
                    className="text-link"
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("projects.repository")}
                    <ArrowUpRight size={16} />
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
function MediaLinks({ t }: { t: Translate }) {
  return (
    <section id="media" className="section container">
      <Reveal>
        <p className="eyebrow">{t("media.eyebrow")}</p>
        <div className="section-intro">
          <h2>{t("media.title")}</h2>
          <p>{t("media.description")}</p>
        </div>
        <div className="media-grid">
          {socials.map((s) => {
            const Icon = socialIcons[s.id] || Radio;
            const content = (
              <>
                <Icon size={26} strokeWidth={1.6} />
                <div>
                  <h3>{s.name}</h3>
                  <p>{s.description || t(`media.${s.id}`)}</p>
                  {s.handle && <p>{s.handle}</p>}
                  <span className="media-status">
                    {!s.url && t("media.pending")}
                  </span>
                </div>
                {s.url && <ArrowUpRight className="media-arrow" size={20} />}
              </>
            );
            return s.url ? (
              <a
                key={s.id}
                className="media-card"
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            ) : (
              <div key={s.id} className="media-card unavailable">
                {content}
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
function JoinCTA({ t }: { t: Translate }) {
  const discord = socials.find((s) => s.id === "discord");
  return (
    <section id="join" className="join-section">
      <div className="join-glow" aria-hidden="true" />
      <Reveal className="container join-content">
        <p className="eyebrow">
          <span className="live-dot" />
          {t("join.eyebrow")}
        </p>
        <h2>
          {t("join.title")}
          <br />
          <span>{t("join.accent")}</span>
        </h2>
        <p>{t("join.description")}</p>
        {discord?.url ? (
          <a
            className="button"
            href={discord.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={20} />
            {t("join.cta")}
            <ArrowUpRight size={19} />
          </a>
        ) : (
          <>
            <button className="button" disabled>
              <MessageCircle size={20} />
              {t("join.cta")}
            </button>
            <p className="join-pending">{t("join.pending")}</p>
          </>
        )}
        <div className="join-socials">
          {socials
            .filter((s) => s.url && s.id !== "discord")
            .map((s) => (
              <a
                key={s.id}
                href={s.url!}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.name}
                <ArrowUpRight size={14} />
              </a>
            ))}
        </div>
      </Reveal>
    </section>
  );
}
function Footer({ t }: { t: Translate }) {
  return (
    <footer className="container footer">
      <div>
        <a className="footer-brand" href="#home">
          SHAWARMA PATROL<span className="brand-dot">.</span>
        </a>
        <p>{t("footer.tagline")}</p>
      </div>
      <nav aria-label={t("nav.menu")}>
        {["about", "journey", "projects", "media"].map((id) => (
          <a key={id} href={`#${id}`}>
            {t(`nav.${id}`)}
          </a>
        ))}
      </nav>
      <LanguageSwitcher />
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} SHAWARMA PATROL</span>
        <span>{t("footer.rights")}</span>
      </div>
    </footer>
  );
}
export async function Landing() {
  const t = await getTranslations();
  return (
    <>
      <Navigation />
      <a className="skip-link" href="#main">
        {t("nav.skip")}
      </a>
      <main id="main">
        <Hero t={t} />
        <About t={t} />
        <Journey t={t} />
        <CurrentGame t={t} />
        <ProjectGrid t={t} />
        <MediaLinks t={t} />
        <JoinCTA t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
