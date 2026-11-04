type BilingualLabel = [string, string];

// Descriptive labels for the linked information, not purported official page titles.
const labels: Record<string, BilingualLabel> = {
  'choiceinhealth.ca': ['Choice in Health — clinic information', 'Choice in Health — renseignements sur la clinique'],
  'choiceinhealth.ca/contact': ['Choice in Health — address and contact details', 'Choice in Health — adresse et coordonnées'],
  'choiceinhealth.ca/accessibility': ['Choice in Health — accessibility information', 'Choice in Health — renseignements sur l’accessibilité'],
  'choiceinhealth.ca/bookonline': ['Choice in Health — appointment requests', 'Choice in Health — demandes de rendez-vous'],
  'choiceinhealth.ca/faq': ['Choice in Health — frequently asked questions', 'Choice in Health — questions fréquentes'],
  'choiceinhealth.ca/french': ['Choice in Health — information in French', 'Choice in Health — renseignements en français'],
  'bloorwestwomensclinic.com/contact': ['Bloor West Village — address and contact details', 'Bloor West Village — adresse et coordonnées'],
  'bloorwestwomensclinic.com/abortion-services': ['Bloor West Village — abortion services', 'Bloor West Village — services d’avortement'],
  'cabbagetownwomensclinic.com': ['Cabbagetown — clinic information', 'Cabbagetown — renseignements sur la clinique'],
  'cabbagetownwomensclinic.com/contact': ['Cabbagetown — address, contact and access details', 'Cabbagetown — adresse, coordonnées et accessibilité'],
  'cabbagetownwomensclinic.com/book-online': ['Cabbagetown — appointment requests', 'Cabbagetown — demandes de rendez-vous'],
  'cabbagetownwomensclinic.com/service-page/appointment': ['Cabbagetown — appointment information', 'Cabbagetown — renseignements sur les rendez-vous'],
  'taclinic.ca': ['Toronto Abortion Clinic — services and contact details', 'Toronto Abortion Clinic — services et coordonnées'],
  'taclinic.ca/online-booking': ['Toronto Abortion Clinic — online booking', 'Toronto Abortion Clinic — rendez-vous en ligne'],
  'oaclinic.ca': ['Ottawa Abortion Clinic — services, address and hours', 'Ottawa Abortion Clinic — services, adresse et heures'],
  'oaclinic.ca/online-booking': ['Ottawa Abortion Clinic — online booking', 'Ottawa Abortion Clinic — rendez-vous en ligne'],
  'mwclinic.com': ['Mississauga Women’s Clinic — services and contact details', 'Mississauga Women’s Clinic — services et coordonnées'],
  'mwclinic.com/appointments': ['Mississauga Women’s Clinic — appointments', 'Mississauga Women’s Clinic — rendez-vous'],
  'vichoice.ca': ['Vancouver Island Choice — clinic information', 'Vancouver Island Choice — renseignements sur la clinique'],
  'vichoice.ca/contact-us': ['Vancouver Island Choice — address and contact details', 'Vancouver Island Choice — adresse et coordonnées'],
  'kensingtonclinic.com': ['Kensington Clinic — clinic information', 'Kensington Clinic — renseignements sur la clinique'],
  'kensingtonclinic.com/appointments': ['Kensington Clinic — appointments and location', 'Kensington Clinic — rendez-vous et adresse'],
  'csfmontreal.qc.ca/en/contact-us': ['Centre de santé des femmes de Montréal — contact details', 'Centre de santé des femmes de Montréal — coordonnées'],
  'csfmontreal.qc.ca/nous-joindre': ['Centre de santé des femmes de Montréal — contact details', 'Centre de santé des femmes de Montréal — coordonnées'],
  'csfmontreal.qc.ca/en/services/abortion': ['Centre de santé des femmes de Montréal — abortion services', 'Centre de santé des femmes de Montréal — services d’avortement'],
  'csfmontreal.qc.ca/services/avortement': ['Centre de santé des femmes de Montréal — abortion services', 'Centre de santé des femmes de Montréal — services d’avortement'],
  'montrealmorgentaler.ca/en/contact': ['Morgentaler Montréal — address and contact details', 'Morgentaler Montréal — adresse et coordonnées'],
  'montrealmorgentaler.ca/contact': ['Morgentaler Montréal — address and contact details', 'Morgentaler Montréal — adresse et coordonnées'],
  'montrealmorgentaler.ca/en/free-appointment': ['Morgentaler Montréal — appointment information', 'Morgentaler Montréal — renseignements sur les rendez-vous'],
  'montrealmorgentaler.ca/rendez-vous-gratuit': ['Morgentaler Montréal — appointment information', 'Morgentaler Montréal — renseignements sur les rendez-vous'],
  'cliniquedesfemmes.com': ['Clinique des femmes de l’Outaouais — services and contact details', 'Clinique des femmes de l’Outaouais — services et coordonnées'],
  'cliniquedesfemmes.com/nous-joindre': ['Clinique des femmes de l’Outaouais — contact details', 'Clinique des femmes de l’Outaouais — coordonnées'],
  'cliniquedesfemmes.com/faq': ['Clinique des femmes de l’Outaouais — frequently asked questions', 'Clinique des femmes de l’Outaouais — questions fréquentes'],
  'womenshealthclinic.org/services/abortion/book-appointment': ['Women’s Health Clinic Winnipeg — booking an appointment', 'Women’s Health Clinic Winnipeg — prise de rendez-vous'],
  'actioncanadashr.org/access-line': ['Action Canada — Access Line support and referrals', 'Action Canada — soutien et orientation de la Ligne d’accès'],
  'actioncanadashr.org/fr/ligne-dacces': ['Action Canada — Access Line support and referrals', 'Action Canada — soutien et orientation de la Ligne d’accès'],
  'canada.ca/en/public-health/services/sexual-health/abortion-canada.html': ['Public Health Agency of Canada — abortion in Canada', 'Agence de la santé publique du Canada — avortement au Canada'],
  'canada.ca/fr/sante-publique/services/sante-sexuelle/avortement-canada.html': ['Public Health Agency of Canada — abortion in Canada', 'Agence de la santé publique du Canada — avortement au Canada'],
  'albertahealthservices.ca/info/page14011.aspx': ['Alberta Health Services — abortion services', 'Alberta Health Services — services d’avortement'],
  'nshealth.ca/clinics-programs-and-services/rose-clinic-reproductive-options-and-services': ['Nova Scotia Health — ROSE Clinic services and booking', 'Santé Nouvelle-Écosse — services et rendez-vous de la clinique ROSE'],
  'princeedwardisland.ca/en/information/health-pei/abortion-services': ['Health PEI — abortion services', 'Santé Î.-P.-É. — services d’avortement'],
  'princeedwardisland.ca/fr/information/sante-i-p-e/services-davortement': ['Health PEI — abortion services', 'Santé Î.-P.-É. — services d’avortement'],
  'vitalitenb.ca/en/services-and-locations/service-directory/abortion': ['Vitalité — abortion services and regional contact details', 'Vitalité — services d’avortement et coordonnées régionales'],
  'vitalitenb.ca/fr/services-et-emplacement/repertoire-des-services/avortement': ['Vitalité — abortion services and regional contact details', 'Vitalité — services d’avortement et coordonnées régionales'],
  'nthssa.ca/en/services/now/making-appointment': ['NTHSSA — booking a Northern Options for Women appointment', 'ASTNO — rendez-vous au programme Options nordiques pour les femmes'],
  'nthssa.ca/fr/services/programme-now/prendre-rendez-vous': ['NTHSSA — booking a Northern Options for Women appointment', 'ASTNO — rendez-vous au programme Options nordiques pour les femmes'],
  'bclaws.gov.bc.ca/civix/document/id/complete/statreg/337_95': ['British Columbia — Access to Abortion Services Regulation', 'Colombie-Britannique — règlement sur l’accès aux services d’avortement'],
};

/** Fall back to an explicitly URL-derived label rather than inventing a title. */
export function sourceLabel(value: string, fr: boolean): string {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');
    const path = url.pathname.replace(/\/+$/, '');
    const known = labels[(host + path).toLowerCase()];
    if (known) return known[fr ? 1 : 0];
    if (!path) return (fr ? 'Site de ' : 'Website: ') + host;
    const lastPart = decodeURIComponent(path.split('/').filter(Boolean).slice(-1)[0]);
    const readable = lastPart.replace(/[-_]+/g, ' ').replace(/\.(html?|aspx?|php)$/i, '');
    // Query parameters can identify different records on the same directory page.
    const record = [...url.searchParams.entries()].filter(([key]) => /^(id|nofiche|serviceatfacilityid|facilityid)$/i.test(key)).map(([key, id]) => `${key}=${id}`).join(', ');
    return `${fr ? 'Page source' : 'Source page'}: ${readable}${record ? ` (${record})` : ''} · ${host}`;
  } catch {
    return value;
  }
}
