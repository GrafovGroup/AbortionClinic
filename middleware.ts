import {NextRequest, NextResponse} from 'next/server';
import {retiredConnectionDestination} from './lib/retired-connection';

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const canonicalHost = url.hostname === 'www.abortionclinic.ca';
  if (canonicalHost) {
    url.hostname = 'abortionclinic.ca';
    url.protocol = 'https:';
    url.port = '';
  }

  const directory = retiredConnectionDestination(url.pathname);
  if (directory) {
    url.pathname = directory;
    url.search = '';
    // An explicit fragment replaces the legacy form's clinic and origin-page context.
    url.hash = 'main';
    const response = NextResponse.redirect(url, 308);
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('Referrer-Policy', 'no-referrer');
    return response;
  }
  if (canonicalHost) return NextResponse.redirect(url, 308);

  const headers = new Headers(request.headers);
  const french = url.pathname === '/fr' || url.pathname.startsWith('/fr/');
  headers.set('x-site-language', french ? 'fr' : 'en');
  const response = NextResponse.next({request: {headers}});
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  if (/^\/(?:fr\/admin|admin|api)(?:\/|$)/.test(url.pathname)) {
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}
