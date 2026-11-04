import {LockKeyhole} from 'lucide-react';
import {pathFor} from '../lib/content';

export default function PrivacyReassurance({fr,compact=false}:{fr:boolean;compact?:boolean}) {
  const t=(en:string,french:string)=>fr?french:en;
  const privacyLink=<a href={pathFor('privacy',fr)}>{t('Privacy and Quick Exit','Confidentialité et sortie rapide')}</a>;
  if(compact)return <aside className="privacy-reassurance privacy-reassurance--compact">
    <div className="privacy-reassurance-title"><LockKeyhole size={19} aria-hidden="true"/><h2>{t('Browsing the directory','Consulter le répertoire')}</h2></div>
    <p>{t('You can look up clinic contact details without entering your name or phone number.','Vous pouvez trouver les coordonnées d’une clinique sans fournir votre nom ni votre numéro de téléphone.')}</p>
    {privacyLink}
  </aside>;
  return <section className="privacy-reassurance privacy-reassurance--home">
    <div><div className="privacy-reassurance-title"><LockKeyhole size={22} aria-hidden="true"/><h2>{t('Your privacy while browsing','Votre vie privée sur le site')}</h2></div><p>{t('You choose when to contact a clinic and what to share.','Vous décidez quand joindre une clinique et quels renseignements lui donner.')}</p>{privacyLink}</div>
    <ul>
      <li><strong>{t('Search without an account','Cherchez sans créer de compte')}</strong><span>{t('A city or province is enough to get started.','Il suffit d’indiquer une ville ou une province.')}</span></li>
      <li><strong>{t('Contact a clinic directly','Joignez la clinique directement')}</strong><span>{t('Use the phone number or official website in its listing.','Utilisez le numéro ou le site officiel indiqué dans sa fiche.')}</span></li>
      <li><strong>{t('Leave with Quick Exit','Utilisez la sortie rapide')}</strong><span>{t('It opens the weather site. Earlier pages can remain in your browser history.','Elle ouvre le site météo. Les pages déjà consultées peuvent rester dans votre historique.')}</span></li>
    </ul>
  </section>;
}
