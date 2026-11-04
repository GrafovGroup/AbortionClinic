import type {Article} from './content';

const checked = '2026-11-03';
const tac = 'https://taclinic.ca/online-booking';
const now = 'https://www.nthssa.ca/en/services/now/making-appointment';
const niagara = 'https://www.niagarahealth.on.ca/files/firsttrimestersurgicalabortionreferralform-56.pdf';
const shore = 'https://clinic.shorecentre.ca/abortion/';
const choiceFAQ = 'https://choiceinhealth.ca/faq';
const support = 'https://abortioncarecanada.ca/i-need-support/';
const opal = 'https://opalyukon.ca/appointments';
const rose = 'https://www.nshealth.ca/clinics-programs-and-services/rose-clinic-reproductive-options-and-services';
const willow = 'https://willowclinic.ca/medical-abortion/';
const connection = 'https://www.connectionmedical.ca/ontario-wide-virtual-abortion-service';
const accessibility = 'https://choiceinhealth.ca/accessibility';
const accessLine = 'https://www.actioncanadashr.org/access-line';
const government = 'https://www.canada.ca/en/public-health/services/sexual-health/abortion-canada.html';
const reliable = 'https://www.actioncanadashr.org/sexual-health-hub/finding-reliable-sexual-health-info-online';

export const accessArticles: Article[] = [
  {
    slug: 'booking-abortion-appointment',
    frSlug: 'prendre-rendez-vous-avortement',
    title: ['Booking an abortion appointment in Canada', 'Prendre rendez-vous pour un avortement au Canada'],
    intro: ['Check the service’s booking route, referral requirements and confirmation instructions before making plans.', 'Vérifiez les modalités de réservation, les exigences de référence et la confirmation du rendez-vous avant de faire des plans.'],
    reviewed: checked, updated: checked,
    sections: [
      {
        title: ['Use the right appointment route', 'Utiliser le bon service de rendez-vous'],
        body: ['Start with the clinic’s official instructions. Booking may differ by method: Toronto Abortion Clinic directs medication appointments to online booking and procedural appointments to its phone line. A regional booking service may assign a different treatment location. Ask where you will be seen.', 'Commencez par les consignes officielles de la clinique. Les modalités peuvent varier selon la méthode : Toronto Abortion Clinic propose la réservation en ligne pour les soins par médicaments et demande de téléphoner pour une intervention. Un service régional de rendez-vous peut vous diriger vers un autre établissement. Demandez où vous serez reçu.'],
      },
      {
        title: ['Ask whether a referral is needed', 'Demander si une référence est nécessaire'],
        body: ['There is no single booking process for every service. For example, the NOW program accepts direct calls, while Niagara Health publishes a referral form for a healthcare professional to complete. Ask your chosen service what applies and who should send any required documents.', 'Il n’existe pas une seule procédure pour tous les services. Par exemple, le programme NOW accepte les appels directs, tandis que Niagara Health publie un formulaire de référence à remplir par un professionnel de la santé. Demandez au service choisi quelles démarches s’appliquent et qui doit transmettre les documents requis.'],
      },
      {
        title: ['Confirm before you travel', 'Obtenir une confirmation avant de partir'],
        body: ['An online request may still need confirmation: SHORE distinguishes a held appointment from a confirmed booking. Check the date, address, arrival instructions and callback arrangements with the service. Send health information only through its designated channel. AbortionClinic.ca does not receive booking requests or medical documents.', 'Une demande en ligne peut nécessiter une confirmation : SHORE distingue une plage retenue d’un rendez-vous confirmé. Vérifiez la date, l’adresse, les consignes d’arrivée et les modalités de rappel avec le service. Transmettez les renseignements de santé uniquement par le canal prévu. AbortionClinic.ca ne reçoit ni demandes de rendez-vous ni documents médicaux.'],
      },
    ],
    sources: [tac, now, niagara, shore],
    sourceNotes: [
      {url: tac, title: ['Toronto Abortion Clinic — booking instructions', 'Toronto Abortion Clinic — modalités de réservation (en anglais)'], supports: ['Booking routes for medication and procedural appointments.', 'Modalités de réservation selon le type de soins.']},
      {url: now, title: ['NOW — making an appointment', 'NOW — prendre rendez-vous'], supports: ['Direct calls and safe callback arrangements.', 'Appels directs et modalités de rappel sécuritaires.']},
      {url: niagara, title: ['Niagara Health — referral form (PDF)', 'Niagara Health — formulaire de référence (PDF, en anglais)'], supports: ['A provider-completed referral pathway at this hospital.', 'Un parcours de référence à remplir par un professionnel dans cet hôpital.']},
      {url: shore, title: ['SHORE Centre — requesting an appointment', 'SHORE Centre — demander un rendez-vous (en anglais)'], supports: ['The distinction between a request and a confirmed appointment.', 'La distinction entre une demande et un rendez-vous confirmé.']},
    ],
    related: ['what-to-expect', 'travelling-for-abortion-care', 'find-care'],
  },
  {
    slug: 'abortion-without-health-card',
    frSlug: 'avortement-sans-carte-assurance-maladie',
    title: ['Finding abortion care without a health card', 'Trouver des soins d’avortement sans carte d’assurance maladie'],
    intro: ['Ask about your situation directly. A missing card, an expired card and having no insurance can require different arrangements.', 'Expliquez votre situation directement au service. Une carte perdue, une carte expirée et l’absence d’assurance peuvent nécessiter des démarches différentes.'],
    reviewed: checked, updated: checked,
    sections: [
      {
        title: ['Contact the clinic even if an online form does not fit', 'Contacter la clinique si le formulaire ne convient pas'],
        body: ['Tell the booking team which coverage documents you have and ask what it can accept. Toronto Abortion Clinic provides a separate booking route for people without Ontario health insurance. Requirements are service-specific; one clinic’s form does not establish the rules elsewhere.', 'Indiquez à l’équipe de rendez-vous quels documents de couverture vous avez et demandez ce qu’elle accepte. Toronto Abortion Clinic prévoit une démarche distincte pour les personnes sans assurance maladie de l’Ontario. Les exigences sont propres au service; le formulaire d’une clinique ne détermine pas les règles ailleurs.'],
      },
      {
        title: ['Separate the appointment, tests and medication costs', 'Distinguer les frais du rendez-vous, des examens et des médicaments'],
        body: ['Ask for the expected charges, what an insurer can pay directly and what would require reimbursement. Choice in Health describes several accepted insurance plans and options for uninsured patients. Confirm your own eligibility before relying on an example from another clinic or province.', 'Demandez quels frais sont prévus, ce qu’un assureur peut payer directement et ce qui doit être remboursé après paiement. Choice in Health décrit plusieurs régimes acceptés et des options pour les personnes sans assurance. Confirmez votre admissibilité avant de vous fier à l’exemple d’une autre clinique ou province.'],
      },
      {
        title: ['Ask about support before paying', 'Demander du soutien avant de payer'],
        body: ['Abortion Care Canada describes assistance for some uninsured care costs and practical expenses. Contact its access team to discuss the available options. Funding and appointments are not guaranteed by this directory; clarify any approval process before assuming an expense will be covered.', 'Abortion Care Canada décrit une aide pour certains frais de soins non assurés et certaines dépenses pratiques. Communiquez avec son équipe d’accès pour discuter des possibilités. Ce répertoire ne garantit ni financement ni rendez-vous; vérifiez la procédure d’approbation avant de présumer qu’un frais sera couvert.'],
      },
    ],
    sources: [tac, choiceFAQ, support],
    sourceNotes: [
      {url: tac, title: ['Toronto Abortion Clinic — booking without OHIP', 'Toronto Abortion Clinic — réservation sans assurance ontarienne (en anglais)'], supports: ['A published booking route without Ontario coverage.', 'Une démarche publiée pour les personnes sans couverture ontarienne.']},
      {url: choiceFAQ, title: ['Choice in Health — coverage questions', 'Choice in Health — questions de couverture (en anglais)'], supports: ['This clinic’s insurance and uninsured-care information.', 'Renseignements de cette clinique sur l’assurance et les soins non assurés.']},
      {url: support, title: ['Abortion Care Canada — support options', 'Abortion Care Canada — options de soutien (en anglais)'], supports: ['Programs addressing care fees and practical barriers.', 'Programmes liés aux frais de soins et aux obstacles pratiques.']},
    ],
    related: ['cost', 'booking-abortion-appointment', 'travelling-for-abortion-care'],
  },
  {
    slug: 'travelling-for-abortion-care',
    frSlug: 'deplacements-pour-avortement',
    title: ['Planning travel for abortion care', 'Planifier un déplacement pour des soins d’avortement'],
    intro: ['Confirm your appointment, care location and return arrangements before booking transport or accommodation.', 'Confirmez votre rendez-vous, le lieu des soins et les modalités du retour avant de réserver le transport ou l’hébergement.'],
    reviewed: checked, updated: checked,
    sections: [
      {
        title: ['Check the full visit schedule', 'Vérifier l’ensemble des visites prévues'],
        body: ['Ask whether assessment and treatment occur on the same day, whether you need a return visit, and where follow-up will happen. Opal’s Yukon instructions illustrate why this matters: assessment and procedural care may be scheduled separately. Use your own clinic’s confirmed instructions when planning time away.', 'Demandez si l’évaluation et les soins ont lieu le même jour, si une autre visite est nécessaire et où se fera le suivi. Les consignes d’Opal au Yukon montrent pourquoi cette vérification compte : l’évaluation et l’intervention peuvent être prévues séparément. Planifiez votre absence selon les consignes confirmées de votre clinique.'],
      },
      {
        title: ['Arrange the return journey with the care team', 'Préparer le retour avec l’équipe soignante'],
        body: ['Check whether you need someone to accompany you and whether the clinic has restrictions on driving after your appointment. ROSE requires accompaniment home after procedural care. Tell the service if arranging a support person is difficult; do not assume a taxi or solo trip meets its requirements.', 'Vérifiez si une personne doit vous accompagner et si la clinique impose des restrictions de conduite après le rendez-vous. ROSE exige un accompagnement pour le retour après une intervention. Indiquez au service si cela pose une difficulté; ne présumez pas qu’un taxi ou un trajet seul répond à ses exigences.'],
      },
      {
        title: ['Ask about costs and regional assistance', 'Se renseigner sur les frais et l’aide régionale'],
        body: ['Confirm billing if care is outside your home province or territory. Ask separately about travel, accommodation and childcare expenses. The NOW program can discuss transport to Yellowknife, and Abortion Care Canada describes travel assistance. Speak with the relevant team before making purchases; arrangements depend on the program and your situation.', 'Confirmez la facturation si les soins ont lieu hors de votre province ou territoire. Renseignez-vous séparément sur le transport, l’hébergement et la garde d’enfants. Le programme NOW peut discuter du transport vers Yellowknife, et Abortion Care Canada décrit une aide aux déplacements. Parlez à l’équipe concernée avant de payer; les modalités dépendent du programme et de votre situation.'],
      },
    ],
    sources: [opal, rose, now, support],
    sourceNotes: [
      {url: opal, title: ['Opal — visits and travel from Yukon communities', 'Opal — visites et déplacements depuis les localités du Yukon (en anglais)'], supports: ['Appointment stages and local health-centre assistance.', 'Étapes des rendez-vous et aide des centres de santé locaux.']},
      {url: rose, title: ['Nova Scotia Health — ROSE appointment preparation', 'Santé Nouvelle-Écosse — préparation des rendez-vous ROSE (en anglais)'], supports: ['Accompaniment requirements for procedural appointments.', 'Exigence d’accompagnement pour les rendez-vous par intervention.']},
      {url: now, title: ['NOW — appointment and transportation arrangements', 'NOW — rendez-vous et transport'], supports: ['Discussing transportation needs when booking.', 'Discussion des besoins de transport lors de la réservation.']},
      {url: support, title: ['Abortion Care Canada — travel and logistics', 'Abortion Care Canada — déplacements et logistique (en anglais)'], supports: ['Published categories of practical assistance.', 'Catégories publiées d’aide pratique.']},
    ],
    related: ['cost', 'booking-abortion-appointment', 'language-accessibility'],
  },
  {
    slug: 'virtual-abortion-care',
    frSlug: 'avortement-et-soins-virtuels',
    title: ['Understanding virtual abortion appointments', 'Comprendre les rendez-vous d’avortement à distance'],
    intro: ['A virtual appointment does not establish that every part of care can happen remotely or that a clinic serves every province.', 'Un rendez-vous virtuel ne signifie pas que tous les soins se font à distance ni qu’une clinique dessert toutes les provinces.'],
    reviewed: checked, updated: checked,
    sections: [
      {
        title: ['Confirm the service area and eligibility', 'Confirmer le territoire desservi et l’admissibilité'],
        body: ['Ask whether the provider can offer care where you will be located. Connection Medical advertises an Ontario-wide virtual service. Willow’s British Columbia service uses distance from Vancouver and a clinical assessment when considering telemedicine. These examples do not create a general eligibility rule for other clinics.', 'Demandez si le prestataire peut offrir des soins là où vous vous trouverez. Connection Medical annonce un service virtuel à l’échelle de l’Ontario. En Colombie-Britannique, Willow tient compte de la distance de Vancouver et d’une évaluation clinique pour la télémédecine. Ces exemples ne constituent pas une règle générale pour les autres cliniques.'],
      },
      {
        title: ['Ask which steps need a local visit', 'Demander quelles étapes nécessitent un déplacement'],
        body: ['Check how any tests, prescriptions and follow-up will be arranged. SHORE describes virtual assessment with testing and follow-up determined by the clinician. Ask where each step can happen and who will coordinate it. Use the care team’s instructions rather than another clinic’s online treatment schedule.', 'Vérifiez comment les examens, les ordonnances et le suivi seront organisés. SHORE décrit une évaluation virtuelle, avec des examens et un suivi déterminés par le professionnel. Demandez où chaque étape peut avoir lieu et qui la coordonnera. Suivez les consignes de l’équipe soignante plutôt que le calendrier de traitement publié par une autre clinique.'],
      },
      {
        title: ['Plan the appointment connection', 'Préparer la connexion au rendez-vous'],
        body: ['Ask whether the appointment uses telephone or video, what to do if the connection fails, and how the clinic will send its instructions. Connection Medical uses video appointments and describes medication delivery arrangements. Confirm a suitable contact method and delivery plan directly with the service before booking.', 'Demandez si le rendez-vous se fait par téléphone ou vidéo, quoi faire en cas de problème de connexion et comment la clinique transmettra ses consignes. Connection Medical utilise la vidéo et décrit des modalités de livraison des médicaments. Confirmez directement avec le service un mode de contact et une livraison qui conviennent avant de réserver.'],
      },
    ],
    sources: [connection, willow, shore],
    sourceNotes: [
      {url: connection, title: ['Connection Medical — Ontario virtual service', 'Connection Medical — service virtuel en Ontario (en anglais)'], supports: ['Published service area, video appointments and delivery arrangements.', 'Territoire publié, rendez-vous vidéo et modalités de livraison.']},
      {url: willow, title: ['Willow Clinic — in-person and distance care', 'Willow Clinic — soins en personne et à distance (en anglais)'], supports: ['Distance and clinical-assessment conditions for telemedicine.', 'Conditions de distance et d’évaluation clinique pour la télémédecine.']},
      {url: shore, title: ['SHORE Centre — virtual appointment process', 'SHORE Centre — déroulement des rendez-vous virtuels (en anglais)'], supports: ['Assessment, testing and follow-up arrangements.', 'Modalités d’évaluation, d’examens et de suivi.']},
    ],
    related: ['medication-abortion', 'language-accessibility', 'find-care'],
  },
  {
    slug: 'language-accessibility',
    frSlug: 'langue-et-accessibilite',
    title: ['Language, interpretation and accessibility', 'Langue, interprétation et accessibilité'],
    intro: ['Ask about the support you need when booking so the clinic can confirm arrangements before your visit.', 'Parlez de vos besoins au moment de réserver pour que la clinique puisse confirmer les mesures prévues avant votre visite.'],
    reviewed: checked, updated: checked,
    sections: [
      {
        title: ['Request the right interpretation support', 'Demander le service d’interprétation approprié'],
        body: ['Describe your communication needs. Choice in Health offers language and American Sign Language interpretation on request. Ask your clinic whether interpretation covers assessment, instructions and follow-up; arrangements differ between services.', 'Décrivez vos besoins de communication. Choice in Health offre sur demande l’interprétation linguistique et en langue des signes américaine. Demandez à votre clinique si l’interprétation couvre l’évaluation, les consignes et le suivi; les modalités varient.'],
      },
      {
        title: ['Describe the access features that matter to you', 'Décrire les aménagements qui comptent pour vous'],
        body: ['Ask about entrances, elevators, washrooms, mobility equipment and sensory needs before travelling. Choice in Health describes features and limitations of its space. Request concrete details from your clinic instead of relying on an “accessible” label.', 'Avant de partir, renseignez-vous sur l’entrée, l’ascenseur, les toilettes, les aides à la mobilité et les besoins sensoriels. Choice in Health décrit les caractéristiques et les limites de ses locaux. Demandez des précisions à votre clinique au-delà d’une mention « accessible ».'],
      },
      {
        title: ['Get help finding an appropriate contact', 'Obtenir de l’aide pour trouver un contact approprié'],
        body: ['Action Canada’s Access Line offers English and French support and access to interpretation in other languages. It can help with service information. Interpretation on that line is separate from interpretation at a clinic: confirm your appointment arrangements with the provider itself.', 'La Ligne d’accès d’Action Canada offre du soutien en français et en anglais ainsi que l’accès à l’interprétation dans d’autres langues. Elle peut fournir de l’information sur les services. L’interprétation sur cette ligne est distincte de celle d’une clinique : confirmez les modalités du rendez-vous auprès du prestataire lui-même.'],
      },
    ],
    sources: [accessibility, accessLine],
    sourceNotes: [
      {url: accessibility, title: ['Choice in Health — accessibility details', 'Choice in Health — détails d’accessibilité (en anglais)'], supports: ['Specific physical-access features, limitations and interpretation requests.', 'Caractéristiques d’accès physique, limites et demandes d’interprétation.']},
      {url: accessLine, title: ['Action Canada — Access Line languages', 'Action Canada — langues de la Ligne d’accès'], supports: ['Language and interpretation support on the information line.', 'Soutien linguistique et interprétation sur la ligne d’information.']},
    ],
    related: ['booking-abortion-appointment', 'travelling-for-abortion-care', 'virtual-abortion-care'],
  },
  {
    slug: 'finding-abortion-provider',
    frSlug: 'trouver-un-prestataire-avortement',
    title: ['Checking whether a service provides abortion care', 'Vérifier si un service offre des soins d’avortement'],
    intro: ['A pregnancy-support website, counselling service or ultrasound offer does not by itself confirm that abortion care is available there.', 'Un site d’aide à la grossesse, un service de consultation ou une offre d’échographie ne confirme pas à lui seul qu’un avortement y est disponible.'],
    reviewed: checked, updated: checked,
    sections: [
      {
        title: ['Ask directly what the organization offers', 'Demander directement quels services sont offerts'],
        body: ['Before sharing personal details, ask whether the service provides abortion care, whether it makes referrals if needed, and where care takes place. Distinguish a treatment provider from an information or appointment line. A clear answer helps you decide whether the service matches what you are seeking.', 'Avant de partager des renseignements personnels, demandez si le service pratique des avortements, s’il fait des références au besoin et où les soins ont lieu. Distinguez le prestataire de soins d’une ligne d’information ou de rendez-vous. Une réponse claire aide à déterminer si le service correspond à votre recherche.'],
      },
      {
        title: ['Check the purpose and sources of the information', 'Vérifier l’objectif et les sources de l’information'],
        body: ['The Government of Canada warns that crisis pregnancy centres can resemble clinics while seeking to discourage abortion. Action Canada describes warning signs such as shame, pressure and misleading health claims. Look for an identifiable organization, a clear description of its services and traceable medical sources.', 'Le gouvernement du Canada prévient que des centres de crise de grossesse peuvent ressembler à des cliniques tout en cherchant à décourager l’avortement. Action Canada décrit des signes préoccupants comme la culpabilisation, la pression et les affirmations de santé trompeuses. Cherchez un organisme identifiable, une description claire des services et des sources médicales vérifiables.'],
      },
      {
        title: ['Cross-check before making arrangements', 'Recouper l’information avant de faire des démarches'],
        body: ['Compare the organization’s current website with a health-authority resource or an established sexual-health directory. If information conflicts, ask the organization to clarify or contact Action Canada for service information. This directory’s source links and check dates show the basis for a listing; they are not an endorsement or a guarantee of care.', 'Comparez le site actuel de l’organisme avec une ressource d’autorité de santé ou un répertoire reconnu en santé sexuelle. En cas de contradiction, demandez des précisions à l’organisme ou des renseignements à Action Canada. Les sources et dates de vérification de ce répertoire indiquent la base d’une fiche; elles ne constituent ni une approbation ni une garantie de soins.'],
      },
    ],
    sources: [government, reliable, accessLine],
    sourceNotes: [
      {url: government, title: ['Government of Canada — abortion information', 'Gouvernement du Canada — renseignements sur l’avortement'], supports: ['The federal warning about crisis pregnancy centres.', 'La mise en garde fédérale concernant les centres de crise de grossesse.']},
      {url: reliable, title: ['Action Canada — evaluating online information', 'Action Canada — évaluer l’information en ligne (en anglais)'], supports: ['Warning signs in pregnancy and abortion information.', 'Signes préoccupants dans l’information sur la grossesse et l’avortement.']},
      {url: accessLine, title: ['Action Canada — independent service information', 'Action Canada — information indépendante sur les services'], supports: ['An external information and support contact.', 'Un contact externe d’information et de soutien.']},
    ],
    related: ['provider-review-policy', 'editorial-policy', 'find-care'],
  },
];
