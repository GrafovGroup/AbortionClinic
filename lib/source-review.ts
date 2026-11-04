import {localizedResource, providerName} from './localization';
import {providers, bookingByProvider, type Provider} from './providers';
import {articles, pathFor} from './content';
import {cityGuides, cityGuidePath} from './city-guides';
import {practicalSources} from './provider-practical-details';

export type LinkOutcome = 'available' | 'missing' | 'manual';
export type CheckedSource = {url:string; outcome:LinkOutcome; http_status:number|null; checked_at:string};
export type ReviewCategory = 'provider' | 'article' | 'city';
export type SourceReviewEntry = {
  id:string; category:ReviewCategory; name:string; frenchName:string; city:string; province:string;
  reviewed:string|null; path:string; frenchPath:string; urls:string[];
};
export type ReviewRow = {
  id:string; category:ReviewCategory; name:string; frenchName:string; city:string; province:string;
  reviewed:string|null; due:boolean; path:string; frenchPath:string;
  sources:(CheckedSource|{url:string;outcome:'unchecked';http_status:null;checked_at:null})[];
};

// Only public HTTPS links already included in published content enter the queue.
// The API never accepts a URL from an editor's request body.
function sourceURLs(urls:string[]) {
  return [...new Set(urls.flatMap(url=>[url,localizedResource(url,true)]))].filter(url=>{
    try {const parsed=new URL(url);return parsed.protocol==='https:'&&!parsed.username&&!parsed.password;}
    catch {return false;}
  });
}

export function publishedSources(provider:Provider) {
  return sourceURLs([provider.url,...provider.sources,...practicalSources(provider.id),...(bookingByProvider[provider.id]?.bookingUrl?[bookingByProvider[provider.id].bookingUrl!]:[])]);
}

export function sourceReviewCatalogue():SourceReviewEntry[] {
  const providerEntries:SourceReviewEntry[]=providers.map(provider=>({
    id:provider.id, category:'provider', name:provider.name, frenchName:providerName(provider,true),
    city:provider.city, province:provider.province, reviewed:provider.reviewed,
    path:'/providers/'+provider.id+'/', frenchPath:'/fr/prestataires/'+provider.id+'/', urls:publishedSources(provider),
  }));
  const articleEntries=articles.map<SourceReviewEntry>(article=>({
    id:'article:'+article.slug, category:'article', name:article.title[0], frenchName:article.title[1],
    city:'', province:'', reviewed:article.reviewed||null,
    path:pathFor(article.slug,false), frenchPath:pathFor(article.slug,true),
    urls:sourceURLs([...(article.sources||[]),...(article.sourceNotes||[]).map(source=>source.url)]),
  })).filter(entry=>entry.urls.length>0);
  const cityEntries:SourceReviewEntry[]=cityGuides.map(guide=>({
    id:'city:'+guide.slug, category:'city', name:guide.title[0], frenchName:guide.title[1],
    city:'', province:guide.province, reviewed:guide.updated,
    path:cityGuidePath(guide.slug,false), frenchPath:cityGuidePath(guide.slug,true),
    urls:sourceURLs([guide.source.url,...(guide.source.frUrl?[guide.source.frUrl]:[])]),
  }));
  return [...providerEntries,...articleEntries,...cityEntries];
}

export function reviewRows(records:CheckedSource[],now=Date.now()): ReviewRow[] {
  const recordsByURL=new Map(records.map(record=>[record.url,record]));
  const cutoff=new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'America/Toronto'}).format(new Date(now-90*86400000));
  return sourceReviewCatalogue().map(({urls,...entry})=>({
    ...entry, due:!entry.reviewed||entry.reviewed<=cutoff,
    sources:urls.map(url=>recordsByURL.get(url)??{url,outcome:'unchecked' as const,http_status:null,checked_at:null}),
  })).sort((a,b)=>
    Number(b.sources.some(s=>s.outcome==='missing'))-Number(a.sources.some(s=>s.outcome==='missing'))||
    Number(b.due)-Number(a.due)||(a.reviewed||'').localeCompare(b.reviewed||'')||a.name.localeCompare(b.name));
}

// Only call with URLs from the published catalogue. A redirect may target another
// organization, so editors inspect redirects themselves before updating a listing.
export async function checkPublishedSource(url:string,request:typeof fetch=fetch):Promise<CheckedSource> {
  const checked_at=new Date().toISOString();
  let http_status:number|null=null;
  let outcome:LinkOutcome='manual';
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),6000);
  try {
    if (new URL(url).protocol==='https:') {
      const response=await request(url,{method:'GET',redirect:'manual',signal:controller.signal,headers:{Accept:'text/html,application/pdf,*/*;q=0.5'}});
      http_status=response.status;
      if (http_status===404||http_status===410) outcome='missing';
      else if (response.ok) outcome='available';
      if (response.body) await response.body.cancel();
    }
  } catch { /* A timeout or network refusal needs a manual check. */ }
  finally {clearTimeout(timeout);}
  return {url,outcome,http_status,checked_at};
}

export async function prepareSourceChecks(db:D1Database) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS source_link_checks (
    url TEXT PRIMARY KEY NOT NULL, outcome TEXT NOT NULL, http_status INTEGER, checked_at TEXT NOT NULL
  )`).run();
}
