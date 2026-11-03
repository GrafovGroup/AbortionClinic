import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, cp, writeFile, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn, execFileSync } from 'node:child_process';
import { createServer } from 'node:net';
import { request } from 'node:http';
import { join, resolve } from 'node:path';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { apacheConfig } from './apache-config.mjs';

// Run explicitly after build:production. It fails, rather than silently skips,
// when Apache is unavailable. Isolated extracted packages can be selected using
// APACHE_BIN, APACHE_MODULE_DIR and APACHE_LIBRARY_DIR (only for this process).
const binary = process.env.APACHE_BIN || ['/usr/sbin/apache2','/usr/sbin/httpd','/usr/bin/httpd'].find(existsSync);
if (!binary) throw new Error('Apache integration test requires Apache 2.4+. Install apache2-bin, or set APACHE_BIN, APACHE_MODULE_DIR and optional APACHE_LIBRARY_DIR to a verified local extraction. Run npm run build:production first.');
const moduleDir = process.env.APACHE_MODULE_DIR || '/usr/lib/apache2/modules';
const apacheEnvironment = {...process.env};
if (process.env.APACHE_LIBRARY_DIR) apacheEnvironment.LD_LIBRARY_PATH = [process.env.APACHE_LIBRARY_DIR, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':');
try { execFileSync(binary, ['-v'], {env:apacheEnvironment, stdio:'pipe'}); }
catch (error) { throw new Error(`Apache cannot start. Check APACHE_BIN and its verified runtime libraries: ${error.stderr?.toString() || error.message}`); }
const redirects = JSON.parse(await readFile('dist-production/redirects.json','utf8'));
const indexing = JSON.parse(await readFile('dist-production/indexing.json','utf8'));
const inventory = JSON.parse(await readFile('data/live-inventory.json','utf8'));
let sandbox, child, base, stderr = '';

before(async () => {
 sandbox = await mkdtemp('/tmp/abortionclinic-apache-check-');
 const docroot = join(sandbox,'site');
 await cp(resolve('dist-production'),docroot,{recursive:true});
 await writeFile(join(docroot,'.htaccess'),apacheConfig({redirects,indexing}));
 // Nonpublic fixtures prove the deny rules while leaving release files intact.
 for (const [path,body] of [['.env','test fixture only'],['.git/config','test fixture only'],['scripts/internal.mjs','test fixture only'],['index.html.bak','test fixture only'],['backup.zip','test fixture only'],['.well-known/acme-challenge/test-token','certificate-challenge-fixture']]) {
  const full = join(docroot,path); await mkdir(resolve(full,'..'),{recursive:true}); await writeFile(full,body);
 }
 await mkdir(join(docroot,'empty-directory'));
 const reservation = createServer();
 await new Promise((resolve,reject) => { reservation.once('error',reject); reservation.listen(0,'127.0.0.1',resolve); });
 const port = reservation.address().port;
 await new Promise(resolve => reservation.close(resolve));
 base = `http://127.0.0.1:${port}`;
 const config = join(sandbox,'httpd.conf');
 const modules = ['mpm_event','authz_core','authz_host','rewrite','dir','mime','headers','setenvif','autoindex'];
 await writeFile(config, `ServerRoot "${sandbox}"
PidFile "${join(sandbox,'httpd.pid')}"
DefaultRuntimeDir "${sandbox}"
Listen 127.0.0.1:${port}
ServerName localhost
${modules.map(name=>`LoadModule ${name}_module "${join(moduleDir,`mod_${name}.so`)}"`).join('\n')}
User #${process.getuid()}
Group #${process.getgid()}
ErrorLog "${join(sandbox,'error.log')}"
LogLevel warn
TypesConfig /etc/mime.types
DocumentRoot "${docroot}"
<Directory />
 Require all denied
</Directory>
<Directory "${docroot}">
 Options FollowSymLinks
 AllowOverride All
 Require all granted
</Directory>
`);
 execFileSync(binary,['-t','-f',config],{env:apacheEnvironment,stdio:'pipe'});
 child=spawn(binary,['-f',config,'-DFOREGROUND'],{env:apacheEnvironment,stdio:['ignore','ignore','pipe']});
 child.stderr.on('data',chunk=>{stderr+=chunk.toString();});
 for(let attempt=0;attempt<100;attempt++) {
  if(child.exitCode!==null)throw new Error(`Apache exited before readiness: ${stderr}`);
  try {const response=await fetch(base+'/');if(response.status===200)return;if(response.status>=500)throw new Error(`Apache returned ${response.status}: ${await readFile(join(sandbox,'error.log'),'utf8')}`);}
  catch(error){if(error.message.startsWith('Apache returned'))throw error;}
  await delay(50);
 }
 throw new Error(`Apache did not become ready. ${stderr}`);
});
after(async()=>{
 if(child && child.exitCode===null) {
  const exited=once(child,'exit');child.kill('SIGTERM');
  await Promise.race([exited,delay(5000).then(()=>{if(child.exitCode===null)child.kill('SIGKILL');})]);
 }
 if(sandbox)await rm(sandbox,{recursive:true,force:true});
});

test('Apache serves all 108 retained live routes and the 52 exact legacy redirects',async()=>{
 for(const entry of inventory.filter(entry=>!redirects[entry.path])) {
  const response=await fetch(base+entry.path,{redirect:'manual'});
  assert.equal(response.status,200,entry.path);
  assert.match(response.headers.get('content-type'),/text\/html/);
 }
 assert.equal(Object.keys(redirects).length,52);
 for(const [from,to] of Object.entries(redirects)) for(const path of [from,from.replace(/\/$/,'')]) {
  const response=await fetch(base+path+'?old-search=test-fixture',{redirect:'manual'});
  assert.equal(response.status,301,path);
  const destination=new URL(response.headers.get('location'),base);
  assert.equal(destination.pathname,to,path);
  assert.equal(destination.search,'','Legacy redirects must discard queries');
 }
 assert.equal((await fetch(base+'/en/clinics/not-a-legacy-route/',{redirect:'manual'})).status,404,'Redirects must not swallow suffix paths');
});

test('Apache preserves selective indexing, CSP, referrer protection and browser module MIME types',async()=>{
 for(const [path,indexed] of Object.entries(indexing)) {
  const response=await fetch(base+path);
  assert.equal(response.status,200,path);
  assert.equal(response.headers.get('referrer-policy'),'no-referrer');
  assert.equal(response.headers.get('x-content-type-options'),'nosniff');
  assert.match(response.headers.get('content-security-policy'),/default-src 'self'/);
  if(indexed)assert.doesNotMatch(response.headers.get('x-robots-tag')||'',/noindex/i,path);
  else assert.match(response.headers.get('x-robots-tag')||'',/noindex/i,path);
 }
 for(const [path,mime] of [['/routes.mjs','text/javascript'],['/images/healthcare-welcome-640.webp','image/webp'],['/favicon.ico','image/x-icon']]) {
  const response=await fetch(base+path);assert.equal(response.status,200,path);assert.ok(response.headers.get('content-type').startsWith(mime),path);
 }
});

test('Apache returns real custom 404s, protects private files and permits certificate challenges',async()=>{
 for(const path of ['/missing-page/','/fr/missing-page/']) {
  const response=await fetch(base+path);assert.equal(response.status,404,path);assert.match(await response.text(),/AbortionClinic/);assert.match(response.headers.get('x-robots-tag')||'',/noindex/i,path);
 }
 for(const path of ['/.env','/.git/config','/scripts/internal.mjs','/index.html.bak','/backup.zip','/indexing.json','/redirects.json','/_headers','/_redirects']) {
  assert.equal((await fetch(base+path)).status,403,path);
 }
 assert.equal((await fetch(base+'/empty-directory/')).status,403,'Directory listing must be disabled');
 assert.equal(await (await fetch(base+'/.well-known/acme-challenge/test-token')).text(),'certificate-challenge-fixture');
});

test('canonical HTTPS redirects affect only the real domain and do not trust arbitrary proxy headers',async()=>{
 // Node fetch normalizes Host to the URL origin. Native HTTP is required to
 // exercise name-based virtual hosting against the local listener.
 const withHost=(path,host)=>new Promise((resolve,reject)=>{
  const req=request(base+path,{headers:{Host:host,'X-Forwarded-Proto':'https'}},response=>{response.resume();response.on('end',()=>resolve(response));});
  req.on('error',reject);req.end();
 });
 for(const host of ['abortionclinic.ca','www.abortionclinic.ca','www.abortionclinic.ca:80']) {
  const response=await withHost('/ontario/?old-search=test-fixture',host);
  assert.equal(response.statusCode,301,host);
  assert.equal(response.headers.location,'https://abortionclinic.ca/ontario/');
 }
 for(const host of ['localhost','staging.example.test','abortionclinic.ca.attacker.test']) {
  const response=await withHost('/',host);assert.equal(response.statusCode,200,host);
 }
 assert.equal((await withHost('/.well-known/acme-challenge/test-token','abortionclinic.ca')).statusCode,200,'Certificate issuance must work before origin HTTPS');
});

test('Apache configuration rejects invalid/chained redirects and unsafe indexing paths',()=>{
 assert.throws(()=>apacheConfig({redirects:42,indexing:{'/':true}}));
 assert.throws(()=>apacheConfig({redirects:{},indexing:'invalid'}));
 for(const bad of [{'//attacker.test/':'/'},{'/old/':'https://attacker.test/'},{'/same/':'/same/'},{'/one/':'/two/','/two/':'/three/'}])assert.throws(()=>apacheConfig({redirects:bad,indexing:{'/':true}}));
 assert.throws(()=>apacheConfig({redirects:{},indexing:{'/bad\nHeader exploit/':false}}));
 assert.throws(()=>apacheConfig({redirects:{},indexing:{'/':'true'}}));
});
