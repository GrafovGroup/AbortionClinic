import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { makeServer } from './serve.mjs';
import { pages, pathFor } from './content.mjs';

execFileSync(process.execPath, ['scripts/build.mjs']);
test('all bilingual routes, contextual language links and internal links resolve', async () => {
  for (const lang of ['en','fr']) for (const page of pages) {
    const path = pathFor(lang,page);
    const html = await readFile(`dist${path}index.html`, 'utf8');
    assert.match(html, new RegExp(`lang="${lang}-CA"`));
    assert.ok(html.includes(`href="${pathFor(lang === 'en' ? 'fr' : 'en',page)}"`));
    assert.match(html, /noindex,nofollow/);
    for (const [,href] of html.matchAll(/href="(\/[^"#]*)"/g)) {
      await readFile(`dist${href}${href.endsWith('/') ? 'index.html' : ''}`);
    }
    assert.doesNotMatch(html, /get connected|we connect you|we refer you/i);
    assert.doesNotMatch(html, /MedicalClinic|type="email"|type="tel"/);
  }
});
test('provider data cannot publish unsourced or undated entries', async () => {
  const records = JSON.parse(await readFile('public/providers.json','utf8'));
  for (const record of records) {
    assert.ok(record.name.en && record.name.fr && record.address.en && record.address.fr);
    assert.equal(new URL(record.website).protocol,'https:');
    assert.equal(new URL(record.source).protocol,'https:');
    assert.match(record.reviewed, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(Number.isFinite(Date.parse(record.reviewed)));
  }
  // Empty data is intentional; this check does not validate any real providers.
  assert.ok(Array.isArray(records));
});
test('HTTP server serves bilingual pages and rejects unknown routes and writes', async () => {
  const server = makeServer();
  await new Promise((resolve, reject) => { server.once('error',reject); server.listen(0,'127.0.0.1',resolve); });
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    for (const route of ['/en/', '/fr/', '/en/clinics/', '/fr/clinics/']) {
      const response = await fetch(base + route);
      assert.equal(response.status,200);
      assert.match(response.headers.get('content-type'), /text\/html/);
      assert.equal(response.headers.get('referrer-policy'),'no-referrer');
      assert.match(await response.text(), /AbortionClinic/);
    }
    const data = await fetch(base + '/providers.json');
    assert.deepEqual(await data.json(), []);
    assert.equal((await fetch(base + '/missing/')).status,404);
    assert.equal((await fetch(base + '/en/', {method:'POST'})).status,405);
    assert.equal((await fetch(base + '/%2e%2e%2fscripts/content.mjs')).status,403);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
