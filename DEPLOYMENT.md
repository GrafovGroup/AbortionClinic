# Production release for AbortionClinic.ca

The user authorized publication on November 3, 2026. The existing host is OpenAI
Sites. This session can publish source to GitHub but has no connected Sites
publishing tool or hosting credentials. A prepared build or GitHub push is not
proof of a website deployment.

## Build the public version

Use Node.js 22+ and the exact lockfile:

```sh
npm ci
npm run build:production
npm test
SITE_MODE=production npm run test:browser
```

Publish the contents of **`dist-production/`**. The default `dist/` build is for
review and blocks indexing. The production build keeps the 102 original sitemap
URLs, canonical/language links, original asset paths, and 52 redirect rules.
It enables indexing on sitemap pages while retaining noindex on the original
unindexed directory/administrative routes and error pages.

To review locally, run `npm run start:production`. This loopback server verifies
production behavior; it does not expose or deploy a public website.

After committing reviewed source, `npm run release` creates
`releases/abortionclinic-production.zip` and a SHA-256/commit manifest. The archive
contains the built site at its root, including `_headers` and `_redirects`.
Packaging requires the system `zip` command. It performs no network publication.

## Update the existing OpenAI Sites project

Use the existing project connected to AbortionClinic.ca. Its source-update/import
controls must be checked in that project; this repository does not assume Sites
supports GitHub synchronization or ZIP upload. If it accepts a build pipeline,
use `npm ci && npm run build:production` and the `dist-production` output directory.
If it accepts static output, use the prepared archive only through that supported
mechanism. Do not assume pushing this repository updates the live site.

Configure the equivalents of `_headers` and `_redirects` if the host does not
consume those files directly. Required behavior:

- Existing sitemap URLs respond with 200, not a single-page-app fallback.
- The retired connection-request URLs and older development paths return the
  generated 301 redirects.
- Unknown URLs return an actual 404 with the localized error page where supported.
- Public content has no preview `noindex` header; robots.txt allows crawling and
  points to the public sitemap. Original nonindexed routes stay nonindexed.
- Serve image/script MIME types and preserve Referrer-Policy, CSP and nosniff.

Do not change the domain's DNS merely to publish an updated version within its
current Sites project. Keep the previous published version available for rollback
using the host's supported version history.

## Verify after publication

Check the actual public origin, not a local build: English/French homepage,
provider details, a province page, the sitemap and robots.txt, a legacy 301 route,
a missing URL, original image paths, and mobile/search/Quick Exit behavior.
Confirm the administrative contact is shown as website-inquiries-only. No intake,
referral, booking or patient coordination backend is included.

Recovered provider dates and clinical citations remain attributed to the original
site. Tests are not new medical, legal, French-language or provider verification.
The administrative phone was recovered from the original public contact page;
current telephone reachability has not been independently verified.
