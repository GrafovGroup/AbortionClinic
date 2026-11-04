import type {BookingInfo, Provider} from './providers';

const santeQuebec = 'https://ciusss-centresudmtl.gouv.qc.ca/soins-et-services/sante-sexuelle/avortement';
const clinicalResource = 'https://cdn.ciussscentreouest.ca/documents/ciusss-coim/Zone_partenaires/Pharmaciens/OUTIL_-_Liste_cliniques_offrant_le_service_d_interruption_de_grossesse.pdf';
const csfmServices = 'https://csfmontreal.qc.ca/en/services/abortion/';
const csfmContact = 'https://csfmontreal.qc.ca/en/contact-us/';

export const montrealProviders: Provider[] = [
  {
    id: 'clsc-des-faubourgs',
    name: 'CLSC des Faubourgs',
    kind: 'clinic',
    city: 'Montréal',
    province: 'QC',
    phone: '514-908-3517',
    phoneLabel: ['Direct clinic line', 'Ligne directe de la clinique'],
    alternatePhone: {
      number: '514-527-2361',
      label: ['CLSC switchboard · choose option 3, then extension 203674', 'Standard du CLSC · choisir l’option 3, puis composer le poste 203674'],
    },
    url: santeQuebec,
    resourceLabel: ['Clinic information (French)', 'Information sur la clinique'],
    services: ['medication', 'procedural'],
    description: [
      'The family planning and abortion clinic at the Sainte-Catherine site offers medication and procedural abortion. The clinic takes appointment requests by phone.',
      'À son point de service de la rue Sainte-Catherine, la clinique de planification familiale et d’avortement offre l’avortement par médicaments et par intervention. Les rendez-vous se prennent par téléphone.',
    ],
    sources: [santeQuebec, clinicalResource],
    reviewed: '2026-11-03',
    confirmed: false,
  },
  {
    id: 'centre-rendez-vous-avortement-montreal',
    name: 'Centre des rendez-vous en avortement de Montréal',
    kind: 'regional-booking',
    city: 'Montréal',
    province: 'QC',
    phone: '514-380-8299',
    phoneLabel: ['Montréal regional appointment line', 'Ligne régionale de rendez-vous de Montréal'],
    url: santeQuebec,
    resourceLabel: ['Appointment centre information (French)', 'Information sur le centre des rendez-vous'],
    services: [],
    description: [
      'This regional telephone service helps arrange appointments with abortion clinics in Montréal. The centre will tell you which clinic to attend.',
      'Ce service téléphonique régional aide à prendre rendez-vous dans une clinique d’avortement à Montréal. Le centre vous indiquera à quelle clinique vous rendre.',
    ],
    sources: [santeQuebec],
    reviewed: '2026-11-03',
    confirmed: false,
  },
  {
    id: 'centre-sante-femmes-montreal',
    name: 'Centre de santé des femmes de Montréal',
    kind: 'clinic',
    city: 'Montréal',
    province: 'QC',
    phone: '514-270-6110',
    phoneLabel: ['Abortion appointments · choose option 1', 'Rendez-vous pour un avortement · choisir l’option 1'],
    url: csfmServices,
    resourceLabel: ['Clinic services', 'Services de la clinique'],
    services: ['medication', 'procedural'],
    description: [
      'This community health centre offers medication and procedural abortion. You can call for an appointment even if you have never been a patient there.',
      'Ce centre de santé communautaire offre l’avortement par médicaments et par intervention. Vous pouvez y prendre rendez-vous même si vous n’avez pas de dossier au centre.',
    ],
    sources: [csfmServices, csfmContact, 'https://csfmontreal.qc.ca/nous-joindre/'],
    reviewed: '2026-11-03',
    confirmed: false,
  },
];

export const montrealBooking: Record<string, BookingInfo> = {
  'clsc-des-faubourgs': {
    access: [
      'Call the direct clinic line to request an appointment. If you use the CLSC switchboard, choose option 3 and then enter extension 203674.',
      'Appelez la ligne directe pour demander un rendez-vous. Si vous passez par le standard du CLSC, choisissez l’option 3, puis composez le poste 203674.',
    ],
    hours: [
      'Weekdays, 8:30 a.m. to 4:30 p.m. Eastern, except statutory holidays.',
      'Du lundi au vendredi, de 8 h 30 à 16 h 30 (heure de l’Est), sauf les jours fériés.',
    ],
  },
  'centre-rendez-vous-avortement-montreal': {
    access: [
      'Call the regional line to ask about an appointment. You can leave a callback number and a suitable time to reach you outside phone hours.',
      'Appelez la ligne régionale pour demander un rendez-vous. En dehors des heures de service, vous pouvez laisser un numéro de rappel et indiquer le meilleur moment pour vous joindre.',
    ],
    hours: [
      'Weekdays, 8 a.m. to 4 p.m. Eastern, except statutory holidays.',
      'Du lundi au vendredi, de 8 h à 16 h (heure de l’Est), sauf les jours fériés.',
    ],
  },
  'centre-sante-femmes-montreal': {
    access: [
      'Choose option 1 for an abortion appointment. The centre accepts voicemail at any time.',
      'Choisissez l’option 1 pour un rendez-vous en avortement. Vous pouvez laisser un message vocal en tout temps.',
    ],
    hours: [
      'Appointment calls are taken Monday to Friday, 8:15 a.m. to 4:15 p.m. Eastern.',
      'Pour les rendez-vous, appelez du lundi au vendredi, de 8 h 15 à 16 h 15 (heure de l’Est).',
    ],
    languages: [
      'French and English. An interpreter can be requested.',
      'Français et anglais. Un service d’interprétation est offert sur demande.',
    ],
  },
  'morgentaler-montreal': {
    access: [
      'Call the clinic to book. If you cannot reach the team, the clinic’s own appointment page lets you request a callback.',
      'Appelez la clinique pour prendre rendez-vous. Si vous n’arrivez pas à joindre l’équipe, vous pouvez demander un rappel sur le site de la clinique.',
    ],
    bookingUrl: 'https://montrealmorgentaler.ca/en/free-appointment/',
  },
};
