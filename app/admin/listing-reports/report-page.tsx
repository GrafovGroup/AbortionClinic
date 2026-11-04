import Brand from '../../brand';
import {isAdmin} from '../../../lib/admin';
import {chatGPTSignInPath} from '../../chatgpt-auth';
import ListingReportQueue from './review-queue';

export default async function ListingReportsPage({fr}:{fr:boolean}) {
  const path=(fr?'/fr':'')+'/admin/listing-reports/';
  if(!await isAdmin())return <main className="article-page admin-access"><Brand href={fr?'/fr/':'/'}/><h1>{fr?'Accès restreint':'Restricted access'}</h1><p>{fr?'Seuls les membres autorisés de l’équipe peuvent consulter les signalements.':'Only authorized team members can access listing reports.'}</p><a href={chatGPTSignInPath(path)} target="_top">{fr?'SE CONNECTER':'SIGN IN'}</a><a href={fr?'/admin/listing-reports/':'/fr/admin/listing-reports/'} lang={fr?'en-CA':'fr-CA'}>{fr?'English':'Français'}</a></main>;
  return <ListingReportQueue fr={fr}/>;
}
