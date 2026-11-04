'use client';
import Brand from '../brand';
import {useState,useEffect} from 'react';
import {Button} from '@/components/ui/button';

type ReviewRequest={
  id:string;organization:string;email:string;evidence:string;kind:string;
  status:'pending'|'in_review'|'resolved'|'rejected';created_at:string;
  provider_id?:string|null;provider_name?:string|null;
};
export default function Admin({fr}:{fr:boolean}) {
  const [rows,setRows]=useState<ReviewRequest[]>([]);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState('');
  const t=(a:string,b:string)=>fr?b:a;
  const statusLabels={pending:t('Pending','En attente'),in_review:t('In review','En examen'),resolved:t('Resolved','Résolue'),rejected:t('Rejected','Rejetée')};
  async function refresh() {
    try {
      const response=await fetch('/api/admin/requests',{cache:'no-store'});
      if (!response.ok) throw new Error();
      setRows(await response.json());setError('');
    } catch {setError(t('Could not load requests.','Impossible de charger les demandes.'));}
  }
  useEffect(()=>{refresh()},[]);
  async function update(id:string,status:string) {
    setBusy(id);
    try {
      const response=await fetch('/api/admin/requests',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})});
      if (!response.ok) throw new Error();
      await refresh();
    } catch {setError(t('Change not saved. Try again.','Changement non enregistré. Réessayez.'));}
    finally {setBusy('');}
  }
  return <main className="article-page">
    <div className="inbox-navigation"><Brand href={fr?'/fr/':'/'}/><a className="language" lang={fr?'en-CA':'fr-CA'} href={fr?'/admin/provider-requests/':'/fr/admin/provider-requests/'}>{fr?'English':'Français'}</a></div>
    <nav className="inbox-tabs" aria-label={t('Staff tools','Outils de l’équipe')}>
      <a href={fr?'/fr/admin/':'/admin/'}>{t('Historical requests','Anciennes demandes')}</a>
      <a href={fr?'/fr/admin/source-review/':'/admin/source-review/'}>{t('Review listing sources','Vérifier les sources des fiches')}</a>
      <a href={fr?'/fr/admin/listing-reports/':'/admin/listing-reports/'}>{t('Visitor reports','Signalements des visiteurs')}</a>
    </nav>
    <h1>{t('Provider review','Vérification des prestataires')}</h1>
    <p>{t('Verify identity through the organization’s published contact details. Check the evidence URL independently. Resolving a request records the review. Publish listing changes through the source review process.','Vérifiez l’identité à partir des coordonnées publiées de l’organisme. Vérifiez indépendamment l’URL de référence. La résolution enregistre l’examen. Publiez les modifications selon le processus de vérification des sources.')}</p>
    <Button onClick={refresh}>{t('REFRESH','ACTUALISER')}</Button><p role="status">{error}</p>
    {!rows.length&&!error&&<p>{t('No requests to review.','Aucune demande à examiner.')}</p>}
    {rows.map(row=><article className="provider" key={row.id}><div>
      <h3>{row.organization}</h3>
      {row.provider_id?<p>{t('Listing','Fiche')} · <a href={(fr?'/fr/prestataires/':'/providers/')+encodeURIComponent(row.provider_id)+'/'}>{row.provider_name||row.provider_id}</a></p>:<p>{t('General request · no listing selected','Demande générale · aucune fiche sélectionnée')}</p>}
      <p>{row.email}</p>
      <p>{row.kind==='claim'?t('Claim review','Vérification du lien avec une fiche'):t('Correction','Correction')} · {new Intl.DateTimeFormat(fr?'fr-CA':'en-CA',{dateStyle:'long',timeStyle:'short',timeZone:'America/Toronto'}).format(new Date(row.created_at))}</p>
      <p>{t('Status','État')} · {statusLabels[row.status]}</p>
      <a href={row.evidence} target="_blank" rel="noreferrer noopener">{t('Public evidence','Référence publique')} ↗</a>
    </div><div className="provider-actions">{(['in_review','resolved','rejected'] as const).map(status=><Button key={status} disabled={busy===row.id} variant="outline" onClick={()=>update(row.id,status)}>{({in_review:t('REVIEW','EXAMINER'),resolved:t('RESOLVE','RÉSOUDRE'),rejected:t('REJECT','REJETER')})[status]}</Button>)}</div></article>)}
  </main>;
}
