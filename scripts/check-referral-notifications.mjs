import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {createServer} from 'vite';

// Real SQLite statements, isolated in memory. All outbound requests are mocked.
const sqlite=new DatabaseSync(':memory:');
for(const file of fs.readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())sqlite.exec(fs.readFileSync('drizzle/'+file,'utf8'));
const db={
  prepare(sql){
    const statement=sqlite.prepare(sql);
    const bind=(...values)=>({
      first:async()=>statement.get(...values)||null,
      all:async()=>({results:statement.all(...values)}),
      run:async()=>({meta:{changes:Number(statement.run(...values).changes)}}),
    });
    return {...bind(),bind};
  },
  async batch(statements){
    sqlite.exec('BEGIN');
    try {const results=[];for(const statement of statements)results.push(await statement.run());sqlite.exec('COMMIT');return results;}
    catch(error){sqlite.exec('ROLLBACK');throw error;}
  },
};
globalThis.__notificationTestEnv={DB:db};
const server=await createServer({configFile:false,cacheDir:'.sites-runtime/referral-test-vite',server:{middlewareMode:true,hmr:false,ws:false,watch:null},logLevel:'error',plugins:[{
  name:'isolated-worker-binding',
  resolveId(id){if(id==='cloudflare:workers')return '\0test-worker-binding';},
  load(id){if(id==='\0test-worker-binding')return 'export const env = globalThis.__notificationTestEnv';},
}]});
const actualFetch=globalThis.fetch;
const calls=[];
let respond=()=>Response.json({next:'https://formspree.io/thanks'});
globalThis.fetch=async(url,options)=>{calls.push({url,options,body:JSON.parse(options.body)});return respond();};
try {
  const {POST}=await server.ssrLoadModule('/app/api/referrals/route.ts');
  const {notifyReferral,FORMSPREE_ENDPOINT}=await server.ssrLoadModule('/lib/referral-notifications.ts');
  const payload={name:'Synthetic private alias', contact:'synthetic@example.test', method:'email', locale:'en', consent:true};
  const post=data=>POST(new Request('https://example.test/api/referrals/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}));
  for(const locale of ['en','fr']){
    const response=await post({...payload,locale});
    assert.equal(response.status,410);
    assert.equal(response.headers.get('Cache-Control'),'no-store');
  }
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM referral_requests').get().count,0);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM referral_events').get().count,0);
  assert.equal(calls.length,0,'Retired intake must never send alerts');

  // An administrator can still manage notifications for records that predate closure.
  function legacyRecord(){
    const id=crypto.randomUUID(),now=new Date().toISOString();
    sqlite.prepare(`INSERT INTO referral_requests
      (id,token_hash,name,contact,method,language,source_path,locale,consent_version,consented_at,created_at,updated_at,notification_status)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(id,crypto.randomUUID(),payload.name,payload.contact,'email','en','/request-connection/','en','legacy',now,now,now,'pending');
    return id;
  }
  const first=legacyRecord();
  assert.equal(await notifyReferral(db,first,true),'accepted');
  assert.equal(calls.length,1);assert.equal(calls[0].url,FORMSPREE_ENDPOINT);
  assert.deepEqual(Object.keys(calls[0].body).sort(),['inbox','message','reference','subject']);
  for(const privateValue of [payload.name,payload.contact,'/request-connection/'])assert(!JSON.stringify(calls[0].body).includes(privateValue));
  assert.equal(calls[0].options.headers.Accept,'application/json');
  assert.equal(calls[0].options.redirect,'manual');
  assert(!calls[0].options.headers.Origin&&!calls[0].options.headers.Referer);

  respond=()=>Response.json({errors:[{message:'Too many submissions'}]},{status:429});
  const failed=legacyRecord();
  assert.equal(await notifyReferral(db,failed,true),'failed');
  const failedCalls=calls.length;
  respond=()=>Response.json({ok:true});
  assert.equal(await notifyReferral(db,failed,true),'accepted');
  assert.equal(calls.length,failedCalls+1);
  assert.equal(await notifyReferral(db,failed,true),'accepted');
  assert.equal(calls.length,failedCalls+1,'An admin retry cannot resend accepted alerts');

  respond=()=>{throw new TypeError('Synthetic network failure');};
  const uncertain=legacyRecord();
  assert.equal(await notifyReferral(db,uncertain,true),'unknown');

  respond=()=>Response.json({ok:false,errors:[{code:'CAPTCHA_REQUIRED'}]});
  assert.equal(await notifyReferral(db,legacyRecord(),true),'failed');

  // Multiple concurrent notification attempts share one atomic SQLite claim.
  const concurrent=uncertain;
  sqlite.prepare("UPDATE referral_requests SET notification_status='pending' WHERE id=?").run(concurrent);
  respond=()=>Response.json({ok:true});
  const before=calls.length;
  await Promise.all([notifyReferral(db,concurrent),notifyReferral(db,concurrent),notifyReferral(db,concurrent)]);
  assert.equal(calls.length,before+1);

  sqlite.prepare("UPDATE referral_requests SET notification_status='not_requested' WHERE id=?").run(concurrent);
  assert.equal(await notifyReferral(db,concurrent,true),'not_requested');
  assert.equal(calls.length,before+1,'Existing requests must not be forwarded retroactively');
  assert.equal(await notifyReferral(db,crypto.randomUUID(),true),'not_requested');

  // Stale, interrupted sends need an explicit admin retry; fresh sends stay locked.
  sqlite.prepare("UPDATE referral_requests SET notification_status='sending',notification_attempted_at=? WHERE id=?").run(new Date().toISOString(),concurrent);
  assert.equal(await notifyReferral(db,concurrent,true),'sending');
  sqlite.prepare('UPDATE referral_requests SET notification_attempted_at=? WHERE id=?').run(new Date(Date.now()-120000).toISOString(),concurrent);
  assert.equal(await notifyReferral(db,concurrent),'sending');
  assert.equal(await notifyReferral(db,concurrent,true),'accepted');

  console.log('PASS: retired EN/FR intake rejects requests without storing data or sending alerts. Legacy notification handling and retry protections passed.');
} finally {
  globalThis.fetch=actualFetch;
  delete globalThis.__notificationTestEnv;
  await server.close();sqlite.close();
}
