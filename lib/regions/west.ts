import type {CityGuide, TextPair} from '../city-guide-types';
import type {Provider, BookingInfo} from '../providers';

const checked = '2026-11-03';
const bcAccess = 'https://www2.gov.bc.ca/gov/content/health/managing-your-health/family/abortion';
const interior = 'https://www.interiorhealth.ca/services/abortion';
const care = 'https://www.bcwomens.ca/our-services/abortion-contraception';
const vancouverOptions = ['everywomans', 'bc-womens-care', 'willow-clinic'];
const bcSource: CityGuide['source'] = {url: bcAccess, label: ['British Columbia access information', 'Accès aux services en Colombie-Britannique (en anglais)']};

export const westProviders: Provider[] = [
  {
    id: 'bc-womens-care', name: 'BC Women’s Hospital — CARE Program', city: 'Vancouver', province: 'BC',
    phone: '604-875-2022', alternatePhone: {number: '1-888-300-3088;ext=2022', label: ['Toll-free, extension 2022', 'Sans frais, poste 2022']},
    url: care, services: ['procedural'],
    description: ['Hospital-based procedural abortion in Vancouver. Appointments can be requested directly by phone or through the hospital’s booking website.', 'Avortement par intervention en milieu hospitalier à Vancouver. Les rendez-vous se demandent directement par téléphone ou sur le site de réservation de l’hôpital.'],
    sources: [care], reviewed: checked, confirmed: false,
  },
  {
    id: 'willow-clinic', name: 'Willow Clinic', city: 'Vancouver', province: 'BC', phone: '604-709-5611',
    url: 'https://willowclinic.ca/medical-abortion/', services: ['medication'], virtual: true,
    description: ['Medication abortion in Vancouver and, for eligible patients, by telemedicine in British Columbia. Appointment format depends on location and clinical assessment.', 'Avortement par médicaments à Vancouver et, pour les personnes admissibles, par télémédecine en Colombie-Britannique. Le format dépend du lieu de résidence et de l’évaluation clinique.'],
    sources: ['https://willowclinic.ca/medical-abortion/', 'https://willowclinic.ca/appointments/', 'https://willowclinic.ca/contact/'], reviewed: checked, confirmed: false,
  },
  {
    id: 'steps-kamloops', name: 'STEPS Women’s and Sexual Health Clinic', city: 'Kamloops', province: 'BC', phone: '778-362-1582',
    url: 'https://stepshealth.ca/contact', services: ['medication'], virtual: true,
    description: ['Medication abortion through the Kamloops clinic. Interior Health also lists telephone or virtual appointments and local referrals for procedural care; ask STEPS about the appropriate pathway.', 'Avortement par médicaments à la clinique de Kamloops. Interior Health indique aussi des rendez-vous à distance et une orientation locale pour les soins par intervention; demandez à STEPS le parcours approprié.'],
    sources: ['https://stepshealth.ca/contact', interior], reviewed: checked, confirmed: false,
  },
  {
    id: 'womens-vita-nanaimo', name: 'Women’s Vita Medical Clinic', city: 'Nanaimo', province: 'BC', phone: '250-591-9812',
    url: 'https://smartsexresource.com/clinics-testing/womens-vita-medical-clinic/', resourceLabel: ['BC Centre for Disease Control listing', 'Fiche du Centre de contrôle des maladies de la C.-B. (en anglais)'], services: ['medication'],
    description: ['The BC Centre for Disease Control lists medication abortion at this Nanaimo clinic. Call to confirm current appointments and the clinic location before visiting.', 'Le Centre de contrôle des maladies de la Colombie-Britannique répertorie l’avortement par médicaments dans cette clinique de Nanaimo. Téléphonez pour confirmer les rendez-vous et le lieu avant de vous déplacer.'],
    sources: ['https://smartsexresource.com/clinics-testing/womens-vita-medical-clinic/', 'https://www.islandsexualhealth.org/pregnancy/abortion/'], reviewed: checked, confirmed: false,
  },
  {
    id: 'suite-six-prince-george', name: 'Suite Six Medical Clinic', city: 'Prince George', province: 'BC', phone: '250-563-3024',
    url: 'https://suitesix.ca/abortion-services/', services: ['medication'],
    description: ['Medication abortion in Prince George. The clinic’s instructions describe booking after referral; it can arrange referral to a local specialist for procedural care.', 'Avortement par médicaments à Prince George. Les instructions de la clinique décrivent la prise de rendez-vous après une recommandation; elle peut orienter vers un spécialiste local pour les soins par intervention.'],
    sources: ['https://suitesix.ca/abortion-services/'], reviewed: checked, confirmed: false,
  },
];

export const westBooking: Record<string, BookingInfo> = {
  'bc-womens-care': {access: ['No referral is needed. Use the hospital’s secure online booking link or call; the clinic provides separate instructions to confirm a booked appointment.', 'Aucune recommandation n’est requise. Utilisez le lien sécurisé de l’hôpital ou téléphonez; la clinique fournit des instructions distinctes pour confirmer le rendez-vous.'], bookingUrl: care},
  'willow-clinic': {hours: ['Telephone: Monday–Friday, 9:30 a.m.–noon and 1:30–4:30 p.m., Pacific time.', 'Téléphone : du lundi au vendredi, de 9 h 30 à midi et de 13 h 30 à 16 h 30, heure du Pacifique.'], access: ['Book by phone or request a callback. A doctor’s referral is not required. Telemedicine eligibility depends on distance from Vancouver and a clinical assessment.', 'Téléphonez ou demandez un rappel. Une recommandation médicale n’est pas requise. L’admissibilité à la télémédecine dépend de la distance de Vancouver et d’une évaluation clinique.'], bookingUrl: 'https://willowclinic.ca/appointments/'},
  'steps-kamloops': {access: ['Call the dedicated Women’s and Sexual Health Clinic number. Ask which appointments can happen by telephone or video and whether local tests are needed.', 'Appelez le numéro dédié à la clinique de santé sexuelle. Demandez quels rendez-vous peuvent avoir lieu par téléphone ou vidéo et si des examens locaux sont nécessaires.']},
  'womens-vita-nanaimo': {access: ['The linked resource is a public health directory entry. Confirm the current service, booking requirements and address with the clinic by phone.', 'La ressource liée est une fiche de santé publique. Confirmez par téléphone les services actuels, les modalités de rendez-vous et l’adresse de la clinique.']},
  'suite-six-prince-george': {access: ['The clinic asks referred patients to call for an appointment. If you need help finding a local referral, its page also lists Northern Interior Public Health at 250-645-8963.', 'La clinique demande aux personnes orientées par un professionnel de téléphoner. Pour obtenir de l’aide avec une référence locale, sa page indique aussi Northern Interior Public Health au 250-645-8963.']},
  'everywomans': {hours: ['Appointment telephone line: Monday–Friday, 9:30 a.m.–4 p.m., Pacific time.', 'Ligne de rendez-vous : du lundi au vendredi, de 9 h 30 à 16 h, heure du Pacifique.'], bookingUrl: 'https://everywomanshealthcentre.ca/making-an-appointment/'},
  'kelowna': {access: ['Leave a message at 250-980-1399. The hospital lists callbacks on Monday, Tuesday and Thursday, 8 a.m.–3 p.m., and Wednesday, 8–11 a.m., Pacific time.', 'Laissez un message au 250-980-1399. L’hôpital indique des rappels le lundi, mardi et jeudi, de 8 h à 15 h, et le mercredi, de 8 h à 11 h, heure du Pacifique.']},
  'vi-choice': {hours: ['Phone: Monday, 9:30 a.m.–4:30 p.m.; Tuesday–Friday, 9 a.m.–4:30 p.m. Closed 12:30–1:30 p.m., Pacific time.', 'Téléphone : lundi, de 9 h 30 à 16 h 30; mardi au vendredi, de 9 h à 16 h 30. Fermé de 12 h 30 à 13 h 30, heure du Pacifique.']},
  'opal': {access: ['Call to book directly. For other Yukon communities, a local health centre can help with referral and travel arrangements. The clinic is now in Medical Rehabilitation Services at Whitehorse General Hospital, entrance E4.', 'Appelez directement pour prendre rendez-vous. Ailleurs au Yukon, le centre de santé local peut aider avec la référence et le déplacement. La clinique se trouve maintenant aux services de réadaptation de l’Hôpital général de Whitehorse, entrée E4.']},
  'now': {access: ['You may contact NOW directly without a referral. Leave a safe callback number and say whether staff may leave a message. Discuss any transportation needs when booking.', 'Vous pouvez joindre NOW directement sans recommandation. Laissez un numéro de rappel sécuritaire et indiquez si l’équipe peut laisser un message. Discutez de vos besoins de transport lors de la réservation.']},
};

export const westProviderUpdates: Record<string, Partial<Provider>> = {
  everywomans: {reviewed: checked, sources: ['https://everywomanshealthcentre.ca/', 'https://everywomanshealthcentre.ca/making-an-appointment/']},
  kelowna: {reviewed: checked, sources: ['https://www.interiorhealth.ca/locations/kelowna-general-hospital-gynecology-services-clinic', interior], description: ['Procedural abortion at Kelowna General Hospital. Leave a message on the clinic line to request an appointment; this clinic does not offer medication abortion.', 'Avortement par intervention à l’Hôpital général de Kelowna. Laissez un message à la clinique pour demander rendez-vous; cette clinique n’offre pas l’avortement par médicaments.']},
  'vi-choice': {city: 'View Royal', reviewed: checked, sources: ['https://www.vichoice.ca/', 'https://www.vichoice.ca/contact-us', 'https://www.islandsexualhealth.org/pregnancy/abortion/', 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/337_95'], services: ['medication', 'procedural']},
  opal: {reviewed: checked, name: 'Opal Clinic', url: 'https://opalyukon.ca/appointments', services: ['medication', 'procedural'], sources: ['https://opalyukon.ca/appointments', 'https://opalyukon.ca/abortion'], description: ['Medication and procedural abortion through Opal at Whitehorse General Hospital. People elsewhere in Yukon can contact Opal directly or discuss referral and travel with their local health centre.', 'Avortement par médicaments et par intervention avec Opal à l’Hôpital général de Whitehorse. Ailleurs au Yukon, contactez directement Opal ou discutez de la référence et du déplacement avec le centre de santé local.']},
  now: {reviewed: checked},
};

function metroGuide(slug: string, city: string, description: TextPair, surrounding: string[], booking: TextPair): CityGuide {
  return {slug, province: 'BC', updated: checked, title: [`Abortion care in ${city}`, `Accès à l’avortement à ${city}`], description, booking, source: bcSource, surrounding, regionalProviderIds: vancouverOptions};
}

export const westGuides: CityGuide[] = [
  {
    slug: 'vancouver', province: 'BC', updated: checked,
    title: ['Abortion clinics in Vancouver', 'Cliniques d’avortement à Vancouver'],
    description: ['Compare Vancouver clinic contacts and booking instructions, with links for communities across Metro Vancouver.', 'Comparez les coordonnées et les modalités de rendez-vous des cliniques de Vancouver, avec des liens vers les municipalités du Grand Vancouver.'],
    booking: ['Everywoman’s and the BC Women’s CARE Program list procedural care. Willow lists medication care and assesses eligibility for appointments at a distance. Contact the clinic whose service fits your needs to confirm the appointment process.', 'Everywoman’s et le programme CARE de BC Women’s indiquent des soins par intervention. Willow offre des soins par médicaments et évalue l’admissibilité aux rendez-vous à distance. Confirmez les modalités auprès de la clinique qui offre le service recherché.'],
    source: {url: care, label: ['BC Women’s booking and access information', 'Rendez-vous et accès à BC Women’s (en anglais)']},
    surrounding: ['Burnaby', 'Richmond', 'Surrey', 'New Westminster', 'North Vancouver', 'West Vancouver', 'Coquitlam', 'Port Coquitlam', 'Port Moody', 'Delta', 'White Rock', 'Langley', 'Pitt Meadows', 'Maple Ridge'],
  },
  {
    slug: 'victoria', province: 'BC', updated: checked,
    title: ['Abortion care in Greater Victoria', 'Accès à l’avortement dans le Grand Victoria'],
    description: ['Find the Vancouver Island Choice Clinic contact and information for Victoria, the West Shore and the Saanich Peninsula.', 'Trouvez les coordonnées de Vancouver Island Choice Clinic et des renseignements pour Victoria, le West Shore et la péninsule de Saanich.'],
    booking: ['Vancouver Island Choice Clinic lists its office at 104–284 Helmcken Road, in the View Royal area. Call before visiting to confirm your appointment, care location and the available methods.', 'Vancouver Island Choice Clinic indique le 104–284, chemin Helmcken, dans le secteur de View Royal. Téléphonez avant de vous déplacer pour confirmer le rendez-vous, le lieu des soins et les méthodes offertes.'],
    source: {url: 'https://www.vichoice.ca/contact-us', label: ['Vancouver Island Choice Clinic contact information', 'Coordonnées de Vancouver Island Choice Clinic (en anglais)']},
    surrounding: ['Saanich', 'Oak Bay', 'Esquimalt', 'View Royal', 'Langford', 'Colwood', 'Metchosin', 'Sooke', 'Central Saanich', 'North Saanich', 'Sidney'], regionalProviderIds: ['vi-choice'],
  },
  {
    slug: 'kelowna', province: 'BC', updated: checked,
    title: ['Abortion care in Kelowna and the Central Okanagan', 'Accès à l’avortement à Kelowna et dans le centre de l’Okanagan'],
    description: ['Find the Kelowna hospital clinic and regional information for West Kelowna, Lake Country and Peachland.', 'Trouvez la clinique hospitalière de Kelowna et des renseignements régionaux pour West Kelowna, Lake Country et Peachland.'],
    booking: ['The Kelowna hospital clinic provides procedural abortion and asks callers to leave a message. For medication care, use Interior Health’s access information to ask about an appropriate local or remote service.', 'La clinique hospitalière de Kelowna offre l’avortement par intervention et demande de laisser un message. Pour les soins par médicaments, consultez Interior Health afin de trouver un service local ou à distance approprié.'],
    source: {url: interior, label: ['Interior Health abortion access', 'Accès à l’avortement — Interior Health (en anglais)']},
    surrounding: ['West Kelowna', 'Lake Country', 'Peachland', 'Summerland', 'Penticton'],
  },
  {
    slug: 'kamloops', province: 'BC', updated: checked,
    title: ['Abortion care in Kamloops', 'Accès à l’avortement à Kamloops'],
    description: ['Find the STEPS clinic’s dedicated number and regional access information for the Thompson area.', 'Trouvez le numéro dédié de la clinique STEPS et des renseignements sur l’accès dans la région de Thompson.'],
    booking: ['STEPS offers medication care and can discuss remote appointments. Interior Health identifies STEPS as an access point for Kamloops and surrounding communities, including referral for local procedural services.', 'STEPS offre des soins par médicaments et peut discuter des rendez-vous à distance. Interior Health désigne STEPS comme point d’accès à Kamloops et dans les environs, y compris pour l’orientation vers des soins locaux par intervention.'],
    source: {url: interior, label: ['Interior Health service and referral information', 'Services et orientation — Interior Health (en anglais)']},
    surrounding: ['Logan Lake', 'Chase', 'Barriere', 'Merritt'],
  },
  {
    slug: 'nanaimo', province: 'BC', updated: checked,
    title: ['Abortion care in Nanaimo', 'Accès à l’avortement à Nanaimo'],
    description: ['Find a public health listing for medication care in Nanaimo and links for nearby Vancouver Island communities.', 'Trouvez une fiche de santé publique pour les soins par médicaments à Nanaimo et des liens vers les municipalités voisines de l’île de Vancouver.'],
    booking: ['The BC Centre for Disease Control lists Women’s Vita for medication abortion. Confirm current appointments by phone. If you need another method or another location, the provincial Pregnancy Options Service can help identify services.', 'Le Centre de contrôle des maladies de la Colombie-Britannique répertorie Women’s Vita pour l’avortement par médicaments. Confirmez les rendez-vous par téléphone. Pour une autre méthode ou un autre lieu, le service provincial Pregnancy Options peut aider à repérer les services.'],
    source: {url: 'https://www.islandsexualhealth.org/pregnancy/abortion/', label: ['Island Sexual Health access information', 'Renseignements d’Island Sexual Health (en anglais)']},
    surrounding: ['Lantzville', 'Parksville', 'Qualicum Beach', 'Ladysmith', 'Duncan', 'North Cowichan'], regionalProviderIds: ['vi-choice'],
  },
  {
    slug: 'prince-george', province: 'BC', updated: checked,
    title: ['Abortion care in Prince George', 'Accès à l’avortement à Prince George'],
    description: ['Find medication care and referral information in Prince George, with regional links for northern Interior communities.', 'Trouvez des soins par médicaments et des renseignements sur les références à Prince George, avec des liens pour les collectivités du nord de l’intérieur.'],
    booking: ['Suite Six describes medication appointments after referral and can arrange local specialist referral for procedural care. Its service page also gives Northern Interior Public Health’s number for help with a local referral.', 'Suite Six décrit des rendez-vous pour les soins par médicaments après une recommandation et peut orienter vers un spécialiste local pour les soins par intervention. Sa page indique aussi le numéro de Northern Interior Public Health pour obtenir une référence locale.'],
    source: {url: 'https://suitesix.ca/abortion-services/', label: ['Suite Six referral and appointment instructions', 'Références et rendez-vous — Suite Six (en anglais)']},
    surrounding: ['Vanderhoof', 'Quesnel', 'Mackenzie', 'McBride'],
  },
  metroGuide('abbotsford', 'Abbotsford', ['Use this guide for Abbotsford–Mission regional access and compare clearly located Vancouver options.', 'Consultez les renseignements régionaux pour Abbotsford–Mission et comparez les options situées à Vancouver.'], ['Mission', 'Chilliwack', 'Langley'], ['For an Abbotsford appointment, ask your health care provider or HealthLink BC about local services. The Vancouver clinic contacts below are additional options; confirm travel and appointment requirements directly.', 'Pour un rendez-vous à Abbotsford, demandez à votre professionnel de santé ou à HealthLink BC quels services sont offerts localement. Les cliniques de Vancouver ci-dessous sont d’autres options; confirmez directement les modalités et le déplacement.']),
  metroGuide('mission', 'Mission', ['Find regional access information for Mission and the central Fraser Valley.', 'Trouvez des renseignements régionaux pour Mission et le centre de la vallée du Fraser.'], ['Abbotsford', 'Maple Ridge', 'Chilliwack'], ['Start with provincial access information to ask about care in Mission or Abbotsford. If considering a listed Vancouver clinic, confirm which visits require travel and the clinic’s current booking process.', 'Consultez les renseignements provinciaux pour connaître les soins à Mission ou à Abbotsford. Si vous envisagez une clinique de Vancouver répertoriée, confirmez les visites qui nécessitent un déplacement et les modalités actuelles.']),
  metroGuide('chilliwack', 'Chilliwack', ['Find an access route for Chilliwack and the eastern Fraser Valley, including Kent, Harrison Hot Springs and Hope.', 'Trouvez un point de départ pour Chilliwack et l’est de la vallée du Fraser, dont Kent, Harrison Hot Springs et Hope.'], ['Kent', 'Harrison Hot Springs', 'Hope', 'Abbotsford', 'Mission'], ['HealthLink BC and your local health authority can help identify services in the Fraser Valley. Before travelling to a listed Vancouver clinic, ask about appointment location, the number of visits and follow-up arrangements.', 'HealthLink BC et votre autorité de santé locale peuvent aider à trouver des services dans la vallée du Fraser. Avant de vous rendre dans une clinique de Vancouver, demandez le lieu, le nombre de visites et les modalités de suivi.']),
  metroGuide('surrey', 'Surrey', ['Explore abortion access from Surrey and connect with clearly identified regional clinics.', 'Explorez l’accès à l’avortement depuis Surrey et trouvez les coordonnées de cliniques régionales clairement situées.'], ['Delta', 'White Rock', 'Langley', 'New Westminster'], ['Ask about services available in Surrey through the provincial access resource. For Vancouver clinics, check the method offered and appointment location before booking; remote appointments are subject to each clinic’s criteria.', 'La ressource provinciale permet de se renseigner sur les services à Surrey. Pour les cliniques de Vancouver, vérifiez la méthode et le lieu avant de réserver; les rendez-vous à distance dépendent des critères de chaque clinique.']),
  metroGuide('burnaby', 'Burnaby', ['Find regional clinic contacts for Burnaby, with links to Vancouver and New Westminster.', 'Trouvez des coordonnées régionales pour Burnaby, avec des liens vers Vancouver et New Westminster.'], ['Vancouver', 'New Westminster', 'Coquitlam'], ['Compare the Vancouver clinics below by their documented services, then contact one directly. For another local option in Burnaby, use British Columbia’s health navigation resource.', 'Comparez les services documentés des cliniques de Vancouver ci-dessous, puis contactez directement une clinique. Pour une autre option locale à Burnaby, consultez la ressource provinciale d’orientation.']),
  metroGuide('richmond', 'Richmond', ['Find abortion access information for Richmond and regional clinic contacts in Vancouver.', 'Trouvez des renseignements pour Richmond et les coordonnées de cliniques régionales à Vancouver.'], ['Vancouver', 'Delta', 'Burnaby'], ['If you are travelling from Richmond, confirm the clinic address and your appointment instructions in advance. Ask the clinic about interpretation or accessibility needs when you contact it.', 'Si vous vous déplacez depuis Richmond, confirmez l’adresse et les instructions avant le rendez-vous. Faites connaître vos besoins d’interprétation ou d’accessibilité lors du premier contact.']),
  metroGuide('coquitlam', 'Coquitlam', ['Browse regional options from Coquitlam and the Tri-Cities area.', 'Consultez les options régionales depuis Coquitlam et le secteur des Tri-Cities.'], ['Port Coquitlam', 'Port Moody', 'Burnaby', 'New Westminster', 'Pitt Meadows'], ['For Coquitlam, Port Coquitlam or Port Moody, use the provincial access information to ask about local care. The regional clinic list identifies Vancouver locations so you can discuss travel before booking.', 'Pour Coquitlam, Port Coquitlam ou Port Moody, consultez les renseignements provinciaux sur les soins locaux. La liste régionale situe les cliniques à Vancouver pour discuter du déplacement avant la réservation.']),
  metroGuide('langley-5915002', 'Langley', ['Find regional abortion access for Langley and neighbouring Fraser Valley communities.', 'Trouvez des renseignements sur l’accès régional à l’avortement pour Langley et les collectivités voisines de la vallée du Fraser.'], ['Surrey', 'White Rock', 'Abbotsford', 'Mission'], ['Ask provincial health navigation about services near your home in the City or Township of Langley. When contacting a regional clinic, confirm whether assessment, treatment and follow-up use the same location.', 'Demandez aux services provinciaux d’orientation quelles options existent près de votre domicile dans la ville ou le canton de Langley. Confirmez avec la clinique si l’évaluation, les soins et le suivi ont lieu au même endroit.']),
  metroGuide('new-westminster', 'New Westminster', ['Find regional abortion clinic contacts from New Westminster and links for nearby municipalities.', 'Trouvez les coordonnées de cliniques régionales depuis New Westminster et des liens vers les municipalités voisines.'], ['Burnaby', 'Coquitlam', 'Surrey', 'Delta'], ['Use the regional clinic list to compare the services currently documented in Vancouver. If you prefer a service in New Westminster, ask HealthLink BC or your health care provider for local access information.', 'Comparez les services documentés à Vancouver dans la liste régionale. Si vous préférez un service à New Westminster, demandez à HealthLink BC ou à votre professionnel de santé des renseignements sur l’accès local.']),
  metroGuide('north-vancouver-5915051', 'North Vancouver', ['Find abortion access information for North Vancouver and the North Shore.', 'Trouvez des renseignements sur l’accès à l’avortement à North Vancouver et sur la rive nord.'], ['West Vancouver', 'Vancouver', 'Burnaby'], ['The listed regional clinics are in Vancouver. Before arranging travel from the North Shore, contact the clinic about booking, the location of each visit and any support-person requirements.', 'Les cliniques régionales répertoriées se trouvent à Vancouver. Avant de prévoir le déplacement depuis la rive nord, confirmez la réservation, le lieu de chaque visite et les exigences concernant l’accompagnement.']),
  metroGuide('delta', 'Delta', ['Find regional abortion access from Delta and links to Richmond, Surrey and neighbouring communities.', 'Trouvez des renseignements sur l’accès régional depuis Delta et des liens vers Richmond, Surrey et les collectivités voisines.'], ['Richmond', 'Surrey', 'White Rock', 'New Westminster'], ['For care in Delta, ask your health care provider or provincial health navigation about local options. If choosing a listed Vancouver clinic, confirm its appointment process and travel needs directly.', 'Pour des soins à Delta, demandez à votre professionnel de santé ou aux services provinciaux d’orientation quelles sont les options locales. Si vous choisissez une clinique de Vancouver, confirmez directement ses modalités et les déplacements nécessaires.']),
  {
    slug: 'whitehorse', province: 'YT', updated: checked,
    title: ['Abortion care in Whitehorse and Yukon', 'Accès à l’avortement à Whitehorse et au Yukon'],
    description: ['Find Opal Clinic’s appointment number and information for people travelling from other Yukon communities.', 'Trouvez le numéro de rendez-vous d’Opal Clinic et des renseignements pour les personnes d’autres collectivités du Yukon.'],
    booking: ['You can call Opal directly. In Dawson or Watson Lake, a local doctor can discuss options; elsewhere, a community health centre can help with referral and travel. Confirm the Whitehorse General Hospital entrance when arranging your visit.', 'Vous pouvez appeler directement Opal. À Dawson ou à Watson Lake, un médecin local peut discuter des options; ailleurs, le centre de santé peut aider avec la référence et le déplacement. Confirmez l’entrée de l’Hôpital général de Whitehorse lors de la réservation.'],
    source: {url: 'https://opalyukon.ca/appointments', label: ['Opal booking and travel information', 'Rendez-vous et déplacements — Opal (en anglais)']},
    surrounding: ['Carcross', 'Marsh Lake', 'Haines Junction', 'Watson Lake', 'Dawson'],
  },
  {
    slug: 'yellowknife', province: 'NT', updated: checked,
    title: ['Abortion care in Yellowknife and the Northwest Territories', 'Accès à l’avortement à Yellowknife et aux Territoires du Nord-Ouest'],
    description: ['Find direct NOW program contacts for Yellowknife and people travelling from other Northwest Territories communities.', 'Trouvez les coordonnées directes du programme NOW à Yellowknife et des renseignements pour les autres collectivités des Territoires du Nord-Ouest.'],
    booking: ['You can contact NOW without a referral. Leave a safe callback number and tell staff whether they may leave a message. If travel to Yellowknife is needed, discuss transportation when arranging care.', 'Vous pouvez contacter NOW sans recommandation. Laissez un numéro de rappel sécuritaire et indiquez si l’équipe peut laisser un message. Si un déplacement à Yellowknife est nécessaire, discutez du transport en organisant les soins.'],
    source: {url: 'https://www.nthssa.ca/en/services/now/making-appointment', frUrl: 'https://www.nthssa.ca/fr/contact-information/options-nordiques-pour-les-femmes-now', label: ['NOW appointment information', 'Coordonnées du programme NOW']},
    surrounding: ['Dettah', 'Behchokò', 'Hay River', 'Fort Smith', 'Inuvik'],
  },
  {
    slug: 'iqaluit', province: 'NU', updated: checked,
    title: ['Abortion access in Iqaluit and the Qikiqtaaluk region', 'Accès à l’avortement à Iqaluit et dans la région de Qikiqtaaluk'],
    description: ['Find the territorial access route for Iqaluit and Qikiqtaaluk communities, including Kimmirut, Kinngait and Pangnirtung.', 'Trouvez le parcours d’accès territorial pour Iqaluit et les collectivités de Qikiqtaaluk, dont Kimmirut, Kinngait et Pangnirtung.'],
    booking: ['Nunavut’s Department of Health directs people to their local health centre for a referral and advises that travel may be necessary. Ask the care team to confirm where appointments will take place. The NOW program’s Nunavut coverage is specifically Kitikmeot, so it is not listed as an Iqaluit clinic.', 'Le ministère de la Santé du Nunavut oriente les personnes vers leur centre de santé local pour obtenir une référence et précise qu’un déplacement peut être nécessaire. Confirmez le lieu des rendez-vous avec l’équipe. Au Nunavut, le programme NOW dessert spécifiquement Kitikmeot; il n’est donc pas présenté comme une clinique d’Iqaluit.'],
    source: {url: 'https://www.irespectmyself.ca/en/having-sex/pregnancy/abortion', frUrl: 'https://www.irespectmyself.ca/fr/having-sex/pregnancy/abortion', label: ['Nunavut Department of Health access information', 'Renseignements d’accès du ministère de la Santé du Nunavut']},
    surrounding: ['Kimmirut', 'Kinngait', 'Pangnirtung', 'Qikiqtarjuaq', 'Igloolik', 'Pond Inlet'],
  },
];
