import { chromium } from "playwright";
import assert from "node:assert/strict";
const base = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3000";
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH,
    headless: true,
    args: ["--no-sandbox"],
  });
  let checks = 0;
  const errors = [];
  for (const locale of ["uk", "ru", "en"])
    for (const width of [360, 390, 768, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      page.on("pageerror", (e) => errors.push(e.message));
      const response = await page.goto(`${base}/${locale}`);
      assert.equal(response.status(), 200);
      assert.equal(await page.locator("html").getAttribute("lang"), locale);
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(await page.locator(".journey-entry").count(), 6);
      assert.equal(await page.locator('a[href="#"]').count(), 0);
      assert.equal(await page.locator("button:disabled").count(), 1);
      assert.equal(
        await page.locator('link[rel="alternate"][hreflang]').count(),
        4,
      );
      for (const id of [
        "home",
        "about",
        "journey",
        "current",
        "projects",
        "media",
        "join",
      ]) {
        await page.locator("#" + id).scrollIntoViewIfNeeded();
        assert(await page.locator("#" + id).isVisible());
      }
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `overflow ${locale} ${width}`,
      );
      if (width < 850) {
        await page.evaluate(() => scrollTo(0, 0));
        const toggle = page.locator("#menu-toggle");
        await toggle.click();
        assert.equal(await toggle.getAttribute("aria-expanded"), "true");
        await page.keyboard.press("Escape");
        assert.equal(await toggle.getAttribute("aria-expanded"), "false");
        await toggle.click();
        await page.locator('#mobile-menu a[href="#projects"]').click();
        assert.equal(await page.locator("#mobile-menu").count(), 0);
      }
      await page.evaluate(() => scrollTo(0, 0));
      await context.close();
      checks++;
    }
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${base}/uk`);
  await page.locator('header .languages a[lang="ru"]').click();
  await page.waitForURL("**/ru");
  await page.goto(`${base}/`);
  assert(page.url().endsWith("/ru"));
  await context.close();
  for (const [header, expected] of [
    ["uk-UA,uk;q=0.9", "uk"],
    ["ru-RU", "ru"],
    ["en-US", "en"],
    ["fr-FR", "en"],
  ]) {
    const c = await browser.newContext({
      extraHTTPHeaders: { "Accept-Language": header },
    });
    const p = await c.newPage();
    await p.goto(`${base}/`);
    assert(p.url().endsWith("/" + expected));
    await c.close();
  }
  const c = await browser.newContext();
  const p = await c.newPage();
  assert.equal((await p.goto(`${base}/de`)).status(), 404);
  assert.equal(
    (await p.goto(`${base}/brand/social-preview.png`)).status(),
    200,
  );
  assert.equal((await p.goto(`${base}/sitemap.xml`)).status(), 200);
  await c.close();
  assert.deepEqual(errors, []);
  await browser.close();
  console.log(
    `PASS: ${checks} locale/viewport layouts; menu, persistence, detection, metadata, missing links, 404, assets, sitemap; no browser errors.`,
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
