import {resolveRoute} from './routes';

export type Artwork = {file:string;alt:[string,string];position?:string;frame?:'arch'|'rounded'|'cut';healthcare?:boolean};
export const artwork:Record<string,Artwork> = {
  "welcome": {
    "file": "healthcare-welcome",
    "alt": [
      "Illustration of a woman speaking with a healthcare professional during a private consultation",
      "Illustration d’une femme discutant avec une professionnelle de la santé lors d’une consultation privée"
    ],
    "healthcare": true
  },
  "findCare": {
    "file": "finding-care",
    "alt": [
      "Illustration of a woman being welcomed at a healthcare reception desk",
      "Illustration d’une femme accueillie à la réception d’un établissement de santé"
    ],
    "healthcare": true
  },
  "medication": {
    "file": "medication-guidance",
    "alt": [
      "Illustration of a pharmacist discussing prescribed medication with a woman",
      "Illustration d’une pharmacienne discutant de médicaments prescrits avec une femme"
    ],
    "healthcare": true
  },
  "procedural": {
    "file": "in-clinic-consultation",
    "alt": [
      "Illustration of a nurse introducing a woman to a private clinic room",
      "Illustration d’une infirmière présentant une salle de consultation privée à une femme"
    ],
    "healthcare": true
  },
  "cost": {
    "file": "care-cost-support",
    "alt": [
      "Illustration of a woman reviewing healthcare coverage information with a navigator",
      "Illustration d’une femme examinant des renseignements sur la couverture des soins avec une intervenante"
    ],
    "healthcare": true
  },
  "preparation": {
    "file": "preparing-for-visit",
    "alt": [
      "Illustration of a woman preparing questions for a healthcare appointment with a nurse",
      "Illustration d’une femme préparant ses questions pour un rendez-vous avec une infirmière"
    ],
    "healthcare": true
  },
  "questions": {
    "file": "questions-and-answers",
    "alt": [
      "Illustration of a woman asking a healthcare professional a question",
      "Illustration d’une femme posant une question à une professionnelle de la santé"
    ],
    "healthcare": true
  },
  "about": {
    "file": "independent-care-navigation",
    "alt": [
      "Illustration of women working together on community healthcare information",
      "Illustration de femmes travaillant ensemble sur de l’information communautaire en santé"
    ],
    "healthcare": true
  },
  "editorial": {
    "file": "medical-editorial-review",
    "alt": [
      "Illustration of a health-information editor checking an article against a reference book",
      "Illustration d’une rédactrice en santé vérifiant un article à l’aide d’un ouvrage de référence"
    ],
    "healthcare": true
  },
  "verification": {
    "file": "provider-information-check",
    "alt": [
      "Illustration of healthcare professionals reviewing clinic information together",
      "Illustration de professionnelles de la santé vérifiant ensemble des renseignements sur une clinique"
    ],
    "healthcare": true
  },
  "privacy": {
    "file": "discreet-contact",
    "alt": [
      "Illustration of a woman taking a private phone call in a quiet room at home",
      "Illustration d’une femme prenant un appel privé dans une pièce calme à la maison"
    ],
    "healthcare": true
  },
  "terms": {
    "file": "informed-service-choice",
    "alt": [
      "Illustration of a woman reading healthcare service information before choosing her next step",
      "Illustration d’une femme lisant de l’information sur les services de santé avant de choisir sa prochaine étape"
    ],
    "healthcare": true
  },
  "contact": {
    "file": "contact-care-navigator",
    "alt": [
      "Illustration of a care navigator answering a call in a private workspace",
      "Illustration d’une intervenante répondant à un appel dans un espace de travail privé"
    ],
    "healthcare": true
  },
  "resources": {
    "file": "options-and-support",
    "alt": [
      "Illustration of a counsellor discussing healthcare resources and options with a woman",
      "Illustration d’une intervenante discutant des ressources et des options de soins avec une femme"
    ],
    "healthcare": true
  },
  "providers": {
    "file": "provider-collaboration",
    "alt": [
      "Illustration of two healthcare professionals collaborating in a clinic",
      "Illustration de deux professionnelles de la santé collaborant dans une clinique"
    ],
    "healthcare": true
  },
  "homeRest": {
    "file": "recovery-at-home",
    "alt": [
      "Illustration of a woman resting at home with a blanket and a heat pack",
      "Illustration d’une femme se reposant à la maison avec une couverture et une compresse chaude"
    ],
    "healthcare": true
  },
  "homeSteps": {
    "file": "prepared-clinic-room",
    "alt": [
      "Illustration of a nurse preparing fresh linens in a clinic room",
      "Illustration d’une infirmière préparant du linge propre dans une salle de clinique"
    ],
    "healthcare": true
  },
  "homeOptions": {
    "file": "telehealth-options",
    "alt": [
      "Illustration of a woman consulting a healthcare professional by video from home",
      "Illustration d’une femme consultant une professionnelle de la santé par vidéo depuis chez elle"
    ],
    "healthcare": true
  }
};

const topicArt:Record<string,string>={
  'find-care':'findCare','medication-abortion':'medication','procedural-abortion':'procedural',
  cost:'cost','what-to-expect':'preparation',faq:'questions',about:'about',
  'editorial-policy':'editorial','provider-review-policy':'verification',privacy:'privacy',
  terms:'terms',contact:'contact',resources:'resources','for-providers':'providers',
};

// Each page and home pathway has its own original healthcare scene.
// Translation counterparts share artwork with localized descriptions.
// Location and provider templates retain their factual service panels.
export function artworkForRoute(route:string):Artwork|undefined {
  const r=resolveRoute(route);
  if(!r.valid||r.provider||r.province||r.isLocationDirectory)return undefined;
  if(!r.key)return artwork.welcome;
  return artwork[topicArt[r.key]];
}
