import type {BookingInfo, Provider} from './providers';

export const torontoProviders: Provider[] = [
  {
    id: 'toronto-abortion-clinic',
    name: 'Toronto Abortion Clinic',
    kind: 'clinic',
    city: 'Toronto',
    province: 'ON',
    phone: '416-932-0446',
    phoneLabel: ['Clinic booking line', 'Rendez-vous à la clinique'],
    url: 'https://taclinic.ca/',
    services: ['medication', 'procedural'],
    description: [
      'Toronto Abortion Clinic offers medication and procedural abortion. The booking process depends on which service you need.',
      'La clinique offre l’avortement par médicaments et par intervention. La façon de prendre rendez-vous dépend du service souhaité.',
    ],
    sources: ['https://taclinic.ca/', 'https://taclinic.ca/online-booking'],
    reviewed: '2026-11-03',
    confirmed: false,
  },
  {
    id: 'bloor-west-village-womens-clinic',
    name: 'Bloor West Village Women’s Clinic',
    kind: 'clinic',
    city: 'Toronto',
    province: 'ON',
    phone: '416-849-4595',
    phoneLabel: ['Clinic reception and appointments', 'Accueil et rendez-vous'],
    alternatePhone: {number: '1-844-785-1375', label: ['Toll-free reception', 'Accueil sans frais']},
    url: 'https://www.bloorwestwomensclinic.com/contact/',
    services: ['medication', 'procedural'],
    description: [
      'The clinic offers medication and procedural abortion at 2425 Bloor Street West, Suite 403, near Jane subway station.',
      'La clinique offre l’avortement par médicaments et par intervention au 2425, rue Bloor Ouest, bureau 403, près de la station de métro Jane.',
    ],
    sources: [
      'https://www.bloorwestwomensclinic.com/contact/',
      'https://www.bloorwestwomensclinic.com/abortion-services',
    ],
    reviewed: '2026-11-03',
    confirmed: false,
  },
  {
    id: 'cabbagetown-womens-clinic',
    name: 'Cabbagetown Women’s Clinic',
    kind: 'clinic',
    city: 'Toronto',
    province: 'ON',
    phone: '416-323-0642',
    phoneLabel: ['Clinic appointment line', 'Rendez-vous à la clinique'],
    alternatePhone: {number: '1-800-399-1592', label: ['Toll-free clinic line', 'Numéro sans frais de la clinique']},
    url: 'https://www.cabbagetownwomensclinic.com/contact',
    services: ['medication', 'procedural'],
    description: [
      'Cabbagetown Women’s Clinic now operates in Leslieville, at 1624 Queen Street East. It offers medication and procedural abortion.',
      'La clinique Cabbagetown se trouve maintenant dans Leslieville, au 1624, rue Queen Est. Elle offre l’avortement par médicaments et par intervention.',
    ],
    sources: [
      'https://www.cabbagetownwomensclinic.com/',
      'https://www.cabbagetownwomensclinic.com/contact',
      'https://www.cabbagetownwomensclinic.com/book-online',
      'https://www.cabbagetownwomensclinic.com/service-page/appointment',
    ],
    reviewed: '2026-11-03',
    confirmed: false,
  },
];

export const torontoBooking: Record<string, BookingInfo> = {
  'toronto-abortion-clinic': {
    hours: [
      'Monday to Friday, 8 a.m. to 5 p.m., and Saturday, 8 a.m. to 1:30 p.m. (Eastern time).',
      'Du lundi au vendredi, de 8 h à 17 h, et le samedi, de 8 h à 13 h 30 (heure de l’Est).',
    ],
    access: [
      'For medication abortion, book online or call. For procedural abortion, call the booking line.',
      'Pour un avortement par médicaments, prenez rendez-vous en ligne ou par téléphone. Pour un avortement par intervention, appelez la clinique.',
    ],
    languages: [
      'The clinic offers language assistance for appointments. Its website explains how to request help in your language.',
      'La clinique offre de l’aide linguistique pour les rendez-vous. Son site explique comment demander de l’aide dans votre langue.',
    ],
    bookingUrl: 'https://taclinic.ca/online-booking',
  },
  'bloor-west-village-womens-clinic': {
    hours: [
      'Reception answers Monday through Saturday. Check the clinic website for closures.',
      'L’accueil répond au téléphone du lundi au samedi. Consultez le site de la clinique pour les jours de fermeture.',
    ],
    access: [
      'Call reception to arrange an appointment or ask a question about booking.',
      'Appelez l’accueil pour prendre rendez-vous ou poser une question sur la réservation.',
    ],
  },
  'cabbagetown-womens-clinic': {
    hours: [
      'Appointment line daily, 8 a.m. to 10 p.m. To confirm an online request, call on a weekday from 8 a.m. to 4 p.m. (Eastern time).',
      'Ligne de rendez-vous tous les jours de 8 h à 22 h. Pour confirmer une demande en ligne, appelez en semaine de 8 h à 16 h (heure de l’Est).',
    ],
    access: [
      'Call to book directly. If you use the online form, check its booking criteria and call the clinic to confirm the appointment.',
      'Appelez la clinique pour prendre rendez-vous. Si vous utilisez le formulaire en ligne, vérifiez les critères qui y sont indiqués, puis appelez pour confirmer le rendez-vous.',
    ],
    bookingUrl: 'https://www.cabbagetownwomensclinic.com/book-online',
  },
  'choice-in-health': {
    hours: [
      'Monday, 9:30 a.m. to 4:30 p.m. Tuesday to Friday, 9:30 a.m. to 5 p.m. (Eastern time).',
      'Le lundi, de 9 h 30 à 16 h 30. Du mardi au vendredi, de 9 h 30 à 17 h (heure de l’Est).',
    ],
    access: [
      'You can book directly with the clinic. Its online booking requires a valid Ontario health card number. Call if you do not have one.',
      'Vous pouvez prendre rendez-vous directement avec la clinique. Pour réserver en ligne, il faut un numéro de carte Santé de l’Ontario valide. Si vous n’en avez pas, appelez la clinique.',
    ],
    languages: [
      'Ask when booking about interpretation, including American Sign Language.',
      'Au moment de prendre rendez-vous, vous pouvez demander les services d’un interprète, notamment en langue des signes américaine (ASL).',
    ],
    bookingUrl: 'https://choiceinhealth.ca/bookonline',
  },
};
