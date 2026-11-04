import assert from 'node:assert/strict';
import {createServer} from 'vite';

const server = await createServer({
  configFile: false,
  server: {middlewareMode: true, hmr: false, ws: false, watch: null},
  logLevel: 'error',
});

try {
  const {filterProviders} = await server.ssrLoadModule('/lib/directory-search.ts');
  const {locationCarePath, providerLocation, searchLocations} = await server.ssrLoadModule('/lib/locations.ts');
  const {providers} = await server.ssrLoadModule('/lib/providers.ts');
  const {resolveRoute} = await server.ssrLoadModule('/lib/routes.ts');
  const {localProviders} = await server.ssrLoadModule('/lib/locations.ts');
  const contacts = (query, region) => filterProviders(query, [], false, region);
  for (const query of ['Quebec City', 'Québec City, QC', 'Ville de Québec', 'Québec, QC']) {
    const matches = contacts(query);
    assert(matches.length && matches.every(provider => provider.city === 'Québec'), query);
    assert.equal(searchLocations(query)[0].name, 'Québec');
  }
  assert(contacts('Québec').some(provider => provider.city !== 'Québec'));
  assert.deepEqual(contacts('Montréal, QC'), contacts('Montreal'));
  assert(contacts('Waterloo, QC').every(provider => provider.province === 'QC'));
  assert.equal(contacts('Waterloo, ON', 'QC').length, 0);
  assert(searchLocations('PEI').every(place => place.province === 'PE'));
  assert(searchLocations('Toronto', 'QC').length === 0);
  assert.equal(contacts('constructor').length, 0);
  assert.equal(searchLocations('Aylmer')[0].province,'ON','A borough alias must not override a real municipality');
  assert.equal(searchLocations('Aylmer, QC')[0].name,'Gatineau');
  assert.equal(searchLocations('Fort McMurray')[0].name,'Wood Buffalo');
  assert.equal(searchLocations('Sydney, NS')[0].name,'Cape Breton');

  // A community result must lead back to the contacts for that municipality.
  for (const provider of providers) {
    const place = providerLocation.get(provider.id);
    assert(place, 'No matching municipality for ' + provider.id);
    for (const french of [false, true]) {
      const url = new URL(locationCarePath(place, french), 'https://abortionclinic.ca');
      const query = new URLSearchParams(url.hash.slice(1)).get('q');
      const route=resolveRoute(url.pathname);
      const matches = route.cityGuide ? localProviders(route.location) : contacts(query, place.province);
      assert(matches.some(match => match.id === provider.id), provider.id);
      assert(matches.every(match => providerLocation.get(match.id)?.id === place.id), provider.city);
    }
  }
  console.log('Bilingual community links and geographic filters passed for ' + providers.length + ' provider records.');
} finally {
  await server.close();
}
