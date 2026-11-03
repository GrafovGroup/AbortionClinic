import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { makeServer } from './serve.mjs';
import { validateProviders, filterProviders } from '../public/directory.mjs';

execFileSync(process.execPath, ['scripts/build.mjs']);
async function htmlFiles(dir) {
 const entries=await readdir(dir,{withFileTypes:true});
 const children=await Promise.all(entries.map(x=>x.isDirectory()?htmlFiles(`${dir}/${x.name}`):x.name.endsWith('.html')?[`${dir}/${x.name}`]:[]));
 return children.flat();
}
test('all generated pages have working internal links, localized metadata and safe positioning',async()=>{
 const files=await htmlFiles('dist');
 assert.equal(files.length,62);
 for(const file of files){
  const html=await readFile(file,'utf8');
  assert.match(html, /lang="(?:en|fr)-CA"/);
  assert.match(html, /hreflang="en-CA"/);
  assert.match(html, /hreflang="fr-CA"/);
  assert.match(html, /noindex,nofollow/);
  assert.equal((html.match(/<h1>/g)||[]).length,1);
  for(const [,href] of html.matchAll(/href="(\/[^"#]*)(?:#[^"]*)?"/g))await readFile(`dist${href}${href.endsWith('/')?'index.html':''}`);
  for(const [,source] of html.matchAll(/src="(\/[^"#]*)"/g))await readFile(`dist${source}`);
  assert.doesNotMatch(html,/get connected|we connect you|we refer you|MedicalClinic|type="email"|type="tel"/i);
  const schema=JSON.parse(html.match(/type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(schema['@type'],'WebSite');
 }
});
test('sitemap lists every content page and excludes error pages',async()=>{
 const sitemap=await readFile('dist/sitemap.xml','utf8');
 const locations=[...sitemap.matchAll(/<loc>https:\/\/abortionclinic.ca(.*?)<\/loc>/g)].map(x=>x[1]);
 assert.equal(locations.length,58);
 assert.equal(new Set(locations).size,58);
 for(const href of locations)await readFile(`dist${href}index.html`);
 assert.ok(!locations.some(x=>x.includes('/404/')));
});
const fixture={id:'test-only-record',name:{en:'TEST fixture',fr:'TEST fictif'},address:{en:'TEST address',fr:'Adresse TEST'},city:'Montréal',province:'QC',website:'https://example.org',source:'https://example.org/source',reviewed:'2025-01-01',phone:'+1 555 010 0100'};
test('provider validation rejects missing sources, impossible dates, unsafe links and duplicate IDs',()=>{
 assert.deepEqual(validateProviders([fixture]),[fixture]);
 for(const change of [{source:''},{website:'javascript:alert(1)'},{source:'https://user:pass@example.org'},{reviewed:'2025-02-30'},{reviewed:'2999-01-01'},{province:'ZZ'},{province:'constructor'},{phone:4165550100},{id:123},{phone:'<script>'},{id:'../escape'},{name:{en:'Missing French'}}])assert.throws(()=>validateProviders([{...fixture,...change}]));
 assert.throws(()=>validateProviders([fixture,fixture]));
});
test('geographic search handles accents, region names and combined filters',()=>{
 const on={...fixture,id:'test-ontario',city:'Toronto',province:'ON'};
 const records=[fixture,on];
 assert.deepEqual(filterProviders(records,' Montreal '),[fixture]);
 assert.deepEqual(filterProviders(records,'quebec'),[fixture]);
 assert.deepEqual(filterProviders(records,'Montréal, QC'),[fixture]);
 assert.deepEqual(filterProviders(records,'Toronto Ontario'),[on]);
 assert.deepEqual(filterProviders(records,'','ON'),[on]);
 assert.deepEqual(filterProviders(records,'Toronto','QC'),[]);
 assert.deepEqual(filterProviders(records,'TEST fixture'),[]);
});
test('published provider data is valid and currently empty',async()=>{
 const records=JSON.parse(await readFile('public/providers.json','utf8'));
 assert.deepEqual(validateProviders(records),[]);
});
test('HTTP serves pages/assets and rejects unknown routes, traversal and writes',async()=>{
 const server=makeServer();
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 try{
  const base=`http://127.0.0.1:${server.address().port}`;
  for(const route of ['/','/en/','/fr/','/en/clinics/','/fr/cliniques/','/fr/information/medication/']){
   const res=await fetch(base+route);assert.equal(res.status,200);assert.match(res.headers.get('content-type'),/text\/html/);assert.equal(res.headers.get('referrer-policy'),'no-referrer');assert.match(await res.text(),/AbortionClinic/);
  }
  for(const route of ['/app.js','/ui.mjs','/directory.mjs'])assert.match((await fetch(base+route)).headers.get('content-type'),/javascript/);
  const missing=await fetch(base+'/fr/missing/');assert.equal(missing.status,404);assert.match(await missing.text(),/Cette page est introuvable/);
  assert.equal((await fetch(base+'/en/',{method:'POST'})).status,405);
  assert.equal((await fetch(base+'/%2e%2e%2fscripts/content.mjs')).status,403);
  assert.equal((await fetch(base+'/en/',{method:'HEAD'})).status,200);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
