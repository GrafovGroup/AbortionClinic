import {exactLocations, localProviders, normalizeLocation, provinceForQuery} from './locations';
import {provinces} from './content';
import {providerName} from './localization';
import {providers} from './providers';

export function filterProviders(query:string, methods:string[], virtual:boolean, region?:string) {
  const name = normalizeLocation(query);
  const province = provinceForQuery(query);
  const places = name && !province ? exactLocations(query, region) : [];
  const localIds = new Set(places.flatMap(place => localProviders(place).map(provider => provider.id)));

  return providers.filter(provider => {
    if (region && provider.province !== region) return false;
    if (virtual && !provider.virtual) return false;
    if (methods.length && !methods.some(method => provider.services.includes(method))) return false;
    if (!name) return true;
    if (province) return provider.province === province[0];
    if (places.length) return localIds.has(provider.id);

    const regionNames = provinces.find(item => item[0] === provider.province)!;
    return [provider.name, providerName(provider, true), provider.city, regionNames[3], regionNames[4]]
      .some(value => normalizeLocation(value).includes(name));
  }).sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name));
}
