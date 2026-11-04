'use client';
import {useState} from 'react';
import Brand from './brand';
import './resource-share-card.css';

export default function ResourceShareCard({fr}:{fr:boolean}) {
  const [copied,setCopied]=useState(false);
  const [failed,setFailed]=useState(false);
  const url=fr?'https://abortionclinic.ca/fr/localites/':'https://abortionclinic.ca/locations/';
  const description=fr?'AbortionClinic.ca — Répertoire indépendant de cliniques d’avortement et de ressources régionales au Canada. Coordonnées publiques, sources et guides en français et en anglais. Communiquez directement avec l’organisme indiqué pour les soins et les rendez-vous.':'AbortionClinic.ca — An independent directory of abortion clinics and regional resources in Canada. Public contacts, sources and guides in English and French. Contact the listed organization directly for care and appointments.';
  async function copy() {
    setFailed(false);
    try{await navigator.clipboard.writeText(description+'\n'+url);setCopied(true);}catch{setFailed(true);}
  }
  return <section className="resource-share-block" aria-label={fr?'Fiche à partager':'Resource sharing card'}>
    <div className="resource-share-actions"><button type="button" onClick={copy}>{fr?'COPIER LE TEXTE ET LE LIEN':'COPY TEXT AND LINK'}</button><button type="button" onClick={()=>window.print()}>{fr?'IMPRIMER LA FICHE':'PRINT RESOURCE CARD'}</button></div>
    <p role="status" className="small-note">{copied?(fr?'Texte et lien copiés.':'Text and link copied.'):failed?(fr?'Copiez le texte et le lien ci-dessous manuellement.':'Copy the text and link below manually.'):(fr?'La fiche imprimée contient des liens publics, sans renseignements personnels.':'The printed card contains public links and no personal information.')}</p>
    <div className="resource-share-card">
      <Brand href={fr?'/fr/':'/'}/>
      <h2>{fr?'Trouver les coordonnées d’une clinique au Canada':'Find clinic contacts in Canada'}</h2>
      <p>{description}</p>
      <div className="resource-share-links"><p><strong>English</strong><a href="https://abortionclinic.ca/locations/">abortionclinic.ca/locations/</a></p><p><strong>Français</strong><a href="https://abortionclinic.ca/fr/localites/">abortionclinic.ca/fr/localites/</a></p></div>
      <p className="resource-share-boundary">{fr?'Un répertoire d’information. Aucun soin, rendez-vous ni service de mise en relation n’est fourni par ce site. Consultez les fiches en ligne pour les sources et dates de vérification.':'An information directory. This website does not provide care, appointments or referrals. Check the live listings for sources and review dates.'}</p>
    </div>
  </section>;
}
