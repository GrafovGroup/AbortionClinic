import {ArrowUpRight} from 'lucide-react';
import {cityGuides,cityGuidePath} from '../lib/city-guides';
import {coveredCommunities,findLocationBySlug,localProviders} from '../lib/locations';
import {provinces} from '../lib/content';
import './national-city-guides.css';

export default function NationalCityGuides({fr,province}:{fr:boolean;province?:string}) {
  const t=(en:string,french:string)=>fr?french:en;
  const groups=provinces.filter(region=>!province||region[0]===province).map(region=>({region,guides:cityGuides.filter(guide=>guide.province===region[0]).sort((a,b)=>a.slug.localeCompare(b.slug))})).filter(group=>group.guides.length);
  return <section className="national-city-guides" id="city-guides">
    <p className="eyebrow">{t('CITY & AREA GUIDES','GUIDES DES VILLES ET RÉGIONS')}</p>
    <h2>{province?t('Explore your area.','Explorez votre région.'):t('Major cities. Surrounding communities.','Grandes villes. Localités voisines.')}</h2>
    <p className="city-coverage-intro">{t('Find local clinic contacts, booking instructions and regional options. Each guide also connects surrounding communities with relevant resources.','Trouvez les coordonnées des cliniques locales, les modalités de rendez-vous et les options régionales. Chaque guide relie aussi les localités voisines aux ressources pertinentes.')}</p>
    {!province&&<p className="small-note">{t('Coverage includes the centres of all 41 census metropolitan areas in the 2021 Census, all provincial and territorial capitals, and additional regional centres.','La couverture comprend les centres des 41 régions métropolitaines de recensement de 2021, toutes les capitales provinciales et territoriales, ainsi que d’autres centres régionaux.')}</p>}
    <div className="city-guide-regions">{groups.map(({region,guides})=><details key={region[0]} open={!!province}>
      <summary><span>{region[fr?4:3]}</span><small>{guides.length} {guides.length===1?'guide':'guides'}</small></summary>
      <ul>{guides.map(guide=>{
        const location=findLocationBySlug(guide.province,guide.slug);
        const count=location?localProviders(location).filter(provider=>provider.kind!=='regional-booking').length:0;
        const surrounding=coveredCommunities(guide);
        return <li key={guide.slug}><a href={cityGuidePath(guide.slug,fr)}><span><strong>{location?.name||guide.slug}</strong>{guide.aliases?.length&&<span className="city-guide-alias">{guide.aliases.join(' · ')}</span>}<small>{count?count+' '+t(count===1?'local clinic listing':'local clinic listings',count===1?'fiche de clinique locale':'fiches de cliniques locales'):t('Regional access guide','Guide d’accès régional')}{surrounding.length?' · '+surrounding.length+' '+t('surrounding communities','localités voisines'):''}</small></span><ArrowUpRight size={17} aria-hidden="true"/></a></li>;
      })}</ul>
    </details>)}</div>
    {!province&&<a className="source-link" href="https://www23.statcan.gc.ca/imdb/p3VD.pl?CLV=1&CPV=A&CST=01012021&CVD=1348194&Function=getVD&MLV=3&TVD=1348193">{t('STATISTICS CANADA — METROPOLITAN AREA LIST','STATISTIQUE CANADA — LISTE DES RÉGIONS MÉTROPOLITAINES')} ↗</a>}
  </section>;
}
