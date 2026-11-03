# AbortionClinic.ca

A bilingual informational website and public clinic directory for Canada. The
current implementation restores the published site's blue visual identity, logo,
photography and existing public URLs while applying the independent-directory
requirements in `CODEX_RESTORATION_MASTER_PROMPT.md`.

The live site became accessible after the environment network settings were
applied. Its public content and assets were recovered on **November 3, 2026**.
This is a maintainable replacement built from that evidence; original backend
source and private data were not recovered. Production publication is authorized. A deployable release is prepared separately; WHC cPanel is the selected destination; authenticated hosting access and the domain document root still need confirmation.

## Develop locally

Requires Node.js 22 or newer and npm. The build uses `parse5` to sanitize recovered
markup. Browser checks use pinned `playwright-core` and `axe-core` dependencies
with system Chromium. The generated static website has no package runtime.

```sh
cd /workspace/AbortionClinic
npm ci
npm run build
npm test
npm run test:browser
npm start
```

The browser runner uses `/usr/bin/chromium` by default; set `CHROMIUM_PATH` for a
different installation. `BROWSER_ARTIFACTS` overrides its screenshot directory.
Install Chromium through the operating system's package manager if needed.

The development server binds to loopback on port 3000; `PORT` overrides the port.
Stop it with Ctrl-C. Rebuild after source changes. `dist/` and `node_modules/` are
ignored. Use the existing checkout: each cloud task already has an isolated
environment and needs no separate worktree unless explicitly requested.

## Routes and implementation

The build generates 118 pages and 52 permanent compatibility redirects. It
preserves every one of the 102 URLs in the captured production sitemap. Of the
110 observed live pages, 108 keep their URLs; the two legacy connection-request
routes redirect to the clinic directory and do not retain patient intake.

English uses the existing root paths, such as `/find-care/`, `/ontario/` and
`/providers/mississauga-womens-clinic/`. French preserves the corresponding
translated paths, including `/fr/trouver-des-soins/` and `/fr/prestataires/`.
Earlier development `/en/` and other changed paths redirect to these canonical
addresses. Language links remain contextual; canonical, hreflang, social metadata
and existing public Google/Bing verification values are retained or rebuilt.

- `scripts/build.mjs`: static output, shared page shell, metadata, sitemap and redirects.
- `scripts/recovery.mjs`: recovered-markup sanitization and editorial transforms.
- `public/routes.mjs`: shared canonical English/French route definitions.
- `scripts/content.mjs`, `scripts/ui.mjs`, `scripts/editorial.mjs`: localized interface and editorial copy.
- `public/live-theme.css`, `public/live-assets/`: recovered stylesheet and assets.
- `public/style.css`: responsive adjustments and styles for the rebuilt interface.
- `public/app.js`, `public/directory.mjs`: browser interactions, geographic search and validation.
- `public/providers.json`: 25 bilingual provider records recovered from the published site.
- `scripts/serve.mjs`: local static server, 301 redirects, error responses and headers.
- `scripts/site.test.mjs`, `scripts/browser-check.mjs`: automated checks.

## Recovery evidence and content limits

`data/live-inventory.json` records 110 observed routes and their metadata.
`data/live-pages.json` retains captured main content without scripts; legacy
connection-request pages retain metadata only. These are archival inputs, not
content to render without sanitization and review. Original service claims may
appear in these snapshots; they must not be reintroduced into rendered pages.
`data/live-assets.json` records origin URLs and SHA-256 hashes for the original
stylesheet and 42 assets. `data/recovered-providers.json` preserves the provider
extraction and provenance independently of application formatting.

All 25 provider records retain the published source-review date **2026-09-10**.
That is an upstream date, not evidence of a new review by this project. Recovery
on **2026-11-03** is recorded separately. The official provider websites and
contact details have not been independently rechecked. Six records have explicit
street addresses; missing addresses remain null, with city/region shown instead.

Recovered educational pages keep their citations and original dates and show a
review notice. Additional topic guides contain questions to discuss with a
provider. Neither recovery nor automated testing constitutes qualified medical,
legal or Canadian French review.

The directory has no patient intake, booking, referral service or analytics.
Geographic search remains in browser memory. Quick Exit explains that it cannot
erase history. Both contact pages link to the recovered administrative website-inquiries phone number.

## Production build and publication

The current live host is **OpenAI Sites**; the user selected **WHC Web Hosting with cPanel** for the migration and authorized publication.
Use `npm run build:production` to create `dist-production/` with public indexing,
original canonical routes, selective noindex rules, security headers and redirects.
The default `npm run build` still produces the search-blocked preview in `dist/`.
Do not publish that preview directory.

`npm run start:production` serves the public build locally. After committing the
reviewed source, `npm run release` creates a ZIP and a commit/checksum manifest in
`releases/`. No publishing credentials are stored in the repository.

The recovered administrative phone is available on both contact pages and is
limited to website inquiries. Patient intake and clinical coordination remain
absent. Provider/clinical provenance is retained without claiming new review.

See [DEPLOYMENT.md](DEPLOYMENT.md) for the exact build commands, host requirements,
release package and post-publication checks. [WHC_DEPLOYMENT.md](WHC_DEPLOYMENT.md)
covers the selected cPanel migration. The production build now includes Apache
`.htaccess` rules; `npm run release:whc` packages `releases/abortionclinic-whc.zip`.
GitHub uploads alone do not update WHC or change the live domain.
