import { mkdir, writeFile, cp, rm, readFile } from 'node:fs/promises';
import { content, pages, escape as e } from './content.mjs';
import { editorial, administrativeContact } from './editorial.mjs';
import { ui, regionNames } from './ui.mjs';
import { pathFor, topicPath, regionPath, providerPath, oldPathFor } from '../public/routes.mjs';
import { validateProviders } from '../public/directory.mjs';
import { recoveredContent, cleanMetadata } from './recovery.mjs';
import { apacheConfig } from './apache-config.mjs';

const production=process.argv.includes('--production');
const out=new URL(production?'../dist-production/':'../dist/',import.meta.url);
const load=async p=>JSON.parse(await readFile(new URL(p,import.meta.url),'utf8'));
const live=await load('../data/live-pages.json');
const inventory=await load('../data/live-inventory.json');
const providers=validateProviders(await load('../public/providers.json'));
const byPath=new Map(live.map(p=>[p.path,p]));
const allPaths=new Set(), sitemapPaths=new Set(), redirects={}, indexing={};
const connectionPaths=['/request-connection/','/fr/demander-une-mise-en-relation/'];
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
await cp(new URL('../public/',import.meta.url),out,{recursive:true});
// Keep the published asset URLs available, including existing image search links.
await cp(new URL('../public/live-assets/',import.meta.url),out,{recursive:true});
await cp(new URL('./ui.mjs',import.meta.url),new URL('ui.mjs',out));
const arrow='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7"/></svg>';
const link=(href,label,cls='')=>`<a${cls?` class="${cls}"`:''} href="${e(href)}"${/^https?:/.test(href)?' rel="noreferrer"':''}>${e(label)} ${arrow}</a>`;
const image=(name,alt='',cls='',eager=false)=>`<figure class="editorial-image editorial-image--rounded editorial-image--healthcare ${cls}"><img src="/images/${name}-1280.webp" srcset="/images/${name}-640.webp 640w, /images/${name}-1280.webp 1280w" sizes="(max-width:700px) 90vw, 38vw" width="1280" height="853" alt="${e(alt)}" loading="${eager?'eager':'lazy'}" decoding="async"${eager?' fetchpriority="high"':''}></figure>`;
const logo=(lang)=>`<a class="brand brand-logo" href="${pathFor(lang,'home')}"><img src="/brand/abortionclinic-logo.svg" width="1478" height="264" alt="AbortionClinic.ca" decoding="async"></a>`;
const labelDate=(lang,p)=>p.provenance?(lang==='en'?'Review date reported by original listing':'Date de révision indiquée dans la fiche originale'):ui[lang].reviewed;
const address=(p,lang)=>p.address[lang]||`${p.city}, ${p.regionName?.[lang]||p.province}`;
const dateNote=(lang)=>lang==='en'?'Recovered from the published website on November 3, 2026. Official provider details have not been independently re-reviewed. Contact the provider to confirm current information.':'Renseignements récupérés du site publié le 3 novembre 2026. Les coordonnées officielles n’ont pas été revérifiées indépendamment. Confirmez les renseignements actuels auprès du fournisseur.';
const titleOf=(page,lang)=>page.title?.replace(/\s*\|\s*AbortionClinic.ca$/,'')||content[lang].nav[0];

async function write(lang,page,title,body,href,counterpart,{index=true,recovered=false}={}){
 const c=content[lang],u=ui[lang],other=lang==='en'?'fr':'en',source=byPath.get(href);
 if(page!=='home' && source?.headings?.[0]?.level===1 && !recovered) body=body.replace(/<h1>.*?<\/h1>/s,`<h1>${e(source.headings[0].text)}</h1>`);
 const originalTitle=source?.title||`${title} | AbortionClinic.ca`;
 const finalTitle=cleanMetadata(originalTitle,lang);
 const description=page==='contact' ? (lang==='en'?'Site corrections and general administrative information. No patient inquiries, referrals or appointment booking.':'Corrections du site et renseignements administratifs. Aucun accueil de demandes de patients, service d’orientation ou prise de rendez-vous.') : cleanMetadata(source?.description||c.intro,lang);
 const canonical=`https://abortionclinic.ca${href}`;
 const english=lang==='en'?href:counterpart;
 const schema={'@context':'https://schema.org','@type':'WebSite',name:'AbortionClinic.ca',url:'https://abortionclinic.ca/',inLanguage:['en-CA','fr-CA']};
 const meta=source?.metadata||inventory[0].metadata;
 const html=`<!doctype html><html lang="${c.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="${production?(index?'index,follow':'noindex,follow'):'noindex,nofollow'}"><meta name="referrer" content="no-referrer"><meta name="theme-color" content="#4b6897"><title>${e(finalTitle)}</title><meta name="description" content="${e(description)}"><link rel="icon" href="/favicon.ico"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="${c.lang}" href="${canonical}"><link rel="alternate" hreflang="${content[other].lang}" href="https://abortionclinic.ca${counterpart}"><link rel="alternate" hreflang="x-default" href="https://abortionclinic.ca${english}"><meta property="og:title" content="${e(finalTitle)}"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${canonical}"><meta property="og:type" content="website"><meta property="og:locale" content="${lang}_CA"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${e(finalTitle)}"><meta name="twitter:description" content="${e(description)}">${['google-site-verification','msvalidate.01'].filter(k=>meta[k]).map(k=>`<meta name="${k}" content="${e(meta[k])}">`).join('')}<link rel="stylesheet" href="/live-theme.css"><link rel="stylesheet" href="/style.css"><script type="application/ld+json">${JSON.stringify(schema)}</script><script type="module" src="/app.js"></script></head><body data-lang="${lang}" class="${page==='home'?'live-home':'internal-page'}"><a class="skip-link" href="#main">${c.skip}</a><header>${logo(lang)}<nav id="main-nav" aria-label="${lang==='en'?'Main navigation':'Navigation principale'}">${pages.slice(0,4).map((p,i)=>`<a href="${pathFor(lang,p)}"${p===page?' aria-current="page"':''}>${e(c.nav[i])}</a>`).join('')}<a class="language language-switch" href="${counterpart}" lang="${content[other].lang}" hreflang="${content[other].lang}">${c.other}</a></nav><a class="quick-exit" id="quick-exit" href="https://www.google.com" rel="noreferrer" aria-describedby="exit-help">${u.quickExit} ${arrow}</a></header><main id="main">${body}${recovered?`<aside class="recovery-note"><p>${lang==='en'?'This page was recovered from the existing published website. Its original citations and dates are preserved; this recovery does not claim a new clinical review.':'Cette page a été récupérée du site publié. Les citations et dates originales sont conservées; cette récupération ne constitue pas une nouvelle révision clinique.'}</p></aside>`:''}</main><footer><div class="footer-top"><div>${logo(lang)}<p>${c.disclosure}</p></div><div class="footer-links">${link(pathFor(lang,'locations'),lang==='en'?'Cities across Canada':'Localités au Canada')}${['about','forProviders','editorial','providerPolicy','privacy','terms','contact','disclaimer'].map(p=>link(pathFor(lang,p),({forProviders:lang==='en'?'For providers':'Pour les fournisseurs',providerPolicy:lang==='en'?'How listings are checked':'Révision des fiches'})[p]||c.footer[pages.indexOf(p)-4])).join('')}</div></div><div class="footer-bottom"><span>© ${new Date().getUTCFullYear()} AbortionClinic.ca</span><span>${lang==='en'?'For emergencies, call 911.':'En cas d’urgence, composez le 911.'}</span><a id="exit-help" href="${pathFor(lang,'privacy')}">${lang==='en'?'Quick Exit does not erase your history.':'La sortie rapide n’efface pas votre historique.'}</a></div><p class="preview-note">${production?(lang==='en'?'Independent information and public provider listings. Confirm current details with providers.':'Information indépendante et fiches publiques. Confirmez les renseignements actuels auprès des fournisseurs.'):u.buildNotice}</p></footer></body></html>`;
 const dir=new URL('.'+href,out);await mkdir(dir,{recursive:true});await writeFile(new URL('index.html',dir),html);
 allPaths.add(href);indexing[href]=index;if(index)sitemapPaths.add(href);
}
for(const lang of ['en','fr']){
 const c=content[lang],u=ui[lang],ed=editorial[lang],other=lang==='en'?'fr':'en',path=p=>pathFor(lang,p);
 const heading=(title,lead)=>`<section class="page-hero"><div class="container"><div class="breadcrumb">${link(path('home'),c.nav[0])}<span>/</span><span>${e(title)}</span></div><h1>${e(title)}</h1><p class="lead">${e(lead)}</p></div></section>`;
 const cards=(topics)=>`<div class="card-grid">${topics.map(t=>`<a class="topic-card" href="${topicPath(lang,t.id)}"><h2>${e(t.title)}</h2><p>${e(t.summary)}</p><span>${u.readGuide} ${arrow}</span></a>`).join('')}</div>`;
 const faq=()=>`<section class="faq-section"><h2>${u.faqTitle}</h2><div class="faq-list">${ed.faqs.map(f=>`<details><summary>${e(f.q)}</summary><p>${e(f.a)}</p></details>`).join('')}</div></section>`;
 const providerCard=p=>`<article class="provider-card"><p class="eyebrow">${e(p.city)} · ${e(p.province)}</p><h3>${e(p.name[lang])}</h3><p>${e(address(p,lang))}</p><p>${labelDate(lang,p)}: <time datetime="${p.reviewed}">${p.reviewed}</time></p>${link(providerPath(lang,p.id),u.details)}${link(p.website,u.website)}${p.phone?link(`tel:${p.phone}`,`${u.phone}: ${p.phoneDisplay||p.phone}`):''}</article>`;
 const searchForm=(home=false)=>`<form id="${home?'home-search':'directory-search'}" class="${home?'home-search':'filter-panel'}" role="search">${home?'':`<h2>${u.filters}</h2>`}<label for="location">${u.search}</label><div class="${home?'searchbar':'search-row'}"><input disabled id="location" name="location" type="search" autocomplete="off" maxlength="100" placeholder="${lang==='en'?'Try Toronto, Montréal or Ontario':'Essayez Toronto, Montréal ou Québec'}"><button disabled type="submit" class="button">${c.cta} ${arrow}</button></div>${home?'':`<label for="region">${u.region}</label><select disabled id="region" name="region"><option value="">${u.allRegions}</option>${regionNames.map(([code,en,fr])=>`<option value="${code}">${e(lang==='en'?en:fr)}</option>`).join('')}</select><button disabled type="reset" id="clear-filters" class="clear-filters">${u.clear}</button>`}<p class="search-help">${u.privateSearch}</p></form>`;
 const countryRegions=()=>regionNames.map(([code,en,fr])=>link(regionPath(lang,code),lang==='en'?en:fr)).join('');
 const home=`<section class="hero home-hero"><div class="hero-copy"><p class="eyebrow">${lang==='en'?'INDEPENDENT • CANADIAN • FREE TO USE':'INDÉPENDANT • CANADIEN • GRATUIT'}</p><h1>${lang==='en'?'Find information about abortion care<br><em>in Canada.</em>':'Trouvez de l’information sur les services d’avortement<br><em>au Canada.</em>'}</h1><p>${c.intro}</p>${searchForm(true)}<div class="popular">${lang==='en'?'Explore:':'Explorer :'} ${[['ON','Toronto'],['QC','Montréal'],['BC','Vancouver'],['AB','Calgary']].map(([code,city])=>link(`${regionPath(lang,code)}#q=${encodeURIComponent(city)}`,city)).join('')}</div>${link(path('locations'),lang==='en'?'Browse all Canadian locations':'Consulter toutes les localités canadiennes','browse-all')}</div>${image('healthcare-welcome',lang==='en'?'A woman speaking with a healthcare professional in a private consultation':'Une femme en conversation privée avec une professionnelle de la santé','directory-art',true)}</section><section id="home-results-section" class="home-results" hidden><h2>${c.nav[1]}</h2><p id="directory-status" role="status"></p><div id="results"></div></section><section class="privacy-reassurance privacy-reassurance--home"><div><div class="privacy-reassurance-title"><h2>${lang==='en'?'Explore with discretion.':'Explorez en toute discrétion.'}</h2></div><p>${u.heroNote}</p>${link(path('privacy'),u.privacyLink)}</div><ul>${u.trust.map(([title,text])=>`<li><strong>${title}</strong><span>${text}</span></li>`).join('')}</ul></section><div class="pathways pathways--illustrated">${[['medication','recovery-at-home'],['procedural','prepared-clinic-room'],[null,'telehealth-options']].map(([id,img],i)=>{const t=ed.topics.find(x=>x.id===id);return `<a href="${id?topicPath(lang,id):path('resources')}">${image(img,'','pathway-art')}<span class="number">0${i+1}</span><div><h3>${e(t?.title||c.nav[3])}</h3><p>${e(t?.summary||u.resourcesLead)}</p></div>${arrow}</a>`;}).join('')}</div><section class="regions"><p class="eyebrow">${lang==='en'?'ACROSS CANADA':'PARTOUT AU CANADA'}</p><h2>${u.directoryTitle}</h2><div class="province-grid">${countryRegions()}</div></section>`;
 await write(lang,'home',c.title,home,path('home'),pathFor(other,'home'));
 const directory=(initial='',intro=u.directoryLead)=>`${heading(initial?regionNames.find(x=>x[0]===initial)[lang==='en'?1:2]:u.directoryTitlePage,intro)}<section class="section"><div class="container directory-layout" data-region="${initial}">${searchForm()}<div class="directory-results"><div class="results-header"><h2>${c.nav[1]}</h2><p id="directory-status" role="status"></p></div><p class="recovery-note">${dateNote(lang)}</p><div id="results">${providers.filter(p=>!initial||p.province===initial).map(providerCard).join('')||`<p>${u.noMatchText}</p>`}</div><noscript><p>${u.noscript}</p></noscript></div></div></section>`;
 await write(lang,'clinics',c.nav[1],directory(),path('clinics'),pathFor(other,'clinics'),{index:false});
 for(const [code,en,fr] of regionNames)await write(lang,'clinics',lang==='en'?en:fr,directory(code,u.provinceIntro),regionPath(lang,code),regionPath(other,code));
 await write(lang,'information',c.nav[2],`${heading(u.infoTitle,u.infoLead)}<section class="section"><div class="container">${cards(ed.topics)}</div></section>${faq()}`,path('information'),pathFor(other,'information'));
 await write(lang,'resources',c.nav[3],`${heading(u.resourcesTitle,u.resourcesLead)}<section class="section"><div class="container">${cards(ed.topics)}<h2>${u.browseRegions}</h2><div class="province-grid">${countryRegions()}</div></div></section>`,path('resources'),pathFor(other,'resources'));
 await write(lang,'resources',u.browseRegions,`${heading(u.browseRegions,u.directoryLead)}<section class="section"><div class="province-grid">${countryRegions()}</div><h2>${lang==='en'?'Cities in the published directory':'Villes du répertoire publié'}</h2><div class="province-grid">${[...new Map(providers.map(p=>[p.city,p])).values()].map(p=>link(`${regionPath(lang,p.province)}#q=${encodeURIComponent(p.city)}`,p.city)).join('')}</div></section>`,path('locations'),pathFor(other,'locations'),{index:false});
 for(const p of providers){
  const text=p.description?.[lang]||'';
  const body=`${heading(p.name[lang],text)}<section class="section"><div class="container content-grid"><article class="prose"><h2>${lang==='en'?'Public contact details':'Coordonnées publiques'}</h2><p>${e(address(p,lang))}</p>${link(p.website,u.website,'button')}${p.phone?link(`tel:${p.phone}`,`${u.phone}: ${p.phoneDisplay||p.phone}`,'button-secondary'):''}<h2>${lang==='en'?'Services in the published listing':'Services indiqués dans la fiche publiée'}</h2><ul>${(p.services?.[lang]||[]).map(s=>`<li>${e(s)}</li>`).join('')}</ul><p>${labelDate(lang,p)}: <time datetime="${p.reviewed}">${p.reviewed}</time></p><p class="recovery-note">${dateNote(lang)}</p><h2>${u.source}</h2>${(p.sources||[p.source]).map(url=>link(url,url)).join('')}<p>${u.unconfirmed}</p>${link(path('contact'),u.correction)}</article><aside class="sidebar"><div class="callout"><h2>${u.listingNote}</h2><p>${u.listingBody}</p>${link(regionPath(lang,p.province),p.regionName[lang])}</div></aside></div></section>`;
  await write(lang,'clinics',p.name[lang],body,providerPath(lang,p.id),providerPath(other,p.id));
 }
 for(const p of pages.slice(4)){
  const title=c.footer[pages.indexOf(p)-4],entry=ed[p]||{intro:c.disclosure,sections:[{title:u.emergencyTitle,body:u.emergency}]};
  await write(lang,p,title,`${heading(title,entry.intro)}<section class="section"><div class="container prose">${p==='contact'?`<p>${link('tel:'+administrativeContact.phone,administrativeContact.display,'button')}</p><p>${lang==='en'?'Administrative website inquiries only. This is not a clinical, appointment or emergency line.':'Demandes administratives sur le site uniquement. Ce n’est pas une ligne clinique, de rendez-vous ou d’urgence.'}</p><p>${link(administrativeContact.source,lang==='en'?'Source: published contact page':'Source : page de contact publiée')}</p>`:''}${entry.sections.map(s=>`<section><h2>${e(s.title)}</h2><p>${e(s.body)}</p></section>`).join('')}</div></section>`,path(p),pathFor(other,p));
 }
 for(const t of ed.topics){
  const existing=byPath.get(topicPath(lang,t.id));
  const body=existing?recoveredContent(existing.mainHtml,lang):`${heading(t.title,t.summary)}<section class="section prose">${t.sections.map(s=>`<h2>${e(s.title)}</h2><p>${e(s.body)}</p>`).join('')}</section>`;
  await write(lang,'information',t.title,body,topicPath(lang,t.id),topicPath(other,t.id),{recovered:!!existing});
 }
 const policy=lang==='en'?{title:'How listings are checked',intro:'Public information, with its source and limitations visible.'}:{title:'Révision des fiches',intro:'Des renseignements publics avec leurs sources et leurs limites.'};
 await write(lang,'editorial',policy.title,`${heading(policy.title,policy.intro)}<article class="prose"><p>${dateNote(lang)}</p>${ed.editorial.sections.map(s=>`<h2>${e(s.title)}</h2><p>${e(s.body)}</p>`).join('')}</article>`,path('providerPolicy'),pathFor(other,'providerPolicy'));
 await write(lang,'contact',lang==='en'?'For providers':'Pour les fournisseurs',`${heading(lang==='en'?'For providers':'Pour les fournisseurs',lang==='en'?'Public listing corrections and editorial information.':'Corrections des fiches publiques et information éditoriale.')}<article class="prose"><p>${c.disclosure}</p><p>${u.listingBody}</p>${link(path('contact'),u.correction)}</article>`,path('forProviders'),pathFor(other,'forProviders'),{index:false});
 const errorPath=lang==='en'?'/404/':'/fr/404/';
 await write(lang,'404',u.notFound,`${heading(u.notFound,u.notFoundText)}${link(path('home'),u.backHome,'button')}`,errorPath,other==='en'?'/404/':'/fr/404/',{index:false});
 // Preserve every observed address. Remaining static FAQ content is recovered,
 // stripped of runtime code, and linked to the same bilingual counterpart.
 for(const entry of live.filter(p=>p.lang===c.lang&&!allPaths.has(p.path)&&!connectionPaths.includes(p.path))){
  const alternate=entry.alternates.find(a=>a.hreflang===content[other].lang);
  if(!alternate)throw new Error(`Missing language counterpart ${entry.path}`);
  await write(lang,'information',titleOf(entry,lang),recoveredContent(entry.mainHtml,lang),entry.path,new URL(alternate.href).pathname,{index:entry.inSitemap,recovered:true});
 }
 for(const p of pages){const old=oldPathFor(lang,p);if(old!==path(p))redirects[old]=path(p);}
 for(const t of ed.topics)redirects[`/${lang}/information/${t.id}/`]=topicPath(lang,t.id);
 for(const [code] of regionNames)redirects[`${oldPathFor(lang,'resources')}${code.toLowerCase()}/`]=regionPath(lang,code);
 redirects[lang==='en'?connectionPaths[0]:connectionPaths[1]]=path('clinics');
}
for(const source of inventory)if(source.inSitemap&&!allPaths.has(source.path))throw new Error(`Missing published URL ${source.path}`);
for(const path of allPaths)delete redirects[path];
await writeFile(new URL('404.html',out),await readFile(new URL('404/index.html',out)));
await writeFile(new URL('redirects.json',out),JSON.stringify(redirects,null,2)+'\n');
await writeFile(new URL('_redirects',out),Object.entries(redirects).map(([from,to])=>`${from} ${to} 301`).join('\n')+'\n');
await writeFile(new URL('robots.txt',out),production?'User-agent: *\nAllow: /\nSitemap: https://abortionclinic.ca/sitemap.xml\n':'User-agent: *\nDisallow: /\n');
await writeFile(new URL('indexing.json',out),JSON.stringify(indexing,null,2)+'\n');
const headers=['/*','  Referrer-Policy: no-referrer','  X-Content-Type-Options: nosniff',"  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"];
if(!production)headers.push('  X-Robots-Tag: noindex, nofollow');
else for(const [path,index] of Object.entries(indexing))if(!index)headers.push(path,'  X-Robots-Tag: noindex, follow');
await writeFile(new URL('_headers',out),headers.join('\n')+'\n');
if(production)await writeFile(new URL('.htaccess',out),apacheConfig({redirects,indexing}));
await writeFile(new URL('sitemap.xml',out),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${[...sitemapPaths].map(p=>`<url><loc>https://abortionclinic.ca${p}</loc></url>`).join('')}</urlset>`);
console.log(`Built ${allPaths.size} pages; preserved all ${inventory.filter(x=>x.inSitemap).length} published sitemap URLs. ${Object.keys(redirects).length} compatibility redirects. ${production?'Production indexing enabled for sitemap pages.':'Preview indexing disabled.'}`);
