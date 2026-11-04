import Brand from './brand';
import {pathFor} from '../lib/content';
import {Globe, LogOut, BookOpen} from 'lucide-react';

type Props = {fr:boolean; current:string; equivalent:string};
export default function DirectoryHeader({fr,current,equivalent}:Props) {
  const weather = fr ? 'https://meteo.gc.ca/' : 'https://weather.gc.ca/';
  const items = [
    ['find-care', fr ? 'Cliniques' : 'Clinics'],
    ['locations', fr ? 'Régions' : 'Locations'],
    ['resources', fr ? 'Guides' : 'Guides & support'],
  ];
  return <>
    <div className="site-utility">
      <div className="utility-inner">
        <span className="utility-caption"><BookOpen size={15} aria-hidden="true"/>{fr ? 'Répertoire canadien indépendant' : 'Independent Canadian directory'}</span>
        <a className="language-switch" href={equivalent} hrefLang={fr?'en-CA':'fr-CA'} lang={fr?'en-CA':'fr-CA'}><Globe size={15} aria-hidden="true"/>{fr?'English':'Français'}</a>
        <a className="exit-link" href={weather} rel="noreferrer" onClick={e=>{e.preventDefault();window.location.replace(weather)}}><LogOut size={15} aria-hidden="true"/>{fr?'Sortie rapide':'Quick exit'}</a>
      </div>
    </div>
    <header className="directory-header"><div className="directory-header-inner">
      <Brand href={pathFor('',fr)}/>
      <nav aria-label={fr?'Navigation principale':'Main navigation'}>
        {items.map(([key,label])=><a key={key} href={pathFor(key,fr)} aria-current={current===key?'page':undefined}>{label}</a>)}
      </nav>
    </div></header>
  </>;
}
