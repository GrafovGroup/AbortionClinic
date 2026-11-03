import { chromium } from 'playwright-core';
import { createRequire } from 'node:module';
import { readFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { makeServer } from './serve.mjs';
import { pathFor, topicPath } from '../public/routes.mjs';

const require = createRequire(import.meta.url);
const axeSource = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
const production = process.env.SITE_MODE === 'production';
const artifacts = process.env.BROWSER_ARTIFACTS || `/tmp/abortionclinic-browser${production ? '-production' : ''}`;
await mkdir(artifacts, { recursive: true });
const server = makeServer({ production });
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
let checks = 0;
const pass = name => { checks++; console.log(`PASS ${name}`); };
try {
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  for (const [device, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 360, height: 800 } })) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const rootResponse = await page.goto(base + '/');
    assert.equal(rootResponse.status(), 200);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    pass(`${device}: root homepage`);
    for (const lang of ['en', 'fr']) {
      await page.goto(base + pathFor(lang, 'home'));
      await page.waitForLoadState('networkidle');
      assert.equal(await page.locator('html').getAttribute('lang'), `${lang}-CA`);
      assert.equal(await page.locator('h1').count(), 1);
      assert.ok((await page.locator('h1').innerText()).length > 20);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, `${device}/${lang} homepage overflows horizontally`);
      const internalPaths = await page.locator('a[href^="/"]').evaluateAll(links => [...new Set(links.map(a => a.pathname))]);
      for (const path of internalPaths) {
        assert.equal((await context.request.get(base + path)).status(), 200, `Broken homepage link ${path}`);
      }
      pass(`${device}/${lang}: homepage, layout, internal links`);

      // The contextual language switch must stay on the same logical page.
      const switcher = page.locator('a[hreflang]').first();
      if (device === 'mobile' && await page.locator('#menu-toggle').isVisible()) await page.locator('#menu-toggle').click();
      await switcher.click();
      await page.waitForURL(base + pathFor(lang === 'en' ? 'fr' : 'en', 'home'));
      await page.goto(base + pathFor(lang, 'home'));
      pass(`${device}/${lang}: language switch`);

      if (device === 'mobile') {
        assert.equal(await page.locator('#main-nav').isVisible(), true);
        const navLinks = await page.locator('#main-nav a').all();
        for (const item of navLinks) assert.equal(await item.isVisible(), true);
        pass(`${device}/${lang}: visible wrapped mobile navigation`);
      }

      if (await page.locator('details').count() === 0) await page.goto(base + pathFor(lang, 'faq'));
      const faq = page.locator('details').first();
      if (await faq.count()) {
        await faq.locator('summary').click();
        assert.equal(await faq.evaluate(el => el.open), true);
        await faq.locator('summary').click();
        assert.equal(await faq.evaluate(el => el.open), false);
      } else {
        assert.ok(await page.locator('main h2').count() >= 2, 'FAQ page needs accessible questions');
        assert.ok((await page.locator('main').innerText()).length > 200, 'FAQ answers must be present');
      }
      pass(`${device}/${lang}: FAQ questions and answers`);
      await page.goto(base + pathFor(lang, 'home'));

      await page.evaluate(axeSource);
      const audit = await page.evaluate(async () => {
        const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } });
        return result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, failureSummary: n.failureSummary })) }));
      });
      assert.deepEqual(audit, [], `${device}/${lang}: accessibility violations ${JSON.stringify(audit)}`);
      for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 600) {
        await page.evaluate(y => window.scrollTo({top: y, behavior: 'instant'}), y);
        await page.waitForTimeout(80);
      }
      await page.waitForLoadState('networkidle');
      const brokenImages = await page.locator('img').evaluateAll(images => images.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.getAttribute('src')));
      assert.deepEqual(brokenImages, [], `${device}/${lang}: homepage images failed to load`);
      await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({top: 0, behavior: 'instant'}); });
      await page.screenshot({ path: `${artifacts}/${device}-${lang}-home.png`, fullPage: true });
      pass(`${device}/${lang}: automated WCAG checks`);

      const homeRequests = [];
      const recordHomeRequest = request => homeRequests.push(request.url());
      page.on('request', recordHomeRequest);
      await page.locator('#home-search #location').fill('Toronto');
      await page.locator('#home-search').evaluate(form => form.requestSubmit());
      await page.locator('#home-results-section .provider-card').first().waitFor();
      assert.equal(await page.locator('#home-results-section').isVisible(), true);
      for (const location of await page.locator('#home-results-section .provider-card .eyebrow').allTextContents()) assert.match(location, /Toronto/);
      assert.equal(page.url(), base + pathFor(lang, 'home'));
      assert.ok(homeRequests.every(url => url === base + '/providers.json'), 'Home search must only load the unfiltered public dataset');
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
      page.off('request', recordHomeRequest);
      pass(`${device}/${lang}: homepage search returns actual geographic matches privately`);

      const detailsLink = page.locator('#home-results-section .provider-card a[href^="/"]').first();
      const detailPath = await detailsLink.getAttribute('href');
      await detailsLink.click();
      await page.waitForURL(base + detailPath);
      assert.ok((await page.locator('main h1').innerText()).length > 3);
      assert.equal(new URL(page.url()).search, '');
      assert.ok(await page.locator('main a[href^="https://"]').count() > 0);
      pass(`${device}/${lang}: recovered provider details open with public source links`);

      const directoryPath = pathFor(lang, 'clinics');
      await page.goto(base + directoryPath);
      await page.waitForLoadState('networkidle');
      const requests = [];
      const onRequest = request => requests.push(request.url());
      page.on('request', onRequest);
      await page.locator('#location').fill('Toronto');
      await page.locator('#region').selectOption('ON');
      await page.locator('#directory-search').evaluate(form => form.requestSubmit());
      await page.waitForTimeout(150);
      assert.equal(new URL(page.url()).search, '', 'Directory search must not enter the URL');
      assert.equal(new URL(page.url()).hash, '', 'Directory search must not enter the URL fragment');
      assert.deepEqual(requests, [], 'Directory search should remain in browser memory');
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0, 'Search should not store sensitive journeys');
      assert.ok((await page.locator('#directory-status').innerText()).length > 0);
      await page.locator('#clear-filters').click();
      assert.equal(await page.locator('#location').inputValue(), '');
      assert.equal(await page.locator('#region').inputValue(), '');
      page.off('request', onRequest);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, `${device}/${lang} directory overflows horizontally`);
      pass(`${device}/${lang}: search privacy, filters, reset, layout`);

      await page.evaluate(axeSource);
      const directoryAudit = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })));
      assert.deepEqual(directoryAudit, [], `${device}/${lang}: directory accessibility violations ${JSON.stringify(directoryAudit)}`);
      await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({top: 0, behavior: 'instant'}); });
      await page.screenshot({ path: `${artifacts}/${device}-${lang}-directory.png`, fullPage: true });
      pass(`${device}/${lang}: directory automated WCAG checks`);

      if (device === 'desktop' && lang === 'en') {
        // Synthetic records exist only in intercepted test responses, never the
        // public dataset or generated site. They exercise nonempty search paths.
        const fixtures = [
          { id: 'test-toronto', name: { en: 'TEST ONLY Toronto', fr: 'TEST SEULEMENT Toronto' }, address: { en: 'Test address', fr: 'Adresse de test' }, city: 'Toronto', province: 'ON', website: 'https://example.invalid/toronto', source: 'https://example.invalid/source', reviewed: '2026-01-01' },
          { id: 'test-montreal', name: { en: 'TEST ONLY Montréal', fr: 'TEST SEULEMENT Montréal' }, address: { en: 'Test address', fr: 'Adresse de test' }, city: 'Montréal', province: 'QC', website: 'https://example.invalid/montreal', source: 'https://example.invalid/source', reviewed: '2026-01-01' },
        ];
        const serveFixtures = route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fixtures) });
        await page.route('**/providers.json', serveFixtures);
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.locator('.provider-card').first().waitFor();
        assert.equal(await page.locator('.provider-card').count(), 2);
        await page.locator('#location').fill('montreal quebec');
        await page.locator('#directory-search').evaluate(form => form.requestSubmit());
        assert.equal(await page.locator('.provider-card').count(), 1);
        assert.match(await page.locator('.provider-card h3').innerText(), /Montréal/);
        await page.locator('#region').selectOption('ON');
        assert.equal(await page.locator('.provider-card').count(), 0);
        await page.locator('#clear-filters').click();
        assert.equal(await page.locator('.provider-card').count(), 2);
        await page.locator('#region').selectOption('ON');
        assert.equal(await page.locator('.provider-card').count(), 1);
        assert.match(await page.locator('.provider-card h3').innerText(), /Toronto/);
        await page.unroute('**/providers.json', serveFixtures);
        pass('desktop/en: synthetic search matches, accent normalization, combined filters, reset');

        let requestsForData = 0;
        const failThenRetry = route => {
          requestsForData++;
          return route.fulfill({ status: requestsForData === 1 ? 503 : 200, contentType: 'application/json', body: requestsForData === 1 ? '{}' : '[]' });
        };
        await page.route('**/providers.json', failThenRetry);
        await page.reload();
        await page.locator('.error-state button').waitFor();
        await page.locator('.error-state button').click();
        await page.locator('.empty-state').waitFor();
        assert.equal(requestsForData, 2);
        assert.equal(await page.locator('.error-state').count(), 0);
        await page.unroute('**/providers.json', failThenRetry);
        pass('desktop/en: directory load failure and successful retry');
      }

      const extraPages = [pathFor(lang, 'resources'), topicPath(lang, 'medication'), pathFor(lang, 'privacy')];
      for (const path of extraPages) {
        const response = await page.goto(base + path);
        assert.equal(response.status(), 200, `Missing page ${path}`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, `${device}: ${path} overflows horizontally`);
        await page.evaluate(axeSource);
        const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })));
        assert.deepEqual(violations, [], `${device}: ${path} accessibility violations ${JSON.stringify(violations)}`);
      }
      pass(`${device}/${lang}: resource, topic, privacy pages and automated WCAG checks`);

      // Test destination without sending the user's session to an external site.
      await page.route('https://www.google.com/**', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Neutral destination</title>' }));
      await page.locator('#quick-exit').click();
      await page.waitForURL('https://www.google.com/**');
      assert.equal(await page.title(), 'Neutral destination');
      pass(`${device}/${lang}: quick exit`);
    }
    assert.deepEqual(errors, [], `${device} browser errors: ${errors.join('; ')}`);
    await context.close();
  }
  console.log(`${checks} browser checks passed. Screenshots: ${artifacts}`);
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
