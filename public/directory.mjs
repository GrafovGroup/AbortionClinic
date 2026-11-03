export const normalize = value => String(value).normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim();
const names={AB:'Alberta',BC:'British Columbia Colombie-Britannique',MB:'Manitoba',NB:'New Brunswick Nouveau-Brunswick',NL:'Newfoundland Labrador Terre-Neuve-et-Labrador',NT:'Northwest Territories Territoires du Nord-Ouest',NS:'Nova Scotia Nouvelle-Écosse',NU:'Nunavut',ON:'Ontario',PE:'Prince Edward Island Île-du-Prince-Édouard',QC:'Quebec Québec',SK:'Saskatchewan',YT:'Yukon'};
export function filterProviders(records, query='', region='') {
 const words=normalize(query).split(/\s+/).filter(Boolean);
 return records.filter(p => (!region || p.province===region) && words.every(word=>normalize([p.city,p.province,names[p.province]].join(' ')).includes(word)));
}
export function validateProviders(records) {
 if(!Array.isArray(records)) throw new Error('Provider data must be an array');
 const ids=new Set();
 for(const p of records) {
  if(typeof p.id!=='string'||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.id)||ids.has(p.id)) throw new Error('Invalid or duplicate provider id');
  ids.add(p.id);
  if(typeof p.province!=='string'||!Object.hasOwn(names,p.province)||typeof p.city!=='string'||!p.city.trim()) throw new Error('Provider requires city and region');
  for(const key of ['name','address']) for(const lang of ['en','fr']) if(typeof p[key]?.[lang]!=='string'||!p[key][lang].trim()) throw new Error('Missing localized provider field');
  for(const key of ['website','source']) {if(typeof p[key]!=='string') throw new Error('Provider links must be strings');const url=new URL(p[key]);if(url.protocol!=='https:'||url.username||url.password) throw new Error('Provider links must use HTTPS without credentials');}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(p.reviewed)||!Number.isFinite(Date.parse(p.reviewed))||new Date(p.reviewed).toISOString().slice(0,10)!==p.reviewed||p.reviewed>new Date().toISOString().slice(0,10)) throw new Error('Invalid provider review date');
  if(p.phone!==undefined && (typeof p.phone!=='string'||!/^\+?[\d ()-]{7,25}$/.test(p.phone))) throw new Error('Invalid public phone');
 }
 return records;
}
