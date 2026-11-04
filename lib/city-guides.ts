import type {CityGuide} from './city-guide-types';
export type {CityGuide} from './city-guide-types';
import {westGuides} from './regions/west';
import {prairiesGuides} from './regions/prairies';
import {ontarioGuides} from './regions/ontario';
import {quebecGuides} from './regions/quebec';
import {atlanticGuides} from './regions/atlantic';
export const cityGuides: CityGuide[] = [
  ...westGuides, ...prairiesGuides, ...ontarioGuides, ...quebecGuides, ...atlanticGuides,
  {
    slug: 'montreal',
    surrounding: ['Laval', 'Longueuil', 'Brossard', 'Saint-Lambert', 'Boucherville', 'Repentigny', 'Terrebonne', 'Blainville', 'Boisbriand', 'Rosemère', 'Dorval', 'Pointe-Claire', 'Kirkland', 'Beaconsfield', 'Dollard-des-Ormeaux', 'L’Île-Perrot', 'Vaudreuil-Dorion'],
    province: 'QC',
    updated: '2026-11-03',
    title: ['Abortion clinics in Montréal', 'Cliniques d’avortement à Montréal'],
    description: [
      'Find direct clinic numbers in Montréal and a separate regional line that helps people arrange an appointment.',
      'Trouvez les numéros directs des cliniques de Montréal et les coordonnées du service régional de prise de rendez-vous.',
    ],
    booking: [
      'To reach the CLSC des Faubourgs clinic, use its direct number in the clinic list. If you would like help finding an appointment with a Montréal clinic, Santé Québec also lists a regional booking centre with its own number and calling hours.',
      'Pour joindre la clinique du CLSC des Faubourgs, utilisez son numéro direct dans la liste des cliniques. Si vous cherchez un rendez-vous dans une clinique de Montréal, Santé Québec indique aussi les coordonnées et les heures d’appel du centre régional de prise de rendez-vous.',
    ],
    source: {
      url: 'https://ciusss-centresudmtl.gouv.qc.ca/soins-et-services/sante-sexuelle/avortement',
      label: ['Booking information from Santé Québec (in French)', 'Modalités de prise de rendez-vous de Santé Québec'],
    },
  },
  {
    slug: 'toronto',
    aliases: ['Scarborough', 'Etobicoke', 'North York'],
    surrounding: ['Mississauga', 'Brampton', 'Vaughan', 'Markham', 'Richmond Hill', 'Pickering', 'Ajax', 'Oakville', 'Milton', 'Caledon', 'Aurora', 'Newmarket', 'Whitchurch-Stouffville'],
    province: 'ON',
    updated: '2026-11-03',
    title: ['Abortion clinics in Toronto', 'Cliniques d’avortement à Toronto'],
    description: [
      'Compare Toronto clinics, find their direct phone numbers and see how to contact each one about an appointment.',
      'Comparez les cliniques de Toronto, trouvez leur numéro direct et consultez les modalités de prise de rendez-vous de chacune.',
    ],
    booking: [
      'Choose a clinic and check its booking instructions for the service you want. For example, Toronto Abortion Clinic offers online booking for medication abortion and asks people seeking a procedural appointment to call.',
      'Choisissez une clinique et vérifiez comment prendre rendez-vous pour le service souhaité. Par exemple, la Toronto Abortion Clinic offre la prise de rendez-vous en ligne pour un avortement par médicaments et demande de téléphoner pour un avortement par intervention.',
    ],
    source: {
      url: 'https://taclinic.ca/online-booking',
      label: ['Toronto Abortion Clinic booking instructions', 'Modalités de la Toronto Abortion Clinic (en anglais)'],
    },
  },
];

export const cityGuideForLocation = (location: {slug: string; province: string}) =>
  cityGuides.find(guide => guide.slug === location.slug && guide.province === location.province);

export const cityGuidePath = (slug: string, fr = false) =>
  (fr ? '/fr/cliniques/' : '/clinics/') + slug + '/';
