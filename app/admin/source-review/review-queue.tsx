'use client';
import {useEffect,useState} from 'react';
import Brand from '../../brand';
import {Button} from '@/components/ui/button';
import {formatDate} from '../../../lib/localization';
import type {ReviewRow,ReviewCategory} from '../../../lib/source-review';
import './review-queue.css';

export default function SourceReview({fr}:{fr:boolean}) {
  const t=(en:string,french:string)=>fr?french:en;
  const [rows,setRows]=useState<ReviewRow[]>([]);
  const [loaded,setLoaded]=useState(false);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState('');
  const [filter,setFilter]=useState('all');
  const [category,setCategory]=useState<ReviewCategory|'all'>('all');
  async function refresh() {
    const response=await fetch('/api/admin/source-review',{cache:'no-store'});
    if (!response.ok) throw new Error();
    setRows(await response.json());
    setLoaded(true);
  }
  useEffect(()=>{refresh().catch(()=>setError(t('Could not load the review queue.','Impossible de charger la liste de vérification.')));},[]);
  async function check(id:string) {
    setBusy(id);setError('');
    try {
      const response=await fetch('/api/admin/source-review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});
      if (!response.ok) throw new Error();
      await refresh();
    } catch {setError(t('The link check could not finish. Try again later.','La vérification n’a pas pu se terminer. Réessayez plus tard.'));}
    finally {setBusy('');}
  }
  const missing=(row:ReviewRow)=>row.sources.some(source=>source.outcome==='missing');
  const selected=rows.filter(row=>category==='all'||row.category===category);
  const shown=selected.filter(row=>filter==='all'||filter==='due'&&row.due||filter==='missing'&&missing(row)||filter==='manual'&&row.sources.some(source=>source.outcome==='manual')||filter==='unchecked'&&row.sources.some(source=>source.outcome==='unchecked'));
  const categories:Record<ReviewCategory,string>={provider:t('Provider listing','Fiche de prestataire'),article:t('Information article','Article d’information'),city:t('City guide','Guide local')};
  const labels={
    unchecked:t('Not checked','Non vérifié'),available:t('Responded successfully','Réponse reçue'),
    missing:t('Page missing','Page introuvable'),manual:t('Manual check needed','Vérification manuelle requise'),
  };
  return <main className="article-page source-review-page">
    <div className="inbox-navigation"><Brand href={fr?'/fr/':'/'}/><a href={fr?'/admin/source-review/':'/fr/admin/source-review/'} lang={fr?'en-CA':'fr-CA'}>{fr?'English':'Français'}</a></div>
    <nav className="inbox-tabs" aria-label={t('Staff tools','Outils de l’équipe')}><a href={fr?'/fr/admin/provider-requests/':'/admin/provider-requests/'}>{t('Provider corrections','Corrections des fiches')}</a><a href={fr?'/fr/admin/listing-reports/':'/admin/listing-reports/'}>{t('Visitor reports','Signalements des visiteurs')}</a><a href={fr?'/fr/admin/':'/admin/'}>{t('Historical requests','Anciennes demandes')}</a></nav>
    <h1>{t('Content source review','Vérification des sources')}</h1>
    <p>{t('Review provider listings, city guides and sourced articles every 90 days. Check published links here, then read the source and verify the relevant facts before updating the content. Pages without a recorded source-review date are also marked for review.','Vérifiez les fiches de prestataires, les guides locaux et les articles sourcés tous les 90 jours. Contrôlez les liens ici, puis lisez les sources et vérifiez les faits avant de modifier le contenu. Les pages sans date de vérification des sources sont aussi signalées.')}</p>
    <p className="small-note">{t('A successful response only confirms that a URL responded. Redirects, blocked requests and timeouts require a manual check. Link checks keep their own date and do not update a content-review date or establish clinical review or provider confirmation. Dates use Toronto time.','Une réponse reçue confirme seulement que l’URL répond. Les redirections, blocages et délais dépassés nécessitent une vérification manuelle. Les contrôles des liens ne modifient pas les dates de vérification du contenu et ne constituent ni une révision clinique ni une confirmation du prestataire. Les dates suivent l’heure de Toronto.')}</p>
    <div className="source-review-controls"><label htmlFor="review-category">{t('Content type','Type de contenu')}<select id="review-category" value={category} onChange={event=>setCategory(event.target.value as ReviewCategory|'all')}>
      <option value="all">{t('All content','Tout le contenu')} ({rows.length})</option>
      {(['provider','article','city'] as ReviewCategory[]).map(kind=><option key={kind} value={kind}>{categories[kind]} ({rows.filter(row=>row.category===kind).length})</option>)}
    </select></label><label htmlFor="review-filter">{t('Show','Afficher')}<select id="review-filter" value={filter} onChange={event=>setFilter(event.target.value)}>
      <option value="all">{t('All statuses','Tous les états')} ({selected.length})</option>
      <option value="due">{t('Content review due','Contenu à vérifier')} ({selected.filter(row=>row.due).length})</option>
      <option value="missing">{t('Missing pages','Pages introuvables')} ({selected.filter(missing).length})</option>
      <option value="manual">{t('Manual link check','Liens à vérifier manuellement')} ({selected.filter(row=>row.sources.some(s=>s.outcome==='manual')).length})</option>
      <option value="unchecked">{t('Links not checked','Liens non vérifiés')} ({selected.filter(row=>row.sources.some(s=>s.outcome==='unchecked')).length})</option>
    </select></label><Button variant="outline" disabled={!!busy} onClick={()=>{setError('');refresh().catch(()=>setError(t('Could not refresh.','Impossible d’actualiser.')));}}>{t('REFRESH','ACTUALISER')}</Button></div>
    <p role="status" aria-live="polite">{error||(!loaded?t('Loading content…','Chargement du contenu…'):t('Showing ','Affichage de ')+shown.length+t(' items.',' éléments.'))}</p>
    {loaded&&!shown.length&&<p>{t('No content matches these filters.','Aucun contenu ne correspond à ces filtres.')}</p>}
    {shown.map(row=><article className="source-review-card" key={row.id}>
      <div className="source-review-heading"><div><p className="eyebrow">{[categories[row.category],row.city,row.province].filter(Boolean).join(' · ')}</p><h2><a href={fr?row.frenchPath:row.path}>{fr?row.frenchName:row.name}</a></h2><p>{t('Sources checked','Sources vérifiées')} · {row.reviewed?formatDate(row.reviewed,fr):t('No date recorded','Aucune date consignée')}{row.due&&<strong className="review-due"> · {t('Review due','Vérification à faire')}</strong>}</p></div><Button variant="outline" disabled={!!busy} onClick={()=>check(row.id)}>{busy===row.id?t('CHECKING…','VÉRIFICATION…'):t('CHECK LINKS','VÉRIFIER LES LIENS')}</Button></div>
      <ul>{row.sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noreferrer noopener">{source.url}</a><span className={'source-status source-status--'+source.outcome}>{labels[source.outcome]}{source.http_status?' · HTTP '+source.http_status:''}</span>{source.checked_at&&<time dateTime={source.checked_at}>{new Intl.DateTimeFormat(fr?'fr-CA':'en-CA',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Toronto'}).format(new Date(source.checked_at))} · {t('Toronto time','heure de Toronto')}</time>}</li>)}</ul>
    </article>)}
  </main>;
}
