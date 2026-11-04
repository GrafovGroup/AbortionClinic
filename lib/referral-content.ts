export const referralStatuses = ['new', 'contacted', 'connected', 'closed'] as const;
export type ReferralStatus = typeof referralStatuses[number];
export const statusLabels: Record<ReferralStatus, [string, string]> = {
  new: ['New', 'Nouvelle'], contacted: ['Contacted', 'Contactée'],
  connected: ['Connected', 'Mise en relation'], closed: ['Closed', 'Fermée'],
};
export const consentVersion = '2026-09-11-formspree-alerts';
export const contactConsent = [
  'I agree that AbortionClinic.ca may store this request, notify its team through Formspree using only a request reference, and contact me using my chosen method to help arrange a connection. I have read the privacy information.',
  'J’accepte qu’AbortionClinic.ca conserve cette demande, avise son équipe par Formspree avec uniquement une référence de demande et me contacte selon le moyen choisi pour faciliter la mise en relation. J’ai lu les renseignements sur la confidentialité.',
] as const;
export const sharingConsent = [
  'Optional: I also allow AbortionClinic.ca to share my name, contact details and preferences with the clinic selected above for this connection.',
  'Facultatif : j’autorise aussi AbortionClinic.ca à transmettre mon nom et mes coordonnées et préférences de contact à la clinique sélectionnée ci-dessus pour cette mise en relation.',
] as const;
export function referralPath(fr: boolean, providerId = '', sourcePath = '') {
  const context = new URLSearchParams();
  if (providerId) context.set('clinic', providerId);
  if (sourcePath) context.set('from', sourcePath);
  return (fr ? '/fr/demander-une-mise-en-relation/' : '/request-connection/') + (context.size ? '#' + context.toString() : '');
}
export function referralReference(id: string) { return 'AC-' + id.replaceAll('-', '').slice(0, 12).toUpperCase(); }
