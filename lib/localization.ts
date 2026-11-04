import type {Provider} from './providers';

export const formatDate=(value:string,fr:boolean)=>new Intl.DateTimeFormat(fr?'fr-CA':'en-CA',{dateStyle:'long',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'));
export const formatNumber=(value:number,fr:boolean)=>new Intl.NumberFormat(fr?'fr-CA':'en-CA').format(value);

// Official French resource pages. Keep original URLs
// when no equivalent has been verified; do not invent translated clinic brands.
const frenchResources:Record<string,string>={
  'https://vitalitenb.ca/en/services-and-locations/service-directory/abortion':'https://vitalitenb.ca/fr/services-et-emplacement/repertoire-des-services/avortement',
  'https://www.princeedwardisland.ca/en/information/health-pei/abortion-services':'https://www.princeedwardisland.ca/fr/information/sante-i-p-e/services-davortement',
  'https://csfmontreal.qc.ca/en/services/abortion/':'https://csfmontreal.qc.ca/services/avortement/',
  'https://csfmontreal.qc.ca/en/contact-us/':'https://csfmontreal.qc.ca/nous-joindre/',
  'https://montrealmorgentaler.ca/en/free-appointment/':'https://montrealmorgentaler.ca/rendez-vous-gratuit/',
  'https://choiceinhealth.ca/':'https://choiceinhealth.ca/french',
  'https://montrealmorgentaler.ca/en/contact/':'https://montrealmorgentaler.ca/contact/',
  'https://www.nthssa.ca/en/services/now/making-appointment':'https://www.nthssa.ca/fr/services/programme-now/prendre-rendez-vous',
  'https://www.irespectmyself.ca/en/having-sex/pregnancy/abortion':'https://www.irespectmyself.ca/fr/having-sex/pregnancy/abortion',
  'https://www150.statcan.gc.ca/n1/en/catalogue/92-162-X':'https://www150.statcan.gc.ca/n1/fr/catalogue/92-162-X',
  'https://www.actioncanadashr.org/access-line':'https://www.actioncanadashr.org/fr/ligne-dacces',
  'https://www.canada.ca/en/public-health/services/sexual-health/abortion-canada.html':'https://www.canada.ca/fr/sante-publique/services/sante-sexuelle/avortement-canada.html',
  'https://horizonnb.ca/services/clinics/family-planning-clinic-abortion-clinic/':'https://horizonnb.ca/fr/services/cliniques/clinique-de-planification-familiale-clinique-davortement/',
  'https://www.princeedwardisland.ca/en/information/health-pei/abortion-services?wbdisable=true':'https://www.princeedwardisland.ca/fr/information/sante-i-p-e/services-davortement',
  'https://www.nthssa.ca/en/services/now':'https://www.nthssa.ca/fr/contact-information/options-nordiques-pour-les-femmes-now',
};
export const localizedResource=(url:string,fr:boolean)=>fr?(frenchResources[url]||url):url;
const frenchProviderNames:Record<string,string>={
  'chaleur-family-planning':'Hôpital régional Chaleur — Clinique de planification familiale',
  'new-brunswick-abortion-intake':'Accueil centralisé pour l’avortement au Nouveau-Brunswick',
  moncton:'L’Hôpital de Moncton — Clinique de planification familiale',
  'shors-charlottetown':'Santé Î.-P.-É. — Services de santé sexuelle et reproductive et en matière d’options',
  'shors-summerside':'Santé Î.-P.-É. — Services de santé sexuelle et reproductive et en matière d’options',
  now:'Options nordiques pour les femmes (NOW)',
};
export const providerName=(provider:Provider,fr:boolean)=>fr?(frenchProviderNames[provider.id]||provider.name):provider.name;
export function providerPhone(provider:Pick<Provider,'phone'>){
  const [number,extension]=provider.phone.split(';ext=');
  const digits=number.replace(/\D/g,'');
  return 'tel:+'+(digits.length===10?'1':'')+digits+(extension?';ext='+extension:'');
}
export const serviceName=(method:string,fr:boolean)=>method==='medication'?(fr?'Avortement par médicaments':'Medication abortion'):(fr?'Avortement par intervention':'Procedural abortion');
