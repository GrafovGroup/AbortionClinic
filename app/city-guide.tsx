import {ArrowUpRight, BookOpen, MapPin} from 'lucide-react';
import ClinicListing from './clinic-listing';
import {type CityGuide as CityGuideData} from '../lib/city-guides';
import {type Location, localProviders, provincePath,coveredCommunities,guideProviders,locationCarePath} from '../lib/locations';
import {pathFor, provinces} from '../lib/content';
import {providerName,formatDate} from '../lib/localization';
import './city-guide.css';

type Props = {guide: CityGuideData; location: Location; fr: boolean};

export default function CityGuide({guide, location, fr}: Props) {
  const lang = fr ? 1 : 0;
  const contacts = [...localProviders(location)].sort((a,b) =>
    providerName(a,fr).localeCompare(providerName(b,fr),fr?'fr-CA':'en-CA'));
  const clinics = contacts.filter(provider => provider.kind !== 'regional-booking');
  const bookingCentres = contacts.filter(provider => provider.kind === 'regional-booking');
  const region = provinces.find(p=>p[0]===location.province)!;
  const territorial=['YT','NT','NU'].includes(location.province);
  const regional = guideProviders(guide);
  const surrounding=coveredCommunities(guide);

  return <div className="city-guide">
    <div className="city-guide-intro">
      <div>
        <p className="eyebrow"><MapPin size={16} aria-hidden="true"/>{fr?'GUIDE LOCAL':'CITY GUIDE'} · {region[fr?4:3]}</p>
        <h1>{guide.title[lang]}</h1>
        <p className="intro">{guide.description[lang]}</p>
        <div className="city-guide-jumps">
          {clinics.length>0&&<a href="#local-clinics">{fr?'Cliniques locales':'Local clinics'} ({clinics.length})</a>}
          {bookingCentres.length>0&&<a href="#regional-booking">{fr?'Prise de rendez-vous régionale':'Regional booking'}</a>}
          {regional.length>0&&<a href="#regional-options">{fr?'Options régionales':'Regional options'}</a>}
          {surrounding.length>0&&<a href="#surrounding-communities">{fr?'Localités voisines':'Surrounding communities'}</a>}
        </div>
        <p className="small-note city-guide-date">{fr?'Guide vérifié le ':'Guide checked '}{formatDate(guide.updated,fr)}</p>
      </div>
      <aside className="city-booking-note">
        <BookOpen size={24} aria-hidden="true"/>
        <h2>{fr?'Comment prendre rendez-vous':'How to book'}</h2>
        <p>{guide.booking[lang]}</p>
        <a href={fr&&guide.source.frUrl?guide.source.frUrl:guide.source.url} rel="noreferrer">{guide.source.label[lang]} <ArrowUpRight size={16} aria-hidden="true"/></a>
      </aside>
    </div>
    <section className="city-contacts" id="local-clinics">
      <h2>{fr?'Cliniques à '+location.name:'Clinics in '+location.name}</h2>
      {!clinics.length&&<div className="city-no-local"><h3>{fr?'Aucune clinique locale répertoriée pour le moment':'No local clinic listed yet'}</h3><p>{fr?'Consultez les modalités d’accès ci-dessus et les ressources régionales de ce guide. L’absence de fiche ne signifie pas qu’aucun soin n’est disponible dans votre localité.':'Use the access instructions above and the regional resources in this guide. An absent listing does not mean care is unavailable in your community.'}</p></div>}
      {clinics.map(p=><ClinicListing key={p.id} provider={p} fr={fr}/>)}
    </section>
    {bookingCentres.length>0&&<section className="city-contacts" id="regional-booking">
      <h2>{fr?'Service régional de prise de rendez-vous':'Regional booking service'}</h2>
      {bookingCentres.map(p=><ClinicListing key={p.id} provider={p} fr={fr}/>)}
    </section>}
    {regional.length>0&&<section className="city-contacts" id="regional-options">
      <h2>{fr?'Options ailleurs dans la région':'Options elsewhere in the region'}</h2>
      <p className="small-note">{fr?'Les lieux réels sont indiqués sur chaque fiche. Confirmez l’admissibilité, le lieu du rendez-vous et les déplacements nécessaires auprès du service.':'Each listing shows its actual location. Confirm eligibility, appointment location and any travel required with the service.'}</p>
      {regional.map(provider=><ClinicListing key={provider.id} provider={provider} fr={fr}/>)}
    </section>}
    {surrounding.length>0&&<section className="city-surrounding" id="surrounding-communities">
      <h2>{fr?'Localités voisines et environs':'Surrounding communities and area'}</h2>
      <p>{fr?'Ces liens permettent d’explorer les ressources par localité. Ils ne définissent pas le territoire desservi par une clinique.':'Explore resources by community. These browsing links do not define a clinic’s service area.'}</p>
      <ul>{surrounding.map(place=>{
        const target=locationCarePath(place,fr);
        const same=target.startsWith((fr?'/fr/cliniques/':'/clinics/')+guide.slug+'/');
        return <li key={place.id}>{same?<span>{place.name}<small>{fr?'Ressources dans ce guide':'Resources in this guide'}</small></span>:<a href={target}>{place.name}<ArrowUpRight size={14} aria-hidden="true"/></a>}</li>;
      })}</ul>
    </section>}
    <div className="city-guide-more">
      <a href={provincePath(location.province,fr)}>{territorial?(fr?'Répertoire territorial':'Territorial directory'):(fr?'Répertoire provincial':'Provincial directory')} · {region[fr?4:3]}</a>
      <a href={pathFor('what-to-expect',fr)}>{fr?'Questions à poser au premier appel':'Questions to ask when you call'}</a>
    </div>
  </div>;
}
