'use client';
import {useEffect,useState} from 'react';
import {ArrowRight,ArrowUpRight,Search} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {providers} from '../lib/providers';
import {provinces,pathFor} from '../lib/content';
import {type Location,locationCarePath,provincePath,localProviders,searchLocations,locationSource} from '../lib/locations';
import {resolveRoute} from '../lib/routes';
import RouteVisual from './route-visual';
import NationalCityGuides from './national-city-guides';
import {localizedResource,formatNumber} from '../lib/localization';
import {breadcrumbsForRoute} from '../lib/seo';

export function BreadcrumbTrail({route}:{route:string}){
  const crumbs=breadcrumbsForRoute(route);const fr=route==='fr'||route.startsWith('fr/');
  return crumbs.length?<nav className="breadcrumbs" aria-label={fr?'Fil d’Ariane':'Breadcrumb'}><ol>{crumbs.map((c,i)=><li key={c.path}>{i>0&&<span aria-hidden="true">/</span>}{i===crumbs.length-1?<span aria-current="page">{c.name}</span>:<a href={c.path}>{c.name}</a>}</li>)}</ol></nav>:null;
}

export function LocationLinks({items,fr}:{items:Location[];fr:boolean}){
  return <ul className="location-list">{items.map(l=>{
    const local=localProviders(l);
    return <li key={l.id}><a href={locationCarePath(l,fr)}><span><strong>{l.name}</strong><small>{l.province} · {l.region}{items.some(other=>other.id!==l.id&&other.name===l.name&&other.province===l.province)?' · '+(fr?'Réf. ':'Ref. ')+l.id:''}</small><small>{local.length?(fr?'Consulter les prestataires répertoriés':'View listed providers'):(fr?'Consulter les services régionaux':'View regional care services')}</small></span><ArrowRight size={17} aria-hidden="true"/></a></li>;
  })}</ul>;
}

export default function LocationDirectory({route,onSearchChange}:{route:string;onSearchChange:(value:string)=>void}){
  const {fr}=resolveRoute(route);const t=(en:string,f:string)=>fr?f:en;
  const [query,setQuery]=useState('');
  useEffect(()=>{const value=new URLSearchParams(window.location.hash.slice(1)).get('q');if(value)setQuery(value.slice(0,100));},[]);
  const items=query?searchLocations(query,undefined,50):[];
  return <section className="article-page location-directory">
    <div className="editorial-heading location-heading"><div>
      <p className="eyebrow">{t('COMMUNITY SEARCH','RECHERCHE PAR LOCALITÉ')}</p>
      <h1>{t('Find regional care for','Trouvez des soins régionaux pour')} <em>{t('your community.','votre localité.')}</em></h1>
      <p className="intro">{t('Choose your community to find a city guide or the relevant provincial or territorial resources. Explore local contacts, booking instructions and surrounding communities.','Choisissez votre localité pour trouver un guide local ou les ressources de votre province ou territoire. Consultez les coordonnées, les modalités de rendez-vous et les localités voisines.')}</p>
      <label htmlFor="community-search">{t('Search cities and communities','Chercher une ville ou une localité')}</label>
      <div className="community-search"><Search size={20} aria-hidden="true"/><Input id="community-search" value={query} autoComplete="off" maxLength={100} onChange={e=>{setQuery(e.target.value);onSearchChange(e.target.value)}} placeholder={t('City name, or city and province','Nom de ville, ou ville et province')}/></div>
      <p className="small-note">{t('The search runs in your browser. Choose a region below to browse without entering a city.','La recherche se fait dans votre navigateur. Vous pouvez aussi choisir une région ci-dessous sans saisir de nom de ville.')}</p>
    </div><RouteVisual route={route} fr={fr}/></div>
    {query&&<><p role="status">{items.length===50?t('Showing the first 50 matches. Refine your search.','Les 50 premiers résultats sont affichés. Précisez votre recherche.'):formatNumber(items.length,fr)+' '+t('matching locations','localités correspondantes')}</p>{items.length?<LocationLinks items={items} fr={fr}/>:<div className="empty"><h2>{t('Try the municipality name.','Essayez le nom de la municipalité.')}</h2><p>{t('Neighbourhood and former municipal names may be absent. Choose a region below, or open the provider directory.','Les quartiers et anciens noms de municipalités peuvent être absents. Choisissez une région ci-dessous ou consultez le répertoire des prestataires.')}</p><a href={pathFor('find-care',fr)}>{t('CLINICS','CLINIQUES')}</a></div>}</>}
    <NationalCityGuides fr={fr}/><h2>{t('Care guides by province and territory','Guides par province et territoire')}</h2>
    <div className="province-grid">{provinces.map(p=>{const count=providers.filter(provider=>provider.province===p[0]).length;return <a key={p[0]} href={provincePath(p[0],fr)}><span>{p[fr?4:3]}<small>{count?formatNumber(count,fr)+' '+t('provider records and regional resources','fiches de prestataires et ressources régionales'):t('Regional access resources','Ressources régionales d’accès aux soins')}</small></span><ArrowUpRight size={17} aria-hidden="true"/></a>})}</div>
    <aside className="geography-note"><h2>{t('About community search','À propos de la recherche par localité')}</h2><p>{t('Place names come from Statistics Canada’s 2025 geography: 5,054 municipalities and equivalent areas. This helps identify your region; it does not mean a clinic operates in every community. Local names and boundaries may have changed.','Les noms proviennent de la géographie de Statistique Canada de 2025 : 5 054 municipalités et territoires équivalents. Ils servent à repérer votre région; ils ne signifient pas qu’une clinique se trouve dans chaque localité. Les noms et limites peuvent avoir changé.')}</p><a href={localizedResource(locationSource.url,fr)}>{t('STATISTICS CANADA — GEOGRAPHY SOURCE','STATISTIQUE CANADA — SOURCE GÉOGRAPHIQUE')} ↗</a><p className="small-note">{t('Adapted from Statistics Canada, Census Subdivision Boundary File, 2025. This does not constitute an endorsement by Statistics Canada.','Adapté de Statistique Canada, Fichier des limites des subdivisions de recensement, 2025. Cette adaptation ne constitue pas une approbation de Statistique Canada.')}</p></aside>
  </section>;
}
