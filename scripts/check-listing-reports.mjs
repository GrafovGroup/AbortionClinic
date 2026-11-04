import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {createServer} from 'vite';

// An isolated database and synthetic authenticated user: no live reports sent.
const sqlite=new DatabaseSync(':memory:');
const db={prepare(sql){const statement=sqlite.prepare(sql);const bind=(...values)=>({first:async()=>statement.get(...values)||null,all:async()=>({results:statement.all(...values)}),run:async()=>({meta:{changes:Number(statement.run(...values).changes)}})});return {...bind(),bind};}};
globalThis.__listingReportTest={env:{DB:db},admin:false};
const server=await createServer({configFile:false,cacheDir:'.sites-runtime/listing-report-test-vite',server:{middlewareMode:true,hmr:false,ws:false,watch:null},logLevel:'error',plugins:[{
  name:'isolated-listing-report-bindings',enforce:'pre',
  resolveId(id){if(id==='cloudflare:workers')return '\0test-report-worker';if(/\/lib\/admin(?:\.ts)?$/.test(id))return '\0test-report-admin';},
  load(id){if(id==='\0test-report-worker')return 'export const env=globalThis.__listingReportTest.env';if(id==='\0test-report-admin')return 'export async function isAdmin(){return globalThis.__listingReportTest.admin?{userId:"synthetic-admin"}:null;}';},
}]});
try {
  const {providers}=await server.ssrLoadModule('/lib/providers.ts');
  const report=await server.ssrLoadModule('/app/api/listing-reports/route.ts');
  const admin=await server.ssrLoadModule('/app/api/admin/listing-reports/route.ts');
  const helpers=await server.ssrLoadModule('/lib/listing-reports.ts');
  const target=providers[0];const originalReview=target.reviewed;
  const request=(data,{path='/api/listing-reports',method='POST',origin='https://reports.test',type='application/json'}={})=>new Request('https://reports.test'+path,{method,headers:{origin,'Content-Type':type},body:JSON.stringify(data)});
  const valid={listing:target.id,issue:'phone',website:''};
  assert.equal((await report.POST(request(valid,{origin:'https://untrusted.example'}))).status,403);
  assert.equal((await report.POST(request(valid,{type:'text/plain'}))).status,415);
  for(const input of [{...valid,listing:'unknown'},{...valid,issue:'constructor'},{...valid,website:'bot'},null,[],{...valid,details:'Medical details must never be stored'},{...valid,email:'personal@example.test'},{...valid,source:'https://untrusted.example'}])assert.equal((await report.POST(request(input))).status,400);
  assert.equal((await report.POST(request({...valid,website:'é'.repeat(600)}))).status,413,'Body cap counts bytes, not characters');

  const concurrent=await Promise.all([1,2].map(()=>report.POST(request(valid))));
  assert(concurrent.every(response=>response.status===202));
  const responses=await Promise.all(concurrent.map(response=>response.json()));
  assert.deepEqual(responses,[{status:'received'},{status:'received'}]);
  let rows=sqlite.prepare('SELECT * FROM listing_reports').all();
  assert.equal(rows.length,1,'Repeated pending issues combine atomically');
  assert.deepEqual(Object.keys(rows[0]).sort(),['id','provider_id','issue','status','created_at','resolved_at'].sort(),'Storage contains no contact, IP, device, URL or free-text fields');
  await Promise.all([helpers.prepareListingReports(db),helpers.prepareListingReports(db)]);
  assert.equal((await admin.GET()).status,403);
  assert.equal((await admin.PATCH(request({id:rows[0].id},{path:'/api/admin/listing-reports',method:'PATCH'}))).status,403);
  globalThis.__listingReportTest.admin=true;
  assert.equal((await admin.PATCH(request({id:rows[0].id},{path:'/api/admin/listing-reports',method:'PATCH',origin:'https://untrusted.example'}))).status,403);
  assert.equal((await admin.PATCH(request({id:rows[0].id,status:'pending'},{path:'/api/admin/listing-reports',method:'PATCH'}))).status,400);
  assert.equal((await admin.PATCH(request({id:crypto.randomUUID()},{path:'/api/admin/listing-reports',method:'PATCH'}))).status,404);
  const inbox=await admin.GET();assert.equal(inbox.headers.get('Cache-Control'),'no-store');
  const loaded=await inbox.json();assert.equal(loaded[0].provider_name,target.name);
  assert.equal((await admin.PATCH(request({id:rows[0].id},{path:'/api/admin/listing-reports',method:'PATCH'}))).status,200);
  assert.equal(sqlite.prepare('SELECT status FROM listing_reports WHERE id=?').get(rows[0].id).status,'resolved');
  assert.equal(target.reviewed,originalReview,'Resolving a report must not change the public listing');
  assert.equal((await report.POST(request(valid))).status,202,'New report can flag an issue after resolution');
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM listing_reports WHERE status='pending'").get().n,1);

  const oldDate=new Date(Date.now()-91*86400000).toISOString();
  sqlite.prepare('UPDATE listing_reports SET created_at=?').run(oldDate);
  assert.equal((await (await admin.GET()).json()).length,0,'Old pending and resolved reports expire on queue access');
  const freshDate=new Date().toISOString();
  const issues=Object.keys(helpers.listingIssueLabels);
  for(let i=0;i<60;i++)sqlite.prepare("INSERT INTO listing_reports(id,provider_id,issue,status,created_at) VALUES(?,?,?,'pending',?)").run(crypto.randomUUID(),providers[Math.floor(i/issues.length)].id,issues[i%issues.length],freshDate);
  assert.equal((await report.POST(request({listing:providers[20].id,issue:'phone'}))).status,429,'Global cap bounds new issue creation without storing visitor identity');
  assert.equal((await report.POST(request(valid))).status,202,'Existing pending issue remains reportable under cap');
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM listing_reports').get().n,60);
  console.log('PASS: minimal visitor reports, strict validation, byte limits, concurrent deduplication, private resolution, retention and identity-free global throttling.');
}finally{await server.close();sqlite.close();}
