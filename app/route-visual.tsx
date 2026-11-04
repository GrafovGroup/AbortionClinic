import {ArrowUpRight} from 'lucide-react';
import {resolveRoute} from '../lib/routes';
import {providers} from '../lib/providers';
import {pathFor} from '../lib/content';
import {formatNumber,localizedResource,serviceName} from '../lib/localization';
import EditorialImage from './editorial-image';

export default function RouteVisual({route,fr,className=''}:{route:string;fr:boolean;className?:string}){
  const r=resolveRoute(route);const t=(en:string,french:string)=>fr?french:en;
  if(!r.province&&!r.isLocationDirectory)return <EditorialImage route={route} fr={fr} priority className={className}/>;
  const listed=r.province?providers.filter(p=>p.province===r.province![0]):providers;
  const methods=[...new Set(listed.flatMap(p=>p.services))];
  return <aside className="context-panel location-panel">
    <p className="eyebrow">{t('SERVICE OVERVIEW','APERÇU DES SERVICES')}</p>
    <h2>{r.province?.[fr?4:3]||'Canada'}</h2>
    <dl>
      <div><dt>{t('Provider records in this selection','Fiches de prestataires dans cette sélection')}</dt><dd className="context-count">{formatNumber(listed.length,fr)}</dd></div>
      {methods.length>0&&<div><dt>{t('Documented care methods','Méthodes de soins documentées')}</dt><dd>{methods.map(m=>serviceName(m,fr)).join(' · ')}</dd></div>}
    </dl>
    {r.province?<><p>{t('This is a selection of public records, not a complete count of services. For current regional access information, consult the source below.','Il s’agit d’une sélection de fiches publiques, et non d’un décompte complet des services. Consultez la source ci-dessous pour connaître les modalités régionales actuelles.')}</p><a className="context-link" href={localizedResource(r.province[7],fr)} rel="noreferrer">{t('REGIONAL ACCESS RESOURCE','RESSOURCE RÉGIONALE')} <ArrowUpRight size={17}/></a></>:<a className="context-link" href={pathFor('find-care',fr)}>{t('COMPARE LISTED SERVICES','COMPARER LES SERVICES RÉPERTORIÉS')} <ArrowUpRight size={17}/></a>}
  </aside>;
}
