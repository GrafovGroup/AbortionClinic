import Brand from '../brand';
import {isAdmin} from '../../lib/admin';
import {chatGPTSignInPath} from '../chatgpt-auth';
import Admin from './review';
import SourceReview from './source-review/review-queue';
import ReferralInbox from './referral-inbox';
export default async function AdminPage({fr,providerRequests=false,sourceReview=false}:{fr:boolean;providerRequests?:boolean;sourceReview?:boolean}){
  const user=await isAdmin();
  const path=(fr?'/fr':'')+'/admin/'+(sourceReview?'source-review/':providerRequests?'provider-requests/':'');
  if(!user)return <main className="article-page admin-access"><Brand href={fr?'/fr/':'/'}/><h1>{fr?'Accès restreint':'Restricted access'}</h1><p>{fr?'Seuls les membres autorisés de l’équipe peuvent consulter les demandes.':'Only authorized team members can access requests.'}</p><a href={chatGPTSignInPath(path)} target="_top">{fr?'SE CONNECTER':'SIGN IN'}</a><a href={fr?path.replace(/^\/fr/,''):'/fr'+path} lang={fr?'en-CA':'fr-CA'}>{fr?'English':'Français'}</a></main>;
  return sourceReview?<SourceReview fr={fr}/>:providerRequests?<Admin fr={fr}/>:<ReferralInbox fr={fr}/>;
}
