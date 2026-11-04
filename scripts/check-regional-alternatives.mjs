import assert from 'node:assert/strict';
import {createServer} from 'vite';

const server = await createServer({
  configFile: false,
  server: {middlewareMode: true, hmr: false, ws: false, watch: null},
  logLevel: 'error',
});
try {
  const {regionalAlternatives, filteredDirectoryPath, communityAccessResource} = await server.ssrLoadModule('/lib/regional-alternatives.ts');
  const {filterProviders} = await server.ssrLoadModule('/lib/directory-search.ts');

  for (const [query, province, metro] of [
    ['Brampton', 'ON', 'gta'],
    ['Longueuil', 'QC', 'montreal'],
    ['Surrey', 'BC', 'vancouver'],
  ]) {
    const result = regionalAlternatives(query, [], false);
    assert.equal(result.place.name, query);
    assert.equal(result.province[0], province);
    assert.equal(result.metro.id, metro);
    assert.equal(result.localCount, filterProviders(query,[],false).length);
    assert(result.metroProviders.length > 0);
    assert(result.metroProviders.every(provider => provider.city !== query && provider.province === province && provider.kind !== 'regional-booking'));
    const filtered = regionalAlternatives(query, ['procedural'], false);
    assert(filtered.metroProviders.every(provider => provider.services.includes('procedural')));
  }

  // A clinic's physical address and a province-wide remote service area are separate.
  assert.equal(regionalAlternatives('Brampton', ['medication'], true).metroProviders.length, 0);
  assert.equal(regionalAlternatives('Brampton', ['medication'], true).virtualResources[0].name, 'Connection Medical Clinic');
  assert.equal(regionalAlternatives('Surrey', ['medication'], true).virtualResources[0].name, 'Willow Reproductive Health Centre');
  assert.equal(regionalAlternatives('Longueuil', ['medication'], true).virtualResources.length, 0);
  assert.equal(regionalAlternatives('Brampton', ['procedural'], true).virtualResources.length, 0);
  assert.equal(regionalAlternatives('Brampton', [], false, 'QC').metroProviders.length, 0);
  assert.equal(regionalAlternatives('Brampton', [], false, 'QC').virtualResources.length, 0);

  assert(regionalAlternatives('Montréal', ['procedural'], true).localCount > 0);
  assert.equal(regionalAlternatives('Waterloo', [], false).province, undefined);
  assert.equal(regionalAlternatives('Waterloo, QC', [], false).province[0], 'QC');
  assert.equal(regionalAlternatives('unlisted city', [], false).place, undefined);
  assert(regionalAlternatives('Brampton',[],false).localCount>0,'Brampton now has a verified local clinic');
  assert(regionalAlternatives('Longueuil',[],false).localCount>0,'Longueuil now has verified local contacts');
  assert.equal(regionalAlternatives('Surrey',[],false).localCount,0);

  for (const french of [false, true]) {
    const target = new URL(filteredDirectoryPath('Brampton, ON', ['medication'], true, french), 'https://example.test');
    const params = new URLSearchParams(target.hash.slice(1));
    assert.equal(target.pathname, french ? '/fr/trouver-des-soins/' : '/find-care/');
    assert.equal(params.get('q'), 'Brampton, ON');
    assert.equal(params.get('type'), 'medication');
    assert.equal(params.get('virtual'), '1');
    assert(communityAccessResource(regionalAlternatives('Longueuil', [], false).place, french).url.includes(french ? '/services/interruption-' : '/en/services/'));
  }
  console.log('Regional alternatives passed for Brampton, Longueuil and Surrey, province restrictions, filters, ambiguous municipalities, verified virtual service areas and bilingual navigation.');
} finally {
  await server.close();
}
