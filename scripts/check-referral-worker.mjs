import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const workerRequire=createRequire(require.resolve('wrangler/package.json'));
const {Miniflare,Response:WorkerResponse}=workerRequire('miniflare');
const {build}=workerRequire('esbuild');

// Exercise the production module with workerd's native fetch implementation.
// All outbound traffic is routed to this local stub, never the network.
const calls=[];
let reply=()=>new WorkerResponse('No fixture',{status:500});
const bundled=await build({
  stdin:{contents:`
    import {notifyReferral} from './lib/referral-notifications.ts';
    export default {async fetch(request) {
      if(new URL(request.url).pathname==='/runtime-probe') {
        try {new Request('https://formspree.io/f/xkjnebre',{redirect:'error'});}
        catch(error) {return Response.json({name:error.name,message:error.message});}
        return Response.json({name:'no_error'});
      }
      // Storage/atomic claims are covered by check-referral-notifications.mjs.
      const db={prepare(){return {bind(){return {run:async()=>({meta:{changes:1}})}}}}};
      const status=await notifyReferral(db,'00000000-0000-4000-8000-000000000001');
      return Response.json({status});
    }};
  `,resolveDir:process.cwd(),sourcefile:'notification-worker-test.ts',loader:'ts'},
  bundle:true,format:'esm',platform:'browser',write:false,
});
const worker=new Miniflare({
  modules:true,script:bundled.outputFiles[0].text,compatibilityDate:'2026-05-15',
  outboundService:async(request)=>{
    calls.push({url:request.url,method:request.method});
    return reply();
  },cf:false,
});
try {
  const probe=await (await worker.dispatchFetch('http://notification.test/runtime-probe')).json();
  assert.equal(probe.name,'TypeError');
  assert.match(probe.message,/Invalid redirect value/);
  console.log('Confirmed runtime cause:',probe.message);
  const check=async(httpStatus,body,expected)=>{
    const before=calls.length;
    reply=()=>new WorkerResponse(typeof body==='string'?body:JSON.stringify(body),{
      status:httpStatus,
      headers:{'Content-Type':'application/json',...(httpStatus===303?{Location:'https://formspree.io/thanks'}:{})},
    });
    const response=await worker.dispatchFetch('http://notification.test');
    assert.equal((await response.json()).status,expected);
    assert.equal(calls.length,before+1,'Send once without following redirects');
    assert.deepEqual(calls.at(-1),{url:'https://formspree.io/f/xkjnebre',method:'POST'});
  };
  await check(200,{next:'https://formspree.io/thanks'},'accepted');
  await check(303,'','failed');
  await check(429,{errors:[{code:'RATE_LIMIT'}]},'failed');
  await check(200,'not JSON','unknown');
  console.log('PASS: workerd accepts the notification request, recognizes success, blocks redirects, and handles rejection/invalid JSON. No external requests sent.');
} finally {
  await worker.dispose();
}
