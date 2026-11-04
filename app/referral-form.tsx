'use client';
import {useEffect, useRef, useState} from 'react';
import {providers} from '../lib/providers';
import {providerName} from '../lib/localization';
import {pathFor} from '../lib/content';
import {contactConsent, sharingConsent, consentVersion, referralPath} from '../lib/referral-content';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import PrivacyReassurance from './privacy-reassurance';

export default function ReferralForm({fr,onContextChange}: {fr: boolean;onContextChange:(hash:string)=>void}) {
  const t = (en: string, french: string) => fr ? french : en;
  const [clinic, setClinic] = useState('');
  const [method, setMethod] = useState('email');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [invalid, setInvalid] = useState('');
  const [saved, setSaved] = useState('');
  const [source, setSource] = useState('');
  const token = useRef('');
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const context = new URLSearchParams(location.hash.slice(1));
    const id = context.get('clinic') || '';
    if (providers.some(p => p.id === id)) setClinic(id);
    setSource((context.get('from') || '').slice(0, 250));
    setReady(true);
  }, []);
  const selected = providers.find(p => p.id === clinic);
  useEffect(()=>{if(ready)onContextChange(referralPath(fr,clinic,source).split('#')[1]?'#'+referralPath(fr,clinic,source).split('#')[1]:'');},[clinic,source,ready,fr,onContextChange]);
  if (saved) return <section className="connection-success" role="status" aria-live="polite">
    <p className="eyebrow">{t('REQUEST RECEIVED', 'DEMANDE REÇUE')}</p>
    <h2>{t('Your request is with AbortionClinic.ca.', 'Votre demande a été transmise à AbortionClinic.ca.')}</h2>
    <p>{t('Reference', 'Référence')} : <strong>{saved}</strong></p>
    <p>{t('Our team can now follow up using your chosen contact method. This is a connection request, not a booked appointment. No message has been sent automatically to a clinic.', 'Notre équipe peut maintenant vous joindre selon le moyen choisi. Il s’agit d’une demande de mise en relation, et non d’un rendez-vous confirmé. Aucun message n’a été envoyé automatiquement à une clinique.')}</p>
    <p>{t('Your contact and sharing choices stay with your request. You can ask our team to withdraw or delete it using your reference.', 'Vos préférences de contact et de partage accompagnent votre demande. Vous pouvez demander à notre équipe de la retirer ou de la supprimer en indiquant votre référence.')} <a href={pathFor('privacy',fr)}>{t('Privacy details','Renseignements sur la confidentialité')}</a></p>
    <p>{t('If you need a prompt referral, Action Canada’s Access Line is also available at ', 'Pour obtenir rapidement de l’orientation, vous pouvez aussi joindre la Ligne d’accès d’Action Canada au ')}<a href="tel:+18886422725">1-888-642-2725</a>.</p>
    <a href={pathFor('find-care', fr)}>{t('Return to the directory →', 'Retourner au répertoire →')}</a>
  </section>;
  return <div className="connection-layout"><form ref={formRef} className="connection-form" noValidate onChange={() => { token.current = ''; }} onSubmit={async event => {
    event.preventDefault(); if (busy) return;
    const form = event.currentTarget; const values = Object.fromEntries(new FormData(form));
    setError(''); setInvalid('');
    const fail = (name: string, message: string) => {
      setInvalid(name); setError(message); (form.elements.namedItem(name) as HTMLElement)?.focus();
    };
    const contact = String(values.contact || '').trim();
    if (method === 'email' ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) : !/^\+?[\d\s().-]+$/.test(contact) || contact.replace(/\D/g, '').length < 10 || contact.replace(/\D/g, '').length > 15) {
      fail('contact', method === 'email' ? t('Enter an email address you can safely receive replies at.', 'Saisissez une adresse courriel où vous pouvez recevoir une réponse en toute sécurité.') : t('Enter a telephone number with its area code.', 'Saisissez un numéro de téléphone avec son indicatif régional.')); return;
    }
    if (values.consent !== 'on') { fail('consent', t('Please agree to contact and storage before sending your request.', 'Veuillez accepter la conservation de la demande et la prise de contact avant l’envoi.')); return; }
    if (!token.current) token.current = crypto.randomUUID();
    setBusy(true);
    try {
      const response = await fetch('/api/referrals', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
        requestToken: token.current, name: values.name, contact, method, providerId: clinic,
        language: values.language, voicemail: method === 'phone' && values.voicemail === 'on',
        consent: true, shareConsent: !!clinic && values.shareConsent === 'on', consentVersion,
        sourcePath: source, locale: fr ? 'fr' : 'en', website: values.website,
      })});
      if (!response.ok) {
        if (response.status === 429) setError(t('Several requests from these contact details were received recently. Please wait an hour before sending another.', 'Plusieurs demandes avec ces coordonnées ont été reçues récemment. Veuillez attendre une heure avant d’en envoyer une autre.'));
        else if (response.status === 400 || response.status === 409) setError(t('Please check your entries and consent, then try again.', 'Vérifiez vos réponses et votre consentement, puis réessayez.'));
        else throw new Error();
        return;
      }
      const result = await response.json() as {reference?:unknown};
      if(typeof result.reference!=='string')throw new Error();
      setSaved(result.reference); form.reset();
    } catch { setError(t('Your request could not be confirmed. Your entries are still here; please try again. Retrying the same request will not create a duplicate.', 'La réception de votre demande n’a pas pu être confirmée. Vos réponses sont conservées dans ce formulaire; veuillez réessayer. Un nouvel essai de la même demande ne créera pas de doublon.')); }
    finally { setBusy(false); }
  }}>
    <PrivacyReassurance fr={fr} compact/>
    <fieldset disabled={busy}>
      <legend className="connection-legend">{t('Where would you like to connect?', 'Avec qui souhaitez-vous entrer en relation?')}</legend>
      <label htmlFor="referral-clinic">{t('Clinic preference', 'Clinique souhaitée')}</label>
      <select id="referral-clinic" name="providerId" value={clinic} onChange={e => {setClinic(e.target.value); const share = formRef.current?.elements.namedItem('shareConsent') as HTMLInputElement | null; if (share) share.checked = false;}}>
        <option value="">{t('Help me find a clinic', 'Aidez-moi à trouver une clinique')}</option>
        {[...providers].sort((a,b) => providerName(a,fr).localeCompare(providerName(b,fr), fr ? 'fr-CA' : 'en-CA')).map(p => <option key={p.id} value={p.id}>{providerName(p,fr)} — {p.city}, {p.province}</option>)}
      </select>
      <label htmlFor="referral-name">{t('Preferred name (optional; an alias is fine)', 'Nom d’usage (facultatif; un pseudonyme convient)')}</label>
      <Input id="referral-name" name="name" maxLength={80} autoComplete="off"/>
      <div className="connection-fields"><div><label htmlFor="referral-method">{t('Safe way to contact you', 'Moyen sûr de vous joindre')}</label>
        <select id="referral-method" value={method} onChange={e => {setMethod(e.target.value); setInvalid(''); setError('');}}><option value="email">{t('Email', 'Courriel')}</option><option value="phone">{t('Telephone call', 'Appel téléphonique')}</option></select>
      </div><div><label htmlFor="referral-language">{t('Preferred language', 'Langue de préférence')}</label><select id="referral-language" name="language" defaultValue={fr?'fr':'en'}><option value="en">English</option><option value="fr">Français</option></select></div></div>
      <label htmlFor="referral-contact">{method === 'email' ? t('Safe email address', 'Adresse courriel sûre') : t('Safe telephone number', 'Numéro de téléphone sûr')}</label>
      <Input key={method} id="referral-contact" name="contact" type={method==='email'?'email':'tel'} autoComplete="off" maxLength={254} required aria-invalid={invalid==='contact'} aria-describedby="referral-contact-help referral-error"/>
      <p id="referral-contact-help" className="small-note">{t('Choose an inbox or phone that other people do not monitor. Messages or caller identification may reveal our website’s name.', 'Choisissez une boîte courriel ou un téléphone que d’autres personnes ne surveillent pas. Les messages ou l’afficheur peuvent révéler le nom de notre site.')}</p>
      {method==='phone'&&<label className="consent-row"><input type="checkbox" name="voicemail"/>{t('You may leave a voicemail. Leave unchecked if we should not.', 'Vous pouvez laisser un message vocal. Sinon, laissez cette case décochée.')}</label>}
      <div className="connection-consents"><p>{t('This request goes to AbortionClinic.ca, an independent navigation service. Please do not include symptoms, pregnancy details, health card numbers or medical records.', 'Cette demande est destinée à AbortionClinic.ca, un service indépendant d’orientation. N’incluez aucun symptôme, renseignement sur une grossesse, numéro d’assurance maladie ou dossier médical.')}</p>
      <p className="small-note">{t('Formspree alerts our team with a request reference and a link to our private inbox. Your name, contact details and clinic preference are not included in that alert.', 'Formspree avise notre équipe avec une référence de demande et un lien vers notre boîte de réception privée. Votre nom, vos coordonnées et la clinique souhaitée ne figurent pas dans cette alerte.')}</p>
      <label className="consent-row"><input name="consent" type="checkbox" required aria-invalid={invalid==='consent'} aria-describedby="referral-error"/>{contactConsent[fr?1:0]}</label>
      {clinic&&<label className="consent-row" key={clinic}><input name="shareConsent" type="checkbox"/>{sharingConsent[fr?1:0]}</label>}
      <a href={pathFor('privacy',fr)} target="_blank" rel="noreferrer">{t('Read how connection requests are handled ↗', 'Lire comment les demandes sont traitées ↗')}</a></div>
      <div className="honeypot" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off"/></div>
      <Button type="submit" disabled={!ready||busy}>{busy?t('SENDING…','ENVOI…'):t('SEND REQUEST TO ABORTIONCLINIC.CA','ENVOYER À ABORTIONCLINIC.CA')}</Button>
    </fieldset><p id="referral-error" role="alert">{error}</p><noscript>{t('Enable JavaScript to send a request. For referral help, call Action Canada at 1-888-642-2725.', 'Activez JavaScript pour envoyer une demande. Pour obtenir de l’orientation, appelez Action Canada au 1-888-642-2725.')}</noscript>
  </form><aside className="connection-explainer"><p className="eyebrow">{t('YOUR NEXT STEP', 'LA PROCHAINE ÉTAPE')}</p>
    <h2>{selected?providerName(selected,fr):t('A little help finding care.', 'De l’aide pour trouver des soins.')}</h2>
    {selected&&<p>{selected.city} · {selected.province}</p>}
    <ol><li>{t('Send your request to our team.', 'Envoyez votre demande à notre équipe.')}</li><li>{t('We follow up using your chosen contact method.', 'Nous vous joignons selon le moyen choisi.')}</li><li>{t('We help you contact a clinic. The clinic confirms its services and appointment options.', 'Nous vous aidons à joindre une clinique. Celle-ci confirme ses services et ses possibilités de rendez-vous.')}</li></ol>
    <p>{t('No appointment is reserved by this form. Response times and clinic availability vary. We do not provide medical advice or emergency care.', 'Ce formulaire ne réserve aucun rendez-vous. Les délais de réponse et les disponibilités varient. Nous ne donnons pas de conseils médicaux ni de soins d’urgence.')}</p>
    <p>{t('You can ask our team to withdraw or delete your request. Our privacy page explains what is stored and when older requests are removed.', 'Vous pouvez demander à notre équipe de retirer ou de supprimer votre demande. Notre page de confidentialité explique les renseignements conservés et la suppression des anciennes demandes.')}</p>
  </aside></div>;
}
