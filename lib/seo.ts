import type {Metadata} from 'next';
import {resolveRoute} from './routes';
import {providers} from './providers';
import {providerName,localizedResource} from './localization';
import {provinces,pathFor, type Article} from './content';
import {cityGuides,cityGuidePath} from './city-guides';
import {localProviders,provincePath} from './locations';
import {articleDescriptions} from './article-descriptions';

export const SITE_ORIGIN='https://abortionclinic.ca';
export const absolutePath=(route:string)=>SITE_ORIGIN+'/'+route.replace(/^\/|\/$/g,'')+(route.replace(/^\/|\/$/g,'')?'/':'');
const educationalArticleSlugs = new Set([
  'medication-abortion','procedural-abortion','cost','what-to-expect','faq',
  'booking-abortion-appointment','abortion-without-health-card','travelling-for-abortion-care',
  'virtual-abortion-care','language-accessibility','finding-abortion-provider',
]);
const isEducationalArticle=(article:Article|undefined)=>!!article&&educationalArticleSlugs.has(article.slug);
// Explicit revisions for the national pages expanded in this release. Source
// checks remain separate from HTTP link checks and are never refreshed on read.
const nationalPageRevisions:Record<string,string>={
  '':'2026-11-03', locations:'2026-11-03', resources:'2026-11-03',
};
export function lastModifiedForRoute(route:string):string|undefined {
  const r=resolveRoute(route);
  if(!r.indexable)return undefined;
  const revised=r.article?(r.article.updated||r.article.reviewed)
    :r.provider?r.provider.reviewed
    :r.cityGuide?r.cityGuide.updated
    :!r.province?nationalPageRevisions[r.key]:undefined;
  return revised&&/^\d{4}-\d{2}-\d{2}$/.test(revised)?revised:undefined;
}
export function pageDescription(route:string){
  const r=resolveRoute(route);const {fr,location,province,provider,article}=r;
  if(r.cityGuide)return r.cityGuide.description[fr?1:0];
  if(provider)return fr?`Consultez les services de ${providerName(provider,fr)} à ${provider.city}, son numéro de téléphone et son site officiel pour joindre l’organisme directement.`:`Find the phone number, official website and listed services for ${provider.name} in ${provider.city}. Contact the organization directly.`;
  if(location){const count=localProviders(location).length;return fr?`Avortement à ${location.name} (${location.province}) : ${count?'coordonnées de prestataires locaux et sources':'orientation régionale et soutien pour trouver des soins'}. Information indépendante.`:`Abortion care in ${location.name}, ${location.province}: ${count?'local provider contacts and sources':'regional referrals and help finding care'}. Free, independent information.`;}
  if(r.isLocationDirectory)return fr?'Parcourez les guides des grandes villes canadiennes et de leurs environs. Consultez les coordonnées des cliniques, les modalités de rendez-vous et les ressources régionales.':'Browse guides to major Canadian cities and surrounding communities, with clinic contacts, booking instructions and regional access resources.';
  if(province)return fr?`Soins d’avortement — ${province[4]} : coordonnées publiques, services documentés et orientation régionale. Répertoire indépendant et gratuit.`:`Abortion care in ${province[3]}: public provider contacts, documented services and regional referrals. Free, independent directory.`;
  if(article)return articleDescriptions[article.slug]?.[fr?1:0]||article.intro[fr?1:0];
  const descriptions:Record<string,[string,string]>={
    '':['Find abortion clinics in Canada, read about care options and get phone numbers and official websites to contact a clinic directly.','Trouvez une clinique d’avortement au Canada, renseignez-vous sur les options de soins et consultez les coordonnées pour joindre une clinique directement.'],
    'find-care':['Search abortion clinic listings by city, province or territory. Filter by documented service, then call a clinic or visit its official website.','Cherchez une clinique d’avortement par ville, province ou territoire. Filtrez les services, puis appelez la clinique ou consultez son site officiel.'],
    'resources':['Understand medication and procedural abortion, costs, appointments and support options in Canada. Independent information with public sources.','Comprenez l’avortement par médicaments et par intervention, les coûts, les rendez-vous et le soutien au Canada. Information indépendante et sources publiques.'],
    'for-providers':['Healthcare organizations can request a listing correction or identity review. Submit public evidence for editorial review.','Les organismes de santé peuvent demander la correction d’une fiche ou une vérification d’identité en fournissant une source publique.'],
    'report-listing':['Report an outdated phone number, broken link or other listing error for editorial review. No medical information is requested.','Signalez un numéro périmé, un lien brisé ou une autre erreur dans une fiche pour vérification. Aucun renseignement médical n’est demandé.']};
  return descriptions[r.key]?.[fr?1:0]||'';
}
export function metadataForRoute(route:string):Metadata{
  const consolidated=resolveRoute(route).redirectTo;
  if(consolidated)return {robots:{index:false,follow:true},alternates:{canonical:SITE_ORIGIN+consolidated}};
  const r=resolveRoute(route);const self=absolutePath(route);const en=r.fr?SITE_ORIGIN+r.equivalent:self;const french=r.fr?self:SITE_ORIGIN+r.equivalent;
  const shareImage={url:SITE_ORIGIN+'/social/abortionclinic-'+(r.fr?'fr':'en')+'.jpg',width:1200,height:630,type:'image/jpeg',alt:r.fr?'AbortionClinic.ca — Répertoire canadien indépendant. Coordonnées des cliniques et information sur les soins.':'AbortionClinic.ca — Independent Canadian directory. Clinic contacts and information about care.'};
  return {title:(r.title||(r.fr?'Page introuvable':'Page not found'))+' | AbortionClinic.ca',description:pageDescription(route),alternates:{canonical:self,languages:{'en-CA':en,'fr-CA':french,'x-default':en}},robots:{index:r.indexable,follow:true},openGraph:{type:'website',siteName:'AbortionClinic.ca',title:r.title,description:pageDescription(route),url:self,locale:r.fr?'fr_CA':'en_CA',alternateLocale:r.fr?'en_CA':'fr_CA',images:[shareImage]},twitter:{card:'summary_large_image',title:r.title,description:pageDescription(route),images:[{url:shareImage.url,alt:shareImage.alt}]}};
}
export function breadcrumbsForRoute(route:string){
  const r=resolveRoute(route);const home={name:'Canada',path:pathFor('',r.fr)};
  if(!r.key)return [];
  const crumbs=[home];const code=r.province?.[0]||r.provider?.province;
  if(code){const p=provinces.find(p=>p[0]===code)!;crumbs.push({name:p[r.fr?4:3],path:provincePath(code,r.fr)});}
  const self='/'+route.replace(/^\/|\/$/g,'')+'/';
  if(crumbs.at(-1)?.path!==self)crumbs.push({name:r.city||(r.provider?providerName(r.provider,r.fr):undefined)||(r.isLocationDirectory?(r.fr?'Villes et localités':'Cities and communities')+(r.page>1?' · '+r.page:''):r.title||''),path:self});
  return crumbs;
}
export function structuredDataForRoute(route:string){
  const r=resolveRoute(route);const url=absolutePath(route);const language=r.fr?'fr-CA':'en-CA';
  const publisher={'@type':'Organization','@id':SITE_ORIGIN+'/#publisher',name:'AbortionClinic.ca',url:SITE_ORIGIN+'/',description:r.fr?'Répertoire indépendant d’information sur les services d’avortement au Canada.':'Independent information directory of abortion services in Canada.',subjectOf:{'@id':SITE_ORIGIN+pathFor('about',r.fr)+'#webpage'}};
  const website={'@type':'WebSite','@id':SITE_ORIGIN+'/#website',name:'AbortionClinic.ca',url:SITE_ORIGIN+'/',inLanguage:['en-CA','fr-CA'],publisher:{'@id':publisher['@id']}};
  const crumbs=breadcrumbsForRoute(route);
  const page:Record<string,unknown>={'@type':r.province||r.isLocationDirectory||r.key==='find-care'||!r.key?'CollectionPage':'WebPage','@id':url+'#webpage',url,name:r.title,description:pageDescription(route),inLanguage:language,isPartOf:{'@id':SITE_ORIGIN+'/#website'}};
  const modified=lastModifiedForRoute(route);
  if(modified)page.dateModified=modified;
  if(r.article?.reviewed)page.lastReviewed=r.article.reviewed;
  if(crumbs.length)page.breadcrumb={'@id':url+'#breadcrumb'};
  const list=r.location?localProviders(r.location):r.province&&!r.isLocationDirectory?providers.filter(p=>p.province===r.province![0]):r.key==='find-care'?providers:[];
  if(list.length)page.mainEntity={'@type':'ItemList',numberOfItems:list.length,itemListElement:[...list].sort((a,b)=>a.city.localeCompare(b.city)||a.name.localeCompare(b.name)).map((p,i)=>({'@type':'ListItem',position:i+1,name:providerName(p,r.fr),url:SITE_ORIGIN+(r.fr?'/fr/prestataires/':'/providers/')+p.id+'/'}))};
  if(r.isLocationDirectory&&!r.province)page.mainEntity={'@type':'ItemList',numberOfItems:cityGuides.length,itemListElement:[...cityGuides].sort((a,b)=>a.province.localeCompare(b.province)||a.slug.localeCompare(b.slug)).map((guide,i)=>({'@type':'ListItem',position:i+1,name:guide.title[r.fr?1:0],url:SITE_ORIGIN+cityGuidePath(guide.slug,r.fr)}))};
  if(r.provider)page.about={'@type':'Organization',name:providerName(r.provider,r.fr),url:localizedResource(r.provider.url,r.fr)};
  const article=isEducationalArticle(r.article)&&r.article?{
    '@type':'Article','@id':url+'#article',headline:r.article.title[r.fr?1:0],description:pageDescription(route),
    inLanguage:language,mainEntityOfPage:{'@id':url+'#webpage'},publisher:{'@id':publisher['@id']},
    ...(modified?{dateModified:modified}:{}),
    ...(r.article.sources?.length?{citation:[...new Set(r.article.sources.map(source=>localizedResource(source,r.fr)))]}:{}),
  }:undefined;
  if(article)page.mainEntity={'@id':article['@id']};
  return {'@context':'https://schema.org','@graph':[publisher,website,page,...(article?[article]:[]),...(crumbs.length?[{'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,item:SITE_ORIGIN+c.path}))}]:[])]};
}
