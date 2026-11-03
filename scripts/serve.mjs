import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json', '.txt': 'text/plain' };
export function makeServer({ production=false }={}) {
  const root=resolve(fileURLToPath(new URL(production?'../dist-production/':'../dist/',import.meta.url)));
  return createServer(async (req, res) => {
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if(!production)res.setHeader('X-Robots-Tag','noindex, nofollow');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
    try {
      const pathname=decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const redirects=JSON.parse(await readFile(resolve(root,'redirects.json'),'utf8'));
      const canonicalPath=pathname.endsWith('/')?pathname:pathname+'/';
      if(production){const indexing=JSON.parse(await readFile(resolve(root,'indexing.json'),'utf8'));if(indexing[canonicalPath]===false)res.setHeader('X-Robots-Tag','noindex, follow');}
      if(redirects[canonicalPath]) { res.writeHead(301,{Location:redirects[canonicalPath]}).end(); return; }
      let file = resolve(root, '.' + pathname);
      if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      const data = await readFile(file);
      res.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream');
      res.writeHead(200).end(req.method === 'HEAD' ? undefined : data);
    } catch {
      if(production)res.setHeader('X-Robots-Tag','noindex, follow');
      try { const page=await readFile(resolve(root,req.url.startsWith('/fr/')?'fr/404/index.html':'404/index.html')); res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'}).end(req.method==='HEAD'?undefined:page); }
      catch { res.writeHead(404, {'Content-Type':'text/plain'}).end('Not found'); }
    }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  makeServer({production:process.argv.includes('--production')}).listen(port, '127.0.0.1', () => console.log(`Website listening on port ${port}`));
}
