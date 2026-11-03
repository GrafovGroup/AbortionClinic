# AbortionClinic.ca — Codex Restoration & Informational Directory Master Prompt

Repository: GrafovGroup/AbortionClinic
Existing site: https://abortionclinic.ca
Platform: OpenAI Sites
Languages: English (en-CA) and Canadian French (fr-CA)
Status: Recovery specification — do not deploy without approval.

## Mission
Restore the existing published AbortionClinic.ca website after the original local Codex desktop source was lost. Preserve its established visual identity, layout, imagery and functionality where recoverable. Change its positioning to an **independent information resource and public clinic directory only**. It is **not** a clinic, referral agency, appointment broker, care coordinator, or medical service.

## Safety and recovery workflow
1. Audit the GitHub repository, any available Codex session/history, OpenAI Sites source/export options, and the published website. Record what is recoverable and what must be reconstructed. Do not assume published client-side assets include original source or backend data.
2. Inventory all published EN/FR URLs, layouts, assets, interactive elements, metadata, links, and mobile behaviour. Preserve a record of the existing production deployment.
3. Do not delete, overwrite, disconnect domains, or publish to production. Build and test separately. Never invent provider records, contact details, services, availability, medical advice, or affiliations.
4. Implement the recovered/reconstructed source as a maintainable, version-controlled project. Document setup, build, tests, deployment, limitations, and any missing functionality in README and RESTORATION_LOG.md.
5. Commit source to this repository; never commit secrets, patient data, or credentials. Request approval before production cutover.

## Business model — mandatory
The site publishes general abortion-care education and publicly available contact details for providers in Canada. Visitors independently choose whether to use a phone number or follow an external link. AbortionClinic.ca does **not**:
- provide medical diagnosis, advice tailored to individuals, treatment, or clinical services;
- refer, match, introduce, or connect visitors with providers as a service;
- arrange, coordinate, or book appointments;
- contact providers on behalf of visitors;
- collect patient inquiries, pregnancy details, medical histories, or intake forms;
- promise verification, availability, or affiliation without substantiation.

Remove all language including “Get Connected”, “we connect you”, “we refer you”, “we help book”, and similar claims throughout EN/FR copy, headers, footers, CTAs, SEO metadata, forms and structured data.

## Navigation — replace GET CONNECTED with CLINICS
English main menu: HOME | CLINICS | ABORTION INFORMATION | RESOURCES | EN / FR
French main menu: ACCUEIL | CLINIQUES | INFORMATION SUR L’AVORTEMENT | RESSOURCES | FR / EN
CLINICS and CLINIQUES link to the bilingual public provider directory. Keep navigation consistent across all pages and screen sizes. Place About, Contact (site corrections/general administrative inquiries only), Privacy, Terms, Editorial Policy and Disclaimer in footer.

## Homepage copy
EN headline: “Find information about abortion care in Canada.”
EN subheading: “Explore abortion-care information and browse publicly available contact details for clinics and healthcare providers across Canada.”
EN CTA: “BROWSE CLINICS”
FR headline: “Trouvez de l’information sur les services d’avortement au Canada.”
FR subheading: “Consultez de l’information sur l’avortement et les coordonnées publiques de cliniques et de professionnels de la santé au Canada.”
FR CTA: “CONSULTER LES CLINIQUES”
Search: city, province or territory only. Do not ask about pregnancy, gestational age, identity or treatment preferences.

## Clinic directory
Publicly sourced, factual fields where confirmed: clinic/provider name, address or service region, phone, official website, services, public appointment instructions, languages, source, last-reviewed date, provider-confirmed status if actually confirmed. Clearly distinguish “information reviewed” from “provider-confirmed”. Never fabricate records or show fake verification badges.
Actions: VIEW DETAILS, VIEW WEBSITE (external link), CALL CLINIC (direct tel: link). These are visitor-initiated links only; no referrals, lead forwarding, contact mediation, booking widgets, or tracking of sensitive individual journeys. Provide correction/report-outdated-information mechanism that does not solicit patient health data.

## Educational content
Retain and improve sourced, reviewed pages on medication abortion, procedural abortion, costs/coverage, access requirements, what to expect, aftercare, provincial/territorial resources, and FAQs. Show sources, editorial review dates, and a clear medical-content review process. Obtain qualified review before publishing clinical claims. Provide emergency guidance directing visitors to appropriate local emergency services without pretending to triage.

## Disclosures
EN: “AbortionClinic.ca is an independent informational website, not a medical clinic or healthcare provider. We do not provide medical advice, treatment, referrals, appointment booking, or patient coordination. Provider information is supplied for general reference; visitors contact providers independently.”
FR: “AbortionClinic.ca est un site d’information indépendant, et non une clinique ni un fournisseur de soins de santé. Nous n’offrons ni conseils médicaux, ni traitements, ni services d’orientation, ni prise de rendez-vous, ni coordination des soins. Les renseignements sur les fournisseurs sont présentés à titre indicatif; les visiteurs les contactent directement.”
Review both versions with Canadian healthcare/privacy counsel and a qualified Canadian French reviewer before publication.

## Privacy, accessibility and technical requirements
Do not collect or store sensitive patient information. Use privacy-conscious analytics, avoid invasive third-party trackers and healthcare-search profiling; retain a functional Quick Exit control while explaining its limitations (it cannot erase browser history). Responsive, accessible WCAG-oriented design, keyboard navigation, readable contrast and fast mobile performance. One structured provider database with EN/FR localized fields, contextual language switch, localized routes, en-CA/fr-CA hreflang, canonical tags, XML sitemaps and accurate structured data. Do not represent the directory itself as a MedicalClinic in schema.

## Verification and acceptance
- All navigation uses CLINICS / CLINIQUES, never GET CONNECTED.
- No referral, coordination, patient intake or appointment-booking features remain.
- All public provider details are sourced and dated.
- EN/FR pages, links, menus, search, mobile, accessibility and SEO are tested.
- Original production remains untouched until reviewed and approved.
- Report any unrecoverable assets or backend functions explicitly rather than silently substituting them.

Start by producing a recovery audit and implementation plan; then reconstruct in a separate development environment. Do not deploy to the existing live domain without explicit approval.
