'use client';
import {useEffect,useState} from 'react';
import {providers} from '../lib/providers';
import {providerName} from '../lib/localization';
import {listingIssueLabels,type ListingIssue} from '../lib/listing-reports';
import {Button} from '@/components/ui/button';
import './listing-report-form.css';

export default function ListingReportForm({fr}:{fr:boolean}) {
  const t=(en:string,french:string)=>fr?french:en;
  const [listing,setListing]=useState('');
  const [issue,setIssue]=useState<ListingIssue|''>('');
  const [busy,setBusy]=useState(false);
  const [status,setStatus]=useState('');
  const [invalid,setInvalid]=useState('');
  useEffect(()=>{
    const read=()=>{const id=new URLSearchParams(location.hash.slice(1)).get('listing');setListing(providers.some(provider=>provider.id===id)?id!:'');};
    read();window.addEventListener('hashchange',read);return()=>window.removeEventListener('hashchange',read);
  },[]);
  return <form className="listing-report-form" noValidate onSubmit={async event=>{
    event.preventDefault();if(busy)return;
    const form=event.currentTarget;setStatus('');setInvalid('');
    for(const field of ['listing','issue'])if(!(field==='listing'?listing:issue)){
      setInvalid(field);setStatus(t('Choose a listing and the detail that needs checking.','Choisissez une fiche et le renseignement à vérifier.'));
      (form.elements.namedItem(field) as unknown as {focus:()=>void}|null)?.focus();return;
    }
    setBusy(true);
    try {
      const response=await fetch('/api/listing-reports',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({listing,issue,website:(form.elements.namedItem('website') as HTMLInputElement).value})});
      if(response.ok)setStatus(t('Thank you. This issue is in the editorial review queue. Repeated reports about the same issue are combined. A report does not change the listing automatically.','Merci. Ce problème est dans la liste de vérification éditoriale. Les signalements identiques sont regroupés. Un signalement ne modifie pas automatiquement la fiche.'));
      else if(response.status===429)setStatus(t('The report limit has been reached. Please try again later.','La limite de signalements a été atteinte. Veuillez réessayer plus tard.'));
      else if(response.status===400)setStatus(t('Check the selected listing and issue, then try again.','Vérifiez la fiche et le problème sélectionnés, puis réessayez.'));
      else throw new Error();
    }catch{setStatus(t('The report could not be saved. Please try again later. Your selections remain in this form.','Le signalement n’a pas pu être enregistré. Veuillez réessayer plus tard. Vos choix sont conservés dans ce formulaire.'));}
    finally{setBusy(false);}
  }}>
    <p className="listing-report-privacy">{t('No name, email address or health details are needed. Select only the public listing and the information that may be wrong.','Aucun nom, courriel ou renseignement de santé n’est nécessaire. Sélectionnez seulement la fiche publique et l’information qui semble incorrecte.')}</p>
    <label htmlFor="report-listing">{t('Which listing needs checking?','Quelle fiche faut-il vérifier?')}</label>
    <select id="report-listing" name="listing" required value={listing} aria-invalid={invalid==='listing'} aria-describedby={invalid==='listing'?'listing-report-status':undefined} onChange={event=>{
      const id=event.target.value;setListing(id);setStatus('');
      const fragment=new URLSearchParams();if(id)fragment.set('listing',id);
      history.replaceState(null,'',location.pathname+(fragment.size?'#'+fragment:''));window.dispatchEvent(new HashChangeEvent('hashchange'));
    }}>
      <option value="">{t('Choose a clinic or service','Choisir une clinique ou un service')}</option>
      {[...providers].sort((a,b)=>providerName(a,fr).localeCompare(providerName(b,fr),fr?'fr-CA':'en-CA')).map(provider=><option key={provider.id} value={provider.id}>{providerName(provider,fr)} · {provider.city}, {provider.province}</option>)}
    </select>
    <label htmlFor="report-issue">{t('What needs checking?','Quel renseignement faut-il vérifier?')}</label>
    <select id="report-issue" name="issue" required value={issue} aria-invalid={invalid==='issue'} aria-describedby={invalid==='issue'?'listing-report-status':undefined} onChange={event=>{setIssue(event.target.value as ListingIssue|'');setStatus('');}}>
      <option value="">{t('Choose an issue','Choisir un problème')}</option>
      {(Object.keys(listingIssueLabels) as ListingIssue[]).map(key=><option value={key} key={key}>{listingIssueLabels[key][fr?1:0]}</option>)}
    </select>
    <div className="listing-report-honeypot" aria-hidden="true"><label htmlFor="report-website">Website</label><input id="report-website" name="website" tabIndex={-1} autoComplete="off"/></div>
    <p className="small-note">{t('The website team checks reports against public sources. We cannot reply to reports, book appointments or contact a clinic on your behalf.','L’équipe du site vérifie les signalements à partir de sources publiques. Nous ne pouvons pas répondre aux signalements, prendre rendez-vous ni contacter une clinique pour vous.')}</p>
    <Button type="submit" disabled={busy}>{busy?t('SENDING…','ENVOI…'):t('SEND ERROR REPORT','SIGNALER LE PROBLÈME')}</Button>
    <p id="listing-report-status" role="status" aria-live="polite">{status}</p>
  </form>;
}
