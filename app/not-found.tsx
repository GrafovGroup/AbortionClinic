import Brand from './brand';
import {headers} from 'next/headers';
import {pathFor} from '../lib/content';
export default async function NotFound(){
  const fr=(await headers()).get('x-site-language')==='fr';
  return <main className="article-page not-found-page"><Brand href={pathFor('',fr)}/><p className="eyebrow">404</p><h1>{fr?'Page introuvable':'Page not found'}</h1><p>{fr?'Cette adresse ne correspond à aucune page du répertoire. Cherchez une localité ou revenez à l’accueil pour poursuivre.':'This address does not match a directory page. Search for a location or return home to continue.'}</p><p><a href={pathFor('find-care',fr)}>{fr?'Trouver des soins →':'Find care →'}</a></p><p><a href={pathFor('',fr)}>{fr?'Retour à l’accueil':'Return home'}</a></p></main>;
}
