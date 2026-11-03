# AbortionClinic.ca reconstruction

Local reconstruction preview based on `CODEX_RESTORATION_MASTER_PROMPT.md`.
The user selected the **current published website** as the visual recovery target.
Current styling is provisional: production access is blocked, so visual fidelity
has not been established. Nothing has been deployed.

## Development

Requires Node.js 22 or newer (validated with 24.22.1). No package dependencies,
package installation, database, credentials, or external services are needed.

```sh
cd /workspace/AbortionClinic
npm run build
npm test
npm start
```

The server binds to loopback on port 3000 (`PORT` overrides it). Build again after
editing source; the server reads generated files on each request. `dist/` is an
ignored build output. Stop the server with Ctrl-C. Do not create a worktree: cloud
tasks already have isolated checkouts.

## Structure

- `scripts/content.mjs`: shared EN/FR copy and logical routes.
- `scripts/build.mjs`: static HTML generation, contextual language links and metadata.
- `public/`: CSS, browser interactions and a shared public provider database.
- `scripts/serve.mjs`: local static development server; request URLs are not logged.
- `scripts/site.test.mjs`: route/link/HTTP and provider-schema checks.

The directory starts empty on purpose. Add only sourced and dated public records
with localized `name` and `address`, city/province/territory, `website`, `source`,
`reviewed` (YYYY-MM-DD), and optional public `phone`. No patient data belongs here.
Search uses only geographic fields in browser memory. Empty results do not imply
that care is unavailable. Do not add unsubstantiated confirmation badges.

## Publication

All preview pages carry `noindex,nofollow`; robots.txt also disallows crawling.
This is not authentication. There is no production deployment adapter yet.
Recover the live site, inventory its routes and assets, complete educational and
provider source review, Canadian French/legal review, browser/mobile/accessibility
validation and approved deployment configuration before cutover. Production must
remain untouched until explicit approval. Sitemap and final structured data are
deferred until the recovered public route/content inventory is established.

See `RESTORATION_LOG.md` for evidence, limitations and the next recovery steps.
