# Production release for AbortionClinic.ca

The user authorized publication on November 3, 2026 and subsequently selected WHC
Web Hosting with cPanel as the destination. The provided server IPv4 address is
`148.113.170.101`. Confirm the account's secure hostname, domain document root and
access before uploading or changing DNS. The existing live site remains on OpenAI
Sites until the WHC copy is verified and traffic is switched.

See [WHC_DEPLOYMENT.md](WHC_DEPLOYMENT.md) for migration, backup and rollback steps.
A prepared archive or GitHub push does not deploy to WHC.

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

## Publish to the selected WHC account

Run `npm run release:whc` from a clean committed checkout. The ZIP contains the
production output at its root, including a generated `.htaccess` for Apache 2.4+
or compatible LiteSpeed hosting. The archive and its commit/checksum manifest are
stored in `releases/` and are not committed as source.

The `.htaccess` handles the 52 legacy redirects, proper static 404 responses,
security headers, selective noindex, JavaScript/image MIME types and protection
for hidden/source/backup files. Host-scoped HTTPS and www redirects must be tested
with a valid WHC certificate and the account's actual proxy arrangement.

Verify cPanel's domain-to-document-root mapping, preserve existing site files,
upload and validate the new release, then update only the required website DNS
records. Preserve unrelated websites and mail records. The exact access and DNS
targets must come from the user's WHC account; no credentials belong in the repo.

`npm run test:apache` exercises the generated rules against a real local Apache
server. It requires Apache 2.4 and the indicated modules; see the test's setup
message for binary/module overrides. These checks do not establish readiness of
the user's remote server or its certificate.

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
