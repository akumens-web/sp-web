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

## Ordinary hosting (no Docker)

### Static / shared hosting: FTP, cPanel, Apache or nginx

No Node.js process is needed on the hosting server. Build on your computer or through GitHub Actions, then upload the generated files:

```sh
npm ci
# Linux/macOS; on Windows PowerShell use $env:NEXT_PUBLIC_SITE_URL="https://your-domain.example"
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build:static
```

Upload the **contents of `out/`**, including `_next/`, `brand/`, language folders, `index.html`, `404.html`, `robots.txt`, `sitemap.xml` and `.htaccess`, into the domain document root (usually `public_html/` or `www/`). Do not upload source files, `node_modules`, `.static-build`, or the `out` folder itself. Deploy at the domain root; deployment under a subfolder is not currently supported. Replace the old generated assets together to avoid mixing releases.

Apache receives a small `.htaccess` with directory indexes and a real 404 page. If your host forbids `.htaccess`, remove it and configure those settings in its panel. For static nginx:

```nginx
root /var/www/shawarma-patrol;
index index.html;
location / {
    try_files $uri $uri/ =404;
}
error_page 404 /404.html;
```

Do not use an SPA fallback to `index.html`; unknown URLs should return 404. The root page detects saved language/browser preferences using JavaScript, then opens `/uk/`, `/ru/` or `/en/`. Without JavaScript it offers language links. Each locale page is complete pre-rendered HTML with localized SEO. Server-side Accept-Language detection remains available in Node.js/Docker deployments. Static hosting has no server middleware or runtime environment variables: rebuild to change the public origin or content.

**Build without a local toolchain:** on GitHub open **Actions → Build static hosting package → Run workflow**, enter your real domain (with or without `https://`), and wait for success. A bare domain is normalized to HTTPS; paths, credentials and query strings are rejected. Download the `shawarma-patrol-static` artifact from that run, unzip it and upload its contents to `public_html/`.

For local static verification run `python3 -m http.server 3002 --directory out` and, in another terminal, `SMOKE_BASE_URL=http://127.0.0.1:3002 CHROMIUM_PATH=/usr/bin/chromium npm run test:smoke`. Python is only a local test server, not a production dependency.

### Hosting with Node.js

Use Node.js 24, upload/clone the repository, set the real public origin before the build, then:

```sh
npm ci
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
PORT=3000 npm start
```

The start helper prepares standalone assets and starts the Node.js server without Docker. `PORT` is optional and defaults to 3000; use the port assigned by your hosting provider. Set the working directory to the repository root and use `npm start` as the startup command. The provider must support a long-running Node.js process; use its process manager/automatic restart option. Forward the domain to that process using the provider panel or the nginx example below. PHP-only hosting should use the static package instead.

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
