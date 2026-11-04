# AbortionClinic.ca

Independent Canadian information directory in English and French. Visitors use published phone numbers and official websites to contact clinics themselves. This website does not provide care, book appointments, make referrals or connect care-seekers with providers. It does not claim clinic affiliations, independent clinical review, direct provider confirmation or live appointment availability.

## Current release and hosting

The public site is **https://abortionclinic.ca/**. The directory and maintenance features were released in Sites version **12**, published November 3, 2026 (Toronto time), from source commit `028f8419b6b03a1ef2d62f7487cdf798bf7bd252`. This source also includes the subsequent editorial visual refresh: real Canadian place photography on the homepage, text-led guides and policy pages, simpler borders and factual directory panels. Sites version history records the current deployment and its exact source commit.

- 73 provider-location records, shared across both languages.
- 97 city guides (194 bilingual guide pages), covering 454 distinct core and surrounding communities.
- All 41 Statistics Canada 2021 census metropolitan areas have core-city guide coverage; guides also cover all 13 provincial and territorial capitals.
- 416 active public routes, of which 412 are indexable. These are route counts across both languages, not a count of clinics or Google-indexed pages.
- Six practical bilingual guides cover booking, uninsured access, travel, virtual care, accessibility and checking providers. Public source notes, update history, visitor error reporting and a printable sharing card are included.
- The community lookup contains 5,054 municipality/equivalent names. It provides navigation context and does not establish local clinic coverage.

The application uses Vinext/React on Cloudflare Workers with a D1 database, managed through OpenAI Sites. Reuse the exact project identity and bindings in `.openai/hosting.json`. Do not create another Site, change DNS, change the current public audience or replace the registered canonical domain during routine updates.

The GitHub source copy is a restoration and maintenance copy; pushing to GitHub does not itself publish a Sites version. The earlier static/WHC recovery source is preserved in GitHub history and the branch `archive/pre-sites-source-2026-11-03`. It is historical, not the current deployed application.

## Install, run and build

Requirements are Node.js **22.13 or newer** and **pnpm 11.19.0**, as declared in `package.json`. Use the committed `pnpm-lock.yaml`.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

A clean clone defaults to the portable execution profile and starts development on port 5173. `scripts/execution-profile.mjs` reads an optional ignored `.sites-runtime/execution-profile.json`; this machine-specific file is not required in Git. In a managed Sites environment, use the current Sites setup and build workflow to select its execution profile. Keep the Sites Vite plugin, build integration and scripts.

```bash
pnpm exec tsc --noEmit --incremental false
pnpm build
```

`pnpm build` produces the Worker and browser assets under ignored `dist/`. In managed Sites work, the Sites build helper is the preferred build entrypoint. `pnpm start` runs the built Worker locally using the generated `dist/server/wrangler.json` and ignored `.wrangler/state`.

Do not use the legacy npm-specific `scripts/install-ci.sh` directly: the project uses pnpm and has no npm lockfile. `pnpm install:ci` uses the current frozen pnpm install command.

## Source map

| Area | Files |
| --- | --- |
| Pages, public forms and private staff queues | `app/` |
| Provider records and booking details | `lib/providers.ts`, `lib/additional-providers.json`, `lib/toronto-contacts.ts`, `lib/montreal-contacts.ts`, `lib/regions/` |
| Sourced addresses and accessibility notes | `lib/provider-practical-details.ts` |
| City guides and regional alternatives | `lib/city-guides.ts`, `lib/city-guide-types.ts`, `lib/locations.ts`, `lib/regional-alternatives.ts` |
| Bilingual articles and public policies | `lib/content.ts`, `lib/access-articles.ts`, `lib/resource-articles.ts` |
| Routes, indexing and structured data | `lib/routes.ts`, `lib/seo.ts`, `app/robots.txt/route.ts`, `app/sitemap.xml/route.ts`, `DISCOVERABILITY.md` |
| Geographic data and attribution | `lib/data/canada-locations.json`, `lib/data/location-source.json` |
| Locally hosted branding and images | `public/brand/`, `public/images/`, `IMAGE-CREDITS.md`, favicon files in `public/` |
| Database schema and migrations | `db/`, `drizzle/`; self-initializing report tables also described below |
| Regression checks | `scripts/check-*.mjs` |
| Site identity and package configuration | `.openai/hosting.json`, `package.json`, `pnpm-lock.yaml`, `vite.config.ts` |

## Editorial maintenance

Provider IDs are stable and represent locations. An organization with separate clinical locations can have separate records. English and French profiles derive from the same record IDs.

1. Check the current official service website, health-authority listing or established care-access resource. Record the exact evidence URL and actual access date.
2. Verify the organization, location, care telephone and website. Do not use a fax number, administrative switchboard or another clinic's contact as an appointment line. Extensions use `;ext=`.
3. Add only documented service tags. `virtual: true` requires published evidence of virtual abortion appointments and does not imply Canada-wide eligibility. Do not infer clinical limits, languages, accessibility, referral requirements or appointment availability.
4. Maintain English and Canadian French together. Preserve official names unless an official French name is verified. Missing local listings do not mean care is unavailable.
5. Keep public-source checking distinct from direct organization confirmation and independent clinical review. Current records do not claim direct confirmation. Do not add reviewer credentials, ownership facts, endorsements or confirmations without evidence and authorization.
6. Review changes, run relevant checks, then publish through Sites. Staff queue actions do not automatically edit or publish the public dataset.

`lib/provider-practical-details.ts` requires source URLs for every address or access detail. Ten addresses and two accessibility notes were added in the current release. `lib/access-articles.ts` contains source-specific notes for the six practical guides. Dates reflect Toronto time; a link returning HTTP 200 does not refresh a content-review date.

Geographic data comes from Statistics Canada's 2025 census-subdivision edition, with names and boundaries referenced to January 1, 2025. Its retrieval details, mapping and licence are retained in `lib/data/location-source.json`. Refresh intentionally using `node scripts/import-locations.mjs`, then inspect the diff and validate routes. Neighbourhoods, former municipal names and later boundary changes are not guaranteed.

Search disambiguates same-name municipalities by province and uses explicit local/regional/virtual-service relationships. Never add nearest-clinic claims, guessed travel times or fabricated local clinics. Nunavut guidance distinguishes Kitikmeot access from other regions; NOW is not presented as serving every Nunavut community.

## Private access and operational records

Sites dispatch supplies authenticated identity. Every protected read and write checks server-side `ADMIN_EMAILS` or `ADMIN_USER_IDS`; empty allowlists deny access. `.env.example` contains only empty configuration names. Configure production allowlists through Sites using authorized identities, never browser-submitted identity. Do not commit allowlist values or other runtime secrets.

Local development supports the starter's loopback-only mock identity. If a local admin test needs it, set `ADMIN_USER_IDS=local_seedy` in an ignored `.env` and remove it after testing. Never configure `local_seedy` on hosting. The Sites plugin strips spoofed incoming identity headers.

| Staff queue | English route | French route |
| --- | --- | --- |
| Provider business corrections | `/admin/provider-requests/` | `/fr/admin/provider-requests/` |
| Visitor listing problems | `/admin/listing-reports/` | `/fr/admin/listing-reports/` |
| Public-source maintenance | `/admin/source-review/` | `/fr/admin/source-review/` |
| Historical connection requests | `/admin/` | `/fr/admin/` |

### Provider business corrections

`provider_requests` stores organization name, business email, public evidence URL, request type and review status. There is no patient-information or unrestricted medical-message field. Validation includes input/protocol limits, same-origin enforcement, a honeypot and per-email throttling. Optional listing context is stored in `provider_request_targets` and deleted with its parent request. Correction links use `#listing=<provider-id>`.

Review the request, independently verify its public evidence, edit the source record in both languages, validate and publish, then resolve it. Marking a request resolved grants no listing control and publishes nothing. Records older than 90 days are cleaned up on a subsequent submission or authorized queue read. This is opportunistic cleanup, not a scheduled deletion job. The queue sends no email alerts.

### Visitor listing problems

`POST /api/listing-reports` accepts only a known listing ID, an allowed issue category and an empty honeypot. It accepts no name, email, free text, health details or arbitrary source URL. Issue categories are phone, link, closed, location and services.

The `listing_reports` table stores the public listing ID, issue, review status, random report ID and timestamps. Pending duplicates are combined. Strict field validation, a 1,024-byte request limit, same-origin checks and a global limit of 60 new unique issues per hour apply without IP/device tracking. Reports do not alter public listings automatically. Records older than 90 days are purged on submission or authorized queue access. Staff resolution is authenticated; no notifications are sent.

### Source maintenance

The source-review catalogue includes providers, source-backed articles and city guides. Provider URLs include practical address/accessibility evidence and appointment URLs. The queue flags content whose source-review date is at least 90 days old or is missing, and distinguishes these dates from automated link-check timestamps.

CHECK LINKS requests only published HTTPS URLs already in that catalogue. It accepts no arbitrary URL. HTTP 404/410 are marked missing; redirects, restrictions, timeouts and other failures require manual review. A successful response means the link was reachable, not that the content or appointment availability was confirmed. Results are stored in `source_link_checks`; checks never update the content-review date or public source files.

### Retired connection flow

The public site accepts no new care-introduction or appointment requests. Legacy connection pages redirect to the directory. `POST /api/referrals` returns HTTP 410 without storing input or sending a notification.

Earlier `referral_requests` and `referral_events` remain protected by the server-side admin allowlist. Authorized inbox reads trigger cleanup after 90 days, and authorized staff can delete a request and its events. Historical consent records remain attached to retained data. For an older deletion request, check any reference-only alert retained separately in Formspree or the team's email account. Never export these records into Git.

## Database restoration and backups

This repository backs up **application source and public assets**, not the production database, runtime configuration, account access, DNS, operational logs or private submissions. Those remain separate in the hosting service. Do not commit database exports, patient/contact records, credentials or local test state.

`db/schema.ts` and `drizzle/` contain the existing schema migrations. `provider_request_targets` and `source_link_checks` also initialize with idempotent `CREATE TABLE IF NOT EXISTS` statements; migration `0003_provider_editorial_review.sql` supports explicit provisioning after earlier migrations. The `listing_reports` table and indexes initialize from `lib/listing-reports.ts` on first valid submission or authorized queue use; they are not currently represented by a separate Drizzle migration.

For a fresh local D1 instance, build first, then apply each pending migration once, in filename order, using the generated configuration. For example:

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_worthless_nova.sql
```

Repeat with each later pending SQL file in `drizzle/`. This command is local only. Production migration and backup operations must use the existing Sites project's managed storage workflow. Never rewrite applied migrations or replace production data with local fixtures.

Use `pnpm db:generate` for deliberate schema changes and inspect the generated SQL before applying it. Local `.wrangler/` state, `.env` files, `.sites-runtime/`, dependencies and `dist/` remain ignored.

## Privacy and discoverability

Public search runs in memory and carries filter/language context in URL fragments, not HTTP queries. The site has no analytics, ad trackers, geolocation requests, external fonts, browser storage or patient accounts. Browser history may retain addresses; Quick Exit navigates to the weather website and does not clear prior browser history or network logs. Hosting can retain operational logs and authentication cookies.

The current canonical domain is `https://abortionclinic.ca`. English/French pages have server-rendered content, self-canonicals, reciprocal `en-CA`/`fr-CA` alternates and `x-default`. Public navigation reaches the 97 curated city guides and provincial/territorial resources without requiring JavaScript. The national city-directory hubs `/locations/` and `/fr/localites/` are indexable. Legacy municipality-only URLs and paginated geography lists redirect to provincial/territorial guides instead of remaining separate landing pages.

Provider correction and visitor-report forms are `noindex, follow` and excluded from the sitemap. Administrative pages and APIs are private and excluded from indexing. `noindex` is not an access-control mechanism. `DISCOVERABILITY.md` describes the route policy and validation checks.

Structured data describes the independent directory, visible lists, breadcrumbs and sourced educational articles. The site does not claim to be a MedicalClinic or physician and includes no invented clinical reviewer, rating or provider endorsement. Source check dates, page revisions and automated link-check timestamps remain distinct.

On November 3, 2026 (Toronto time), the 412-URL sitemap was resubmitted successfully through Google Search Console and all 412 URLs were accepted through IndexNow for participating engines including Bing. These acknowledgements are submission receipts, not proof that every page is indexed. Preserve the public IndexNow verification file and any verified ownership metadata. Do not submit the generated Sites hosting subdomain as a separate copy.

## Verification before future changes

Run checks appropriate to the changed area; these use source data and isolated synthetic storage rather than submitting test records to production:

```bash
pnpm exec tsc --noEmit --incremental false
node scripts/check-discoverability.mjs
node scripts/check-national-coverage.mjs
node scripts/check-directory-search.mjs
node scripts/check-regional-alternatives.mjs
node scripts/check-editorial-review.mjs
node scripts/check-listing-reports.mjs
git diff --check
pnpm build
```

Database checks use Node's built-in `node:sqlite`; use a supported Node release with that module available. Historical referral checks remain in `scripts/` for maintenance of retained private records; do not re-enable the retired public intake flow.

The functional release passed TypeScript, route/metadata/sitemap checks, national coverage, regional and bilingual search checks, editorial-queue checks, visitor-report validation/security/storage checks and a production build. Live checks verified the source details, report prefill, English/French switching, missing-field validation, sharing-copy action, sitemap access and anonymous admin denial. Narrow-screen page checks included the new report, guide, profile and sharing templates. Avoid production test submissions when verifying forms.

Before publishing later changes, review both languages, check relevant desktop/mobile templates and source links, and preserve the information-only scope. Publish through Sites using the existing project and retain the resulting source commit and saved version. A source-only GitHub backup does not require a new live deployment.
