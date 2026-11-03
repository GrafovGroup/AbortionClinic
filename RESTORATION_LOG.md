# AbortionClinic.ca recovery and build log

## Current scope

The active build preserves the existing site's blue visual identity and exact
public URLs, using the live site as evidence now that network access works. The
independent-information and public-directory requirements remain in force. No
patient intake, referral service or appointment coordination is being restored.

The original specification remains unchanged. The earlier green/cream original
build was an interim implementation produced while production access was blocked;
it is no longer the visual target.

## Initial audit and interim implementation

- The checkout originally contained only `CODEX_RESTORATION_MASTER_PROMPT.md` at
  commit `0dcbb8bab04267680a9dead4e2f733d9c90333b1`, with no application source,
  assets, manifests, tests, deployment settings or session history.
- GitHub access worked, but production requests initially returned proxy CONNECT
  403. Website domains were added to the environment draft; access began working
  after the user applied the network configuration.
- A provisional 20-page foundation was committed as `75b2a85`. The subsequent
  original design generated 60 localized pages. Its earlier passing tests apply
  to that implementation and do not establish the restored build's result below.

## Live capture — 2026-11-03

- Fetched robots.txt, sitemap.xml and 110 public HTML pages with bounded concurrency.
  All page requests returned HTTP 200. The sitemap contains 102 URLs; eight more
  pages were discovered through public links. No API/admin endpoint was requested,
  and no form was submitted.
- The original eight nonsitemap pages have `noindex, follow`: EN/FR directory,
  locations, for-providers and connection-request pages.
- Recorded canonical URLs, EN/FR/x-default alternates, page titles/descriptions,
  social metadata and public Google/Bing site-verification values.
- Preserved raw responses in `/workspace/scratch/live-site/`. Durable repository
  records are `data/live-inventory.json`, `data/live-pages.json`,
  `data/recovered-providers.json` and `data/live-assets.json`.
- Asset capture includes the published stylesheet and 42 logo, icon and image
  files. The asset manifest records source URLs, sizes and SHA-256 hashes; stored
  files matched the captured hashes when the manifest was copied.
- Scripts were removed from repository main-content snapshots. The two legacy
  patient connection routes retain metadata only there. Snapshots are reference
  material and can contain superseded service language; rendered content must be
  sanitized and edited before use.

## Restored implementation

- Restored the published blue theme, original logo and photography, with responsive
  adjustments for the rebuilt static interface.
- Generates 118 pages and 52 compatibility 301 redirects. All 102 production
  sitemap URLs are preserved. Of 110 observed live routes, 108 retain their page
  addresses; the two legacy connection-request routes redirect to the directory.
- English uses root paths and French uses the original translated `/fr/` paths.
  Earlier development routes redirect to the restored canonical addresses.
- Rebuilt bilingual directory and regional searches use browser memory, with
  direct provider website/telephone links and contextual language switching.
- Recovered 25 bilingual provider records. Every upstream review date is
  **2026-09-10**; recovery on **2026-11-03** is recorded separately. No independent
  provider-source review or provider confirmation is claimed. Six records have
  explicit street addresses; others keep null addresses and show their city/region.
- Restored educational content retains original citations and dates with a recovery
  review notice. Additional guides provide questions to discuss with providers.
- Rebuilt navigation uses Clinics / Cliniques. Original connection forms and
  integrations are excluded. Contact/correction guidance has no configured channel.
- Preserved or rebuilt canonical, hreflang, social and public verification metadata,
  sitemap coverage and appropriate WebSite structured data. The directory is not
  represented as a MedicalClinic. Preview indexing remains disabled.

## Validation status for this restored build

Final validation passed against the restored build and original asset paths.

- Live-capture checks passed for route uniqueness, HTTP statuses, canonical/language
  metadata, provider count/contact extraction, script removal and intake exclusions.
- The original stylesheet and asset hashes matched their captured manifest values.
- `npm run build` produces the expected route and redirect counts and rejects
  missing original sitemap URLs.
- `npm test`: 6 tests passed, none failed or skipped. All 102 sitemap URLs retain
  canonical/language pairs; 108 original pages return 200 and 2 retired connection
  routes redirect to the directory. All 52 compatibility redirects were checked.
- `npm run test:browser`: 46 checks passed on EN/FR desktop and mobile. Includes
  private homepage search, directory search/filter/reset, real provider detail
  navigation, failure/retry, Quick Exit, image loading, overflow and sampled axe
  WCAG A/AA checks with no reported violations. No fresh provider or clinical
  verification is implied by functional checks.
- Published `/images/`, `/brand/` and favicon URLs remain available. Clean review
  screenshots: `/workspace/scratch/abortionclinic-restored-desktop.png` and
  `/workspace/scratch/abortionclinic-restored-mobile.png`.
- Rendered-content review caught and verified fixes for residual clinic-connection
  wording, the absent virtual-care filter, malformed French metadata, old empty
  directory statements and contact metadata. Original source snapshots are retained
  unchanged for audit; rebuilt pages apply the informational-only positioning.

Automated accessibility checks do not replace a complete manual review. Functional
checks and recovered citations do not establish current clinical correctness or
provider contact accuracy.

## Remaining launch work

1. Recheck each provider's official source and contact details; record genuine new
   review dates separately from the captured upstream dates.
2. Obtain qualified medical review of recovered clinical content and its citations,
   plus Canadian French, legal/privacy and final editorial review.
3. Configure an administrative correction channel without collecting patient health
   information. Document production hosting, logging and retention practices.
4. Choose the static host, apply the generated 301 rules and response headers, and
   verify canonical URLs, missing-page statuses and indexing controls for launch.
5. Obtain explicit production approval. The live site, domain and production data
   have not been changed; no production deployment has been made. Source commits
   are published separately to the GitHub repository.

## Cloud environment

Earlier onboarding saved install/start instructions and the required website
domains. This build additionally uses `parse5` from the exact npm lockfile. Browser
checks use system Chromium, `playwright-core` and `axe-core`. Reusable setup must
run `npm ci`, build and the required checks; live processes must restart in a new
task. Draft saves, active runtime changes, publication and fresh-task restoration
are distinct outcomes and must be reported separately when verified.

Updated canonical-route startup instructions were saved in the cloud environment
draft. Saving those notes does not publish a new environment snapshot.
