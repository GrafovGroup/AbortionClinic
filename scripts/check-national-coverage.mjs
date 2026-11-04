import assert from 'node:assert/strict';
import {createServer} from 'vite';

// Independent coverage baseline: Statistics Canada, SGC 2021, all 41 CMAs.
// https://www23.statcan.gc.ca/imdb/p3VD.pl?CLV=1&CPV=A&CST=01012021&CVD=1348194&Function=getVD&MLV=3&TVD=1348193
// Multi-centre CMA names require each named municipal core to be discoverable.
const metropolitanCores = [
  ['001', [['NL', "St. John's"]]],
  ['205', [['NS', 'Halifax']]],
  ['305', [['NB', 'Moncton']]],
  ['310', [['NB', 'Saint John']]],
  ['320', [['NB', 'Fredericton']]],
  ['408', [['QC', 'Saguenay']]],
  ['421', [['QC', 'Québec']]],
  ['433', [['QC', 'Sherbrooke']]],
  ['442', [['QC', 'Trois-Rivières']]],
  ['447', [['QC', 'Drummondville']]],
  ['462', [['QC', 'Montréal']]],
  ['505', [['ON', 'Ottawa'], ['QC', 'Gatineau']]],
  ['521', [['ON', 'Kingston']]],
  ['522', [['ON', 'Belleville'], ['ON', 'Quinte West']]],
  ['529', [['ON', 'Peterborough']]],
  ['532', [['ON', 'Oshawa']]],
  ['535', [['ON', 'Toronto']]],
  ['537', [['ON', 'Hamilton']]],
  ['539', [['ON', 'St. Catharines'], ['ON', 'Niagara Falls']]],
  ['541', [['ON', 'Kitchener'], ['ON', 'Cambridge'], ['ON', 'Waterloo']]],
  ['543', [['ON', 'Brantford']]],
  ['550', [['ON', 'Guelph']]],
  ['555', [['ON', 'London']]],
  ['559', [['ON', 'Windsor']]],
  ['568', [['ON', 'Barrie']]],
  ['580', [['ON', 'Greater Sudbury / Grand Sudbury']]],
  ['595', [['ON', 'Thunder Bay']]],
  ['602', [['MB', 'Winnipeg']]],
  ['705', [['SK', 'Regina']]],
  ['725', [['SK', 'Saskatoon']]],
  ['810', [['AB', 'Lethbridge']]],
  ['825', [['AB', 'Calgary']]],
  ['830', [['AB', 'Red Deer']]],
  ['835', [['AB', 'Edmonton']]],
  ['915', [['BC', 'Kelowna']]],
  ['925', [['BC', 'Kamloops']]],
  ['930', [['BC', 'Chilliwack']]],
  ['932', [['BC', 'Abbotsford'], ['BC', 'Mission']]],
  ['933', [['BC', 'Vancouver']]],
  ['935', [['BC', 'Victoria']]],
  ['938', [['BC', 'Nanaimo']]],
];
const capitals = [
  ['NL', "St. John's"], ['PE', 'Charlottetown'], ['NS', 'Halifax'],
  ['NB', 'Fredericton'], ['QC', 'Québec'], ['ON', 'Toronto'],
  ['MB', 'Winnipeg'], ['SK', 'Regina'], ['AB', 'Edmonton'],
  ['BC', 'Victoria'], ['YT', 'Whitehorse'], ['NT', 'Yellowknife'], ['NU', 'Iqaluit'],
];
assert.equal(metropolitanCores.length, 41);
assert.equal(capitals.length, 13);

const server = await createServer({configFile:false, server:{middlewareMode:true,hmr:false,ws:false,watch:null},logLevel:'error'});
try {
  const {cityGuides, cityGuideForLocation, cityGuidePath} = await server.ssrLoadModule('/lib/city-guides.ts');
  const locationModule = await server.ssrLoadModule('/lib/locations.ts');
  const {locations, providerLocation, localProviders, locationCarePath, normalizeLocation, searchLocations, coveredCommunities, coverageGuideForLocation, guideProviders} = locationModule;
  const {providers} = await server.ssrLoadModule('/lib/providers.ts');
  const {resolveRoute} = await server.ssrLoadModule('/lib/routes.ts');
  const {metadataForRoute} = await server.ssrLoadModule('/lib/seo.ts');
  const failures = [];
  const check = (condition, message) => {if (!condition) failures.push(message);};
  const checkUrl = (url, context) => {
    try {check(new URL(url).protocol === 'https:', `Non-HTTPS public source: ${context}`);}
    catch {failures.push(`Invalid public source: ${context}`);}
  };
  const providerById = new Map(providers.map(provider => [provider.id, provider]));
  check(providerById.size === providers.length, 'Duplicate provider IDs');
  check(new Set(cityGuides.map(guide => guide.slug)).size === cityGuides.length, 'Duplicate city guide route slugs');
  const guidePlaces = new Map();
  for (const guide of cityGuides) {
    const place = locations.find(location => location.province === guide.province && location.slug === guide.slug);
    check(place, `Guide has no canonical municipality: ${guide.province}/${guide.slug}`);
    if (place) {
      guidePlaces.set(place.province + '/' + normalizeLocation(place.name), guide);
      check(cityGuideForLocation(place)?.slug === guide.slug, `Direct guide lookup failed: ${guide.slug}`);
      for (const fr of [false, true]) {
        const route = cityGuidePath(guide.slug, fr);
        const resolved = resolveRoute(route);
        check(resolved.valid && resolved.indexable && !resolved.redirectTo, `Guide route unavailable: ${route}`);
        check(resolved.location?.id === place.id, `Guide route has wrong municipality: ${route}`);
        check(locationCarePath(place, fr) === route, `Core community link misses its guide: ${route}`);
        const meta = metadataForRoute(route);
        check(meta.alternates?.canonical === 'https://abortionclinic.ca' + route, `Wrong canonical: ${route}`);
        check(meta.alternates?.languages?.[fr ? 'en-CA' : 'fr-CA'] === 'https://abortionclinic.ca' + cityGuidePath(guide.slug, !fr), `Missing language alternate: ${route}`);
      }
    }
    for (const field of ['title', 'description', 'booking']) {
      check(Array.isArray(guide[field]) && guide[field].length === 2 && guide[field].every(value => typeof value === 'string' && value.trim().length > 20), `Incomplete bilingual ${field}: ${guide.slug}`);
    }
    check(/^\d{4}-\d{2}-\d{2}$/.test(guide.updated), `Missing review date: ${guide.slug}`);
    check(guide.source?.label?.length === 2 && guide.source.label.every(value => value.trim()), `Missing bilingual source label: ${guide.slug}`);
    checkUrl(guide.source?.url, guide.slug);
    if (guide.source?.frUrl) checkUrl(guide.source.frUrl, guide.slug + ' French');
    const regionalIds = guide.regionalProviderIds || [];
    check(new Set(regionalIds).size === regionalIds.length, `Duplicate regional provider references: ${guide.slug}`);
    for (const id of regionalIds) {
      const provider = providerById.get(id);
      check(provider, `Unknown regional provider ${id}: ${guide.slug}`);
    }
    for (const provider of guideProviders(guide)) {
      check(regionalIds.includes(provider.id), `Unrequested regional provider displayed: ${guide.slug}/${provider.id}`);
      if (place) check(providerLocation.get(provider.id)?.id !== place.id, `Local provider incorrectly displayed as regional: ${guide.slug}/${provider.id}`);
    }
    const surrounding = guide.surrounding || [];
    check(new Set(surrounding.map(normalizeLocation)).size === surrounding.length, `Duplicate surrounding names: ${guide.slug}`);
    for (const name of surrounding) {
      const matches = locations.filter(location => location.province === guide.province && normalizeLocation(location.name) === normalizeLocation(name));
      check(matches.length > 0, `Unknown surrounding municipality: ${guide.slug}/${name}`);
    }
    const communities = coveredCommunities(guide);
    check(new Set(communities.map(location => location.id)).size === communities.length, `Duplicate resolved surrounding municipalities: ${guide.slug}`);
    for (const community of communities) {
      check(community.province === guide.province, `Surrounding link crosses province boundary: ${guide.slug}/${community.name}`);
      const preferred = coverageGuideForLocation(community);
      check(preferred, `Surrounding municipality has no access guide: ${guide.slug}/${community.name}`);
      for (const fr of [false, true]) {
        const destination = new URL(locationCarePath(community, fr), 'https://abortionclinic.ca');
        const route = resolveRoute(destination.pathname);
        check(route.valid && !route.redirectTo, `Broken surrounding link: ${guide.slug}/${community.name}`);
        check(route.province?.[0] === community.province, `Surrounding navigation crosses province: ${guide.slug}/${community.name}`);
      }
    }
    for (const alias of guide.aliases || []) {
      check(searchLocations(alias + ', ' + guide.province).some(location => location.id === place?.id), `City alias does not resolve to guide: ${guide.slug}/${alias}`);
    }
  }
  for (const [code, cores] of metropolitanCores) {
    for (const [province, city] of cores) {
      check(guidePlaces.has(province + '/' + normalizeLocation(city)), `Missing CMA ${code} municipal core guide: ${city}, ${province}`);
    }
  }
  for (const [province, city] of capitals) {
    check(guidePlaces.has(province + '/' + normalizeLocation(city)), `Missing capital guide: ${city}, ${province}`);
  }
  for (const provider of providers) {
    const place = providerLocation.get(provider.id);
    check(place, `Provider has no canonical municipality: ${provider.id} (${provider.city}, ${provider.province})`);
    if (place) {
      check(place.province === provider.province, `Provider mapped across province boundary: ${provider.id}`);
      check(localProviders(place).some(item => item.id === provider.id), `Local provider missing from municipality: ${provider.id}`);
    }
    check(/^\+?[\d\s().-]+(?:;ext=\d+)?$/.test(provider.phone), `Unusable phone string: ${provider.id}`);
    check(provider.sources?.length > 0, `Missing provider evidence: ${provider.id}`);
    for (const source of provider.sources || []) checkUrl(source, provider.id);
  }
  assert.equal(failures.length, 0, '\n' + failures.join('\n'));
  const uniqueSurrounding=new Set(cityGuides.flatMap(guide=>coveredCommunities(guide).map(place=>place.id)));
  const guidedCommunities=new Set([...uniqueSurrounding,...cityGuides.map(guide=>locations.find(place=>place.province===guide.province&&place.slug===guide.slug)?.id)]);
  console.log(JSON.stringify({metropolitanAreas:metropolitanCores.length,municipalCores:metropolitanCores.flatMap(([,cores])=>cores).length,capitals:capitals.length,cityGuides:cityGuides.length,bilingualGuidePages:cityGuides.length*2,providers:providers.length,uniqueSurroundingCommunities:uniqueSurrounding.size,totalGuidedCommunities:guidedCommunities.size},null,2));
} finally {await server.close();}
