import {allPaths,resolveRoute} from '../../lib/routes';
import {absolutePath,lastModifiedForRoute} from '../../lib/seo';

const escapeXml = (value: string) => value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');

export function GET() {
  const entries = allPaths().filter(path=>resolveRoute(path).indexable).map(path=>{
    const updated = lastModifiedForRoute(path);
    return '<url><loc>'+escapeXml(absolutePath(path))+'</loc>'+
      (updated?'<lastmod>'+updated+'</lastmod>':'')+'</url>';
  }).join('');
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+entries+'</urlset>', {
    headers: {'Content-Type':'application/xml; charset=utf-8'},
  });
}
