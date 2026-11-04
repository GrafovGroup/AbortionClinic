import {ArrowUpRight, MapPin, Phone} from 'lucide-react';
import {type Provider, providerResourceLabel, bookingByProvider} from '../lib/providers';
import {pathFor, provinces} from '../lib/content';
import {formatDate, providerName, providerPhone, localizedResource, serviceName} from '../lib/localization';
import {providerPracticalDetails, practicalSources} from '../lib/provider-practical-details';
import {sourceLabel} from '../lib/source-labels';
import './provider-profile.css';

export default function ProviderProfile({provider, fr}: {provider: Provider; route: string; fr: boolean}) {
  const t = (en: string, french: string) => fr ? french : en;
  const language = fr ? 1 : 0;
  const booking = bookingByProvider[provider.id];
  const practical = providerPracticalDetails[provider.id];
  const practicalFields = practical ? [
    {label: t('Published address', 'Adresse publiée'), detail: practical.address},
    {label: t('Referral information', 'Orientation médicale'), detail: practical.referral},
    {label: t('Accessibility', 'Accessibilité'), detail: practical.accessibility},
  ].filter(field => field.detail) : [];
  const regional = provider.kind === 'regional-booking';
  const region = provinces.find(item => item[0] === provider.province);
  const sourceLinks = [...new Map([...provider.sources, ...practicalSources(provider.id), ...(booking?.bookingUrl ? [booking.bookingUrl] : [])].map(source => {
    const localized = localizedResource(source, fr);
    return [localized.replace(/\/(?=[?#]|$)/, ''), localized];
  })).values()];
  const phones = [
    {number: provider.phone, label: provider.phoneLabel?.[language] ?? t('Contact number', 'Numéro de téléphone')},
    ...(provider.alternatePhone ? [{number: provider.alternatePhone.number, label: provider.alternatePhone.label[language]}] : []),
  ];

  return <section className="profile clinic-profile">
    <div className="editorial-heading profile-heading">
      <div>
        <p className="eyebrow">{regional?t('REGIONAL BOOKING SERVICE','SERVICE RÉGIONAL DE RENDEZ-VOUS'):t('CLINIC OR PROGRAM', 'CLINIQUE OU PROGRAMME')}</p>
        <h1>{providerName(provider, fr)}</h1>
        <p className="profile-location"><MapPin size={17} aria-hidden="true"/>{provider.city}, {region?.[fr ? 4 : 3] ?? provider.province}</p>
        <p className="profile-summary">{provider.description[language]}</p>
        <div className="tags">
          {provider.services.map(method => <span key={method}>{serviceName(method, fr)}</span>)}
          {provider.virtual && <span>{t('Virtual appointments', 'Rendez-vous virtuels')}</span>}
          {!regional && !provider.services.length && <span>{t('Ask which methods are available', 'Méthodes offertes à confirmer')}</span>}
        </div>
      </div>
      <aside className="profile-contact" aria-labelledby="profile-contact-title">
        <p className="eyebrow">{t('CONTACT DETAILS', 'COORDONNÉES')}</p>
        <h2 id="profile-contact-title">{t('Contact this service', 'Joindre ce service')}</h2>
        {phones.map(({number, label}) => <div className="profile-phone" key={number}>
          <span>{label}</span>
          <a href={providerPhone({phone: number})} aria-label={label + ' · ' + number.replace(';ext=', fr ? ' poste ' : ' extension ')}>
            <Phone size={18} aria-hidden="true"/>{number.replace(';ext=', fr ? ' poste ' : ' ext. ')}
          </a>
        </div>)}
        <a className="profile-website" href={localizedResource(provider.url, fr)} rel="noreferrer">
          {providerResourceLabel(provider, fr)}<ArrowUpRight size={17} aria-hidden="true"/>
        </a>
      </aside>
    </div>
    {booking && <section className="booking-info" aria-labelledby="booking-heading">
      <h2 id="booking-heading">{t('Before you call', 'Avant d’appeler')}</h2>
      <dl>
        {booking.access && <div><dt>{t('How to book','Prendre rendez-vous')}</dt><dd>{booking.access[language]}</dd></div>}
        {booking.hours && <div><dt>{t('Calling and booking hours','Heures d’appel et de prise de rendez-vous')}</dt><dd>{booking.hours[language]}</dd></div>}
        {booking.languages && <div><dt>{t('Languages and interpretation','Langues et interprétation')}</dt><dd>{booking.languages[language]}</dd></div>}
      </dl>
      {booking.bookingUrl && <a className="booking-link" href={localizedResource(booking.bookingUrl,fr)} rel="noreferrer">{t('Official appointment information','Renseignements officiels sur les rendez-vous')} <ArrowUpRight size={16} aria-hidden="true"/></a>}
    </section>}
    {!!practicalFields.length && <section className="booking-info practical-info" aria-labelledby="practical-heading">
      <h2 id="practical-heading">{t('Planning your visit', 'Préparer votre visite')}</h2>
      <p className="practical-intro">{t('Published details checked on ', 'Renseignements publiés vérifiés le ')}<time dateTime={practical.checked}>{formatDate(practical.checked, fr)}</time>. {t('Confirm the appointment location and your access needs with the clinic before travelling.', 'Confirmez le lieu du rendez-vous et vos besoins d’accessibilité avec la clinique avant de vous déplacer.')}</p>
      <dl>{practicalFields.map(({label, detail}) => detail && <div key={label}>
        <dt>{label}</dt>
        <dd><p>{detail.text[language]}</p><a className="practical-source" href={localizedResource(detail.source, fr)} rel="noreferrer" aria-label={t('Source: ', 'Source : ') + sourceLabel(localizedResource(detail.source, fr), fr)}>{t('View source', 'Consulter la source')}<ArrowUpRight size={14} aria-hidden="true"/></a></dd>
      </div>)}</dl>
    </section>}
    <div className="article-grid profile-details">
      <article className="sources">
        <h2>{t('Sources for this listing', 'Sources de cette fiche')}</h2>
        <p className="profile-source-status"><strong>{t('Public sources checked', 'Sources publiques vérifiées')}</strong><span>{t('The organization has not confirmed this listing directly with us.', 'L’organisme n’a pas confirmé cette fiche directement auprès de nous.')}</span></p>
        <p>{t('Listing information checked on ', 'Renseignements de la fiche vérifiés le ')}<time dateTime={provider.reviewed}>{formatDate(provider.reviewed, fr)}</time>. {t('A source or link check does not confirm appointment availability. Ask the clinic or program about current services and appointments.', 'La vérification d’une source ou d’un lien ne confirme pas la disponibilité des rendez-vous. Consultez la clinique ou le programme pour connaître les services et les rendez-vous disponibles.')}</p>
        <ul>{sourceLinks.map((source, i) => <li key={source}>
          <a href={source} rel="noreferrer"><span className="profile-source-index" aria-hidden="true">{i + 1}.</span> {sourceLabel(source, fr)}<ArrowUpRight aria-hidden="true" size={15}/></a>
        </li>)}</ul>
        <a href={pathFor('provider-review-policy', fr)}>{t('How listings are checked', 'Comment les fiches sont vérifiées')}</a>
      </article>
      <aside className="note-box">
        <h3>{t('More information', 'Pour en savoir plus')}</h3>
        <a href={pathFor('what-to-expect', fr)}>{t('Questions for your first call', 'Questions à poser au premier appel')}</a>
        <a href={pathFor('find-care', fr)}>{t('Browse other clinics', 'Parcourir les autres cliniques')}</a>
        <a href={pathFor('report-listing', fr)+'#listing='+encodeURIComponent(provider.id)}>{t('Report a listing problem', 'Signaler une erreur dans cette fiche')}</a>
        <a href={pathFor('for-providers', fr)+'#listing='+encodeURIComponent(provider.id)}>{t('For organizations: request a correction', 'Organismes : demander une correction')}</a>
      </aside>
    </div>
  </section>;
}
