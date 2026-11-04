import {westProviders, westBooking, westProviderUpdates} from './regions/west';
import {prairiesProviders, prairiesBooking, prairiesProviderUpdates} from './regions/prairies';
import {ontarioProviders, ontarioBooking, ontarioProviderUpdates} from './regions/ontario';
import {quebecProviders, quebecBooking, quebecProviderUpdates} from './regions/quebec';
import {atlanticProviders, atlanticBooking, atlanticProviderUpdates} from './regions/atlantic';
import additional from './additional-providers.json';
import {montrealProviders, montrealBooking} from './montreal-contacts';
import {torontoProviders, torontoBooking} from './toronto-contacts';

type BilingualText = [string, string];
export type BookingInfo = {
  hours?: BilingualText;
  access?: BilingualText;
  languages?: BilingualText;
  bookingUrl?: string;
};
export const bookingByProvider: Record<string, BookingInfo> = {...montrealBooking, ...torontoBooking, ...westBooking, ...prairiesBooking, ...ontarioBooking, ...quebecBooking, ...atlanticBooking};
export type Provider = {
  id: string;
  kind?: 'clinic' | 'regional-booking';
  name: string;
  city: string;
  province: string;
  phone: string;
  phoneLabel?: BilingualText;
  alternatePhone?: {number: string; label: BilingualText};
  url: string;
  resourceLabel?: BilingualText;
  services: string[];
  virtual?: boolean;
  description: BilingualText;
  sources: string[];
  reviewed: string;
  confirmed: false;
};

export function providerResourceLabel(provider: Provider, fr: boolean) {
  return provider.resourceLabel?.[fr ? 1 : 0] ?? (fr ? 'Information sur le service' : 'Service information');
}

const originalProviders:Provider[]=[...additional as Provider[], ...torontoProviders, ...montrealProviders,
{id:'ottawa-abortion-clinic',name:'Ottawa Abortion Clinic',city:'Ottawa',province:'ON',phone:'613-567-8300',url:'https://oaclinic.ca/',services:['medication','procedural'],description:['Medication and procedural abortion care in Ottawa. Contact the clinic directly to discuss appointments.','Services d’avortement par médicaments et par intervention à Ottawa. Communiquez directement avec la clinique pour les rendez-vous.'],sources:['https://oaclinic.ca/online-booking'],reviewed:'2026-09-10',confirmed:false},
{id:'hamilton-health-sciences',name:'Hamilton Health Sciences',city:'Hamilton',province:'ON',phone:'905-389-5068',url:'https://www.hamiltonhealthsciences.ca/areas-of-care/womens-and-newborn-care/womens-health-clinics/pregnancy-loss-and-termination-clinic/',services:['procedural'],description:['The Pregnancy Loss & Termination Clinic offers procedural abortion. Its public page states that medication abortion is not offered at this clinic.','La clinique de perte de grossesse et d’interruption de grossesse offre l’avortement par intervention. Sa page publique indique qu’elle n’offre pas l’avortement par médicaments.'],sources:['https://www.hamiltonhealthsciences.ca/areas-of-care/womens-and-newborn-care/womens-health-clinics/pregnancy-loss-and-termination-clinic/'],reviewed:'2026-09-10',confirmed:false},
{id:'shore-centre',name:'SHORE Centre',city:'Waterloo',province:'ON',phone:'519-743-9360',url:'https://clinic.shorecentre.ca/abortion/',services:['medication'],virtual:true,description:['Medication abortion with virtual appointments. The main clinic is in Waterloo; confirm location and eligibility when contacting SHORE.','Avortement par médicaments avec rendez-vous virtuels. La clinique principale est à Waterloo; confirmez le lieu et les critères d’admissibilité avec SHORE.'],sources:['https://clinic.shorecentre.ca/abortion/','https://www.shorecentre.ca/'],reviewed:'2026-09-10',confirmed:false}
];

const providerUpdates:Record<string,Partial<Provider>> = {...westProviderUpdates,...prairiesProviderUpdates,...ontarioProviderUpdates,...quebecProviderUpdates,...atlanticProviderUpdates};
export const providers:Provider[] = [...originalProviders.map(provider => ({...provider,...providerUpdates[provider.id]})), ...westProviders,...prairiesProviders,...ontarioProviders,...quebecProviders,...atlanticProviders];
