# Shawarma Patrol

A dark, multilingual community landing page. Next.js App Router, TypeScript, Tailwind CSS, next-intl, Framer Motion and Lucide. Server-rendered content with small interactive navigation and reveal components. No backend, database or credentials required.

## Run

Use Node.js 24 LTS and npm (lockfile committed with the project).

```sh
npm ci
npm run dev
# Production verification
npm run lint
npm run typecheck
npm run build
npm start
```

The internal port is **3000**. Open `/uk`, `/ru` or `/en`. `/` respects a saved language cookie, then supported browser preferences, then English. The shared default locale is Ukrainian in `src/i18n/routing.ts`. The selector saves an explicit preference for one year. Unsupported locale routes return 404.

No environment variables are required locally. For deployment set **NEXT_PUBLIC_SITE_URL** to your actual HTTPS origin **before building**; it drives canonical, OpenGraph, sitemap and alternate-language URLs. The localhost fallback is for development only. Do not launch publicly with that fallback.

## Edit content

- `src/config/site.ts`: brand name and deployment origin.
- `src/data/games.ts`: language-independent journey entries; optional period, artwork, logo and external URL. Add an entry, then its `journey.games.<id>` description in all dictionaries. Exactly one entry must have `isCurrent: true`; the featured section reads its name. Update `current` translations for the new game, faction and activities too.
- `src/data/projects.ts`: project name, status, icon, tags, optional URL/repository URL. Add `projects.<id>` in every dictionary. Missing URLs produce no button. Add a new icon mapping in `landing.tsx` if needed.
- `src/data/socials.ts`: **all community URLs live here**. Replace `null` with verified HTTPS destinations. No Discord, Telegram, YouTube or Twitch URLs were provided; cards explicitly show that links are pending, and the Discord CTA is disabled until configured. Add a platform with an icon mapping and `media.<id>` translation.
- `messages/{uk,ru,en}.json`: all copy, labels, statuses, accessibility labels and localized metadata. Keep keys aligned; brand and game names remain in shared data. Technical platform and game names retain their established names; other tags are translated.
- `src/components/landing.tsx`: reusable section composition; `navigation.tsx`: responsive menu and locale selector; `reveal.tsx`: reduced-motion-aware animation.
- `src/app/globals.css`: responsive design tokens, decorative hero and shared styles.

To add a language, add a dictionary and locale in `routing.ts`, then update the selector, proxy supported-path expression and metadata locale mapping. Existing page components are shared. Test long strings at narrow widths.

## Branding

Original geometric placeholder assets are in `public/brand/`: `logo.svg`, `wordmark.svg`, `favicon.svg`, and `social-preview.png` (1200 × 630). Replace them with community artwork. The current navigation uses a typographic mark; to adopt a real logo, replace that mark with a local image in `navigation.tsx`. Game/project artwork is optional; the site uses CSS and icons and does not depend on copyrighted artwork. No external image or font requests.

## Docker / VPS

```sh
NEXT_PUBLIC_SITE_URL=https://your-domain.example docker compose up -d --build
# Or without Compose:
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://your-domain.example -t shawarma-patrol .
docker run -d --name shawarma-patrol --restart unless-stopped -p 127.0.0.1:3000:3000 shawarma-patrol
```

The multi-stage image retains Next.js standalone output, runs as a non-root user and checks `/uk` for health. Compose binds to loopback; an external nginx handles TLS and the public domain. Example inside your existing HTTPS nginx server block:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

If nginx runs in another container, use a shared Docker network and `http://web:3000` instead. Configure certificates and the server name in your existing nginx deployment. Rebuild after changing the public origin, translations or content. Publish all three locale URLs; sitemap and robots are generated automatically.

## Release checklist

Set the actual origin and verified community links; replace branding as desired. Run lint, typecheck, build, and verify navigation, locale persistence, reduced motion and mobile widths. Missing optional links are handled gracefully but a real Discord invitation is needed for recruitment. No member counts, achievements or server statistics are fabricated.

SWC is pinned to a compatible release through `package.json` overrides because the latest compressed native carrier rejects this cloud filesystem’s parent ownership. TLS, npm integrity and native checks are retained. Review this pin when updating next-intl.

Browser smoke tests are included as a development-only dependency. With the server running, use `npx playwright install chromium` followed by `npm run test:smoke`; in this cloud machine use `CHROMIUM_PATH=/usr/bin/chromium npm run test:smoke`. Set `SMOKE_BASE_URL` for another local test port. The checks cover all locales at four widths, menus, locale detection/persistence, metadata, missing links and assets.

For builds behind a trusted HTTPS proxy, Docker supports an optional BuildKit `build_ca` secret (`--secret id=build_ca,src=/path/to/trusted-ca.pem`) and standard HTTP_PROXY/HTTPS_PROXY build arguments. The CA is used only for npm installation and is not retained in the image; verification stays enabled. Ordinary VPS builds need neither option.

Validation performed in the onboarding machine: production build, lint, typecheck and 12 browser locale/viewport combinations; Docker image build and container smoke tests; healthy non-root runtime. Production dependency audit is clean. The full development audit reports an upstream `braces` denial-of-service advisory through Next.js ESLint tooling; no compatible patch is currently offered by npm audit. This tooling is not included in the runtime image. Do not downgrade the Next.js lint configuration via `audit fix --force`; review upstream updates instead.
