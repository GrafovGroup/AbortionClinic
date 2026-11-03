// Editorial guides are nonclinical. Do not add clinical recommendations without
// qualified review and citations, or describe an unperformed review as complete.
export const editorial = {
  en: {
    about: {
      intro: 'Clear information. Space to make your own decisions.',
      sections: [
        { title: 'An independent starting point', body: 'AbortionClinic.ca is an independent information resource and public provider directory for people looking for abortion-care information in Canada. You decide which information to read and which provider to contact.' },
        { title: 'Your next step is yours', body: 'A directory listing is a reference, not a referral or endorsement. We do not book appointments, contact providers for visitors, offer treatment or give advice tailored to your health.' },
        { title: 'Information with context', body: 'Our publishing standard is to name the source of provider information and record when it was checked. A review of public information does not mean a provider has confirmed it, and neither establishes current appointment availability.' },
        { title: 'English and French', body: 'The site provides English and French versions of its pages. The language switch takes you to the corresponding page so you can continue reading in the language you prefer.' }
      ]
    },
    privacy: {
      intro: 'You should be able to look for information without being asked for your medical history.',
      sections: [
        { title: 'What this website asks for', body: 'The directory search asks only for a city, province or territory. There is no patient account, intake form, booking form or health questionnaire. Please do not enter names, pregnancy details or other personal health information into the search field.' },
        { title: 'Your searches', body: 'Directory filtering happens in your browser. This version does not send search terms to the server, save them in browser storage or use them for analytics. The pages you visit may still appear in your browser history.' },
        { title: 'Analytics and third parties', body: 'This version does not include advertising trackers or third-party analytics. Following an external website link or a telephone link uses services outside this website; their privacy practices may differ.' },
        { title: 'Quick Exit has limits', body: 'Quick Exit replaces the current page with a neutral website. It cannot erase browser history, close other tabs or remove records held by your device, network or internet provider.' },
        { title: 'Before public launch', body: 'This privacy statement describes the current development version. Hosting, infrastructure logging, retention practices and an administrative contact must be documented and reviewed before the site is published.' }
      ]
    },
    terms: {
      intro: 'A general information resource for independent use.',
      sections: [
        { title: 'Information, not care', body: 'This website does not establish a patient–provider relationship. Its pages are not a diagnosis, treatment plan or substitute for advice from a qualified healthcare professional who understands your circumstances.' },
        { title: 'Using the directory', body: 'Public information can change. Before relying on a listing, check the provider’s official website or contact the provider independently to confirm its current location, services, requirements and availability.' },
        { title: 'External websites', body: 'An external link is provided for reference. Its presence does not establish an affiliation, endorsement, referral arrangement or guarantee about the destination’s information or services.' },
        { title: 'Development status', body: 'These draft terms describe the intended use of the site. The complete terms require legal review before publication.' }
      ]
    },
    contact: {
      intro: 'Site corrections and administrative questions.',
      sections: [
        { title: 'A channel for corrections', body: 'The administrative contact channel is being prepared. It will be for reporting outdated public information, broken links, accessibility issues and other website concerns. No message is sent from this page.' },
        { title: 'What a correction should include', body: 'When the contact channel is available, identify the page or listing, explain the public information that needs correcting and include an official source if you have one. Do not include patient names, pregnancy details, medical records or appointment information.' },
        { title: 'Questions about your care', body: 'Contact a healthcare provider directly for personal medical questions or appointment requests. AbortionClinic.ca does not receive patient inquiries, contact providers on your behalf or coordinate care.' },
        { title: 'Urgent help', body: 'For an emergency in Canada, call 911 or go to the nearest emergency department. This website does not monitor urgent messages.' }
      ]
    },
    editorial: {
      intro: 'Our standard is to make the source and limits of information visible.',
      sections: [
        { title: 'Public provider information', body: 'A provider record must have an official public source and the date its details were reviewed before it is published. Missing details are left out rather than inferred. The directory currently has no published provider records.' },
        { title: 'Reviewed is not provider-confirmed', body: '“Information reviewed” means a reviewer checked the stated public source. “Provider-confirmed” may be used only when there is evidence of confirmation from that provider. Neither label means an appointment is available or that a visitor is eligible for a particular service.' },
        { title: 'Clinical content', body: 'Clinical explanations require authoritative sources and review by a qualified healthcare professional before publication. The current topic guides offer questions to discuss with a provider; they do not contain treatment instructions. No clinical review is claimed for this version.' },
        { title: 'Language and accessibility', body: 'English and French content should carry the same meaning. Canadian French review, accessibility checks and a clear correction process are part of the publication requirements.' },
        { title: 'Changes and corrections', body: 'When a factual change is made to a published provider record or reviewed article, the source and review date should be updated. An administrative correction channel must be available before public launch.' }
      ]
    },
    faqs: [
      { q: 'Is AbortionClinic.ca a medical clinic?', a: 'No. It is an independent information website and public provider directory. It does not provide medical care, referrals, appointment booking or patient coordination.' },
      { q: 'Can I book an appointment here?', a: 'Appointments are arranged directly with a provider. The site does not accept booking requests or contact providers on your behalf.' },
      { q: 'What does an empty search result mean?', a: 'It means the directory has no published record matching your search. It does not establish that care is unavailable in that location. This version has no published provider records yet.' },
      { q: 'What information can I use to search?', a: 'Use a city, province or territory. Do not enter your name, medical history, pregnancy details or other personal health information.' },
      { q: 'Does Quick Exit erase my history?', a: 'No. It replaces this page with a neutral website, but cannot remove browser history or records held by your device or network.' },
      { q: 'Does a listing mean a provider is affiliated with the site?', a: 'No. Listing publicly available information does not establish an affiliation, recommendation or referral relationship.' },
      { q: 'Where can I ask a question about my own care?', a: 'Ask a qualified healthcare provider directly. The site does not collect patient questions or provide advice for individual circumstances.' }
    ],
    topics: [
      {
        id: 'medication', title: 'Medication abortion', summary: 'Questions to bring to a conversation with a healthcare provider.',
        sections: [
          { title: 'Understanding your options', body: 'Ask a qualified provider to explain the options they offer, what assessment they need and how they decide whether an option is suitable for you. A general website cannot determine your eligibility.' },
          { title: 'Practical arrangements', body: 'You can ask how consultations, prescriptions, medication access, payment and follow-up are arranged. Confirm which steps happen in person and which, if any, can happen remotely.' },
          { title: 'Instructions and support', body: 'Ask who will provide written instructions, whom to contact with concerns and how to access help outside regular hours. Follow the instructions given by your own healthcare provider; this guide does not supply dosing or treatment directions.' }
        ],
        reviewNote: 'Conversation guide only. A sourced clinical explanation is pending qualified medical review.'
      },
      {
        id: 'procedural', title: 'Procedural abortion', summary: 'Prepare questions about a clinic visit, support and follow-up.',
        sections: [
          { title: 'Before a visit', body: 'Ask the provider which assessments, documents and preparations are needed. Request the provider’s own written instructions rather than relying on a general checklist from another source.' },
          { title: 'During the appointment', body: 'You can ask the care team to explain the visit, discuss comfort and support options, and describe how consent and questions are handled. Confirm whether a support person may accompany you.' },
          { title: 'Planning the trip home', body: 'Ask about expected appointment length, transportation arrangements, follow-up and whom to contact afterward. Requirements should come directly from the provider performing your care.' }
        ],
        reviewNote: 'Conversation guide only. Procedure details require authoritative sources and qualified medical review before publication.'
      },
      {
        id: 'costs', title: 'Costs and coverage', summary: 'Clarify fees, documents and practical expenses before a visit.',
        sections: [
          { title: 'Ask for a clear explanation of costs', body: 'Ask the provider whether there are fees for the consultation, tests, medication, procedure or follow-up, and which charges, if any, you would need to pay yourself. This website cannot confirm your coverage.' },
          { title: 'Confirm documents and coverage', body: 'Ask the provider or the relevant insurer what documents are needed and how your coverage applies. If you will travel between provinces or territories, ask specifically how that affects billing.' },
          { title: 'Plan for practical expenses', body: 'Consider asking about transportation, accommodation, interpretation, childcare or time away from work. The provider may be able to tell you where to find information about local practical support; this website does not arrange assistance.' }
        ],
        reviewNote: 'Planning guide only. No coverage, reimbursement or fee amount is guaranteed.'
      },
      {
        id: 'access', title: 'Access requirements', summary: 'Check the provider’s current process directly.',
        sections: [
          { title: 'How to request care', body: 'Ask the provider how people request an appointment, whether a referral is required and what information they need through their own secure channels. Do not send personal health information to this website.' },
          { title: 'Accessibility and communication', body: 'Ask about step-free access, communication accommodations, interpretation and the languages available. A website’s language does not establish the languages offered by a provider.' },
          { title: 'Timing and availability', body: 'Check appointment availability and any service requirements directly with the provider. A directory entry or review date cannot confirm either of these for you.' }
        ],
        reviewNote: 'Planning guide only. Service requirements and availability must be confirmed with the provider.'
      },
      {
        id: 'expectations', title: 'What to expect', summary: 'Make room for the practical questions that matter to you.',
        sections: [
          { title: 'Before contacting a provider', body: 'You may find it helpful to write down your questions about the visit, confidentiality, costs, accessibility, support people and follow-up. You do not need to share that list with this website.' },
          { title: 'At the appointment', body: 'Ask the care team to explain unfamiliar terms and each proposed step. You can ask how questions are handled and how to obtain the information you need to make your own decisions.' },
          { title: 'Before leaving', body: 'Request the provider’s contact details, written instructions and an explanation of any follow-up arrangements. Ask what to do if you cannot reach the usual contact.' }
        ],
        reviewNote: 'General preparation questions, not a prediction of an individual appointment or its outcome.'
      },
      {
        id: 'aftercare', title: 'Aftercare', summary: 'Know where your care instructions and follow-up support come from.',
        sections: [
          { title: 'Use your provider’s instructions', body: 'Your care team should explain the instructions that apply to your care. Ask for a written copy and for clarification of anything you do not understand. This website does not provide recovery schedules or symptom assessments.' },
          { title: 'Questions about follow-up', body: 'Ask whether follow-up is needed, how it is arranged and whom to contact with questions. Confirm the contact process outside regular opening hours.' },
          { title: 'Urgent concerns', body: 'This website cannot assess symptoms or monitor messages. For an emergency in Canada, call 911 or go to the nearest emergency department.' }
        ],
        reviewNote: 'Support-planning guide only. Clinical aftercare information is pending qualified medical review.'
      }
    ]
  },
  fr: {
    about: {
      intro: 'De l’information claire. La liberté de prendre vos propres décisions.',
      sections: [
        { title: 'Un point de départ indépendant', body: 'AbortionClinic.ca est une ressource d’information indépendante et un répertoire public de fournisseurs pour les personnes qui cherchent de l’information sur l’avortement au Canada. Vous choisissez les renseignements à consulter et le fournisseur à contacter.' },
        { title: 'La prochaine étape vous appartient', body: 'Une fiche du répertoire est une référence, et non une recommandation ou un service d’orientation. Nous ne prenons pas de rendez-vous, ne contactons pas de fournisseurs pour les visiteurs, n’offrons pas de traitement et ne donnons pas de conseils adaptés à votre santé.' },
        { title: 'De l’information mise en contexte', body: 'Notre norme de publication consiste à indiquer la source des renseignements sur les fournisseurs et la date de leur vérification. La révision de renseignements publics ne signifie pas qu’un fournisseur les a confirmés. Aucune de ces démarches ne confirme la disponibilité actuelle de rendez-vous.' },
        { title: 'En français et en anglais', body: 'Le site propose ses pages en français et en anglais. Le sélecteur de langue ouvre la page correspondante pour vous permettre de poursuivre votre lecture dans la langue de votre choix.' }
      ]
    },
    privacy: {
      intro: 'Vous devriez pouvoir chercher de l’information sans devoir communiquer vos antécédents médicaux.',
      sections: [
        { title: 'Les renseignements demandés sur ce site', body: 'La recherche dans le répertoire demande uniquement une ville, une province ou un territoire. Il n’y a ni compte patient, ni formulaire d’admission, ni formulaire de réservation, ni questionnaire de santé. Veuillez ne pas saisir de noms, de renseignements sur une grossesse ou d’autres renseignements personnels de santé dans le champ de recherche.' },
        { title: 'Vos recherches', body: 'Le filtrage du répertoire s’effectue dans votre navigateur. Cette version n’envoie pas les termes de recherche au serveur, ne les conserve pas dans le stockage du navigateur et ne les utilise pas à des fins d’analyse. Les pages consultées peuvent toutefois figurer dans l’historique de votre navigateur.' },
        { title: 'Outils d’analyse et tiers', body: 'Cette version ne contient ni traceurs publicitaires ni outils d’analyse tiers. Les liens vers des sites externes et les liens téléphoniques utilisent des services externes dont les pratiques de confidentialité peuvent différer.' },
        { title: 'Les limites de la sortie rapide', body: 'La sortie rapide remplace la page actuelle par un site neutre. Elle ne peut pas effacer l’historique, fermer les autres onglets ni supprimer les traces conservées par votre appareil, votre réseau ou votre fournisseur Internet.' },
        { title: 'Avant le lancement public', body: 'Cette déclaration décrit la version de développement actuelle. L’hébergement, la journalisation de l’infrastructure, les pratiques de conservation et les coordonnées administratives doivent être documentés et révisés avant la publication.' }
      ]
    },
    terms: {
      intro: 'Une ressource d’information générale à consulter de façon autonome.',
      sections: [
        { title: 'De l’information, sans prestation de soins', body: 'Ce site n’établit aucune relation entre un patient et un professionnel de la santé. Ses pages ne constituent ni un diagnostic, ni un plan de traitement, ni un substitut aux conseils d’un professionnel qualifié qui connaît votre situation.' },
        { title: 'Utiliser le répertoire', body: 'Les renseignements publics peuvent changer. Avant de vous fier à une fiche, consultez le site officiel du fournisseur ou contactez-le directement pour confirmer son emplacement, ses services, ses exigences et ses disponibilités.' },
        { title: 'Sites externes', body: 'Un lien externe est fourni à titre de référence. Sa présence ne constitue ni une affiliation, ni une recommandation, ni une entente d’orientation, ni une garantie concernant les renseignements ou services du site de destination.' },
        { title: 'Version de développement', body: 'Ces conditions provisoires décrivent l’utilisation prévue du site. Les conditions complètes exigent une révision juridique avant publication.' }
      ]
    },
    contact: {
      intro: 'Corrections du site et questions administratives.',
      sections: [
        { title: 'Un canal pour les corrections', body: 'Le canal de contact administratif est en préparation. Il permettra de signaler des renseignements publics périmés, des liens brisés, des problèmes d’accessibilité et d’autres difficultés liées au site. Aucun message n’est envoyé à partir de cette page.' },
        { title: 'Les éléments utiles à une correction', body: 'Lorsque le canal sera disponible, indiquez la page ou la fiche concernée, expliquez quels renseignements publics doivent être corrigés et ajoutez une source officielle si vous en avez une. N’incluez pas de noms de patients, de renseignements sur une grossesse, de dossiers médicaux ou de renseignements sur un rendez-vous.' },
        { title: 'Questions sur vos soins', body: 'Contactez directement un professionnel de la santé pour vos questions médicales personnelles ou vos demandes de rendez-vous. AbortionClinic.ca ne reçoit pas de demandes de patients, ne contacte pas de fournisseurs en votre nom et ne coordonne pas les soins.' },
        { title: 'Aide urgente', body: 'En cas d’urgence au Canada, composez le 911 ou rendez-vous au service des urgences le plus proche. Ce site ne surveille pas les messages urgents.' }
      ]
    },
    editorial: {
      intro: 'Notre norme : rendre visibles la source et les limites de l’information.',
      sections: [
        { title: 'Renseignements publics sur les fournisseurs', body: 'Avant publication, une fiche doit indiquer une source publique officielle et la date de révision de ses renseignements. Les détails manquants sont omis plutôt que déduits. Le répertoire ne contient actuellement aucune fiche publiée.' },
        { title: 'Révision et confirmation sont distinctes', body: '« Renseignements révisés » signifie qu’une personne a vérifié la source publique indiquée. La mention « Confirmé par le fournisseur » exige une preuve de confirmation de sa part. Aucune de ces mentions ne signifie qu’un rendez-vous est disponible ou qu’un visiteur est admissible à un service particulier.' },
        { title: 'Contenu clinique', body: 'Les explications cliniques exigent des sources faisant autorité et une révision par un professionnel de la santé qualifié avant publication. Les guides actuels proposent des questions à discuter avec un fournisseur; ils ne contiennent pas de directives de traitement. Aucune révision clinique n’est revendiquée pour cette version.' },
        { title: 'Langue et accessibilité', body: 'Le contenu français et le contenu anglais doivent transmettre le même sens. Une révision en français canadien, des vérifications d’accessibilité et un processus de correction clair font partie des exigences de publication.' },
        { title: 'Mises à jour et corrections', body: 'Lorsqu’une modification factuelle est apportée à une fiche publiée ou à un article révisé, la source et la date de révision doivent être mises à jour. Un canal administratif de correction doit être disponible avant le lancement public.' }
      ]
    },
    faqs: [
      { q: 'AbortionClinic.ca est-il une clinique médicale?', a: 'Non. C’est un site d’information indépendant et un répertoire public de fournisseurs. Il n’offre ni soins médicaux, ni services d’orientation, ni prise de rendez-vous, ni coordination des soins.' },
      { q: 'Puis-je prendre rendez-vous ici?', a: 'Les rendez-vous se prennent directement auprès d’un fournisseur. Le site n’accepte pas de demandes de réservation et ne contacte pas de fournisseurs en votre nom.' },
      { q: 'Que signifie une recherche sans résultat?', a: 'Cela signifie qu’aucune fiche publiée ne correspond à votre recherche. Cela ne démontre pas que des soins sont indisponibles à cet endroit. Cette version ne contient pas encore de fiches de fournisseurs publiées.' },
      { q: 'Quels renseignements puis-je utiliser pour chercher?', a: 'Utilisez une ville, une province ou un territoire. Ne saisissez pas votre nom, vos antécédents médicaux, des détails sur une grossesse ou d’autres renseignements personnels de santé.' },
      { q: 'La sortie rapide efface-t-elle mon historique?', a: 'Non. Elle remplace cette page par un site neutre, mais ne peut pas supprimer l’historique du navigateur ni les traces conservées par votre appareil ou votre réseau.' },
      { q: 'Une fiche signifie-t-elle que le fournisseur est affilié au site?', a: 'Non. Présenter des renseignements publics n’établit aucune affiliation, recommandation ou relation d’orientation.' },
      { q: 'À qui puis-je poser une question sur mes soins?', a: 'Adressez-vous directement à un professionnel de la santé qualifié. Le site ne recueille pas de questions de patients et ne fournit pas de conseils adaptés à une situation individuelle.' }
    ],
    topics: [
      {
        id: 'medication', title: 'Avortement médicamenteux', summary: 'Des questions à poser à un professionnel de la santé.',
        sections: [
          { title: 'Comprendre vos options', body: 'Demandez à un professionnel qualifié d’expliquer les options qu’il propose, l’évaluation nécessaire et la façon de déterminer si une option vous convient. Un site général ne peut pas déterminer votre admissibilité.' },
          { title: 'L’organisation pratique', body: 'Vous pouvez demander comment se déroulent les consultations, les ordonnances, l’accès aux médicaments, le paiement et le suivi. Confirmez les étapes qui ont lieu en personne et celles qui peuvent, le cas échéant, se faire à distance.' },
          { title: 'Les consignes et le soutien', body: 'Demandez qui vous remettra les consignes écrites, qui contacter en cas de préoccupation et comment obtenir de l’aide en dehors des heures d’ouverture. Suivez les consignes de votre propre professionnel; ce guide ne donne pas de directives de dosage ou de traitement.' }
        ],
        reviewNote: 'Guide de discussion uniquement. Une explication clinique sourcée attend une révision médicale qualifiée.'
      },
      {
        id: 'procedural', title: 'Avortement procédural', summary: 'Préparez vos questions sur la visite, le soutien et le suivi.',
        sections: [
          { title: 'Avant la visite', body: 'Demandez au fournisseur quelles évaluations, quels documents et quels préparatifs sont nécessaires. Demandez ses propres consignes écrites plutôt que de vous fier à une liste générale provenant d’une autre source.' },
          { title: 'Pendant le rendez-vous', body: 'Vous pouvez demander à l’équipe d’expliquer la visite, de discuter des options de confort et de soutien et de décrire la façon dont le consentement et les questions sont abordés. Confirmez si une personne de soutien peut vous accompagner.' },
          { title: 'Planifier le retour', body: 'Renseignez-vous sur la durée prévue du rendez-vous, le transport, le suivi et la personne à contacter par la suite. Les exigences doivent provenir directement du fournisseur qui s’occupe de vos soins.' }
        ],
        reviewNote: 'Guide de discussion uniquement. Les détails cliniques exigent des sources faisant autorité et une révision médicale qualifiée avant publication.'
      },
      {
        id: 'costs', title: 'Coûts et couverture', summary: 'Clarifiez les frais, les documents et les dépenses pratiques avant une visite.',
        sections: [
          { title: 'Demander une explication claire des coûts', body: 'Demandez au fournisseur si la consultation, les examens, les médicaments, l’intervention ou le suivi comportent des frais et quels montants, le cas échéant, seraient à votre charge. Ce site ne peut pas confirmer votre couverture.' },
          { title: 'Confirmer les documents et la couverture', body: 'Demandez au fournisseur ou à l’assureur concerné quels documents sont nécessaires et comment votre couverture s’applique. Si vous vous déplacez entre des provinces ou territoires, demandez précisément les conséquences sur la facturation.' },
          { title: 'Prévoir les dépenses pratiques', body: 'Pensez à vous renseigner sur le transport, l’hébergement, l’interprétation, la garde d’enfants ou les absences au travail. Le fournisseur pourra peut-être vous indiquer où trouver de l’information sur du soutien pratique local; ce site n’organise pas cette aide.' }
        ],
        reviewNote: 'Guide de préparation uniquement. Aucune couverture, aucun remboursement ni montant de frais n’est garanti.'
      },
      {
        id: 'access', title: 'Conditions d’accès', summary: 'Vérifiez directement la démarche actuelle du fournisseur.',
        sections: [
          { title: 'Demander des soins', body: 'Demandez au fournisseur comment solliciter un rendez-vous, si une recommandation médicale est nécessaire et quels renseignements il recueille par ses propres canaux sécurisés. N’envoyez pas de renseignements personnels de santé à ce site.' },
          { title: 'Accessibilité et communication', body: 'Renseignez-vous sur l’accès sans marches, les mesures d’adaptation à la communication, l’interprétation et les langues disponibles. La langue d’un site ne confirme pas les langues offertes par un fournisseur.' },
          { title: 'Délais et disponibilités', body: 'Vérifiez les disponibilités de rendez-vous et les exigences du service directement auprès du fournisseur. Une fiche du répertoire ou une date de révision ne peut pas les confirmer pour vous.' }
        ],
        reviewNote: 'Guide de préparation uniquement. Les exigences et disponibilités doivent être confirmées auprès du fournisseur.'
      },
      {
        id: 'expectations', title: 'À quoi s’attendre', summary: 'Faites place aux questions pratiques qui comptent pour vous.',
        sections: [
          { title: 'Avant de contacter un fournisseur', body: 'Il peut être utile de noter vos questions sur la visite, la confidentialité, les coûts, l’accessibilité, les personnes de soutien et le suivi. Vous n’avez pas à communiquer cette liste à ce site.' },
          { title: 'Pendant le rendez-vous', body: 'Demandez à l’équipe de soins d’expliquer les termes inconnus et chaque étape proposée. Vous pouvez demander comment poser vos questions et obtenir les renseignements nécessaires pour prendre vos propres décisions.' },
          { title: 'Avant de partir', body: 'Demandez les coordonnées du fournisseur, les consignes écrites et une explication du suivi prévu. Demandez quoi faire si vous ne pouvez pas joindre votre contact habituel.' }
        ],
        reviewNote: 'Questions générales de préparation, sans prédiction sur un rendez-vous individuel ou son résultat.'
      },
      {
        id: 'aftercare', title: 'Soins après un avortement', summary: 'Sachez où trouver vos consignes de soins et votre soutien de suivi.',
        sections: [
          { title: 'Suivre les consignes de votre fournisseur', body: 'Votre équipe de soins devrait expliquer les consignes qui s’appliquent à vos soins. Demandez-en une copie écrite et faites clarifier ce que vous ne comprenez pas. Ce site ne propose pas de calendrier de rétablissement ni d’évaluation des symptômes.' },
          { title: 'Questions sur le suivi', body: 'Demandez si un suivi est nécessaire, comment il est organisé et qui contacter pour vos questions. Confirmez la démarche à suivre en dehors des heures d’ouverture.' },
          { title: 'Préoccupations urgentes', body: 'Ce site ne peut pas évaluer les symptômes ni surveiller les messages. En cas d’urgence au Canada, composez le 911 ou rendez-vous au service des urgences le plus proche.' }
        ],
        reviewNote: 'Guide de préparation du soutien uniquement. Le contenu clinique de suivi attend une révision médicale qualifiée.'
      }
    ]
  }
};
