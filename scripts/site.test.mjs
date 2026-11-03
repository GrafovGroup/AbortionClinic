import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { makeServer } from './serve.mjs';
import { validateProviders, filterProviders } from '../public/directory.mjs';
import { pathFor, topicPath } from '../public/routes.mjs';

execFileSync(process.execPath, ['scripts/build.mjs']);
const inventory = JSON.parse(await readFile('data/live-inventory.json', 'utf8'));
const redirects = JSON.parse(await readFile('dist/redirects.json', 'utf8'));
const publicRecords = JSON.parse(await readFile('public/providers.json', 'utf8'));
async function htmlFiles(dir) {
 const entries = await readdir(dir, { withFileTypes: true });
 return (await Promise.all(entries.map(x => x.isDirectory() ? htmlFiles(`${dir}/${x.name}`) : x.name.endsWith('.html') ? [`${dir}/${x.name}`] : []))).flat();
}
function internalFile(href) {
 const path = new URL(href, 'https://abortionclinic.ca').pathname;
 const target = redirects[path] || path;
 return `dist${target}${target.endsWith('/') ? 'index.html' : ''}`;
}
function attribute(html, tag, attr) {
 const found = html.match(tag);
 assert.ok(found, `Missing metadata matching ${tag}`);
 return found[0].match(new RegExp(`${attr}="([^"]+)"`))?.[1];
}

test('generated content has working internal links, assets, bilingual metadata and directory-only positioning', async () => {
 const files = await htmlFiles('dist');
 assert.ok(files.length >= 108, 'Expected preserved production routes and supplemental content');
 for (const file of files) {
  const html = await readFile(file, 'utf8');
  if (/http-equiv="refresh"/i.test(html)) continue;
  assert.match(html, /lang="(?:en|fr)-CA"/);
  assert.match(html, /hreflang="en-CA"/);
  assert.match(html, /hreflang="fr-CA"/);
  assert.match(html, /noindex,nofollow/);
  assert.equal((html.match(/<h1(?:\s[^>]*)?>/g) || []).length, 1, `Expected one h1 in ${file}`);
  for (const [, href] of html.matchAll(/href="(\/[^"#]*)(?:#[^"]*)?"/g)) await readFile(internalFile(href));
  for (const [, src] of html.matchAll(/src="(\/[^"#]*)"/g)) await readFile(internalFile(src));
  assert.doesNotMatch(html, /get connected|we connect you|we refer you|MedicalClinic|type="email"|type="tel"/i, file);
  assert.doesNotMatch(html, /our team[^.!?]{0,160}(?:connect|refer|book)|notre équipe[^.!?]{0,160}(?:joindre|mise en relation)/i, `Referral service claim in ${file}`);
  assert.doesNotMatch(html, /No records have been published yet|No provider listings published yet|Aucune fiche n’a encore été publiée/i, `Stale empty-directory claim in ${file}`);
  assert.match(html.match(/<title>(.*?)<\/title>/s)[1], /AbortionClinic\.ca/, `Brand title damaged in ${file}`);
  const schema = JSON.parse(html.match(/type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(schema['@type'], 'WebSite');
 }
});

test('all 102 original sitemap URLs remain and canonical/hreflang pairs preserve production identities', async () => {
 const sitemap = await readFile('dist/sitemap.xml', 'utf8');
 const locations = [...sitemap.matchAll(/<loc>https:\/\/abortionclinic.ca(.*?)<\/loc>/g)].map(x => x[1]);
 assert.equal(new Set(locations).size, locations.length);
 const original = inventory.filter(p => p.inSitemap);
 assert.equal(original.length, 102);
 for (const page of original) {
  assert.ok(locations.includes(page.path), `Lost production sitemap URL ${page.path}`);
  const html = await readFile(internalFile(page.path), 'utf8');
  const canonical = attribute(html, /<link\b[^>]*rel="canonical"[^>]*>/, 'href');
  assert.equal(canonical, page.canonical, `Canonical changed for ${page.path}`);
  for (const alternate of page.alternates.filter(a => ['en-CA', 'fr-CA'].includes(a.hreflang))) {
   const href = attribute(html, new RegExp(`<link\\b[^>]*hreflang="${alternate.hreflang}"[^>]*>`), 'href');
   assert.equal(href, alternate.href, `Language counterpart changed for ${page.path}`);
  }
 }
 for (const href of locations) await readFile(internalFile(href));
 assert.ok(!locations.some(x => x.includes('/404/')));
});

const fixture = { id:'test-only-record', name:{en:'TEST fixture',fr:'TEST fictif'}, address:{en:'TEST address',fr:'Adresse TEST'}, city:'Montréal', province:'QC', website:'https://example.org', source:'https://example.org/source', reviewed:'2025-01-01', phone:'+1 555 010 0100' };
test('provider validation rejects missing sources, impossible dates, unsafe links and duplicate IDs', () => {
 assert.deepEqual(validateProviders([fixture]), [fixture]);
 assert.doesNotThrow(() => validateProviders([{...fixture, address:{en:null,fr:null}}]));
 for (const change of [{source:''},{website:'javascript:alert(1)'},{source:'https://user:pass@example.org'},{reviewed:'2025-02-30'},{reviewed:'2999-01-01'},{province:'ZZ'},{province:'constructor'},{phone:4165550100},{id:123},{phone:'<script>'},{id:'../escape'},{name:{en:'Missing French'}}]) assert.throws(() => validateProviders([{...fixture,...change}]));
 assert.throws(() => validateProviders([fixture, fixture]));
});

test('geographic search handles accents, region names and combined filters', () => {
 const on = {...fixture,id:'test-ontario',city:'Toronto',province:'ON'};
 const records = [fixture,on];
 assert.deepEqual(filterProviders(records,' Montreal '),[fixture]);
 assert.deepEqual(filterProviders(records,'quebec'),[fixture]);
 assert.deepEqual(filterProviders(records,'Montréal, QC'),[fixture]);
 assert.deepEqual(filterProviders(records,'Toronto Ontario'),[on]);
 assert.deepEqual(filterProviders(records,'','ON'),[on]);
 assert.deepEqual(filterProviders(records,'Toronto','QC'),[]);
 assert.deepEqual(filterProviders(records,'TEST fixture'),[]);
});

test('25 recovered records retain original provenance and review dates without fabricated verification', async () => {
 const recovered = JSON.parse(await readFile('data/recovered-providers.json','utf8'));
 assert.equal(publicRecords.length,25);
 validateProviders(publicRecords);
 for (const record of publicRecords) {
  const original = recovered.find(p => p.id === record.id);
  assert.ok(original, `Record not recovered from source: ${record.id}`);
  assert.deepEqual(record.provenance, original.provenance);
  assert.equal(record.reviewed, original.upstreamReviewDate);
  assert.notEqual(record.providerConfirmed,true);
  assert.deepEqual(record.name, original.name);
  assert.equal(record.website, original.website);
  assert.equal(record.phone, original.phone);
 }
});

test('HTTP preserves production pages and legacy redirects; missing routes, traversal and writes are rejected', async () => {
 const server = makeServer();
 await new Promise((resolve,reject) => { server.once('error',reject); server.listen(0,'127.0.0.1',resolve); });
 try {
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const page of inventory) {
   const response = await fetch(base + page.path, {redirect:'manual'});
   if (redirects[page.path]) {
    assert.equal(response.status,301,page.path);
    assert.equal(response.headers.get('location'),redirects[page.path]);
   } else {
    assert.equal(response.status,200,page.path);
    assert.match(response.headers.get('content-type'),/text\/html/);
    assert.equal(response.headers.get('referrer-policy'),'no-referrer');
    assert.match(await response.text(),/AbortionClinic/);
   }
  }
  for (const [from,to] of Object.entries(redirects)) {
   const response = await fetch(base + from,{redirect:'manual'});
   assert.equal(response.status,301,from);
   assert.equal(response.headers.get('location'),to);
   assert.equal((await fetch(base + to)).status,200,to);
  }
  for (const route of ['/app.js','/ui.mjs','/directory.mjs','/routes.mjs']) assert.match((await fetch(base+route)).headers.get('content-type'),/javascript/);
  for (const [route, mime] of [['/images/healthcare-welcome-640.webp','image/webp'],['/images/healthcare-welcome-1280.webp','image/webp'],['/brand/abortionclinic-logo.svg','image/svg+xml'],['/favicon.ico','image/x-icon']]) {
   const asset = await fetch(base + route);
   assert.equal(asset.status,200,route);
   assert.equal(asset.headers.get('content-type'),mime,route);
   assert.ok((await asset.arrayBuffer()).byteLength > 0);
  }
  const missing = await fetch(base+'/fr/missing/');
  assert.equal(missing.status,404);
  assert.match(await missing.text(),/Cette page est introuvable/);
  assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
  assert.equal((await fetch(base+'/%2e%2e%2fscripts/content.mjs')).status,403);
  assert.equal((await fetch(base+pathFor('fr','clinics'),{method:'HEAD'})).status,200);
  assert.equal((await fetch(base+topicPath('en','medication'))).status,200);
 } finally { await new Promise(resolve => server.close(resolve)); }
});
