import {resolveRoute} from './routes';

export type Artwork = {
  file:string;
  alt:[string,string];
  width:number;
  height:number;
  credit?:{place:[string,string];author:string;source:string;license:string;licenseUrl:string};
};

export const artwork:Record<string,Artwork> = {
  welcome: {
    file: 'montreal-parc-de-la-merci',
    width: 1280,
    height: 853,
    alt: ['A cycling path curves through autumn trees in Parc de la Merci, Montréal.', 'Une piste cyclable serpente entre les arbres d’automne du parc de la Merci, à Montréal.'],
    credit: {
      place: ['Parc de la Merci, Montréal', 'Parc de la Merci, Montréal'],
      author: 'Guilhem Vellut',
      source: 'https://commons.wikimedia.org/wiki/File:Bike_path_@_Parc_de_la_Merci_@_Montr%C3%A9al_(30518910046).jpg',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    },
  },
};

// Imagery introduces the homepage only. Articles use text-led headings;
// directory and provider pages show factual panels rather than staged staff.
export function artworkForRoute(route:string):Artwork|undefined {
  const r=resolveRoute(route);
  if(!r.valid||r.key||r.provider||r.province||r.isLocationDirectory)return undefined;
  return artwork.welcome;
}
