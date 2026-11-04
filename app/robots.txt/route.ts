// Public directories and regional guides stay crawlable.
export function GET(){return new Response('User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /fr/admin/\nSitemap: https://abortionclinic.ca/sitemap.xml\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}})}
