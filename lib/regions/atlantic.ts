import type {CityGuide} from '../city-guide-types';
import type {Provider, BookingInfo} from '../providers';

const reviewed = '2026-11-03';
const rose = 'https://www.nshealth.ca/clinics-programs-and-services/rose-clinic-reproductive-options-and-services';
const nsClinics = 'https://www.nshealth.ca/sexual-health-clinics';
const horizon = 'https://horizonnb.ca/services/clinics/family-planning-clinic-abortion-clinic/';
const horizonFr = 'https://horizonnb.ca/fr/services/cliniques/clinique-de-planification-familiale-clinique-davortement/';
const vitalite = 'https://vitalitenb.ca/en/services-and-locations/service-directory/abortion';
const vitaliteFr = 'https://vitalitenb.ca/fr/services-et-emplacement/repertoire-des-services/avortement';
const nbIntake = 'https://www.gnb.ca/en/news/n-b.2026.03.new-central-phone-service-support-self-referral-for-abortion-services.html';
const nbIntakeFr = 'https://www.gnb.ca/fr/nouvelles/n-b.2026.03.services-davortement-nouveau-service-telephonique-centralise-pour-appuyer-lauto-aiguillage.html';
const pei = 'https://www.princeedwardisland.ca/en/information/health-pei/abortion-services';
const peiFr = 'https://www.princeedwardisland.ca/fr/information/sante-i-p-e/services-davortement';
const shors = 'https://www.princeedwardisland.ca/en/information/health-pei/sexual-health-options-reproductive-services-shors';
const nl = 'https://hi.easternhealth.ca/life-stages/pregnancy/unplanned-pregnancy/abortion/';

export const atlanticGuides: CityGuide[] = [
  {
    slug: 'halifax', province: 'NS', updated: reviewed,
    title: ['Abortion care in Halifax and area', 'Soins d’avortement à Halifax et dans les environs'],
    description: ['Clinic contacts for Halifax, including Dartmouth, Bedford and Lower Sackville.', 'Coordonnées pour Halifax, y compris Dartmouth, Bedford et Lower Sackville.'],
    booking: ['ROSE is at the QEII Victoria General site. Call its provincial booking line to discuss an appointment and confirm the location before travelling.', 'ROSE se trouve au site Victoria General du QEII. Appelez sa ligne provinciale pour discuter d’un rendez-vous et confirmer le lieu avant de vous déplacer.'],
    source: {url: rose, label: ['Nova Scotia Health: ROSE booking', 'Santé Nouvelle-Écosse : rendez-vous ROSE (en anglais)']},
    aliases: ['Dartmouth', 'Bedford', 'Lower Sackville', 'Halifax Regional Municipality'],
    surrounding: ['East Hants', 'West Hants', 'Chester'],
  },
  {
    slug: 'cape-breton', province: 'NS', updated: reviewed,
    title: ['Abortion access in Sydney and Cape Breton', 'Accès à l’avortement à Sydney et au Cap-Breton'],
    description: ['A provincial access route for Sydney, Glace Bay, North Sydney and neighbouring communities.', 'Une voie d’accès provinciale pour Sydney, Glace Bay, North Sydney et les communautés voisines.'],
    booking: ['Start with the Nova Scotia booking line. Ask about providers and travel arrangements from Cape Breton; the listed ROSE clinic is in Halifax.', 'Contactez la ligne de rendez-vous de la Nouvelle-Écosse. Discutez des prestataires et du déplacement depuis le Cap-Breton; la clinique ROSE répertoriée est à Halifax.'],
    source: {url: rose, label: ['Nova Scotia provincial abortion access', 'Accès provincial en Nouvelle-Écosse (en anglais)']},
    aliases: ['Sydney', 'Glace Bay', 'North Sydney', 'Sydney Mines', 'New Waterford', 'Cape Breton Regional Municipality'],
    surrounding: ['Victoria, Subd. B', 'Richmond, Subd. A'],
    regionalProviderIds: ['rose'],
  },
  {
    slug: 'truro', province: 'NS', updated: reviewed,
    title: ['Abortion access in Truro and Colchester', 'Accès à l’avortement à Truro et dans Colchester'],
    description: ['Booking information for Truro, Stewiacke and nearby communities.', 'Renseignements pour Truro, Stewiacke et les communautés voisines.'],
    booking: ['Nova Scotia Health directs abortion enquiries from the Truro Sexual Health Clinic to ROSE. The Truro clinic does not provide abortion care. Use the provincial line to discuss options.', 'Santé Nouvelle-Écosse dirige les demandes d’avortement de la clinique de santé sexuelle de Truro vers ROSE. La clinique de Truro ne pratique pas d’avortements. Discutez des options avec la ligne provinciale.'],
    source: {url: nsClinics, label: ['Nova Scotia Health: Truro service information', 'Santé Nouvelle-Écosse : services à Truro (en anglais)']},
    surrounding: ['Stewiacke', 'Colchester, Subd. A', 'Colchester, Subd. B', 'Colchester, Subd. C'],
    regionalProviderIds: ['rose'],
  },
  {
    slug: 'new-glasgow', province: 'NS', updated: reviewed,
    title: ['Abortion care in New Glasgow and Pictou County', 'Soins d’avortement à New Glasgow et dans le comté de Pictou'],
    description: ['A local medication-abortion contact and provincial options for surrounding communities.', 'Un contact local pour l’avortement par médicaments et des options provinciales pour les communautés voisines.'],
    booking: ['Call the Pictou County Sexual Health Centre before visiting. Appointments are required. For other options, contact the provincial ROSE line.', 'Appelez le centre de santé sexuelle du comté de Pictou avant de vous rendre sur place. Un rendez-vous est requis. Pour d’autres options, contactez la ligne provinciale ROSE.'],
    source: {url: nsClinics, label: ['Nova Scotia Health: Pictou County clinic', 'Santé Nouvelle-Écosse : clinique du comté de Pictou (en anglais)']},
    surrounding: ['Stellarton', 'Trenton', 'Westville', 'Pictou'],
    regionalProviderIds: ['rose'],
  },
  {
    slug: 'moncton', province: 'NB', updated: reviewed,
    title: ['Abortion clinics in Moncton and area', 'Cliniques d’avortement à Moncton et dans les environs'],
    description: ['Compare hospital contacts in Moncton, with access information for Dieppe and Riverview.', 'Comparez les coordonnées des hôpitaux de Moncton et les renseignements utiles pour Dieppe et Riverview.'],
    booking: ['The Moncton Hospital and Dr. Georges-L.-Dumont have separate family-planning contacts. The centralized intake line can also help you arrange care; confirm which hospital your appointment is with.', 'L’Hôpital de Moncton et le CHU Dr-Georges-L.-Dumont ont des contacts distincts en planification familiale. La ligne d’accueil centralisée peut aussi aider à organiser les soins; confirmez l’hôpital de votre rendez-vous.'],
    source: {url: vitalite, frUrl: vitaliteFr, label: ['Vitalité: abortion clinic contacts', 'Vitalité : coordonnées des cliniques d’avortement']},
    surrounding: ['Dieppe', 'Riverview', 'Memramcook', 'Shediac'],
  },
  {
    slug: 'saint-john', province: 'NB', updated: reviewed,
    title: ['Abortion access in Saint John and the Kennebecasis Valley', 'Accès à l’avortement à Saint John et dans la vallée de Kennebecasis'],
    description: ['Regional booking information for Saint John, Rothesay, Quispamsis and Grand Bay-Westfield.', 'Renseignements régionaux pour Saint John, Rothesay, Quispamsis et Grand Bay-Westfield.'],
    booking: ['Call New Brunswick’s centralized intake line to discuss available appointments. Tell the team you are travelling from the Saint John area and confirm the care location before arranging transport.', 'Appelez la ligne d’accueil centralisée du Nouveau-Brunswick pour connaître les rendez-vous disponibles. Indiquez que vous partez de la région de Saint John et confirmez le lieu avant d’organiser le transport.'],
    source: {url: nbIntake, frUrl: nbIntakeFr, label: ['New Brunswick: centralized abortion access', 'Nouveau-Brunswick : accès centralisé à l’avortement']},
    surrounding: ['Quispamsis', 'Rothesay', 'Grand Bay-Westfield'],
    regionalProviderIds: ['new-brunswick-abortion-intake'],
  },
  {
    slug: 'fredericton', province: 'NB', updated: reviewed,
    title: ['Abortion access in Fredericton and area', 'Accès à l’avortement à Fredericton et dans les environs'],
    description: ['Booking support for Fredericton, Oromocto, Hanwell and New Maryland.', 'Coordonnées pour Fredericton, Oromocto, Hanwell et New Maryland.'],
    booking: ['New Brunswick’s intake service can help identify medication or procedural appointments. Call directly, then confirm the provider and any travel needed from the capital region.', 'Le service d’accueil du Nouveau-Brunswick aide à trouver un rendez-vous pour un avortement par médicaments ou par intervention. Appelez directement, puis confirmez le prestataire et les déplacements depuis la région de la capitale.'],
    source: {url: horizon, frUrl: horizonFr, label: ['Horizon: central intake instructions', 'Horizon : modalités de l’accueil centralisé']},
    surrounding: ['Oromocto', 'Hanwell', 'New Maryland'],
    regionalProviderIds: ['new-brunswick-abortion-intake'],
  },
  {
    slug: 'bathurst', province: 'NB', updated: reviewed,
    title: ['Abortion care in Bathurst and the Chaleur region', 'Soins d’avortement à Bathurst et dans la région Chaleur'],
    description: ['The family-planning clinic contact for Bathurst and neighbouring communities.', 'Les coordonnées de la clinique de planification familiale pour Bathurst et les communautés voisines.'],
    booking: ['Contact the Chaleur Regional Hospital family-planning clinic directly to ask about an appointment. Confirm the method, appointment location and follow-up arrangements with the clinic.', 'Contactez directement la clinique de planification familiale de l’Hôpital régional Chaleur. Confirmez la méthode, le lieu du rendez-vous et les modalités de suivi avec la clinique.'],
    source: {url: vitalite, frUrl: vitaliteFr, label: ['Vitalité: Chaleur family planning', 'Vitalité : planification familiale à Chaleur']},
    surrounding: ['Belle-Baie', 'Belledune'],
    regionalProviderIds: ['new-brunswick-abortion-intake'],
  },
  {
    slug: 'charlottetown', province: 'PE', updated: reviewed,
    title: ['Abortion care in Charlottetown and area', 'Soins d’avortement à Charlottetown et dans les environs'],
    description: ['Local service information for Charlottetown, Stratford and Cornwall.', 'Renseignements sur les services pour Charlottetown, Stratford et Cornwall.'],
    booking: ['Health PEI lists medication abortion in Charlottetown and procedural care in Summerside. Both use the SHORS booking line; confirm where your appointment will take place.', 'Santé Î.-P.-É. indique l’avortement par médicaments à Charlottetown et par intervention à Summerside. Les deux utilisent la ligne SHORS; confirmez le lieu de votre rendez-vous.'],
    source: {url: pei, frUrl: peiFr, label: ['Health PEI: abortion locations', 'Santé Î.-P.-É. : lieux des services d’avortement']},
    surrounding: ['Stratford', 'Cornwall'],
    regionalProviderIds: ['shors-summerside'],
  },
  {
    slug: 'summerside', province: 'PE', updated: reviewed,
    title: ['Abortion care in Summerside and area', 'Soins d’avortement à Summerside et dans les environs'],
    description: ['Medication and procedural care contacts for Summerside and nearby communities.', 'Coordonnées pour les soins par médicaments et par intervention à Summerside et dans les environs.'],
    booking: ['Call SHORS to book directly. Ask which location to attend and discuss any travel support before making arrangements.', 'Appelez SHORS pour prendre rendez-vous directement. Demandez où vous rendre et discutez du soutien au déplacement avant d’organiser votre trajet.'],
    source: {url: pei, frUrl: peiFr, label: ['Health PEI: access and travel information', 'Santé Î.-P.-É. : accès et renseignements sur les déplacements']},
    surrounding: ['Kensington', 'Borden-Carleton', 'Malpeque Bay'],
    regionalProviderIds: ['shors-charlottetown'],
  },
  {
    slug: 'st-john-s', province: 'NL', updated: reviewed,
    title: ['Abortion care in St. John’s and the northeast Avalon', 'Soins d’avortement à St. John’s et dans le nord-est de l’Avalon'],
    description: ['Clinic contacts for St. John’s, Mount Pearl, Paradise and nearby communities.', 'Coordonnées pour St. John’s, Mount Pearl, Paradise et les communautés voisines.'],
    booking: ['Contact Athena directly about medication or procedural appointments. Confirm the location and instructions with the clinic before travelling from your community.', 'Contactez directement Athena pour un rendez-vous par médicaments ou par intervention. Confirmez le lieu et les consignes avant de vous déplacer depuis votre communauté.'],
    source: {url: nl, label: ['NL Health Services: abortion access', 'Services de santé T.-N.-L. : accès à l’avortement (en anglais)']},
    aliases: ['St Johns', 'Saint Johns'],
    surrounding: ['Mount Pearl', 'Paradise', 'Conception Bay South', 'Torbay', "Portugal Cove-St. Philip's"],
  },
  {
    slug: 'corner-brook', province: 'NL', updated: reviewed,
    title: ['Abortion access in Corner Brook and western Newfoundland', 'Accès à l’avortement à Corner Brook et dans l’ouest de Terre-Neuve'],
    description: ['A booking route for Corner Brook, Pasadena, Deer Lake and Humber-area communities.', 'Une voie d’accès pour Corner Brook, Pasadena, Deer Lake et les communautés de la région de Humber.'],
    booking: ['NL Health Services describes periodic Athena clinics in western or central Newfoundland. Call Athena to confirm the next location and date; this page does not list a permanent Corner Brook clinic.', 'Services de santé T.-N.-L. indique des cliniques périodiques d’Athena dans l’ouest ou le centre de Terre-Neuve. Appelez pour confirmer le lieu et la date; cette page ne répertorie pas de clinique permanente à Corner Brook.'],
    source: {url: nl, label: ['NL Health Services: regional clinic information', 'Services de santé T.-N.-L. : cliniques régionales (en anglais)']},
    surrounding: ['Pasadena', 'Deer Lake', 'Steady Brook', 'Humber Arm South', 'Irishtown-Summerside'],
    regionalProviderIds: ['athena-health-centre'],
  },
];

export const atlanticProviders: Provider[] = [
  {
    id: 'pictou-county-sexual-health', name: 'Pictou County Sexual Health Centre', city: 'New Glasgow', province: 'NS',
    phone: '902-752-8643', url: nsClinics, services: ['medication'],
    description: ['A medication-abortion contact in New Glasgow. Call to arrange a visit; this clinic does not accept walk-ins.', 'Un contact pour l’avortement par médicaments à New Glasgow. Appelez pour prendre rendez-vous; la clinique ne reçoit pas sans rendez-vous.'],
    sources: [nsClinics], reviewed, confirmed: false,
  },
  {
    id: 'chaleur-family-planning', name: 'Chaleur Regional Hospital — Family Planning Clinic', city: 'Bathurst', province: 'NB',
    phone: '506-544-4150', url: vitalite, services: ['procedural'],
    description: ['Vitalité lists this Bathurst clinic for procedural abortion. Contact its family-planning team directly about an appointment.', 'Vitalité indique cette clinique de Bathurst pour l’avortement par intervention. Contactez directement l’équipe de planification familiale pour un rendez-vous.'],
    sources: [vitalite, vitaliteFr], reviewed, confirmed: false,
  },
  {
    id: 'dumont-family-planning', name: 'CHU Dr-Georges-L.-Dumont — Clinique de planification familiale', city: 'Moncton', province: 'NB',
    phone: '506-869-2770', url: vitalite, services: ['procedural'],
    description: ['The Dr. Georges-L.-Dumont family-planning clinic has its own direct booking number, separate from The Moncton Hospital.', 'La clinique de planification familiale du CHU Dr-Georges-L.-Dumont a son propre numéro de rendez-vous, distinct de celui de l’Hôpital de Moncton.'],
    sources: [vitalite, vitaliteFr], reviewed, confirmed: false,
  },
  {
    id: 'new-brunswick-abortion-intake', kind: 'regional-booking', name: 'New Brunswick Centralized Abortion Intake', city: 'Moncton', province: 'NB',
    phone: '1-844-806-9205', phoneLabel: ['New Brunswick booking line', 'Ligne de rendez-vous du Nouveau-Brunswick'],
    url: horizon, services: [],
    description: ['A province-wide booking service operated from The Moncton Hospital. The team helps identify appointment options; treatment locations vary.', 'Un service provincial de prise de rendez-vous établi à l’Hôpital de Moncton. L’équipe aide à trouver un rendez-vous; le lieu des soins varie.'],
    sources: [nbIntake, horizon, vitalite], reviewed, confirmed: false,
  },
];

export const atlanticBooking: Record<string, BookingInfo> = {
  rose: {
    hours: ['Monday–Friday, 8 a.m.–3 p.m. Atlantic time. Messages may be left outside these hours.', 'Du lundi au vendredi, de 8 h à 15 h, heure de l’Atlantique. Il est possible de laisser un message en dehors de ces heures.'],
  },
  moncton: {
    hours: ['Central intake callbacks: Monday–Friday, 8:30 a.m.–3 p.m. Atlantic time.', 'Rappels de l’accueil centralisé : du lundi au vendredi, de 8 h 30 à 15 h, heure de l’Atlantique.'],
    access: ['You can contact the service with or without a physician referral.', 'Le service est accessible avec ou sans demande de consultation médicale.'],
  },
  'new-brunswick-abortion-intake': {
    hours: ['Callbacks: Monday–Friday, 8:30 a.m.–3 p.m. Atlantic time.', 'Rappels : du lundi au vendredi, de 8 h 30 à 15 h, heure de l’Atlantique.'],
    access: ['Leave a message if asked. The team will return your call during operating hours.', 'Laissez un message si on vous le demande. L’équipe vous rappellera pendant les heures d’ouverture.'],
  },
  'shors-charlottetown': {
    hours: ['Monday–Thursday, 8 a.m.–noon and 1–3 p.m.; Friday, 8 a.m.–noon. Atlantic time.', 'Du lundi au jeudi, de 8 h à midi et de 13 h à 15 h; le vendredi, de 8 h à midi. Heure de l’Atlantique.'],
    access: ['Call SHORS directly to arrange abortion care. Attend only after an appointment is confirmed.', 'Appelez directement SHORS pour organiser les soins d’avortement. Présentez-vous seulement après confirmation du rendez-vous.'],
  },
  'shors-summerside': {
    hours: ['Monday–Thursday, 8 a.m.–noon and 1–3 p.m.; Friday, 8 a.m.–noon. Atlantic time.', 'Du lundi au jeudi, de 8 h à midi et de 13 h à 15 h; le vendredi, de 8 h à midi. Heure de l’Atlantique.'],
    access: ['Call SHORS directly to arrange abortion care. Attend only after an appointment is confirmed.', 'Appelez directement SHORS pour organiser les soins d’avortement. Présentez-vous seulement après confirmation du rendez-vous.'],
  },
  'pictou-county-sexual-health': {
    access: ['Book by phone before visiting 688A East River Road in New Glasgow.', 'Prenez rendez-vous par téléphone avant de vous rendre au 688A, East River Road à New Glasgow.'],
  },
};

export const atlanticProviderUpdates: Record<string, Partial<Provider>> = {
  rose: {reviewed, sources: [rose]},
  moncton: {reviewed, sources: [horizon, nbIntake]},
  'shors-charlottetown': {reviewed, sources: [pei, shors]},
  'shors-summerside': {reviewed, sources: [pei, shors]},
  'athena-health-centre': {
    reviewed, sources: [nl],
    alternatePhone: {number: '1-800-755-2044', label: ['Toll-free booking line', 'Ligne de rendez-vous sans frais']},
  },
};
