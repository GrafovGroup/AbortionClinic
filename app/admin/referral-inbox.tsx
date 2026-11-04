'use client';
import Brand from '../brand';
import {useEffect,useState} from 'react';
import {providers} from '../../lib/providers';
import {providerName,providerPhone,localizedResource} from '../../lib/localization';
import {referralReference,referralStatuses,statusLabels,type ReferralStatus} from '../../lib/referral-content';
import type {ReferralRow,ReferralEvent} from '../../lib/referrals';
import {Button} from '@/components/ui/button';

const alertLabels = {
  not_requested:['No alert requested','Aucune alerte demandée'],pending:['Awaiting alert','Alerte en attente'],
  sending:['Acceptance not yet confirmed','Acceptation non encore confirmée'],accepted:['Accepted by Formspree','Acceptée par Formspree'],
  failed:['Alert not accepted','Alerte non acceptée'],unknown:['Acceptance could not be confirmed','Acceptation non confirmée'],
};
type InboxData={rows:ReferralRow[];events:ReferralEvent[];counts:{status:ReferralStatus;count:number}[];sources:{source_path:string;count:number}[];page:number;pageSize:number};
function RequestCard({row,events,fr,onSaved}:{row:ReferralRow;events:ReferralEvent[];fr:boolean;onSaved:()=>void}) {
  const t=(a:string,b:string)=>fr?b:a;
  const [status,setStatus]=useState(row.status),[assigned,setAssigned]=useState(row.assigned_provider_id||row.provider_id||'');
  const [connection,setConnection]=useState(row.connection_method||'details_to_visitor');
  const [confirmed,setConfirmed]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[deleting,setDeleting]=useState(false);
  const [alertBusy,setAlertBusy]=useState(false),[alertError,setAlertError]=useState('');
  const requested=providers.find(p=>p.id===row.provider_id),clinic=providers.find(p=>p.id===assigned);
  const date=(value:string)=>new Intl.DateTimeFormat(fr?'fr-CA':'en-CA',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Toronto'}).format(new Date(value));
  const canShare=!!row.share_consent&&assigned===row.provider_id;
  return <article className="inbox-card"><div className="inbox-card-heading"><div><p className="eyebrow">{referralReference(row.id)}</p><h2>{row.name||t('Name not provided','Nom non fourni')}</h2><p>{date(row.created_at)} · {t('Toronto time','Heure de Toronto')}</p></div><span className="inbox-status">{statusLabels[row.status][fr?1:0]}</span></div>
    <div className="inbox-detail-grid"><div>
      <dl className="request-details"><div><dt>{t('Contact using','Joindre par')}</dt><dd>{row.method==='email'?t('Email','Courriel'):t('Telephone call','Appel téléphonique')} — <a href={row.method==='email'?'mailto:'+encodeURIComponent(row.contact):'tel:'+row.contact}>{row.contact}</a></dd></div>
        <div><dt>{t('Contact preferences','Préférences de contact')}</dt><dd>{row.language==='fr'?'Français':'English'}{row.method==='phone'&&' · '+(row.voicemail?t('Voicemail allowed','Message vocal autorisé'):t('Do not leave voicemail','Ne pas laisser de message vocal'))}</dd></div>
        <div><dt>{t('Requested clinic','Clinique demandée')}</dt><dd>{requested?providerName(requested,fr):t('Help finding a clinic','Aide pour trouver une clinique')}</dd></div>
        <div><dt>{t('Source page','Page d’origine')}</dt><dd><a href={row.source_path} target="_blank" rel="noreferrer">{row.source_path}</a> · {row.locale==='fr'?'FR':'EN'}</dd></div>
        <div><dt>{t('Permission to share','Autorisation de partage')}</dt><dd>{row.share_consent?t('Allowed with the originally requested clinic only.','Autorisée uniquement avec la clinique initialement demandée.'):t('Contact the visitor first. Do not share their details with a clinic.','Contactez d’abord la personne. Ne transmettez pas ses coordonnées à une clinique.')}</dd></div>
        <div><dt>{t('Consent recorded','Consentement enregistré')}</dt><dd>{date(row.consented_at)} · {t('Wording version','Version du texte')} {row.consent_version} · {row.locale.toUpperCase()}</dd></div>
        <div><dt>{t('Team email alert','Alerte courriel à l’équipe')}</dt><dd>{alertLabels[row.notification_status][fr?1:0]}{row.notification_attempted_at&&' · '+date(row.notification_attempted_at)}</dd></div>
      </dl>
      {row.notification_status!=='not_requested'&&row.notification_status!=='accepted'&&<div className="request-history">
        <p className="small-note">{t('The request is saved here. An alert contains only its reference and an inbox link. Retrying an unconfirmed alert may send a duplicate notification. If it keeps failing, check Formspree’s recipient, spam settings and submission limits.', 'La demande est conservée ici. L’alerte contient uniquement sa référence et un lien vers la boîte de réception. Un nouvel essai peut envoyer une alerte en double si l’acceptation était incertaine. Si l’échec persiste, vérifiez le destinataire, les paramètres antipourriel et les limites de Formspree.')}</p>
        <Button type="button" variant="outline" disabled={alertBusy} onClick={async()=>{
          setAlertBusy(true);setAlertError('');
          try {
            const result=await fetch('/api/admin/referrals/notification',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:row.id})});
            if(!result.ok){setAlertError(result.status===409?t('An alert is being processed. Wait a minute and refresh before retrying.','Une alerte est en cours de traitement. Attendez une minute et actualisez avant de réessayer.'):t('Alert acceptance could not be confirmed. The request remains in this inbox. Refresh to see its latest alert status.','L’acceptation de l’alerte n’a pas pu être confirmée. La demande reste dans cette boîte. Actualisez pour consulter le dernier état de l’alerte.'));return;}
            onSaved();
          }catch{setAlertError(t('Could not confirm the alert. Refresh before retrying.','Impossible de confirmer l’alerte. Actualisez avant de réessayer.'));}
          finally{setAlertBusy(false);}
        }}>{alertBusy?t('SENDING ALERT…','ENVOI DE L’ALERTE…'):t('RETRY TEAM ALERT','RÉESSAYER L’ALERTE À L’ÉQUIPE')}</Button><p role="alert">{alertError}</p>
      </div>}
      <details className="request-history"><summary>{t('Activity history','Historique des activités')} ({events.length})</summary><ol>{events.map(e=><li key={e.id}>{statusLabels[e.status][fr?1:0]} · {date(e.created_at)}{e.provider_id&&<span> · {(providers.find(p=>p.id===e.provider_id)?providerName(providers.find(p=>p.id===e.provider_id)!,fr):e.provider_id)}</span>}{e.connection_method&&<span> · {e.connection_method==='shared_with_clinic'?t('Contact details shared with clinic','Coordonnées transmises à la clinique'):t('Clinic details given to visitor','Coordonnées de la clinique remises à la personne')}</span>}<small>{e.actor==='visitor'?t('Submitted by visitor','Soumise par la personne'):t('Editor','Éditeur')+' · '+e.actor}</small></li>)}</ol></details>
    </div><form className="inbox-workflow" onSubmit={async e=>{
      e.preventDefault();setBusy(true);setError('');try{
        const response=await fetch('/api/admin/referrals',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:row.id,version:row.version,status,assignedProviderId:assigned,connectionMethod:connection,confirmConnected:confirmed})});
        if(!response.ok){setError(response.status===409?t('This request changed. Refresh the inbox before saving.','Cette demande a changé. Actualisez la boîte de réception avant d’enregistrer.'):t('Check the clinic, sharing permission and completion confirmation. Your changes were not saved.','Vérifiez la clinique, l’autorisation de partage et la confirmation. Les changements n’ont pas été enregistrés.'));return;}
        onSaved();
      }catch{setError(t('Could not save. Try again.','Impossible d’enregistrer. Réessayez.'));}finally{setBusy(false);}
    }}><fieldset disabled={busy}><legend>{t('Follow-up','Suivi')}</legend>
      <label htmlFor={'clinic-'+row.id}>{t('Clinic for this connection','Clinique pour la mise en relation')}</label><select id={'clinic-'+row.id} value={assigned} onChange={e=>{setAssigned(e.target.value);setConfirmed(false);setConnection('details_to_visitor');}}><option value="">{t('Not selected yet','Pas encore sélectionnée')}</option>{providers.map(p=><option key={p.id} value={p.id}>{providerName(p,fr)} — {p.city}</option>)}</select>
      {clinic&&<p className="operator-contacts"><a href={providerPhone(clinic)}>{clinic.phone}</a> · <a href={localizedResource(clinic.url,fr)} target="_blank" rel="noreferrer">{t('Official clinic website ↗','Site officiel de la clinique ↗')}</a></p>}
      <label htmlFor={'status-'+row.id}>{t('Request status','État de la demande')}</label><select id={'status-'+row.id} value={status} onChange={e=>{setStatus(e.target.value as ReferralStatus);setConfirmed(false);}}>{referralStatuses.map(s=><option key={s} value={s}>{statusLabels[s][fr?1:0]}</option>)}</select>
      {status==='connected'&&<><label htmlFor={'connection-'+row.id}>{t('How the connection was completed','Comment la mise en relation a été effectuée')}</label><select id={'connection-'+row.id} value={connection} onChange={e=>{setConnection(e.target.value as typeof connection);setConfirmed(false);}}><option value="details_to_visitor">{t('Gave clinic contact details to the visitor','Coordonnées de la clinique remises à la personne')}</option>{canShare&&<option value="shared_with_clinic">{t('Shared permitted details with the clinic','Coordonnées autorisées transmises à la clinique')}</option>}</select><label className="consent-row"><input type="checkbox" checked={confirmed} required onChange={e=>setConfirmed(e.target.checked)}/>{t('I have completed this connection.','J’ai effectué cette mise en relation.')}</label></>}
      <p>{t('Saving records your work. It does not send an email, place a call, share a request or book an appointment.','L’enregistrement consigne votre travail. Il n’envoie aucun courriel, ne passe aucun appel, ne transmet aucune demande et ne réserve aucun rendez-vous.')}</p>
      <Button disabled={busy||status==='connected'&&(!assigned||!confirmed)} type="submit">{busy?t('SAVING…','ENREGISTREMENT…'):t('SAVE FOLLOW-UP','ENREGISTRER LE SUIVI')}</Button>
    </fieldset><p role="alert">{error}</p>
      {!deleting?<button className="delete-request" type="button" onClick={()=>setDeleting(true)}>{t('Delete this request','Supprimer cette demande')}</button>:<div className="delete-confirm"><p>{t('Permanently delete the contact details and activity history?','Supprimer définitivement les coordonnées et l’historique?')}</p><Button type="button" variant="outline" disabled={busy} onClick={()=>setDeleting(false)}>{t('CANCEL','ANNULER')}</Button> <Button type="button" disabled={busy} onClick={async()=>{setBusy(true);try{const result=await fetch('/api/admin/referrals',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:row.id})});if(!result.ok)throw new Error();onSaved();}catch{setError(t('Deletion failed. Try again.','La suppression a échoué. Réessayez.'));}finally{setBusy(false);}}}>{t('DELETE PERMANENTLY','SUPPRIMER DÉFINITIVEMENT')}</Button></div>}
    </form></div>
  </article>;
}
export default function ReferralInbox({fr}:{fr:boolean}) {
  const t=(a:string,b:string)=>fr?b:a;const [data,setData]=useState<InboxData|null>(null),[error,setError]=useState('');
  const [status,setStatus]=useState('all'),[page,setPage]=useState(1),[revision,setRevision]=useState(0),[loading,setLoading]=useState(true);
  useEffect(()=>{const controller=new AbortController();setLoading(true);setError('');
    fetch('/api/admin/referrals?status='+status+'&page='+page,{cache:'no-store',signal:controller.signal}).then(async r=>{if(!r.ok)throw new Error();setData(await r.json());}).catch(e=>{if(e.name!=='AbortError'){setData(null);setError(t('Could not load connection requests. Please retry.','Impossible de charger les demandes. Veuillez réessayer.'));}}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});return()=>controller.abort();
  },[status,page,revision,fr]);
  const total=data?.counts.reduce((n,r)=>n+r.count,0)||0;const filtered=status==='all'?total:data?.counts.find(r=>r.status===status)?.count||0;
  return <main className="inbox-page"><div className="inbox-navigation"><Brand href={fr?'/fr/':'/'}/><a href={fr?'/admin/':'/fr/admin/'} lang={fr?'en-CA':'fr-CA'}>{fr?'English':'Français'}</a></div>
    <p className="eyebrow">{t('PRIVATE WORKSPACE','ESPACE PRIVÉ')}</p><h1>{t('Connection requests','Demandes de mise en relation')}</h1><p className="intro">{t('Contact each person safely, help them reach a clinic and record the outcome.','Joignez chaque personne de façon sûre, aidez-la à contacter une clinique et consignez le résultat.')}</p>
    <nav className="inbox-tabs" aria-label={t('Administration','Administration')}><a href={fr?'/fr/admin/':'/admin/'} aria-current="page">{t('Connection requests','Mises en relation')}</a><a href={(fr?'/fr':'')+'/admin/provider-requests/'}>{t('Provider corrections','Corrections des fiches')}</a><a href={(fr?'/fr':'')+'/admin/source-review/'}>{t('Listing sources','Sources des fiches')}</a><a href={(fr?'/fr':'')+'/admin/listing-reports/'}>{t('Visitor reports','Signalements des visiteurs')}</a></nav>
    <div className="inbox-stats">{referralStatuses.map(s=><button key={s} aria-pressed={status===s} onClick={()=>{setStatus(s);setPage(1);}}><strong>{data?data.counts.find(r=>r.status===s)?.count||0:'—'}</strong><span>{statusLabels[s][fr?1:0]}</span></button>)}</div>
    <p className="small-note">{t('Counts reflect retained requests, not unique patients or booked appointments. Records older than 90 days are removed when the inbox or submission service next runs. Formspree alerts contain only a reference and inbox link. Acceptance by Formspree does not confirm email delivery; keep checking this inbox. Deleting a request here does not remove notification copies from Formspree or email.','Les nombres représentent les demandes conservées, et non des patients uniques ou des rendez-vous réservés. Les demandes de plus de 90 jours sont supprimées au prochain accès à la boîte de réception ou au service d’envoi. Les alertes Formspree contiennent uniquement une référence et un lien. Leur acceptation ne confirme pas la livraison du courriel; consultez aussi cette boîte. La suppression ici n’efface pas les copies des alertes dans Formspree ou les courriels.')}</p>
    <div className="inbox-controls"><label>{t('Show','Afficher')}<select value={status} onChange={e=>{setStatus(e.target.value);setPage(1);}}><option value="all">{t('All requests','Toutes les demandes')}</option>{referralStatuses.map(s=><option key={s} value={s}>{statusLabels[s][fr?1:0]}</option>)}</select></label><Button variant="outline" onClick={()=>setRevision(r=>r+1)}>{t('REFRESH','ACTUALISER')}</Button></div>
    <p role="status">{loading?t('Loading requests…','Chargement des demandes…'):error||`${filtered} ${filtered===1?t('request','demande'):t('requests','demandes')}`}</p>
    {!loading&&data&&<>{data.rows.length?data.rows.map(row=><RequestCard key={row.id+'-'+row.version+'-'+revision} row={row} events={data.events.filter(e=>e.referral_id===row.id)} fr={fr} onSaved={()=>setRevision(r=>r+1)}/>):<div className="empty"><h2>{t('No requests here yet.','Aucune demande pour le moment.')}</h2><p>{t('Submitted connection requests will appear here.','Les demandes envoyées apparaîtront ici.')}</p></div>}
      <div className="inbox-pagination"><Button variant="outline" disabled={page===1} onClick={()=>setPage(p=>p-1)}>{t('PREVIOUS','PRÉCÉDENTE')}</Button><span>{t('Page','Page')} {page}</span><Button variant="outline" disabled={page*25>=filtered} onClick={()=>setPage(p=>p+1)}>{t('NEXT','SUIVANTE')}</Button></div>
      {!!data.sources.length&&<details className="inbox-sources"><summary>{t('Top source pages — retained requests','Principales pages d’origine — demandes conservées')}</summary><ul>{data.sources.map(s=><li key={s.source_path}><a href={s.source_path}>{s.source_path}</a><strong>{s.count}</strong></li>)}</ul></details>}
    </>}
  </main>;
}
