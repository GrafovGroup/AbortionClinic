import {filterProviders} from './directory-search';
import {pathFor, provinces} from './content';
import {exactLocations, providerLocation, provinceForQuery, provincePath, type Location} from './locations';

type Bilingual = [string, string];
type MetroArea = {
  id: string;
  province: string;
  name: Bilingual;
  censusDivisions: string[];
};

// These are browsing groups of actual municipalities, not provider service areas.
// The Montréal group is limited to the three divisions represented here.
const metroAreas: MetroArea[] = [
  {id: 'gta', province: 'ON', name: ['Greater Toronto Area', 'Grand Toronto'], censusDivisions: ['Toronto', 'Peel', 'York', 'Durham', 'Halton']},
  {id: 'montreal', province: 'QC', name: ['Greater Montréal', 'Grand Montréal'], censusDivisions: ['Montréal', 'Laval', 'Longueuil']},
  {id: 'vancouver', province: 'BC', name: ['Metro Vancouver', 'Grand Vancouver'], censusDivisions: ['Greater Vancouver']},
];

export type VirtualAccessResource = {
  province: string;
  name: string;
  methods: string[];
  scope: Bilingual;
  url: string;
  sources: string[];
  reviewed: string;
};

// Province-wide eligibility is published by these services. A clinic offering
// virtual visits alone is insufficient evidence for a regional suggestion.
export const virtualAccessResources: VirtualAccessResource[] = [
  {
    province: 'ON',
    name: 'Connection Medical Clinic',
    methods: ['medication'],
    scope: ['Virtual medication abortion across Ontario', 'Avortement par médicaments à distance en Ontario'],
    url: 'https://www.connectionmedical.ca/ontario-wide-virtual-abortion-service',
    sources: ['https://www.connectionmedical.ca/ontario-wide-virtual-abortion-service'],
    reviewed: '2026-11-03',
  },
  {
    province: 'BC',
    name: 'Willow Reproductive Health Centre',
    methods: ['medication'],
    scope: ['Virtual medication abortion in British Columbia; availability depends on distance from Vancouver and clinical assessment', 'Avortement par médicaments à distance en Colombie-Britannique; disponibilité selon la distance de Vancouver et l’évaluation clinique'],
    url: 'https://willowclinic.ca/medical-abortion/',
    sources: ['https://willowclinic.ca/medical-abortion/', 'https://www.interiorhealth.ca/services/abortion'],
    reviewed: '2026-11-03',
  },
];

function withinMetro(location: Location, metro: MetroArea) {
  return location.province === metro.province && metro.censusDivisions.includes(location.region);
}

export function regionalAlternatives(query: string, filters: string[], virtual: boolean, region?: string) {
  const namedProvince = provinceForQuery(query);
  const places = namedProvince ? [] : exactLocations(query, region);
  const provinceCodes = new Set(places.map(place => place.province));
  const provinceCode = region || (provinceCodes.size === 1 ? places[0]?.province : namedProvince?.[0]);
  const province = provinces.find(item => item[0] === provinceCode);
  const place = places.length === 1 ? places[0] : undefined;
  const metro = places.length ? metroAreas.find(area => places.every(location => withinMetro(location, area))) : undefined;
  const localCount = filterProviders(query, [], false, region).length;
  const metroProviders = metro && !virtual
    ? filterProviders('', filters, false, metro.province).filter(provider => {
        const location = providerLocation.get(provider.id);
        return location && withinMetro(location, metro) &&
          !places.some(place => place.id === location.id) && provider.kind !== 'regional-booking';
      })
    : [];
  const virtualResources = virtualAccessResources.filter(resource =>
    resource.province === provinceCode &&
    (!filters.length || filters.some(method => resource.methods.includes(method)))
  );

  return {places, place, province, metro, metroProviders, localCount, virtualResources};
}

export function filteredDirectoryPath(query: string, filters: string[], virtual: boolean, fr: boolean, region?: string) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (filters.length) params.set('type', filters.join(','));
  if (virtual) params.set('virtual', '1');
  return (region ? provincePath(region, fr) : pathFor('find-care', fr)) + (params.size ? '#' + params.toString() : '');
}

export function communityAccessResource(place: Location | undefined, fr: boolean) {
  if (place?.province === 'QC' && place.region === 'Longueuil') {
    return {
      label: fr ? 'Services d’avortement en Montérégie' : 'Montérégie abortion services',
      url: fr
        ? 'https://www.santemonteregie.qc.ca/services/interruption-volontaire-de-grossesse-avortement'
        : 'https://www.santemonteregie.qc.ca/en/services/voluntary-interruption-pregnancy-abortion',
    };
  }
  return undefined;
}

// This control distinguishes provinces for a shared place name. A city and
// district with the same name in the same province retain the shared search.
export function communityProvinceChoices(places: Location[]) {
  return places.filter((place, index) =>
    places.findIndex(item => item.province === place.province) === index
  );
}
