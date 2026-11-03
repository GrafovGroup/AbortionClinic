# AbortionClinic.ca build log

## Scope decision

The user changed the request from reproducing the published website to building
AbortionClinic.ca **from the ground up**. The active implementation is an original
design with a bilingual informational-directory model. Access to the existing
website is no longer required to build the interface. No visual fidelity or
original-source recovery is claimed.

The original `CODEX_RESTORATION_MASTER_PROMPT.md` is retained unchanged as historical
context and the source of the informational-directory requirements. Its direction
to reproduce the old design has been superseded by the user's new-build request.

## Initial recovery audit — 2026-11-03

- The checkout originally contained only the master specification, at commit
  `0dcbb8bab04267680a9dead4e2f733d9c90333b1`, with a clean working tree.
- No application source, assets, manifests, tests, deployment settings or session
  history were available in the checkout.
- GitHub read access was verified. Requests for the published website returned a
  proxy CONNECT 403; no HTML, assets, backend data or URL inventory was recovered.
- The website domains were added to the cloud environment configuration draft.
  That save did not establish active runtime access or environment publication.
- A provisional 20-page bilingual foundation was committed as `75b2a85`. Its three
  Node tests and local HTTP startup passed. Those checks describe that earlier
  commit, not the expanded site below.

## Original build

- A responsive green/cream design with an original hand-built SVG landscape,
  locally served assets, mobile navigation, contextual EN/FR switching and FAQs.
- 58 content pages plus English/French 404 pages: home, directory, information,
  six topic guides per language, resources for all 13 provinces and territories,
  and administrative/policy pages. French routes use localized names.
- One validated bilingual provider data structure, geographic search and province
  filtering in browser memory, reset controls, explicit empty states and provider
  detail generation for future sourced records.
- Nonclinical conversation guides with useful provider questions. No dosing,
  treatment instructions, fabricated provider details or unsupported medical
  review claims were introduced.
- Public-facing contact guidance, privacy and editorial pages; a functional
  contact channel remains to be configured.
- Canonical and alternate-language tags, a sitemap and WebSite structured data.
  The site is not represented as a MedicalClinic. Preview indexing stays disabled.
- No patient intake, appointments, referrals, third-party analytics or external
  visual assets. Quick Exit explains its browser-history limitation.

## Validation for the expanded build

The application remains free of runtime package dependencies. Development checks
use pinned `playwright-core` and `axe-core` packages with system Chromium.

- `npm ci --no-audit --no-fund`: passed from the exact lockfile (2 development packages).
- `npm run build`: passed; 60 localized pages generated and provider data validated.
- `npm test`: all 6 tests passed, none failed or skipped. Covers every generated page, links, metadata, sitemap, geographic matching, invalid provider data and HTTP behavior.
- `npm run test:browser`: all 38 checks passed in Chromium at 1440px and 360px.
  Covers EN/FR language switches, menus, FAQs, empty search, synthetic-record matching,
  reset, load failure/retry, Quick Exit, URL/storage/network privacy and overflow.
  Axe reported zero WCAG 2 A/AA and 2.1 AA violations on sampled home, directory,
  resources, topic and privacy pages.
- Browser checks caught and verified fixes for card-label contrast and filter reset.
  Review also fixed root-path serving, provider URL escaping and type validation.
- `npm start` was restarted; the French directory and browser module returned HTTP 200.
- Clean desktop/mobile review screenshots are saved under `/workspace/scratch/`.

The dataset is empty. Validation can test filtering with synthetic test fixtures,
but it does not verify any real providers. Automated accessibility checks also do
not substitute for a complete manual accessibility review.

## Remaining publication work

1. Add real provider records and provincial/territorial resource links only after
   checking official sources, and record actual review dates.
2. Obtain qualified clinical review and authoritative citations before adding
   clinical explanations. Current guides remain nonclinical questions for providers.
3. Complete Canadian French, legal/privacy and final editorial review. Document
   production hosting, logging and retention practices.
4. Configure a general administrative/correction channel without soliciting patient
   health information. No contact address has been invented.
5. Choose the deployment host, replicate response headers, verify redirects and
   error statuses, and review canonical/indexing settings for launch.
6. Obtain explicit production approval. The existing live site, domain and
   production data have not been changed; no deployment or push has been made.

## Cloud environment configuration

Earlier onboarding saved installation/startup instructions and the custom network
domains `abortionclinic.ca` and `www.abortionclinic.ca` in a draft. The expanded
build now uses `npm ci` and system Chromium for browser testing. Updated complete
`install_script` and `start_skill` fields were saved successfully in the draft,
including the tested clean-install, build, Node tests, browser tests and startup.
Saving does not publish or apply the draft. Environment publication and restoration
into a fresh task have not been verified.
