'use client';
import {useEffect,useState} from 'react';
import {providers} from '../lib/providers';
import {providerName} from '../lib/localization';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {RadioGroup,RadioGroupItem} from '@/components/ui/radio-group';

export default function RequestForm({fr}:{fr:boolean}){
  const t=(en:string,french:string)=>fr?french:en;
  const [listing,setListing]=useState('');
  useEffect(()=>{
    const read=()=>{const id=new URLSearchParams(location.hash.slice(1)).get('listing');setListing(providers.find(item=>item.id===id)?.id??'');};
    read();window.addEventListener('hashchange',read);return ()=>window.removeEventListener('hashchange',read);
  },[]);
  const [busy,setBusy]=useState(false);
  const [status,setStatus]=useState('');
  const [invalid,setInvalid]=useState<string>();
  return <form className="business-form" noValidate onSubmit={async event=>{
    event.preventDefault();if(busy)return;
    const form=event.currentTarget;
    setStatus('');setInvalid(undefined);
    for(const name of ['organization','email','evidence']){
      const field=form.elements.namedItem(name) as HTMLInputElement;
      let message='';
      if(!field.value.trim())message=t('Please complete this field.','Veuillez remplir ce champ.');
      else if(name==='email'&&field.validity.typeMismatch)message=t('Enter a valid business email address.','Saisissez une adresse courriel professionnelle valide.');
      else if(name==='evidence'){
        try{const url=new URL(field.value);if(!['https:','http:'].includes(url.protocol)||url.username||url.password)throw new Error();}
        catch{message=t('Enter a public web address beginning with https:// or http://.','Saisissez une adresse Web publique commençant par https:// ou http://.');}
      }
      if(message){setInvalid(name);setStatus(message);field.focus();return;}
    }
    setBusy(true);
    try{
      const result=await fetch('/api/requests',{method:'POST',headers:{'Content-Type':'application/json','Accept-Language':fr?'fr-CA':'en-CA'},body:JSON.stringify(Object.fromEntries(new FormData(form)))});
      if(result.ok){setStatus(t('Your request was saved for review. This does not change or confirm a listing.','Votre demande a été enregistrée pour examen. Elle ne modifie ni ne confirme une fiche.'));form.reset();}
      else if(result.status===429)setStatus(t('A request from this email address was received recently. Please wait an hour before trying again.','Une demande provenant de cette adresse courriel a été reçue récemment. Veuillez attendre une heure avant de réessayer.'));
      else if(result.status===400)setStatus(t('Check the organization, business email and public source address, then try again.','Vérifiez le nom de l’organisme, le courriel professionnel et l’adresse de la source publique, puis réessayez.'));
      else throw new Error();
    }catch{setStatus(t('The request could not be saved. Your entries are still in this form; please try again later.','La demande n’a pas pu être enregistrée. Vos réponses sont toujours dans ce formulaire; veuillez réessayer plus tard.'));}
    finally{setBusy(false);}
  }}>
    <p>{t('Business details only. Do not submit patient names, medical records or health information.','Renseignements professionnels uniquement. Ne transmettez aucun nom de patient, dossier médical ou renseignement de santé.')}</p>
    <label htmlFor="listing">{t('Directory listing','Fiche du répertoire')}</label>
    <select id="listing" name="listing" value={listing} onChange={event=>{
        const id=event.target.value;setListing(id);
        const fragment=new URLSearchParams();if(id)fragment.set('listing',id);
        history.replaceState(null,'',location.pathname+(fragment.size?'#'+fragment:''));
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }} style={{maxWidth:'100%',width:'100%',padding:'.55rem',border:'1px solid var(--border)',borderRadius:'6px'}}>
      <option value="">{t('General request or listing not found','Demande générale ou fiche introuvable')}</option>
      {[...providers].sort((a,b)=>providerName(a,fr).localeCompare(providerName(b,fr),fr?'fr-CA':'en-CA')).map(p=><option value={p.id} key={p.id}>{providerName(p,fr)} · {p.city}, {p.province}</option>)}
    </select>
    <label htmlFor="organization">{t('Organization name','Nom de l’organisme')}</label><Input key={listing} defaultValue={providers.find(p=>p.id===listing)?.name||''} id="organization" name="organization" autoComplete="organization" required maxLength={150} aria-invalid={invalid==='organization'} aria-describedby={invalid==='organization'?'request-status':undefined}/>
    <label htmlFor="email">{t('Business email','Courriel professionnel')}</label><Input id="email" name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={invalid==='email'} aria-describedby={invalid==='email'?'request-status':undefined}/>
    <label htmlFor="evidence">{t('Public page showing the listing or correction','Page publique indiquant la fiche ou la correction')}</label><Input id="evidence" name="evidence" type="url" required maxLength={1000} placeholder="https://" aria-invalid={invalid==='evidence'} aria-describedby={invalid==='evidence'?'request-status':undefined}/>
    <fieldset><legend>{t('Request type','Type de demande')}</legend><RadioGroup name="kind" defaultValue="correction"><label className="radio-label"><RadioGroupItem value="correction"/>{t('Correct public details','Corriger des renseignements publics')}</label><label className="radio-label"><RadioGroupItem value="claim"/>{t('Review a listing claim','Faire vérifier le lien avec une fiche')}</label></RadioGroup></fieldset>
    <div className="honeypot" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off"/></div>
    <Button disabled={busy} type="submit">{busy?t('SAVING…','ENREGISTREMENT…'):t('SUBMIT FOR REVIEW','SOUMETTRE POUR EXAMEN')}</Button><p id="request-status" role="status" aria-live="polite">{status}</p>
  </form>;
}
