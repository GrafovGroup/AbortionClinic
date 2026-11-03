export const content = {
  en: {
    lang: 'en-CA', label: 'English', other: 'Français', nav: ['Home', 'Clinics', 'Abortion information', 'Resources'],
    footer: ['About', 'Contact', 'Privacy', 'Terms', 'Editorial policy', 'Disclaimer'],
    title: 'Find information about abortion care in Canada.',
    intro: 'Explore abortion-care information and browse publicly available contact details for clinics and healthcare providers across Canada.',
    cta: 'Browse clinics', eyebrow: 'INFORMATION · CHOICE · PRIVACY',
    disclosure: 'AbortionClinic.ca is an independent informational website, not a medical clinic or healthcare provider. We do not provide medical advice, treatment, referrals, appointment booking, or patient coordination. Provider information is supplied for general reference; visitors contact providers independently.',
    draft: 'Restoration preview — content and provider records are being recovered. Not ready for publication.',
    exit: 'Quick exit', exitHelp: 'Opens a neutral website in this tab. This does not erase your browser history.',
    search: 'City, province or territory', searchButton: 'Search clinics', empty: 'No provider records have been recovered yet. This does not mean care is unavailable in your area.',
    noResults: 'No matching records. Try another city, province or territory.', count: 'Results',
    directoryIntro: 'Browse public provider information. Contact providers independently using their official website or telephone number.',
    infoIntro: 'Educational pages are awaiting source recovery and qualified review. No clinical guidance is published in this preview.',
    topics: ['Medication abortion', 'Procedural abortion', 'Costs and coverage', 'Access requirements', 'What to expect', 'Aftercare', 'Frequently asked questions'],
    resourcesIntro: 'Provincial and territorial resources will be restored after their official sources have been checked.',
    emergency: 'For an emergency in Canada, call 911 or go to the nearest emergency department.',
    about: 'An independent information resource and public clinic directory for Canada. This reconstruction is in progress.',
    contact: 'A channel for site corrections and general administrative inquiries has not yet been restored. Please do not submit patient information or medical questions.',
    privacy: 'This preview has no patient intake, analytics, advertising trackers or booking forms. Directory searches stay in your browser and are not sent to a server. External links are subject to the destination’s privacy policy. A complete privacy policy requires review before publication.',
    terms: 'Terms are awaiting legal review. This preview is for reviewing the reconstruction and must not be used as a clinical service.',
    editorial: 'Before publication, each provider record needs an official source and review date. Information reviewed is distinct from provider confirmation. Clinical content requires qualified review; French content requires Canadian French review. No provider has been marked verified in this preview.',
    skip: 'Skip to content', website: 'View website', call: 'Call clinic', reviewed: 'Information reviewed', source: 'Source', pending: 'Awaiting recovery and review'
  },
  fr: {
    lang: 'fr-CA', label: 'Français', other: 'English', nav: ['Accueil', 'Cliniques', 'Information sur l’avortement', 'Ressources'],
    footer: ['À propos', 'Contact', 'Confidentialité', 'Conditions', 'Politique éditoriale', 'Avis de non-responsabilité'],
    title: 'Trouvez de l’information sur les services d’avortement au Canada.',
    intro: 'Consultez de l’information sur l’avortement et les coordonnées publiques de cliniques et de professionnels de la santé au Canada.',
    cta: 'Consulter les cliniques', eyebrow: 'INFORMATION · CHOIX · CONFIDENTIALITÉ',
    disclosure: 'AbortionClinic.ca est un site d’information indépendant, et non une clinique ni un fournisseur de soins de santé. Nous n’offrons ni conseils médicaux, ni traitements, ni services d’orientation, ni prise de rendez-vous, ni coordination des soins. Les renseignements sur les fournisseurs sont présentés à titre indicatif; les visiteurs les contactent directement.',
    draft: 'Aperçu de la restauration — le contenu et les fiches des fournisseurs sont en cours de récupération. Non destiné à la publication.',
    exit: 'Sortie rapide', exitHelp: 'Ouvre un site neutre dans cet onglet. Cela n’efface pas l’historique de votre navigateur.',
    search: 'Ville, province ou territoire', searchButton: 'Rechercher des cliniques', empty: 'Aucune fiche de fournisseur n’a encore été récupérée. Cela ne signifie pas que des soins sont indisponibles dans votre région.',
    noResults: 'Aucun résultat. Essayez une autre ville, province ou un autre territoire.', count: 'Résultats',
    directoryIntro: 'Consultez les renseignements publics sur les fournisseurs. Contactez-les directement par leur site officiel ou par téléphone.',
    infoIntro: 'Les pages éducatives attendent la récupération des sources et une révision qualifiée. Cet aperçu ne publie aucune directive clinique.',
    topics: ['Avortement médicamenteux', 'Avortement procédural', 'Coûts et couverture', 'Conditions d’accès', 'À quoi s’attendre', 'Soins après un avortement', 'Questions fréquentes'],
    resourcesIntro: 'Les ressources provinciales et territoriales seront rétablies après vérification de leurs sources officielles.',
    emergency: 'En cas d’urgence au Canada, composez le 911 ou rendez-vous au service des urgences le plus proche.',
    about: 'Une ressource d’information indépendante et un répertoire public de cliniques au Canada. Cette reconstruction est en cours.',
    contact: 'Le canal de correction du site et de demandes administratives générales n’a pas encore été rétabli. Veuillez ne pas transmettre de renseignements sur les patients ni de questions médicales.',
    privacy: 'Cet aperçu ne contient aucun formulaire d’admission, outil d’analyse, traceur publicitaire ou formulaire de réservation. Les recherches restent dans votre navigateur et ne sont pas envoyées à un serveur. Les liens externes sont soumis à la politique de confidentialité du site de destination. La politique complète doit être révisée avant publication.',
    terms: 'Les conditions attendent une révision juridique. Cet aperçu sert à examiner la reconstruction et ne constitue pas un service clinique.',
    editorial: 'Avant publication, chaque fiche doit avoir une source officielle et une date de révision. La révision des renseignements se distingue de la confirmation par le fournisseur. Le contenu clinique exige une révision qualifiée et le contenu français une révision en français canadien. Aucun fournisseur n’est présenté comme vérifié dans cet aperçu.',
    skip: 'Aller au contenu', website: 'Consulter le site', call: 'Appeler la clinique', reviewed: 'Renseignements révisés', source: 'Source', pending: 'En attente de récupération et de révision'
  }
};
export const pages = ['home', 'clinics', 'information', 'resources', 'about', 'contact', 'privacy', 'terms', 'editorial', 'disclaimer'];
export const pathFor = (lang, page) => `/${lang}/${page === 'home' ? '' : page + '/'}`;
export const escape = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
