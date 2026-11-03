# Deploy AbortionClinic.ca to WHC

The user has authorized publication and selected **Web Hosting Canada (WHC)** as
the destination. OpenAI Sites currently serves the live website. This document
describes the migration; it does not establish that an upload, DNS change or
production deployment has occurred.

The user confirmed WHC Web Hosting with cPanel and supplied server IPv4
`148.113.170.101`. The account hostname, authenticated access and domain document
root still require confirmation. The workflow expects an Apache-compatible static
website service; test the actual account configuration before cutover. A shared static hosting plan does
not need a Node.js process to serve the built site.

## Confirm the destination

Obtain these details from the WHC account or its support team:

- The hosting account and its secure access method: cPanel File Manager, SFTP or SSH,
  according to the plan's supported options.
- The configured domain entry for `abortionclinic.ca`, its **exact document root**,
  and whether `www.abortionclinic.ca` reaches the same website.
- WHC's assigned website IPv4 address and, only if provided for this site, IPv6
  address. Do not infer the website address from a mail-server address or another
  account's setup instructions.
- The DNS provider currently authoritative for the domain and the way HTTPS
  certificates are provisioned for both the apex and `www` hostnames.

Provide credentials through the connected account or secure environment settings,
not chat, repository files or scripts. Public DNS target values can be recorded
with the deployment notes. No second publication approval is needed once the
authorized account and target are established.

## Prepare and preserve

Keep the OpenAI Sites deployment and its domain connection intact while staging
and testing WHC. Record the current DNS records, their TTLs and the time of capture,
especially website A/AAAA/CNAME records. Preserve any existing redirect behavior.

Before uploading, verify the domain-to-document-root mapping in the hosting panel.
If the panel calls the domain an addon domain, use that domain's configured root;
do not assume it is `public_html` or the account's main-domain folder. Do not upload
into an account-wide directory merely because it is the first folder displayed.

If the target directory contains files, make a recoverable backup first, including
hidden files such as `.htaccess`. Store it outside any publicly served document
root or download it securely. Record the existing file inventory and verify that
the backup can be opened. Preserve unrelated files, other sites and account
configuration. If a pre-existing `index.php`, rewrite rule or application would
intercept the new site, resolve that specific conflict after preserving it; do
not clear the whole directory or cPanel account.

## Build and upload

Build with Node.js 22+ and the exact lockfile in the development environment:

```sh
cd /workspace/AbortionClinic
npm ci
npm run build:production
npm test
SITE_MODE=production npm run test:browser
npm run test:production
```

After the tested source is committed, `npm run release:whc` creates
`releases/abortionclinic-whc.zip` and its commit/checksum manifest. Use the
manifest to verify the intended release. Packaging alone does not publish it.

Upload the **contents of `dist-production/`**, or the release archive with those
contents at its root, to the verified WHC document root. Do not upload the preview
`dist/`, repository, `node_modules/` or a parent directory that leaves the site
nested inside `dist-production/` on the server. The resulting root must contain
`index.html`, `robots.txt`, `sitemap.xml` and the generated Apache `.htaccess`.

If using cPanel File Manager, enable its hidden-file display if needed and verify
that `.htaccess` was included after extraction. Review it against any existing
host-specific rules before replacing a previously present file. WHC must honor
the generated redirects, headers and error handling; `_headers` and `_redirects`
alone are not Apache configuration. If the plan does not support the generated
`.htaccess` directives, use the host's supported equivalents and test the results.

Remove only the uploaded archive after successful extraction and verification if
it resides in the public directory. Keep the verified local release and the
separate rollback backup.

## Stage WHC and configure HTTPS

Test the WHC copy before routing ordinary visitors to it. Use a WHC-supported
staging or preview method, or a host override for the actual domain when permitted
by the account and network configuration. Account preview URLs can behave
differently from the real domain when canonical-host redirects are enabled.
Do not treat a preview that redirects to the existing OpenAI Sites origin as a
successful WHC test.

Arrange a valid certificate covering **both** `abortionclinic.ca` and
`www.abortionclinic.ca` through the account's SSL controls or WHC support. Confirm
the certificate and HTTPS behavior before sending public traffic to WHC. Some
certificate methods depend on DNS already resolving to the new server; if so,
use a supported pre-cutover validation method or coordinate the issuance sequence
with WHC. Do not assume that cPanel has already issued a certificate or disable
TLS verification to make a test pass.

Check the WHC response for:

- English `/` and French `/fr/`, a province page and a provider detail page.
- Images at their original public paths, JavaScript/CSS MIME types and local
  browser search, language switching and Quick Exit.
- Original sitemap URLs returning 200, legacy connection/development URLs returning
  the intended 301 redirects, and missing URLs returning a real 404.
- `robots.txt` and sitemap entries, public pages without preview `noindex`, and the
  selective noindex rules on the intended directory/administrative/error routes.
- The generated privacy/security headers, including Referrer-Policy, CSP and
  `X-Content-Type-Options`, plus HTTPS and `www`-to-apex redirect behavior.

## Move website DNS

After the WHC copy and certificate work, update the domain's **existing DNS
provider** using the WHC account's confirmed website target. The normal change is
the apex A record to that assigned IPv4 address. Configure `www` to resolve to the
same website using the account's supported DNS target; the HTTP 301 redirect to
`https://abortionclinic.ca/` is handled by the website configuration, not by DNS.

Review any existing website AAAA records. They must either point to the confirmed
WHC IPv6 service or be removed if no IPv6 website service is provided, so IPv6
visitors are not sent to the old host. Change only records needed for this website.
Keep mail MX records and mail/authentication TXT records, including SPF, DKIM and
DMARC, intact. Keep other unrelated services intact as well.

This A/CNAME update does not require a nameserver change. If WHC specifically
requires a nameserver migration for the chosen setup, first preserve the complete
zone and coordinate any DNSSEC DS-record changes with the registrar and DNS
provider. Do not perform a wholesale nameserver switch as a shortcut for a website
address change.

DNS caches can continue serving the old target for a time. Leave OpenAI Sites
available during propagation and record the new values and cutover time.

## Verify and roll back if needed

Repeat the staging checks against the actual public domain after DNS changes,
including the `www` redirect and HTTPS certificate. Confirm the responses reach
WHC rather than a cached old origin. Record the observed status and release
identity; a successful upload or DNS edit alone is not evidence of a successful
public deployment.

If a material problem requires rollback, restore the recorded website DNS values
at the existing DNS provider. Keep the previous OpenAI Sites version available so
those restored records have a working destination. Where a WHC file rollback is
needed, restore only the affected site's verified backup; do not remove unrelated
account files. DNS rollback also takes time to propagate.

The published directory retains its recovered provider dates and citations without
claiming a fresh medical or provider review. The administrative telephone is for
website inquiries only. No patient intake, referral, booking or coordination
backend is part of this static release.


## Optional Apache integration validation

Run `npm run test:apache` with Apache 2.4 installed. For a separately extracted,
verified installation, set `APACHE_BIN`, `APACHE_MODULE_DIR`, and if necessary
`APACHE_LIBRARY_DIR` for that command. The test runs a temporary local server,
checks the actual generated `.htaccess` and stops only that server afterwards.
It never connects to the WHC account. Normal `npm test` does not require Apache.

The canonical host rules apply only to abortionclinic.ca and www.abortionclinic.ca;
unknown staging hostnames are left alone. A proxy in front of WHC must use HTTPS
to the origin; do not use a flexible HTTP-origin mode or trust arbitrary forwarded
headers to disable HTTPS redirects. ACME challenges remain accessible for SSL
issuance. Legacy redirects discard query strings at the destination, but incoming
requests can still appear in hosting access logs.
