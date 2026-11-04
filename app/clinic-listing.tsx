import {MapPin, ArrowUpRight, Phone} from 'lucide-react';
import {type Provider, providerResourceLabel} from '../lib/providers';
import {provinces} from '../lib/content';
import {formatDate, providerName, providerPhone, localizedResource, serviceName} from '../lib/localization';

export default function ClinicListing({provider:p, fr}:{provider:Provider;fr:boolean}) {
  const name = providerName(p,fr);
  const profile = (fr?'/fr/prestataires/':'/providers/')+p.id+'/';
  const region = provinces.find(v=>v[0]===p.province);
  return <article className="provider">
    <div>
      <small><MapPin size={15} aria-hidden="true"/>{p.city} · {region?.[fr?4:3]}</small>
      <h3><a href={profile}>{name}</a></h3>
      <p className="listing-description">{p.description[fr?1:0]}</p>
      <div className="tags">
        {p.kind==='regional-booking'&&<span className="regional-service-label">{fr?'Service régional de rendez-vous':'Regional booking service'}</span>}
        {p.services.map(s=><span key={s}>{serviceName(s,fr)}</span>)}
        {p.virtual&&<span>{fr?'Rendez-vous virtuels':'Virtual appointments'}</span>}
        {p.kind!=='regional-booking'&&!p.services.length&&<span>{fr?'Méthodes à confirmer':'Ask about methods'}</span>}
      </div>
      <small className="reviewed">{fr?'Sources consultées le':'Sources checked'} <time dateTime={p.reviewed}>{formatDate(p.reviewed,fr)}</time></small>
    </div>
    <div className="provider-actions">
      <a className="website" aria-label={providerResourceLabel(p,fr)+' · '+name} href={localizedResource(p.url,fr)} rel="noreferrer">{providerResourceLabel(p,fr)}<ArrowUpRight size={16} aria-hidden="true"/></a>
      {p.phoneLabel&&<small className="listing-phone-label">{p.phoneLabel[fr?1:0]}</small>}
      <a className="phone-link" href={providerPhone(p)} aria-label={(fr?'Appeler ':'Call ')+name}><Phone size={16} aria-hidden="true"/>{p.phone.replace(';ext=',fr?' poste ':' ext. ')}</a>
      <a className="details" aria-label={(fr?'Fiche et sources · ':'Listing and sources · ')+name} href={profile}>{fr?'Fiche et sources':'Listing & sources'}</a>
    </div>
  </article>;
}
