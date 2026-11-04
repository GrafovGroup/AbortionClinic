import type {ReactNode} from 'react';
import EditorialImage from './editorial-image';
import {artwork} from '../lib/imagery';
import {pathFor} from '../lib/content';
import {cityGuidePath} from '../lib/city-guides';

export default function HomeCareIntro({fr,children}:{fr:boolean;children:ReactNode}) {
  const t=(en:string,french:string)=>fr?french:en;
  const guides=[
    {key:'medication-abortion',art:'medication',title:t('The abortion pill','La pilule abortive'),description:t('About medication abortion','L’avortement par médicaments')},
    {key:'procedural-abortion',art:'procedural',title:t('In-clinic care','Les soins en clinique'),description:t('About procedural care','L’avortement par intervention')},
    {key:'what-to-expect',art:'preparation',title:t('Before you call','Avant d’appeler'),description:t('Prepare your questions','Préparez vos questions')},
  ];
  return <div className="home-care">
    <section className="home-care-feature" aria-labelledby="home-care-title">
      <div className="home-care-copy">
        <p className="eyebrow">{t('THE CANADIAN CLINIC DIRECTORY','LE RÉPERTOIRE CANADIEN DES CLINIQUES')}</p>
        <h1 id="home-care-title">{t('Abortion clinics in Canada.','Cliniques d’avortement au Canada.')}</h1>
        <p>{t('Clear information to help you understand your options and find local clinic contacts.','Des renseignements clairs pour comprendre vos options et trouver les coordonnées des cliniques locales.')}</p>
      </div>
      <EditorialImage art={artwork.welcome} fr={fr} priority className="home-care-photo" sizes="(max-width: 700px) 100vw, 62vw"/>
    </section>
    <section className="home-care-search" aria-labelledby="home-search-title">
      <div className="home-care-search-heading"><p className="eyebrow">{t('START WITH YOUR LOCATION','COMMENCEZ PAR VOTRE RÉGION')}</p><h2 id="home-search-title">{t('Find a clinic.','Trouvez une clinique.')}</h2></div>
      <div className="home-care-search-controls">{children}<div className="popular">{[['Toronto','toronto'],['Montréal','montreal'],['Vancouver','vancouver'],['Calgary','calgary']].map(([city,slug])=><a key={slug} href={cityGuidePath(slug,fr)}>{city}</a>)}</div></div>
    </section>
    <section className="home-care-guides" aria-labelledby="home-guides-title">
      <h2 id="home-guides-title">{t('Understand your options.','Comprenez vos options.')}</h2>
      <div className="home-care-guide-links">{guides.map(guide=><a href={pathFor(guide.key,fr)} key={guide.key}>
        <EditorialImage art={artwork[guide.art]} fr={fr} decorative className="home-care-thumbnail" sizes="112px"/>
        <div><h3>{guide.title}</h3><p>{guide.description}</p></div>
      </a>)}</div>
    </section>
    <section className="home-care-locations" aria-labelledby="home-locations-title"><div><p className="eyebrow">{t('LOCAL INFORMATION','INFORMATION LOCALE')}</p><h2 id="home-locations-title">{t('Explore local care information.','Explorez l’information de votre région.')}</h2></div><a href="#regions">{t('BROWSE LOCATIONS','PARCOURIR LES RÉGIONS')}</a></section>
    <p className="home-care-note">{t('Independent information. For care or appointments, contact the organization listed.','Information indépendante. Pour des soins ou un rendez-vous, joignez l’organisme indiqué.')}</p>
  </div>;
}
