import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { makeServer } from './serve.mjs';
import { administrativeContact } from './editorial.mjs';

execFileSync(process.execPath, ['scripts/build.mjs', '--production']);
const productionRoot = 'dist-production';
const inventory = JSON.parse(await readFile('data/live-inventory.json', 'utf8'));
const redirects = JSON.parse(await readFile(`${productionRoot}/redirects.json`, 'utf8'));
const sourceSitemap = inventory.filter(page => page.inSitemap);
const artifact = path => readFile(`${productionRoot}${path}${path.endsWith('/') ? 'index.html' : ''}`, 'utf8');
const robotsFor = html => html.match(/<meta\s+name="robots"\s+content="([^"]+)"/i)?.[1];
const canonicalFor = html => html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
function headerRules(text) {
 const rules = new Map();
 let current;
 for (const line of text.split('\n')) {
  if (!line.trim() || line.trim().startsWith('#')) continue;
  if (!/^\s/.test(line)) { current = line.trim(); rules.set(current, {}); continue; }
  const colon = line.indexOf(':');
  assert.ok(current && colon > 0, `Malformed static-host header rule: ${line}`);
  rules.get(current)[line.slice(0,colon).trim().toLowerCase()] = line.slice(colon + 1).trim();
 }
 return rules;
}

test('production keeps all 102 original indexed URLs crawlable with original canonicals', async () => {
 assert.equal(sourceSitemap.length, 102);
 const sitemap = await readFile(`${productionRoot}/sitemap.xml`, 'utf8');
 const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
 assert.equal(new Set(locations).size, locations.length);
 for (const page of sourceSitemap) {
  assert.ok(locations.includes(page.canonical), `Production sitemap lost ${page.path}`);
  const html = await artifact(page.path);
  assert.equal(robotsFor(html), 'index,follow', `${page.path} must be indexable`);
  assert.equal(canonicalFor(html), page.canonical);
  assert.doesNotMatch(html, /Development preview|Aperçu de développement/i, `${page.path} still has a preview label`);
  for (const alternate of page.alternates.filter(item => ['en-CA','fr-CA'].includes(item.hreflang))) {
   assert.ok(html.includes(`hreflang="${alternate.hreflang}" href="${alternate.href}"`), `Lost localized URL on ${page.path}`);
  }
 }
 const robots = await readFile(`${productionRoot}/robots.txt`, 'utf8');
 assert.match(robots, /User-agent:\s*\*/i);
 assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/im);
 assert.match(robots, /^Sitemap:\s*https:\/\/abortionclinic\.ca\/sitemap\.xml\s*$/im);
});

test('production preserves intentional noindex pages and static-host security without a global indexing block', async () => {
 const rules = headerRules(await readFile(`${productionRoot}/_headers`, 'utf8'));
 const global = rules.get('/*');
 assert.ok(global, 'Static-host security rules need a global block');
 assert.equal(global['referrer-policy'], 'no-referrer');
 assert.equal(global['x-content-type-options'], 'nosniff');
 assert.ok(global['content-security-policy']?.includes("default-src 'self'"));
 assert.doesNotMatch(global['x-robots-tag'] || '', /noindex|nofollow/i);
 for (const page of inventory.filter(page => !page.inSitemap && !redirects[page.path])) {
  assert.equal(robotsFor(await artifact(page.path)), 'noindex,follow', `Original nonindexed page changed: ${page.path}`);
  const rule = rules.get(page.path) || rules.get(page.path + '*');
  assert.match(rule?.['x-robots-tag'] || '', /noindex/i, `Missing selective noindex header for ${page.path}`);
 }
 for (const path of ['/404/','/fr/404/']) assert.match(robotsFor(await artifact(path)), /noindex/);
 for (const page of sourceSitemap) assert.doesNotMatch(rules.get(page.path)?.['x-robots-tag'] || '', /noindex/i);
});

test('production redirects and assets are complete for a static-host upload', async () => {
 assert.equal(Object.keys(redirects).length, 52);
 const hostRedirects = await readFile(`${productionRoot}/_redirects`, 'utf8');
 for (const [from,to] of Object.entries(redirects)) {
  assert.ok(hostRedirects.split('\n').includes(`${from} ${to} 301`), `Missing host redirect ${from}`);
  assert.ok((await artifact(to)).includes('<h1'), `Missing redirect target ${to}`);
 }
 for (const path of ['/images/healthcare-welcome-640.webp','/images/healthcare-welcome-1280.webp','/brand/abortionclinic-logo.svg','/favicon.ico','/app.js','/routes.mjs','/directory.mjs','/providers.json','/live-theme.css','/style.css']) {
  assert.ok((await readFile(`${productionRoot}${path}`)).length > 0, `Missing production asset ${path}`);
 }
 assert.equal(administrativeContact.phone, '+18336969996');
 assert.equal(administrativeContact.source, 'https://abortionclinic.ca/contact/');
 assert.equal(administrativeContact.recoveredAt, inventory.find(page => page.path === '/contact/').sourceRetrievedDate);
 assert.equal(administrativeContact.reviewed, undefined, 'Recovery must not invent an independent review date');
 for (const [path, restriction] of [['/contact/', /Administrative website inquiries only\. This is not a clinical, appointment or emergency line\./], ['/fr/contact/', /Demandes administratives sur le site uniquement\. Ce n’est pas une ligne clinique, de rendez-vous ou d’urgence\./]]) {
  const html = await artifact(path);
  assert.match(html, /href="tel:\+18336969996"/);
  assert.match(html, restriction);
  assert.doesNotMatch(html, /<form\b/i, 'Contact must not collect patient inquiries');
  assert.match(html, /href="https:\/\/abortionclinic\.ca\/contact\/" rel="noreferrer"/);
  assert.doesNotMatch(html, /newly verified|verified today|vérifié aujourd’hui/i);
 }
});

test('production HTTP smoke serves indexed pages without a global noindex response header', async () => {
 const server = makeServer({ production: true });
 await new Promise((resolve,reject) => { server.once('error',reject); server.listen(0,'127.0.0.1',resolve); });
 try {
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const path of ['/','/fr/','/medication-abortion/','/fr/avortement-par-medicaments/']) {
   const response = await fetch(base + path);
   assert.equal(response.status,200,path);
   assert.doesNotMatch(response.headers.get('x-robots-tag') || '', /noindex|nofollow/i,path);
   assert.equal(robotsFor(await response.text()),'index,follow');
  }
  for (const path of ['/find-care/','/fr/trouver-des-soins/']) {
   const response = await fetch(base + path);
   assert.equal(response.status,200,path);
   assert.match(response.headers.get('x-robots-tag') || '',/noindex/i);
   assert.equal(robotsFor(await response.text()),'noindex,follow');
  }
  for (const [from,to] of Object.entries(redirects)) {
   const response = await fetch(base + from,{redirect:'manual'});
   assert.equal(response.status,301,from);
   assert.equal(response.headers.get('location'),to);
  }
  const missing = await fetch(base + '/missing-production-page/');
  assert.equal(missing.status,404);
  assert.match(missing.headers.get('x-robots-tag') || '',/noindex/i);
 } finally { await new Promise(resolve => server.close(resolve)); }
});
