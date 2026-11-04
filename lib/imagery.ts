import {resolveRoute} from './routes';

export type Artwork = {
  file:string;
  alt:[string,string];
  width:number;
  height:number;
};

export const artwork:Record<string,Artwork> = {
  welcome: {
    file: 'care-consultation-v2', width: 1280, height: 853,
    alt: ['Illustrative care scene: a woman talks with a nurse in a private consultation room.', 'Scène de soins illustrative : une femme discute avec une infirmière dans une salle de consultation privée.'],
  },
  medication: {
    file: 'care-medication-v2', width: 1280, height: 853,
    alt: ['Illustrative care scene: a woman discusses medication with a pharmacist.', 'Scène de soins illustrative : une femme discute de médicaments avec une pharmacienne.'],
  },
  procedural: {
    file: 'care-in-clinic-v2', width: 1280, height: 853,
    alt: ['Illustrative care scene: a nurse prepares an examination room.', 'Scène de soins illustrative : une infirmière prépare une salle d’examen.'],
  },
  preparation: {
    file: 'care-preparation-v2', width: 1280, height: 853,
    alt: ['Illustrative scene: a woman makes a phone call with her appointment questions in a notebook.', 'Scène illustrative : une femme téléphone avec ses questions pour un rendez-vous notées dans un carnet.'],
  },
};

const topicArt:Record<string,string> = {
  'medication-abortion': 'medication',
  'procedural-abortion': 'procedural',
  'what-to-expect': 'preparation',
};

// Care imagery supports the homepage and the matching educational guides.
// Provider records and editorial policies do not imply photographed staff or facilities.
export function artworkForRoute(route:string):Artwork|undefined {
  const r=resolveRoute(route);
  if(!r.valid||r.provider||r.province||r.isLocationDirectory)return undefined;
  return !r.key ? artwork.welcome : artwork[topicArt[r.key]];
}
