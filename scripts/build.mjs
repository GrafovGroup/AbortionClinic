import { mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { content, pages, pathFor, escape as e } from './content.mjs';

await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await cp(new URL('../public/', import.meta.url), new URL('../dist/', import.meta.url), { recursive: true });
for (const [lang, c] of Object.entries(content)) {
  for (const [index, page] of pages.entries()) {
    const other = lang === 'en' ? 'fr' : 'en';
    const title = index < 4 ? c.nav[index] : c.footer[index - 4];
    const href = pathFor(lang, page);
    const search = `<form id="directory-search" action="/${lang}/clinics/" role="search"><label for="location">${c.search}</label><div class="search-row"><input id="location" name="location" type="search" autocomplete="off" maxlength="100"><button>${c.searchButton}</button></div></form>`;
    let body = '';
    if (page === 'home') body = `<section class="hero"><p class="eyebrow">${c.eyebrow}</p><h1>${c.title}</h1><p class="lead">${c.intro}</p><a class="button" href="/${lang}/clinics/">${c.cta} <span aria-hidden="true">↗</span></a><div class="hero-mark" aria-hidden="true">✳</div></section><section class="panel"><h2>${c.nav[1]}</h2><p>${c.directoryIntro}</p><a href="/${lang}/clinics/">${c.searchButton} →</a></section><section><h2>${c.nav[2]}</h2><p>${c.infoIntro}</p><a href="/${lang}/information/">${c.nav[2]} →</a></section>`;
    else if (page === 'clinics') body = `<h1>${title}</h1><p class="lead">${c.directoryIntro}</p><section class="panel">${search}</section><p id="directory-status" role="status">${c.empty}</p><div id="results"></div>`;
    else if (page === 'information') body = `<h1>${title}</h1><p class="lead">${c.infoIntro}</p><ul class="topics">${c.topics.map(x => `<li><h2>${x}</h2><p>${c.pending}</p></li>`).join('')}</ul><p class="notice">${c.emergency}</p>`;
    else body = `<h1>${title}</h1><p class="lead">${c[page === 'resources' ? 'resourcesIntro' : page === 'disclaimer' ? 'disclosure' : page]}</p>`;
    const html = `<!doctype html><html lang="${c.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${e(title)} | AbortionClinic.ca</title><meta name="description" content="${e(c.intro)}"><link rel="canonical" href="https://abortionclinic.ca${href}"><link rel="alternate" hreflang="en-CA" href="https://abortionclinic.ca${pathFor('en',page)}"><link rel="alternate" hreflang="fr-CA" href="https://abortionclinic.ca${pathFor('fr',page)}"><link rel="stylesheet" href="/style.css"><script src="/app.js" defer></script></head><body data-lang="${lang}"><a class="skip" href="#main">${c.skip}</a><div class="draft">${c.draft}</div><header><a class="brand" href="/${lang}/">AbortionClinic<span>.ca</span></a><div class="exit"><a class="exit-link" href="https://www.google.com" rel="noreferrer" id="quick-exit" aria-describedby="exit-help">${c.exit} ↗</a><small id="exit-help">${c.exitHelp}</small></div></header><nav aria-label="${lang === 'en' ? 'Main navigation' : 'Navigation principale'}">${pages.slice(0,4).map((p,i) => `<a href="${pathFor(lang,p)}"${page === p ? ' aria-current="page"' : ''}>${c.nav[i]}</a>`).join('')}<a class="language" lang="${content[other].lang}" hreflang="${content[other].lang}" href="${pathFor(other,page)}">${c.other}</a></nav><main id="main">${body}</main><footer><p class="brand">AbortionClinic<span>.ca</span></p><p>${c.disclosure}</p><nav aria-label="${lang === 'en' ? 'Footer' : 'Pied de page'}">${pages.slice(4).map((p,i) => `<a href="${pathFor(lang,p)}">${c.footer[i]}</a>`).join('')}</nav></footer></body></html>`;
    const dir = new URL(`../dist${href}`, import.meta.url);
    await mkdir(dir, { recursive: true });
    await writeFile(new URL('index.html', dir), html);
  }
}
await writeFile(new URL('../dist/index.html', import.meta.url), '<!doctype html><html lang="en-CA"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>AbortionClinic.ca</title><h1>AbortionClinic.ca</h1><p><a href="/en/">English</a> · <a href="/fr/">Français</a></p></html>');
await writeFile(new URL('../dist/robots.txt', import.meta.url), 'User-agent: *\nDisallow: /\n');
console.log('Built 20 localized preview pages. Publication indexing is disabled.');
