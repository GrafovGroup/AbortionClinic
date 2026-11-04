import type {CityGuide} from '../city-guide-types';
import type {Provider, BookingInfo} from '../providers';

const reviewed = '2026-11-03';
const alberta = 'https://www.albertahealthservices.ca/info/Page14011.aspx';
const calgaryHospital = 'https://www.albertahealthservices.ca/findhealth/service.aspx?Id=1071160&facilityId=2';
const edmontonService = 'https://www.albertahealthservices.ca/findhealth/service.aspx?Id=1003402&facilityid=1002820';
const saskatoonProgram = 'https://www.saskhealthauthority.ca/sites/default/files/2026-03/Saskatoon%20Abortion%20Services.pdf';
const pmh = 'https://prairiemountainhealth.ca/programs-and-services/public-health/abortion-care/';
const whcBooking = 'https://womenshealthclinic.org/services/abortion/book-appointment';
const hsc = 'https://hsc.mb.ca/adults/womens-health/our-services/pregnancy-and-prenatal-care/';
const ahsSource: CityGuide['source'] = {url: alberta, label: ['Alberta Health Services — access by region', 'Alberta Health Services — accès par région (en anglais)']};

export const prairiesGuides: CityGuide[] = [
  {
    slug: 'calgary', province: 'AB', updated: reviewed,
    title: ['Abortion clinics in Calgary and area', 'Cliniques d’avortement à Calgary et dans les environs'],
    description: ['Find Calgary clinic and hospital contacts, with community links for Airdrie, Cochrane, Chestermere and the surrounding area.', 'Trouvez les coordonnées des cliniques et de l’hôpital à Calgary, avec des liens pour Airdrie, Cochrane, Chestermere et les environs.'],
    booking: ['Kensington Clinic accepts appointment requests directly by phone or through its website. If you are travelling from outside Calgary, ask whether any tests should be arranged before your visit. Peter Lougheed Centre has a separate booking number.', 'La Kensington Clinic accepte les demandes de rendez-vous par téléphone ou sur son site. Si vous venez de l’extérieur de Calgary, demandez si des examens sont nécessaires avant votre visite. Le Peter Lougheed Centre a son propre numéro de rendez-vous.'],
    source: {url: 'https://kensingtonclinic.com/appointments/', label: ['Kensington Clinic appointment instructions', 'Rendez-vous à la Kensington Clinic (en anglais)']},
    surrounding: ['Airdrie', 'Cochrane', 'Chestermere', 'Okotoks', 'High River', 'Strathmore', 'Crossfield', 'Rocky View County', 'Foothills County'],
  },
  {
    slug: 'edmonton', province: 'AB', updated: reviewed,
    title: ['Abortion clinics in Edmonton and area', 'Cliniques d’avortement à Edmonton et dans les environs'],
    description: ['Compare Edmonton contacts and find regional options from St. Albert, Strathcona County, Leduc and nearby communities.', 'Comparez les services à Edmonton et consultez les options régionales depuis St. Albert, le comté de Strathcona, Leduc et les localités voisines.'],
    booking: ['Woman’s Health Options takes appointment requests by phone or online. Community & Choice offers medication abortion and online booking. Contact the clinic about the service you want before making travel arrangements.', 'Woman’s Health Options accepte les demandes par téléphone ou en ligne. Community & Choice offre l’avortement par médicaments et la prise de rendez-vous en ligne. Communiquez avec la clinique au sujet du service souhaité avant d’organiser votre déplacement.'],
    source: {url: 'https://womanshealthoptions.com/appointments/', label: ['Woman’s Health Options appointment instructions', 'Rendez-vous à Woman’s Health Options (en anglais)']},
    surrounding: ['St. Albert', 'Strathcona County', 'Spruce Grove', 'Stony Plain', 'Leduc', 'Beaumont', 'Fort Saskatchewan', 'Devon', 'Morinville', 'Parkland County', 'Sturgeon County', 'Leduc County'],
  },
  {
    slug: 'lethbridge', province: 'AB', updated: reviewed,
    title: ['Abortion access in Lethbridge and area', 'Accès à l’avortement à Lethbridge et dans les environs'],
    description: ['Find local access information for Lethbridge and southern Alberta, plus separately labelled clinic contacts in Calgary.', 'Consultez les ressources d’accès à Lethbridge et dans le sud de l’Alberta, ainsi que les coordonnées de cliniques à Calgary, présentées séparément.'],
    booking: ['Pro-Choice YQL lists a resource and referral volunteer line at 587-257-6833 for people in Lethbridge and southern Alberta. Ask the organization about current local pathways and travel support. Calgary clinic contacts below are additional regional options.', 'Pro-Choice YQL indique une ligne bénévole d’information et d’orientation au 587-257-6833 pour Lethbridge et le sud de l’Alberta. Demandez quels parcours locaux et soutiens au déplacement sont actuellement offerts. Les cliniques de Calgary ci-dessous constituent d’autres options régionales.'],
    source: {url: 'https://www.prochoiceyql.ca/clinic-abortion', label: ['Pro-Choice YQL — local access and travel support', 'Pro-Choice YQL — accès local et aide au déplacement (en anglais)']},
    surrounding: ['Coaldale', 'Coalhurst', 'Picture Butte', 'Raymond', 'Nobleford', 'Lethbridge County', 'Taber'],
    regionalProviderIds: ['kensington', 'peter-lougheed-womens-health'],
  },
  {
    slug: 'red-deer', province: 'AB', updated: reviewed,
    title: ['Abortion access in Red Deer and area', 'Accès à l’avortement à Red Deer et dans les environs'],
    description: ['Explore access routes for Red Deer, Sylvan Lake, Blackfalds, Lacombe and nearby central Alberta communities.', 'Consultez les parcours d’accès pour Red Deer, Sylvan Lake, Blackfalds, Lacombe et les localités voisines du centre de l’Alberta.'],
    booking: ['Alberta Health Services directs its Central Zone to abortion services in Edmonton and Calgary. Compare those regional contacts and ask about appointment location before travelling.', 'Alberta Health Services oriente la zone centrale vers les services d’avortement d’Edmonton et de Calgary. Comparez ces coordonnées régionales et confirmez le lieu du rendez-vous avant de vous déplacer.'],
    source: ahsSource,
    surrounding: ['Sylvan Lake', 'Blackfalds', 'Lacombe', 'Penhold', 'Innisfail', 'Red Deer County', 'Lacombe County'],
    regionalProviderIds: ['womans-health-options', 'community-and-choice', 'kensington', 'peter-lougheed-womens-health'],
  },
  {
    slug: 'medicine-hat', province: 'AB', updated: reviewed,
    title: ['Abortion access in Medicine Hat and area', 'Accès à l’avortement à Medicine Hat et dans les environs'],
    description: ['Find the published regional access route for Medicine Hat, Redcliff and southeastern Alberta.', 'Trouvez le parcours régional publié pour Medicine Hat, Redcliff et le sud-est de l’Alberta.'],
    booking: ['Alberta Health Services points its South Zone to Calgary abortion services. Ask the clinic about the visit and follow-up arrangements before travelling from Medicine Hat.', 'Alberta Health Services dirige la zone sud vers les services d’avortement de Calgary. Renseignez-vous auprès de la clinique sur la visite et le suivi avant de partir de Medicine Hat.'],
    source: ahsSource,
    surrounding: ['Redcliff', 'Cypress County', 'Bow Island'],
    regionalProviderIds: ['kensington', 'peter-lougheed-womens-health'],
  },
  {
    slug: 'grande-prairie', province: 'AB', updated: reviewed,
    title: ['Abortion access in Grande Prairie and area', 'Accès à l’avortement à Grande Prairie et dans les environs'],
    description: ['Find regional contacts for Grande Prairie and nearby Peace Country communities, including Sexsmith, Wembley and Beaverlodge.', 'Trouvez des coordonnées régionales pour Grande Prairie et les localités voisines de la région de la Paix, dont Sexsmith, Wembley et Beaverlodge.'],
    booking: ['The Alberta Health Services North Zone access route lists Edmonton. The Edmonton contacts below show their actual locations; ask about any preparation you can complete close to home.', 'Le parcours de la zone nord publié par Alberta Health Services indique Edmonton. Les coordonnées ci-dessous précisent le lieu réel des services; demandez quels préparatifs peuvent être faits près de chez vous.'],
    source: ahsSource,
    surrounding: ['Sexsmith', 'Wembley', 'Beaverlodge', 'Grande Prairie County No. 1'],
    regionalProviderIds: ['womans-health-options', 'community-and-choice'],
  },
  {
    slug: 'wood-buffalo', province: 'AB', updated: reviewed,
    aliases: ['Fort McMurray'],
    title: ['Abortion access in Fort McMurray and Wood Buffalo', 'Accès à l’avortement à Fort McMurray et Wood Buffalo'],
    description: ['Find published access information for Fort McMurray and the Regional Municipality of Wood Buffalo, with Edmonton contacts shown separately.', 'Consultez l’information publiée pour Fort McMurray et la municipalité régionale de Wood Buffalo, avec les coordonnées d’Edmonton présentées séparément.'],
    booking: ['Alberta Health Services lists Edmonton for North Zone abortion access. Contact a service before booking transportation and confirm where each appointment will take place.', 'Alberta Health Services indique Edmonton pour l’accès à l’avortement dans la zone nord. Communiquez avec un service avant de réserver votre transport et confirmez le lieu de chaque rendez-vous.'],
    source: ahsSource,
    regionalProviderIds: ['womans-health-options', 'community-and-choice'],
  },
  {
    slug: 'saskatoon', province: 'SK', updated: reviewed,
    title: ['Abortion clinics in Saskatoon and area', 'Cliniques d’avortement à Saskatoon et dans les environs'],
    description: ['Compare the hospital program and community clinic contacts in Saskatoon, with links for Warman, Martensville and nearby communities.', 'Comparez le programme hospitalier et les cliniques communautaires de Saskatoon, avec des liens pour Warman, Martensville et les environs.'],
    booking: ['The Saskatoon Abortion Care Program accepts direct calls from patients and operates by appointment. Community clinics have separate booking processes. When calling Saskatoon Sexual Health, ask for an abortion appointment because its nurse-only drop-in clinics cannot prescribe abortion medication.', 'Le Saskatoon Abortion Care Program accepte les appels directs des patientes et patients et fonctionne sur rendez-vous. Les cliniques communautaires ont leurs propres modalités. À Saskatoon Sexual Health, demandez un rendez-vous d’avortement : les plages sans rendez-vous assurées uniquement par une infirmière ou un infirmier ne permettent pas de prescrire ces médicaments.'],
    source: {url: 'https://saskatoonsexualhealth.ca/about/', label: ['Saskatoon Sexual Health — booking and clinic types', 'Saskatoon Sexual Health — rendez-vous et types de clinique (en anglais)']},
    surrounding: ['Warman', 'Martensville', 'Osler', 'Dalmeny', 'Langham', 'Dundurn', 'Aberdeen', 'Corman Park No. 344'],
  },
  {
    slug: 'regina', province: 'SK', updated: reviewed,
    title: ['Abortion access in Regina and area', 'Accès à l’avortement à Regina et dans les environs'],
    description: ['Find the Women’s Health Centre contact for Regina, plus community links for White City, Pilot Butte, Balgonie and the surrounding area.', 'Trouvez les coordonnées du Women’s Health Centre à Regina et des liens pour White City, Pilot Butte, Balgonie et les environs.'],
    booking: ['Call the Women’s Health Centre at Regina General Hospital directly to ask about abortion appointments. Planned Parenthood Regina’s current service page points people seeking abortion care to this hospital number; it states that its own clinical services are paused.', 'Appelez directement le Women’s Health Centre de l’Hôpital général de Regina pour les rendez-vous d’avortement. La page actuelle de Planned Parenthood Regina oriente les personnes vers ce numéro hospitalier et indique que ses propres services cliniques sont suspendus.'],
    source: {url: 'https://www.plannedparenthoodregina.com/clinical-services', label: ['Planned Parenthood Regina — current access instructions', 'Planned Parenthood Regina — modalités actuelles d’accès (en anglais)']},
    surrounding: ['White City', 'Pilot Butte', 'Balgonie', 'Lumsden', 'Grand Coulee', 'Pense', 'Edenwold No. 158', 'Sherwood No. 159'],
  },
  {
    slug: 'prince-albert', province: 'SK', updated: reviewed,
    title: ['Abortion access in Prince Albert and area', 'Accès à l’avortement à Prince Albert et dans les environs'],
    description: ['Find regional abortion contacts for Prince Albert and nearby communities. Saskatoon services are shown with their actual city.', 'Trouvez des coordonnées régionales pour Prince Albert et les localités voisines. Les services de Saskatoon sont présentés avec leur ville réelle.'],
    booking: ['For the Saskatoon hospital program, call 306-655-7637 directly to ask about an appointment. Tell the team you are travelling from Prince Albert and ask about preparation and follow-up. This guide does not currently list a local Prince Albert abortion clinic.', 'Pour le programme hospitalier de Saskatoon, appelez directement le 306-655-7637 afin de demander un rendez-vous. Indiquez que vous venez de Prince Albert et renseignez-vous sur les préparatifs et le suivi. Ce guide ne répertorie actuellement aucune clinique d’avortement locale à Prince Albert.'],
    source: {url: saskatoonProgram, label: ['Saskatoon Abortion Care Program — patient access (PDF)', 'Saskatoon Abortion Care Program — accès (PDF en anglais)']},
    surrounding: ['Prince Albert No. 461', 'Shellbrook', 'Birch Hills', 'Buckland No. 491'],
    regionalProviderIds: ['saskatoon', 'saskatoon-sexual-health', 'saskatoon-community-clinic'],
  },
  {
    slug: 'winnipeg', province: 'MB', updated: reviewed,
    title: ['Abortion clinics in Winnipeg and area', 'Cliniques d’avortement à Winnipeg et dans les environs'],
    description: ['Find Winnipeg clinic and hospital contacts and regional links for Selkirk, Headingley, Steinbach and surrounding communities.', 'Trouvez les coordonnées des services de Winnipeg et des liens régionaux pour Selkirk, Headingley, Steinbach et les localités voisines.'],
    booking: ['Women’s Health Clinic has a dedicated intake number for Winnipeg and a toll-free number for callers outside the city. An online intake form is also available. Health Sciences Centre has its own appointment line; call the service you want directly.', 'La Women’s Health Clinic offre un numéro d’accueil pour Winnipeg et un numéro sans frais pour les appels de l’extérieur. Un formulaire d’accueil en ligne est aussi disponible. Le Health Sciences Centre a sa propre ligne de rendez-vous; appelez directement le service souhaité.'],
    source: {url: whcBooking, label: ['Women’s Health Clinic — ways to book', 'Women’s Health Clinic — prise de rendez-vous (en anglais)']},
    surrounding: ['Selkirk', 'Headingley', 'East St. Paul', 'West St. Paul', 'Springfield', 'St. Andrews', 'St. Clements', 'Ritchot', 'Macdonald', 'Stonewall', 'Niverville', 'Steinbach', 'Taché'],
  },
  {
    slug: 'brandon', province: 'MB', updated: reviewed,
    title: ['Abortion access in Brandon and western Manitoba', 'Accès à l’avortement à Brandon et dans l’ouest du Manitoba'],
    description: ['Find the Prairie Mountain Health access route for Brandon, with links to surrounding communities and separately labelled Winnipeg options.', 'Trouvez le parcours d’accès de Prairie Mountain Health pour Brandon, avec des liens vers les localités voisines et les options de Winnipeg présentées séparément.'],
    booking: ['Prairie Mountain Health lists abortion care at Brandon Regional Health Centre and other regional sites. Its public-health line provides information and referrals. Confirm the care site and booking steps with the team; this regional line is not a direct hospital booking desk.', 'Prairie Mountain Health indique des soins d’avortement au Brandon Regional Health Centre et dans d’autres établissements régionaux. Sa ligne de santé publique fournit de l’information et des orientations. Confirmez le lieu des soins et les démarches avec l’équipe; cette ligne régionale n’est pas le bureau de rendez-vous de l’hôpital.'],
    source: {url: pmh, label: ['Prairie Mountain Health — abortion access', 'Prairie Mountain Health — accès à l’avortement (en anglais)']},
    surrounding: ['Cornwallis', 'Elton', 'Whitehead', 'Carberry', 'Minnedosa', 'Souris-Glenwood', 'Riverdale', 'Neepawa', 'Dauphin'],
    regionalProviderIds: ['womens-health-winnipeg', 'hsc-winnipeg-pregnancy'],
  },
];

export const prairiesProviders: Provider[] = [
  {
    id: 'peter-lougheed-womens-health', name: 'Peter Lougheed Centre — Women’s Health Clinic', city: 'Calgary', province: 'AB', phone: '403-943-5716',
    url: calgaryHospital, services: ['procedural'],
    description: ['Hospital-based procedural abortion service in Calgary. Patients can request an appointment directly by phone.', 'Service hospitalier d’avortement par intervention à Calgary. Les patientes et patients peuvent demander un rendez-vous directement par téléphone.'],
    sources: [calgaryHospital], reviewed, confirmed: false,
  },
  {
    id: 'community-and-choice', name: 'Community & Choice Reproductive Health Clinic', city: 'Edmonton', province: 'AB', phone: '780-443-9400',
    url: 'https://communityandchoice.com/medical-abortion/', services: ['medication'],
    description: ['Medication abortion at the Edmonton clinic. No referral is required; the clinic links to its own online booking service.', 'Avortement par médicaments à la clinique d’Edmonton. Aucune recommandation n’est nécessaire; la clinique propose son propre service de rendez-vous en ligne.'],
    sources: ['https://communityandchoice.com/', 'https://communityandchoice.com/medical-abortion/', 'https://communityandchoice.janeapp.com/locations/community-and-choice/book'], reviewed, confirmed: false,
  },
  {
    id: 'saskatoon-sexual-health', name: 'Saskatoon Sexual Health', city: 'Saskatoon', province: 'SK', phone: '306-244-7989',
    url: 'https://saskatoonsexualhealth.ca/services/', services: ['medication'],
    description: ['Community clinic offering medication abortion in Saskatoon. Call for the appropriate appointment; nurse-only drop-in sessions do not provide abortion prescriptions.', 'Clinique communautaire offrant l’avortement par médicaments à Saskatoon. Appelez pour obtenir le rendez-vous approprié; les plages sans rendez-vous assurées uniquement par du personnel infirmier ne permettent pas ces prescriptions.'],
    sources: ['https://saskatoonsexualhealth.ca/services/', 'https://saskatoonsexualhealth.ca/about/'], reviewed, confirmed: false,
  },
  {
    id: 'saskatoon-community-clinic', name: 'Saskatoon Community Clinic', city: 'Saskatoon', province: 'SK', phone: '306-652-0300',
    url: 'https://saskatooncommunityclinic.ca/unplanned-pregnancy/', services: ['medication'],
    description: ['Call reception to request an abortion consultation. The clinic publishes medication-abortion care information and does not require a referral for the initial appointment.', 'Appelez la réception pour demander une consultation d’avortement. La clinique publie de l’information sur les soins par médicaments et n’exige pas de recommandation pour la consultation initiale.'],
    sources: ['https://saskatooncommunityclinic.ca/unplanned-pregnancy/', 'https://saskatooncommunityclinic.ca/wp-content/uploads/2024/07/Medical-Abortion-Information-and-Patient-Care-Form-updated-Jan-2024.pdf'], reviewed, confirmed: false,
  },
  {
    id: 'hsc-winnipeg-pregnancy', name: 'Health Sciences Centre — Pregnancy Counselling Clinic', city: 'Winnipeg', province: 'MB', phone: '204-787-1980',
    url: hsc, services: ['medication', 'procedural'],
    description: ['The Winnipeg hospital lists medication and procedural abortion appointments through this direct number. The Pregnancy Counselling Clinic accepts self-referrals.', 'L’hôpital de Winnipeg indique ce numéro direct pour les rendez-vous d’avortement par médicaments et par intervention. La Pregnancy Counselling Clinic accepte les demandes directes.'],
    sources: [hsc, 'https://hsc.mb.ca/adults/womens-health/find-a-clinic/'], reviewed, confirmed: false,
  },
  {
    id: 'prairie-mountain-abortion-access', kind: 'regional-booking', name: 'Prairie Mountain Health — abortion access', city: 'Brandon', province: 'MB', phone: '1-833-654-0325',
    phoneLabel: ['Public health — information and referrals', 'Santé publique — information et orientation'],
    url: pmh, resourceLabel: ['Regional access information', 'Information sur l’accès régional'], services: [],
    description: ['Regional public-health contact for abortion information and referrals. Prairie Mountain Health lists care in Brandon, Dauphin and Neepawa; confirm the appointment site with the team.', 'Contact régional de santé publique pour l’information et l’orientation en matière d’avortement. Prairie Mountain Health indique des soins à Brandon, Dauphin et Neepawa; confirmez le lieu du rendez-vous avec l’équipe.'],
    sources: [pmh, 'https://prairiemountainhealth.ca/contact-us/ph-and-phc-office-locations/'], reviewed, confirmed: false,
  },
];

export const prairiesBooking: Record<string, BookingInfo> = {
  'kensington': {
    hours: ['Appointment calls: Monday–Friday, 8 a.m.–4:30 p.m. Mountain Time, excluding statutory holidays.', 'Appels pour les rendez-vous : du lundi au vendredi, de 8 h à 16 h 30, heure des Rocheuses, sauf les jours fériés.'],
    access: ['Call or request an appointment on the clinic website. Ask about preparation if travelling from outside Calgary.', 'Appelez ou demandez un rendez-vous sur le site de la clinique. Si vous venez de l’extérieur de Calgary, renseignez-vous sur les préparatifs.'],
    bookingUrl: 'https://kensingtonclinic.com/appointments/',
  },
  'womans-health-options': {
    hours: ['Monday–Friday, 8:30 a.m.–4:30 p.m. Mountain Time.', 'Du lundi au vendredi, de 8 h 30 à 16 h 30, heure des Rocheuses.'],
    access: ['Book directly by phone or online. A referral is not required.', 'Prenez rendez-vous directement par téléphone ou en ligne. Aucune recommandation n’est nécessaire.'],
    bookingUrl: 'https://womanshealthoptions.com/appointments/',
  },
  'peter-lougheed-womens-health': {
    hours: ['Monday–Friday, 8 a.m.–4 p.m. Mountain Time; closed statutory holidays.', 'Du lundi au vendredi, de 8 h à 16 h, heure des Rocheuses; fermé les jours fériés.'],
    access: ['Call the Women’s Health Clinic to request an appointment. The hospital lists clinic procedure days on Tuesday and Wednesday.', 'Appelez la Women’s Health Clinic pour demander un rendez-vous. L’hôpital indique que les interventions ont lieu le mardi et le mercredi.'],
    languages: ['Interpreter and translation services are listed; ask when booking.', 'Des services d’interprétation et de traduction sont indiqués; renseignez-vous au moment de réserver.'],
  },
  'community-and-choice': {
    access: ['No referral is needed. Use the clinic’s linked booking service or call for help.', 'Aucune recommandation n’est nécessaire. Utilisez le service de rendez-vous de la clinique ou appelez pour obtenir de l’aide.'],
    bookingUrl: 'https://communityandchoice.janeapp.com/locations/community-and-choice/book',
  },
  'saskatoon-sexual-health': {
    access: ['Call to request an abortion appointment. Nurse-only drop-in sessions do not provide abortion medication prescriptions.', 'Appelez pour demander un rendez-vous d’avortement. Les plages sans rendez-vous assurées uniquement par du personnel infirmier ne permettent pas de prescrire ces médicaments.'],
  },
  'saskatoon-community-clinic': {
    access: ['No referral is required for the initial consultation. Call reception; appointment availability is not guaranteed.', 'Aucune recommandation n’est requise pour la consultation initiale. Appelez la réception; la disponibilité des rendez-vous n’est pas garantie.'],
  },
  'saskatoon': {
    access: ['Call the program directly. Visits are by appointment; the program does not offer walk-in or same-day service.', 'Appelez directement le programme. Les visites se font sur rendez-vous; le programme n’offre pas de consultations sans rendez-vous ni de soins le jour même.'],
  },
  'womens-health-winnipeg': {
    access: ['Leave an intake message or use the clinic’s online form. Call the toll-free number if you live outside Winnipeg.', 'Laissez un message à l’accueil ou utilisez le formulaire en ligne de la clinique. Si vous habitez hors de Winnipeg, composez le numéro sans frais.'],
    languages: ['Interpreter services can be requested when booking.', 'Vous pouvez demander un service d’interprétation lors de la prise de rendez-vous.'],
    bookingUrl: whcBooking,
  },
  'hsc-winnipeg-pregnancy': {
    access: ['Call 204-787-1980 directly. The Pregnancy Counselling Clinic accepts self-referrals.', 'Appelez directement le 204-787-1980. La Pregnancy Counselling Clinic accepte les demandes directes.'],
  },
  'prairie-mountain-abortion-access': {
    access: ['Use the public-health line for information and referral instructions. Confirm the care location before travelling.', 'Utilisez la ligne de santé publique pour obtenir de l’information et connaître les démarches d’orientation. Confirmez le lieu des soins avant de vous déplacer.'],
  },
};

export const prairiesProviderUpdates: Record<string, Partial<Provider>> = {
  'kensington': {reviewed, sources: ['https://kensingtonclinic.com/', 'https://kensingtonclinic.com/appointments/']},
  'womans-health-options': {reviewed, sources: [edmontonService, 'https://womanshealthoptions.com/appointments/']},
  'saskatoon': {reviewed, sources: [saskatoonProgram]},
  'womens-health-winnipeg': {reviewed, sources: ['https://womenshealthclinic.org/services/abortion-care', whcBooking]},
  'regina': {reviewed, sources: ['https://www.plannedparenthoodregina.com/clinical-services', 'https://www.saskhealthauthority.ca/facilities-locations/regina-general-hospital']},
};
