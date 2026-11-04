import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {createServer} from 'vite';

// Start at the previous schema to exercise automatic additive initialization.
const sqlite=new DatabaseSync(':memory:');
sqlite.exec('PRAGMA foreign_keys=ON');
for (const file of fs.readdirSync('drizzle').filter(file=>/^000[0-2]_.*\.sql$/.test(file)).sort()) {
  sqlite.exec(fs.readFileSync('drizzle/'+file,'utf8'));
}
let batchQueue=Promise.resolve();
const db={
  prepare(sql) {
    const statement=sqlite.prepare(sql);
    const bind=(...values)=>({
      first:async()=>statement.get(...values)||null,
      all:async()=>({results:statement.all(...values)}),
      run:async()=>({meta:{changes:Number(statement.run(...values).changes)}}),
    });
    return {...bind(),bind};
  },
  batch(statements) {
    const work=batchQueue.then(async()=>{
      sqlite.exec('BEGIN');
      try {
        const results=[];
        for (const statement of statements) results.push(await statement.run());
        sqlite.exec('COMMIT');return results;
      } catch(error) {sqlite.exec('ROLLBACK');throw error;}
    });
    batchQueue=work.catch(()=>{});
    return work;
  },
};
globalThis.__editorialTest={env:{DB:db},admin:false};
const server=await createServer({configFile:false,cacheDir:'.sites-runtime/editorial-test-vite',server:{middlewareMode:true,hmr:false,ws:false,watch:null},logLevel:'error',plugins:[{
  name:'isolated-editorial-bindings',enforce:'pre',
  resolveId(id) {
    if(id==='cloudflare:workers')return '\0test-worker-binding';
    if(/\/lib\/admin(?:\.ts)?$/.test(id))return '\0test-editorial-admin';
  },
  load(id) {
    if(id==='\0test-worker-binding')return 'export const env = globalThis.__editorialTest.env';
    if(id==='\0test-editorial-admin')return 'export async function isAdmin(){return globalThis.__editorialTest.admin ? {userId:"synthetic-admin"} : null;}';
  },
}]});
const realFetch=globalThis.fetch;
const outbound=[];
try {
  const {providers}=await server.ssrLoadModule('/lib/providers.ts');
  const {articles}=await server.ssrLoadModule('/lib/content.ts');
  const {cityGuides}=await server.ssrLoadModule('/lib/city-guides.ts');
  const target=providers[0];
  const requests=await server.ssrLoadModule('/app/api/requests/route.ts');
  const inbox=await server.ssrLoadModule('/app/api/admin/requests/route.ts');
  const review=await server.ssrLoadModule('/app/api/admin/source-review/route.ts');
  const source=await server.ssrLoadModule('/lib/source-review.ts');
  const targetSchema=await server.ssrLoadModule('/lib/provider-request-targets.ts');
  const post=(path,data,origin='https://editorial.test')=>new Request('https://editorial.test'+path,{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(data)});
  const valid={organization:'Synthetic clinic organization',email:'synthetic@example.test',evidence:'https://clinic.example.test/source',kind:'correction'};
  assert.equal((await requests.POST(post('/api/requests',{...valid,listing:'unknown'}))).status,400);
  const legacy=await requests.POST(post('/api/requests',valid));
  assert.equal(legacy.status,201);
  const concurrent=await Promise.all([1,2].map(()=>requests.POST(post('/api/requests',{...valid,email:'selected@example.test',listing:target.id}))));
  assert.deepEqual(concurrent.map(response=>response.status).sort(),[201,429]);
  await Promise.all([targetSchema.prepareRequestTargets(db),targetSchema.prepareRequestTargets(db)]);
  const saved=sqlite.prepare('SELECT * FROM provider_request_targets').all();
  assert.equal(saved.length,1);assert.equal(saved[0].provider_id,target.id);assert.equal(saved[0].provider_name,target.name);
  assert.equal((await inbox.GET()).status,403);
  assert.equal((await review.GET()).status,403);
  assert.equal((await review.POST(post('/api/admin/source-review',{id:target.id}))).status,403);
  globalThis.__editorialTest.admin=true;
  const rows=await (await inbox.GET()).json();
  assert(rows.some(row=>row.provider_id===target.id));
  assert(rows.some(row=>row.email===valid.email&&row.provider_id===null));
  assert.equal((await review.POST(post('/api/admin/source-review',{id:target.id},'https://untrusted.example'))).status,403);

  for (const [status,outcome] of [[200,'available'],[302,'manual'],[403,'manual'],[404,'missing'],[410,'missing'],[429,'manual'],[503,'manual']]) {
    const checked=await source.checkPublishedSource('https://clinic.example.test/source',async()=>new Response('',{status}));
    assert.equal(checked.outcome,outcome);
  }
  assert.equal((await source.checkPublishedSource('https://clinic.example.test/source',async()=>{throw new Error('Timeout')})).outcome,'manual');

  const catalogue=source.sourceReviewCatalogue();
  assert.equal(new Set(catalogue.map(entry=>entry.id)).size,catalogue.length);
  assert.equal(catalogue.filter(entry=>entry.category==='provider').length,providers.length);
  assert.equal(catalogue.filter(entry=>entry.category==='city').length,cityGuides.length);
  assert(catalogue.some(entry=>entry.category==='article'));
  assert(catalogue.every(entry=>entry.path.startsWith('/')&&entry.frenchPath.startsWith('/fr/')));
  assert(catalogue.every(entry=>entry.urls.every(url=>url.startsWith('https:'))));
  assert(catalogue.find(entry=>entry.id==='choice-in-health').urls.includes('https://choiceinhealth.ca/accessibility/'),'New practical profile evidence must be monitored');
  const datedArticle=articles.find(article=>article.sources?.length);
  const articleId='article:'+datedArticle.slug;
  const savedArticleDate=datedArticle.reviewed;
  const savedArticleUpdate=datedArticle.updated;
  try {
    delete datedArticle.reviewed;
    datedArticle.updated='2099-01-01';
    const undated=source.reviewRows([],Date.parse('2026-11-03T17:00:00Z')).find(row=>row.id===articleId);
    assert.equal(undated.reviewed,null,'A page update is not a content source check');
    assert.equal(undated.due,true);
    datedArticle.reviewed='2026-08-05';
    assert.equal(source.reviewRows([],Date.parse('2026-11-04T02:00:00Z')).find(row=>row.id===articleId).due,true,'90-day threshold follows Toronto date');
    datedArticle.reviewed='2026-08-06';
    assert.equal(source.reviewRows([],Date.parse('2026-11-04T02:00:00Z')).find(row=>row.id===articleId).due,false);
  } finally {
    if(savedArticleDate===undefined)delete datedArticle.reviewed;else datedArticle.reviewed=savedArticleDate;
    if(savedArticleUpdate===undefined)delete datedArticle.updated;else datedArticle.updated=savedArticleUpdate;
  }
  globalThis.fetch=async(url,options)=>{
    outbound.push({url,options});return new Response('',{status:200});
  };
  assert.equal((await review.POST(post('/api/admin/source-review',{id:'article:unknown',url:'https://untrusted.example'}))).status,404);
  assert.equal(outbound.length,0,'Unknown content must never trigger a network request');
  assert.equal((await review.POST(post('/api/admin/source-review',{id:'x'.repeat(300)}))).status,413);
  const beforeReviewed=target.reviewed;
  const check=await review.POST(post('/api/admin/source-review',{id:target.id,url:'https://untrusted.example/ignored'}));
  assert.equal(check.status,200);
  assert.deepEqual(outbound.map(call=>call.url).sort(),source.publishedSources(target).sort());
  assert(outbound.every(call=>call.options.redirect==='manual'));
  const queue=await (await review.GET()).json();
  const reviewed=queue.find(row=>row.id===target.id);
  assert.equal(reviewed.reviewed,beforeReviewed);
  assert.equal(reviewed.category,'provider');
  assert(reviewed.sources.every(item=>item.outcome==='available'&&item.checked_at));
  for(const entry of [catalogue.find(item=>item.category==='article'),catalogue.find(item=>item.category==='city')]) {
    const start=outbound.length;
    const response=await review.POST(post('/api/admin/source-review',{id:entry.id,url:'https://untrusted.example/ignored'}));
    assert.equal(response.status,200);
    assert.equal((await response.json()).checked,entry.urls.length);
    assert.deepEqual(outbound.slice(start).map(call=>call.url).sort(),[...entry.urls].sort());
    const row=(await (await review.GET()).json()).find(item=>item.id===entry.id);
    assert.equal(row.reviewed,entry.reviewed,'Link checking must not refresh article or guide review dates');
    assert.equal(row.category,entry.category);
    assert.equal(row.path,entry.path);
    assert(row.sources.every(item=>item.outcome==='available'&&item.checked_at));
  }
  assert(outbound.every(call=>call.options.redirect==='manual'));
  // Optional migration remains safe after bootstrap and during repeated rollout.
  const migration=fs.readFileSync('drizzle/0003_provider_editorial_review.sql','utf8');
  sqlite.exec(migration);sqlite.exec(migration);
  sqlite.prepare('DELETE FROM provider_requests WHERE id=?').run(saved[0].request_id);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS total FROM provider_request_targets').get().total,0);
  console.log('PASS: legacy corrections, selected targets, concurrent throttling, additive initialization, private provider/article/city source checks, independent review dates and conservative URL outcomes.');
} finally {
  globalThis.fetch=realFetch;await server.close();sqlite.close();
}
