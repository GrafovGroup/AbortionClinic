'use client';

import {ArrowUpRight, MapPin} from 'lucide-react';
import {pathFor} from '../lib/content';
import {coverageGuideForLocation} from '../lib/locations';
import {cityGuidePath} from '../lib/city-guides';
import {formatDate, localizedResource, providerName, serviceName} from '../lib/localization';
import {communityAccessResource, communityProvinceChoices, filteredDirectoryPath, regionalAlternatives} from '../lib/regional-alternatives';
import './regional-alternatives.css';

type Props = {
  query: string;
  region?: string;
  filters: string[];
  virtual: boolean;
  fr: boolean;
  onClearFilters: () => void;
};

export default function RegionalAlternatives({query, region, filters, virtual, fr, onClearFilters}: Props) {
  const t = (english: string, french: string) => fr ? french : english;
  const result = regionalAlternatives(query, filters, virtual, region);
  const {place, province, metro, metroProviders, localCount, virtualResources} = result;
  const access = communityAccessResource(place, fr);
  const cityGuide=place&&coverageGuideForLocation(place);
  const hasFilters = filters.length > 0 || virtual;
  const cityLabel = place ? place.name + ', ' + place.province : '';
  const choices = communityProvinceChoices(result.places);
  const heading = cityLabel
    ? localCount
      ? t('No listing in ' + cityLabel + ' matches these filters.', 'Aucune fiche à ' + cityLabel + ' ne correspond à ces filtres.')
      : t('No clinic in ' + cityLabel + ' is listed yet.', 'Aucune clinique à ' + cityLabel + ' n’est encore répertoriée.')
    : t('No listings match this search.', 'Aucune fiche ne correspond à cette recherche.');

  return <section className="regional-alternatives" aria-label={t('Other ways to find care', 'Autres façons de trouver des soins')}>
    <div className="regional-empty">
      <h3>{heading}</h3>
      <p>{t('You can explore the regional resources below or change your search.', 'Vous pouvez consulter les ressources régionales ci-dessous ou modifier votre recherche.')}</p>
      {hasFilters && <button type="button" className="regional-action" onClick={onClearFilters}>
        {t('CLEAR SERVICE FILTERS', 'EFFACER LES FILTRES DE SERVICE')}
      </button>}
      {choices.length > 1 && <div className="regional-choices">
        <p>{t('Choose the province for this city name.', 'Choisissez la province correspondant à ce nom de ville.')}</p>
        {choices.map(choice => <a key={choice.id} href={filteredDirectoryPath(choice.name + ', ' + choice.province, filters, virtual, fr)}>
          {choice.name}, {choice.province}
        </a>)}
      </div>}
    </div>

    {metro && !virtual && metroProviders.length > 0 && <details className="metro-options" key={[query, filters.join(','), virtual].join('|')}>
      <summary>{t('SHOW ', 'AFFICHER LES OPTIONS DU ')}{metro.name[fr ? 1 : 0].toLocaleUpperCase(fr ? 'fr-CA' : 'en-CA')}{t(' OPTIONS', '')} <span>({metroProviders.length})</span></summary>
      <p>{t('These listings are in the municipalities shown below. Confirm the appointment location and booking requirements with the clinic.', 'Ces fiches correspondent aux municipalités indiquées ci-dessous. Vérifiez le lieu du rendez-vous et les modalités de réservation avec la clinique.')}</p>
      {filters.length > 0 && <p className="regional-filter-note">{t('Selected services', 'Services sélectionnés')} · {filters.map(filter => serviceName(filter, fr)).join(' / ')}</p>}
      <ul>{metroProviders.map(provider => <li key={provider.id}>
        <div><strong>{providerName(provider, fr)}</strong><span><MapPin size={14} aria-hidden="true"/>{provider.city}, {provider.province}</span></div>
        <a href={(fr ? '/fr/prestataires/' : '/providers/') + provider.id + '/'} aria-label={t('View listing for ', 'Consulter la fiche de ') + providerName(provider, fr)}>
          {t('VIEW LISTING', 'VOIR LA FICHE')}<ArrowUpRight size={16} aria-hidden="true"/>
        </a>
      </li>)}</ul>
    </details>}

    {(access || province || cityGuide) && <div className="regional-resources">
      <h4>{t('Regional contacts and resources', 'Coordonnées et ressources régionales')}</h4>
      {cityGuide&&<a href={cityGuidePath(cityGuide.slug,fr)}>{t('Read the city and area guide','Consulter le guide de la ville et des environs')}<ArrowUpRight size={16} aria-hidden="true"/></a>}
      {access && <a href={access.url} rel="noreferrer">{access.label}<ArrowUpRight size={16} aria-hidden="true"/></a>}
      {province && <>
        <a href={filteredDirectoryPath('', filters, virtual, fr, province[0])}>{t('View listings across ', 'Voir les fiches · ')}{province[fr ? 4 : 3]}</a>
        <a href={localizedResource(province[7], fr)} rel="noreferrer">{t('Regional access source for ', 'Source régionale · ')}{province[fr ? 4 : 3]}<ArrowUpRight size={16} aria-hidden="true"/></a>
      </>}
    </div>}

    {virtualResources.length > 0 && <div className="regional-virtual">
      <h4>{t('Published virtual service areas', 'Territoires de soins virtuels publiés')}</h4>
      <p>{t('These services publish the coverage areas below. Ask the provider to confirm eligibility, required tests and any in-person visits.', 'Ces services publient les territoires desservis ci-dessous. Confirmez avec le prestataire l’admissibilité, les examens requis et les visites en personne.')}</p>
      {virtualResources.map(resource => <article key={resource.url}>
        <h5>{resource.name}</h5><p>{resource.scope[fr ? 1 : 0]}</p>
        <a href={resource.url} rel="noreferrer">{t('SERVICE INFORMATION', 'RENSEIGNEMENTS (EN ANGLAIS)')}<ArrowUpRight size={16} aria-hidden="true"/></a>
        {resource.sources.filter(source=>source!==resource.url).map(source=><a className="regional-area-source" href={source} key={source} rel="noreferrer">{t('Published service-area source', 'Source du territoire desservi (en anglais)')}<ArrowUpRight size={15} aria-hidden="true"/></a>)}
        <small>{t('Service area checked ', 'Territoire vérifié le ')}{formatDate(resource.reviewed, fr)}</small>
      </article>)}
    </div>}

    <p className="regional-browse"><a href={pathFor('locations', fr)}>{t('Choose another city or province', 'Choisir une autre ville ou province')}</a></p>
  </section>;
}
