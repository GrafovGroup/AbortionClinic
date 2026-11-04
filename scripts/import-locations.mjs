// Refresh the public geography snapshot. No visitor queries are sent to Statistics Canada.
import {writeFile, mkdir} from 'node:fs/promises';

const endpoint = 'https://geo.statcan.gc.ca/geo_wa/rest/services/2025/lcsd000a25s_e/MapServer/0/query';
const codes = {'10':'NL','11':'PE','12':'NS','13':'NB','24':'QC','35':'ON','46':'MB','47':'SK','48':'AB','59':'BC','60':'YT','61':'NT','62':'NU'};
async function query(values) {
  const response = await fetch(endpoint + '?' + new URLSearchParams({f:'json',where:'1=1',...values}));
  if (!response.ok) throw new Error(`Statistics Canada: ${response.status}`);
  const result = await response.json();
  if (result.error) throw new Error(JSON.stringify(result.error));
  return result;
}
const {count} = await query({returnCountOnly:'true'});
const pages = await Promise.all(Array.from({length:Math.ceil(count/2000)}, (_, i) => query({
  outFields:'CSDUID,CSDNAME,CSDTYPE,PRUID,CDNAME',returnGeometry:'false',orderByFields:'CSDUID',resultOffset:String(i*2000),resultRecordCount:'2000'
})));
const rows = pages.flatMap(p=>p.features.map(({attributes:a})=>[a.CSDUID,a.CSDNAME,codes[a.PRUID],a.CSDTYPE,a.CDNAME]));
if (rows.length!==count || new Set(rows.map(r=>r[0])).size!==count || new Set(rows.map(r=>r[2])).size!==13 || rows.some(r=>r.some(v=>typeof v!=='string'))) throw new Error('Incomplete geography snapshot');
await mkdir('lib/data',{recursive:true});
await writeFile('lib/data/canada-locations.json', JSON.stringify(rows)+'\n');
await writeFile('lib/data/location-source.json', JSON.stringify({
  title:'Statistics Canada — Census Subdivision Boundary File, 2025',
  url:'https://www150.statcan.gc.ca/n1/en/catalogue/92-162-X',
  api:endpoint,referenceDate:'2025-01-01',retrieved:new Date().toISOString().slice(0,10),count,
  fields:['CSDUID','CSDNAME','provinceCode','CSDTYPE','CDNAME'],
  attribution:'Adapted from Statistics Canada, Census Subdivision Boundary File, 2025. This does not constitute an endorsement by Statistics Canada.',
  licence:'https://www.statcan.gc.ca/en/reference/licence'
},null,2)+'\n');
console.log(`Imported ${count} municipalities and equivalent areas across 13 provinces and territories.`);
