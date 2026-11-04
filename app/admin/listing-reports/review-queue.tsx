'use client';
import {useEffect,useState} from 'react';
import Brand from '../../brand';
import {Button} from '@/components/ui/button';
import {listingIssueLabels,type ListingReportRow} from '../../../lib/listing-reports';
import {providerName} from '../../../lib/localization';
import {providers} from '../../../lib/providers';
import '../../listing-report-form.css';

export default function ListingReportQueue({fr}:{fr:boolean}) {
  const t=(en:string,french:string)=>fr?french:en;
  const [rows,setRows]=useState<ListingReportRow[]>([]);
  const [loaded,setLoaded]=useState(false);const [busy,setBusy]=useState('');const [error,setError]=useState('');const [filter,setFilter]=useState('pending');
  async function refresh(){const response=await fetch('/api/admin/listing-reports',{cache:'no-store'});if(!response.ok)throw new Error();setRows(await response.json());setLoaded(true);}
  useEffect(()=>{refresh().catch(()=>setError(t('Could not load reports.','Impossible de charger les signalements.')));},[]);
  async function resolve(id:string){setBusy(id);setError('');try{const response=await fetch('/api/admin/listing-reports',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});if(!response.ok)throw new Error();await refresh();}catch{setError(t('The report could not be updated.','Le signalement n’a pas pu être mis à jour.'));}finally{setBusy('');}}
  const shown=rows.filter(row=>filter==='all'||row.status===filter);
  const date=(value:string)=>new Intl.DateTimeFormat(fr?'fr-CA':'en-CA',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Toronto'}).format(new Date(value));
  return <main className="article-page listing-report-admin">
    <div className="inbox-navigation"><Brand href={fr?'/fr/':'/'}/><a href={fr?'/admin/listing-reports/':'/fr/admin/listing-reports/'} lang={fr?'en-CA':'fr-CA'}>{fr?'English':'Français'}</a></div>
    <nav className="inbox-tabs" aria-label={t('Staff tools','Outils de l’équipe')}><a href={fr?'/fr/admin/source-review/':'/admin/source-review/'}>{t('Source review','Vérification des sources')}</a><a href={fr?'/fr/admin/provider-requests/':'/admin/provider-requests/'}>{t('Organization requests','Demandes des organismes')}</a><a href={fr?'/fr/admin/':'/admin/'}>{t('Historical requests','Anciennes demandes')}</a></nav>
    <h1>{t('Visitor listing reports','Signalements des visiteurs')}</h1>
    <p>{t('These reports contain only the selected public listing and issue category. Repeated pending issues are combined. Check the published source before resolving a report. Marking it resolved does not change or confirm the public listing.','Ces signalements contiennent seulement la fiche publique sélectionnée et la catégorie du problème. Les signalements identiques en attente sont regroupés. Vérifiez la source publiée avant de clore le signalement. Le clore ne modifie ni ne confirme la fiche publique.')}</p>
    <p className="small-note">{t('Reports older than 90 days are deleted when this queue is opened or another report is received. Dates below use Toronto time.','Les signalements de plus de 90 jours sont supprimés à l’ouverture de cette liste ou à la réception d’un nouveau signalement. Les dates ci-dessous sont à l’heure de Toronto.')}</p>
    <label htmlFor="report-filter">{t('Show','Afficher')}</label><select id="report-filter" value={filter} onChange={event=>setFilter(event.target.value)}><option value="pending">{t('Pending','En attente')}</option><option value="resolved">{t('Resolved','Clos')}</option><option value="all">{t('All reports','Tous les signalements')}</option></select><Button variant="outline" disabled={!!busy} onClick={()=>{setError('');refresh().catch(()=>setError(t('Could not refresh reports.','Impossible d’actualiser les signalements.')));}}>{t('REFRESH','ACTUALISER')}</Button>
    <p role="status">{error||(!loaded?t('Loading…','Chargement…'):shown.length?t('Reports shown: ','Signalements affichés : ')+shown.length:t('No reports match this view.','Aucun signalement dans cette vue.'))}</p>
    {shown.map(row=>{const provider=providers.find(provider=>provider.id===row.provider_id);return <article className="report-queue-card" key={row.id}><div><p className="eyebrow">{row.city} · {row.province}</p><h2><a href={(fr?'/fr/prestataires/':'/providers/')+row.provider_id+'/'}>{provider?providerName(provider,fr):row.provider_name}</a></h2><p>{listingIssueLabels[row.issue][fr?1:0]}</p><p className="report-status">{row.status==='pending'?t('Pending','En attente'):t('Resolved','Clos')} · <time dateTime={row.created_at}>{date(row.created_at)}</time></p>{row.resolved_at&&<p className="report-status">{t('Resolved ','Clos le ')}<time dateTime={row.resolved_at}>{date(row.resolved_at)}</time></p>}</div>{row.status==='pending'&&<Button variant="outline" disabled={!!busy} onClick={()=>resolve(row.id)}>{busy===row.id?t('SAVING…','ENREGISTREMENT…'):t('MARK RESOLVED','MARQUER COMME CLOS')}</Button>}</article>;})}
  </main>;
}
