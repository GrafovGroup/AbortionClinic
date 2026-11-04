import {articles,provinces,pathFor} from './content';
import {providers} from './providers';
import {providerName} from './localization';
import {cityGuides, cityGuideForLocation, cityGuidePath} from './city-guides';
import {retiredConnectionDestination} from './retired-connection';
import {findLocationBySlug,locations,locationsInProvince,locationDirectoryPath,locationPath,provincePath,LOCATION_PAGE_SIZE} from './locations';

export function resolveRoute(route:string){
  const parts=route.split('/').filter(Boolean);const fr=parts[0]==='fr';if(fr)parts.shift();const local=parts.join('/');
  const retiredDestination=retiredConnectionDestination(route);
  const article=articles.find(a=>(fr?a.frSlug:a.slug)===local);
  let key=article?.slug||local;
  for (const [en,french] of [['find-care','trouver-des-soins'],['resources','ressources'],['for-providers','pour-les-prestataires'],['locations','localites'],['report-listing','signaler-une-fiche']]) if(local===(fr?french:en)) key=en;
  const cityGuide=parts.length===2 && parts[0]===(fr?'cliniques':'clinics') ? cityGuides.find(guide=>guide.slug===parts[1]) : undefined;
  const province=cityGuide?provinces.find(p=>p[0]===cityGuide.province):provinces.find(p=>p[fr?2:1]===parts[0]);
  const location=province&&parts.length===2?findLocationBySlug(province[0],parts[1]):undefined;
  const city=location?.name;
  const directorySegment=fr?'localites':'locations';
  const isLocationDirectory=key==='locations'||!!province&&parts[1]===directorySegment;
  const page=province&&parts.length===3&&/^[1-9]\d*$/.test(parts[2])?Number(parts[2]):1;
  const directoryPages=province?Math.ceil(locationsInProvince(province[0]).length/LOCATION_PAGE_SIZE):1;
  const validDirectory=isLocationDirectory&&(province?(parts.length===2||parts.length===3&&page>1&&page<=directoryPages):parts.length===1);
  if(isLocationDirectory)key='locations';
  const provider=parts[0]===(fr?'prestataires':'providers')&&parts.length===2?providers.find(p=>p.id===parts[1]):undefined;
  const translatedAlias=fr&&['find-care','resources','for-providers','locations','report-listing'].includes(local)?pathFor(local,true):undefined;
  const valid=parts.length===0||!!article||['find-care','resources','for-providers','report-listing'].includes(key)||!!retiredDestination||!!provider||!!validDirectory||!!province&&(parts.length===1||!!location);
  const equivalent=cityGuide?cityGuidePath(cityGuide.slug,!fr):provider?(fr?'/providers/':'/fr/prestataires/')+provider.id+'/':isLocationDirectory?locationDirectoryPath(province?.[0],!fr,page):location?locationPath(location,!fr):province?(fr?'/':'/fr/')+province[fr?1:2]+'/':pathFor(key,!fr);
  const title=cityGuide?cityGuide.title[fr?1:0]:provider?`${providerName(provider,fr)} — ${provider.city}`:isLocationDirectory?(province?`${province[fr?4:3]} — ${fr?'villes et localités':'cities and communities'}${page>1?' · page '+page:''}`:fr?'Trouver des soins par ville au Canada':'Find abortion care by city in Canada'):city?`${fr?'Soins d’avortement à ':'Abortion care in '}${city}, ${province![0]}`:province?`${fr?'Soins d’avortement — ':'Abortion care — '}${province[fr?4:3]}`:article?.title[fr?1:0]||({'find-care':fr?'Répertoire des cliniques d’avortement au Canada':'Abortion clinic directory in Canada','resources':fr?'Ressources et soutien':'Resources and support','for-providers':fr?'Pour les prestataires':'For providers','report-listing':fr?'Signaler une erreur dans une fiche':'Report a listing error','':fr?'Avortement au Canada – Cliniques et information':'Abortion in Canada – Clinics and information'}[key]);
  const legacyCityGuide=location&&!cityGuide?cityGuideForLocation(location):undefined;
  const redirectTo=retiredDestination || (legacyCityGuide?cityGuidePath(legacyCityGuide.slug,fr):province&&!cityGuide&&(location||validDirectory)?provincePath(province[0],fr):undefined);
  const indexable=!!valid&&!translatedAlias&&!redirectTo&&!['for-providers','report-listing'].includes(key);
  return {fr,key,article,province,location,city,cityGuide,provider,valid,equivalent,title,isLocationDirectory,page,directoryPages,indexable,translatedAlias,redirectTo,retiredDestination};
}

export function allPaths(includeLegacyRoutes=false){
  const paths=['',...articles.map(a=>a.slug),'find-care','resources','for-providers','locations','report-listing',...provinces.map(p=>p[1]),...cityGuides.map(guide=>cityGuidePath(guide.slug).slice(1,-1)),
    ...(includeLegacyRoutes?locations.map(l=>locationPath(l).slice(1,-1)):[]),
    ...providers.map(p=>'providers/'+p.id),
    ...(includeLegacyRoutes?provinces.flatMap(p=>Array.from({length:Math.ceil(locationsInProvince(p[0]).length/LOCATION_PAGE_SIZE)},(_,i)=>locationDirectoryPath(p[0],false,i+1).slice(1,-1))):[])];
  return [...new Set(paths.flatMap(r=>[r,resolveRoute(r).equivalent.replace(/^\/|\/$/g,'')]))];
}
