type BilingualText = [string, string];

/** Each practical detail must retain the public page that supports it. */
export type PracticalDetail = {text: BilingualText; source: string};
export type ProviderPracticalDetails = {
  checked: string;
  address?: PracticalDetail;
  referral?: PracticalDetail;
  accessibility?: PracticalDetail;
};

export const providerPracticalDetails: Record<string, ProviderPracticalDetails> = {
  'choice-in-health': {
    checked: '2026-11-03',
    address: {text: ['1678 Bloor Street West, Suite 301, Toronto, ON M6P 1A9.', '1678, rue Bloor Ouest, bureau 301, Toronto (ON) M6P 1A9.'], source: 'https://choiceinhealth.ca/contact'},
    accessibility: {text: ['The clinic lists an elevator, but notes limitations with door-opening buttons and washroom accessibility. Discuss your access needs before visiting.', 'La clinique indique qu’un ascenseur est disponible, mais signale des limites concernant les boutons d’ouverture des portes et l’accessibilité des toilettes. Discutez de vos besoins avant la visite.'], source: 'https://choiceinhealth.ca/accessibility/'},
  },
  'bloor-west-village-womens-clinic': {
    checked: '2026-11-03',
    address: {text: ['2425 Bloor Street West, Suite 403, Toronto, ON M6S 4W4.', '2425, rue Bloor Ouest, bureau 403, Toronto (ON) M6S 4W4.'], source: 'https://www.bloorwestwomensclinic.com/contact/'},
  },
  'cabbagetown-womens-clinic': {
    checked: '2026-11-03',
    address: {text: ['1624 Queen Street East, Toronto, ON M4L 1G3. The clinic is in Leslieville.', '1624, rue Queen Est, Toronto (ON) M4L 1G3. La clinique se trouve à Leslieville.'], source: 'https://www.cabbagetownwomensclinic.com/contact'},
    accessibility: {text: ['The clinic states that its premises are wheelchair accessible. Call to discuss any specific access needs.', 'La clinique indique que ses locaux sont accessibles en fauteuil roulant. Appelez pour discuter de vos besoins particuliers.'], source: 'https://www.cabbagetownwomensclinic.com/contact'},
  },
  'mississauga-womens-clinic': {
    checked: '2026-11-03',
    address: {text: ['101 Queensway West, Unit 401, Mississauga, ON L5B 2P7.', '101, Queensway Ouest, bureau 401, Mississauga (ON) L5B 2P7.'], source: 'https://mwclinic.com/'},
  },
  'ottawa-abortion-clinic': {
    checked: '2026-11-03',
    address: {text: ['65 Bank Street, 3rd floor, Ottawa, ON K1P 5N2.', '65, rue Bank, 3e étage, Ottawa (ON) K1P 5N2.'], source: 'https://oaclinic.ca/'},
  },
  'vi-choice': {
    checked: '2026-11-03',
    address: {text: ['104–284 Helmcken Road, V9B 1T2. The clinic uses Victoria in its postal address.', '104–284, chemin Helmcken, V9B 1T2. La clinique utilise Victoria dans son adresse postale.'], source: 'https://www.vichoice.ca/contact-us'},
  },
  kensington: {
    checked: '2026-11-03',
    address: {text: ['2431–5th Avenue NW, Calgary, AB T2N 0T3.', '2431, 5e Avenue Nord-Ouest, Calgary (AB) T2N 0T3.'], source: 'https://kensingtonclinic.com/appointments/'},
  },
  'centre-sante-femmes-montreal': {
    checked: '2026-11-03',
    address: {text: ['4689 avenue Papineau, Suite 300, Montréal, QC H2H 1V4.', '4689, avenue Papineau, bureau 300, Montréal (QC) H2H 1V4.'], source: 'https://csfmontreal.qc.ca/en/contact-us/'},
  },
  'morgentaler-montreal': {
    checked: '2026-11-03',
    address: {text: ['8560 rue Saint-Hubert, Suite 310, Montréal, QC H2P 1Z7.', '8560, rue Saint-Hubert, bureau 310, Montréal (QC) H2P 1Z7.'], source: 'https://montrealmorgentaler.ca/en/contact/'},
  },
  outaouais: {
    checked: '2026-11-03',
    address: {text: ['920 boulevard Saint-Joseph, Suite 105B, Gatineau, QC J8Z 1S9.', '920, boulevard Saint-Joseph, bureau 105B, Gatineau (QC) J8Z 1S9.'], source: 'https://www.cliniquedesfemmes.com/'},
  },
};

export function practicalSources(providerId: string): string[] {
  const details = providerPracticalDetails[providerId];
  return details ? [...new Set([details.address, details.referral, details.accessibility].flatMap(field => field ? [field.source] : []))] : [];
}
