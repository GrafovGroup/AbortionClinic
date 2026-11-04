import data from './data/canada-locations.json';
import source from './data/location-source.json';
import {provinces, slugify} from './content';
import {providers} from './providers';
import {cityGuides, cityGuideForLocation, cityGuidePath, type CityGuide} from './city-guides';

export type Location = {id:string;name:string;province:string;type:string;region:string;slug:string};
export const locationSource = source;
export const LOCATION_PAGE_SIZE = 60;
export const normalizeLocation = (value:string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[.’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const duplicates = new Map<string,number>();
for (const row of data) { const key=row[2]+'/'+slugify(row[1]); duplicates.set(key,(duplicates.get(key)||0)+1); }
const cityTypes=['C','CY','CV','V','RGM','T'];
const existingCities=new Set(providers.map(p=>p.province+'/'+slugify(p.city)));
export const locations:Location[] = data.map(([id,name,province,type,region])=>({id,name,province,type,region,slug:slugify(name)+(duplicates.get(province+'/'+slugify(name))!>1&&!(existingCities.has(province+'/'+slugify(name))&&cityTypes.includes(type))?'-'+id:'')})).sort((a,b)=>a.name.localeCompare(b.name,'en-CA',{numeric:true})||a.id.localeCompare(b.id));
const byPath = new Map(locations.map(l=>[l.province+'/'+l.slug,l]));
export const locationsInProvince = (code:string) => locations.filter(l=>l.province===code);
export const findLocationBySlug = (code:string,slug:string) => byPath.get(code+'/'+slug);
export const provincePath = (code:string,fr=false) => (fr?'/fr/':'/')+provinces.find(p=>p[0]===code)![fr?2:1]+'/';
export const locationPath = (l:Location,fr=false) => provincePath(l.province,fr)+l.slug+'/';
export function locationCarePath(location: Location, fr = false) {
  const guide = cityGuideForLocation(location);
  if (guide) return cityGuidePath(guide.slug, fr);
  const regionalGuide = !localProviders(location).length && coverageGuideForLocation(location);
  if (regionalGuide) return cityGuidePath(regionalGuide.slug, fr) + '#surrounding-communities';
  const query = localProviders(location).length ? '#q=' + encodeURIComponent(location.name + ', ' + location.province) : '';
  return provincePath(location.province, fr) + query;
}
export const locationDirectoryPath = (code?:string,fr=false,page=1) => (code?provincePath(code,fr):(fr?'/fr/':'/'))+(fr?'localites/':'locations/')+(page>1?page+'/':'');

// Match listings to actual municipalities. Same-name places must never share providers.
export const providerLocation = new Map(providers.map(p=>[p.id,locations.find(l=>l.province===p.province&&normalizeLocation(l.name)===normalizeLocation(p.city)&&cityTypes.includes(l.type))]));
export const localProviders = (location:Location) => providers.filter(p=>providerLocation.get(p.id)?.id===location.id);
export const indexedLocations = locations.filter(l=>localProviders(l).length>0);

// Curated browsing connections, never a claim about a clinic's service area.
const communityCache = new Map<CityGuide, Location[]>();
export function coveredCommunities(guide: CityGuide): Location[] {
  const cached=communityCache.get(guide);
  if(cached)return cached;
  const names = new Set((guide.surrounding || []).map(normalizeLocation));
  const candidates = locations.filter(place => place.province === guide.province && names.has(normalizeLocation(place.name)) && place.slug !== guide.slug);
  const result=candidates.filter(place => {
    const sameName = candidates.filter(other => normalizeLocation(other.name) === normalizeLocation(place.name));
    const preferred = sameName.find(other => cityTypes.includes(other.type)) || sameName.find(other => !['IRI','S-É'].includes(other.type)) || sameName[0];
    return place.id === preferred.id;
  });
  communityCache.set(guide,result);
  return result;
}
export function coverageGuideForLocation(location: Location) {
  return cityGuideForLocation(location) || cityGuides.find(guide => guide.province === location.province && coveredCommunities(guide).some(place => place.id === location.id));
}
export function guideProviders(guide: CityGuide) {
  const local = findLocationBySlug(guide.province,guide.slug);
  const localIds = new Set(local ? localProviders(local).map(provider=>provider.id) : []);
  return providers.filter(provider => guide.regionalProviderIds?.includes(provider.id) && !localIds.has(provider.id));
}

const provinceAliases = new Map([
  ['pei','pe'], ['ipe','pe'], ['nwt','nt'], ['tno','nt'], ['cb','bc'], ['tnl','nl'],
]);
const provinceNames = new Map(provinces.flatMap(province =>
  [province[0], province[3], province[4]].map(name => [normalizeLocation(name), province] as const)
));
export function provinceForQuery(query:string) {
  const name = normalizeLocation(query);
  return provinceNames.get(provinceAliases.get(name.replace(/ /g, '')) || name);
}

function cityQuery(query:string) {
  return normalizeLocation(query).replace(/^(?:quebec city|ville de quebec)(?= |$)/, 'quebec');
}

function aliasLocations(query:string,code?:string) {
  const q=normalizeLocation(query);
  return cityGuides.filter(guide=>(!code||guide.province===code)&&(guide.aliases||[]).some(alias=>{
    const name=normalizeLocation(alias);
    return q===name||q===name+' '+guide.province.toLowerCase();
  })).map(guide=>findLocationBySlug(guide.province,guide.slug)).filter((place):place is Location=>!!place);
}

const searchIndex = locations.map(location=>{
  const p=provinces.find(p=>p[0]===location.province)!;
  const name=normalizeLocation(location.name);
  return {location,name,qualified:[name+' '+location.province.toLowerCase(),name+' '+normalizeLocation(p[3]),name+' '+normalizeLocation(p[4])]};
});
export function searchLocations(query:string,code?:string,limit=8) {
  const q=cityQuery(query);
  if (!q) return [];
  const region = provinceForQuery(query);
  const aliases=aliasLocations(query,code);
  const exact=searchIndex.filter(s=>(!code||s.location.province===code)&&(s.name===q||s.qualified.includes(q)));
  if(aliases.length&&!exact.length)return aliases.slice(0,limit);
  return searchIndex.filter(s=>(!code||s.location.province===code)&&(region ? s.location.province===region[0] : s.name.includes(q)||s.qualified.some(name=>name.startsWith(q))))
    .sort((a,b)=>Number(b.name===q||b.qualified.includes(q))-Number(a.name===q||a.qualified.includes(q))||Number(b.name.startsWith(q))-Number(a.name.startsWith(q)))
    .slice(0,limit).map(s=>s.location);
}
export function exactLocations(query:string,code?:string) {
  const q=cityQuery(query);
  const exact=searchIndex.filter(s=>(!code||s.location.province===code)&&(s.name===q||s.qualified.includes(q))).map(s=>s.location);
  if(exact.length)return exact;
  const aliases=aliasLocations(query,code);
  if(aliases.length)return aliases;
  return [];
}
