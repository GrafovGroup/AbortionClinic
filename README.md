# AbortionClinic.ca

An original bilingual information website and public clinic directory for Canada.
The current scope is a **new build from the ground up**, as requested after the
initial recovery attempt. It does not reproduce or claim to recover the live
website. The informational-directory requirements in
`CODEX_RESTORATION_MASTER_PROMPT.md` still apply; its recovery-first instructions
describe the earlier phase.

## Develop locally

Requires Node.js 22 or newer and npm. The application and build have no runtime
package dependencies. Browser testing uses the exact development dependencies in
`package-lock.json` and a system Chromium executable.

```sh
cd /workspace/AbortionClinic
npm ci
npm run build
npm test
npm run test:browser
npm start
```

The browser runner uses `/usr/bin/chromium` by default. Set `CHROMIUM_PATH` if your
installation is elsewhere. Screenshots are written to
`/tmp/abortionclinic-browser`; `BROWSER_ARTIFACTS` overrides that directory. Install
Chromium through your operating system's package manager if it is absent.

The development server binds to loopback on port 3000; `PORT` overrides the port.
Stop it with Ctrl-C. Rebuild after source changes; the server reads the generated
files on each request. `dist/` and `node_modules/` are ignored. Use the existing
checkout: cloud tasks already have isolated environments and do not need a
separate Git worktree unless explicitly requested.

## Site structure

The build currently generates 58 content pages and two localized 404 pages:
English and French homepages, directory pages, topic guides, all 13 province and
territory pages, and administrative/policy pages. The root serves English, with a
contextual language switch on localized pages. French routes use translated names
such as `/fr/cliniques/`.

- `scripts/build.mjs`: static pages, original SVG illustration, metadata and sitemap.
- `scripts/content.mjs` and `scripts/ui.mjs`: localized copy, interface labels and routes.
- `scripts/editorial.mjs`: administrative content, FAQs and nonclinical topic guides.
- `public/style.css`: responsive layout, colour, typography and interaction styles.
- `public/app.js` and `public/directory.mjs`: navigation, geographic filtering and validation.
- `public/providers.json`: one shared bilingual provider dataset, currently empty.
- `scripts/serve.mjs`: local static server and response headers.
- `scripts/site.test.mjs` and `scripts/browser-check.mjs`: automated validation.

The site uses local assets and an original SVG landscape. It has no patient intake,
booking, referral flow or analytics. Directory search terms stay in browser memory.
Quick Exit replaces the current page and explains that it cannot erase history.

## Provider records and content

The directory is deliberately empty until real records can be sourced. A missing
result does not imply that care is unavailable. Each record requires a unique
slug `id`, `name` and `address` in both `en` and `fr`, `city`, a two-letter Canadian
province/territory code in `province`, HTTPS `website` and `source` URLs, and an
actual `reviewed` date in YYYY-MM-DD format. A public `phone` is optional.

The build validates records and creates matching detail pages when records exist.
Schema validation does not establish that information is accurate: check the
official source and record the real review date. Do not add patient information,
invented providers or unsubstantiated confirmation badges.

The six topic guides contain questions to discuss with a provider. They do not
publish clinical instructions. Provincial/territorial resource pages currently
identify their source gap rather than inventing local services. The contact page
explains its administrative purpose but has no configured contact channel.

## Deployment and launch requirements

`npm run build` creates a static `dist/` directory suitable for a static host.
No production deployment has been made. A production host must serve directory
index pages, return an actual 404 status for missing routes, and preserve the
security/privacy headers from the development server, especially
`Referrer-Policy: no-referrer` and the Content Security Policy. Configure equivalent
headers on the chosen host; the Node development server is not a deployment plan.

Preview pages include `noindex,nofollow`, the local server sends `X-Robots-Tag`, and
robots.txt disallows crawling. These settings do not provide access control.
Keep them until an explicitly approved public launch; then review the indexing
settings together with canonical URLs, sitemap and the selected production host.

Before launch, complete official provider/resource sourcing, qualified review for
any future clinical content, Canadian French and legal/privacy review, an
administrative correction channel, and final accessibility/content checks. Obtain
explicit approval before deployment or changes to the existing live domain.

See `RESTORATION_LOG.md` for scope history and validation evidence.
