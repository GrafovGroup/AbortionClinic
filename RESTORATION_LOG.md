# Recovery audit and implementation plan

## 2026-11-03 — initial audit

- Checkout initially contained only `CODEX_RESTORATION_MASTER_PROMPT.md`.
- Original HEAD: `0dcbb8bab04267680a9dead4e2f733d9c90333b1`.
- Initial working tree was clean. No application, manifests, lockfiles, tests,
  assets, deployment settings or session history were found in the checkout.
- GitHub read access was verified using `git ls-remote origin HEAD`; the remote
  HEAD matched the checkout. Commands requiring networking needed execution
  outside the command sandbox in this session.
- Production HTTPS request failed with proxy CONNECT 403. No production HTML,
  assets, screenshots, backend data or URL inventory were recovered. The desired
  production domains were added to the configuration draft, not applied at runtime.
- The user selected reproduction of the current website. No claim of visual
  fidelity can be made until the published site becomes accessible.
- No live domain, production configuration, or production data was changed.

## Provisional foundation

Created a dependency-free Node static site with 20 EN/FR routes, localized menu
and footer, contextual language switching, exact supplied home/disclosure copy,
quick exit with history limitation, local geographic directory search, and an
explicit empty directory. Educational and policy pages state their review status.
No clinical claims, provider records, patient intake, referrals or booking flows
were invented. No third-party assets or analytics were added.

This is a review scaffold, not a completed restoration. The green/cream design
is provisional and must be replaced or adjusted using recovered evidence.

## Validation and environment configuration

- Node.js 24.22.1 and npm 11.9.0 available; no dependencies to download.
- `npm run build`: passed, generated 20 localized pages.
- `npm test`: 3 tests passed, 0 failed/skipped. Checks cover all localized routes,
  internal links, language counterpart URLs, preview indexing controls and local
  HTTP responses, including missing routes, traversal rejection and write rejection.
- The provider validation test ran over an empty dataset; it verifies no actual
  providers. Browser search, quick exit, mobile layouts and visual accessibility
  have not been exercised in a real browser.
- `npm start`: running successfully; a direct HTTP request to the French directory
  succeeded. This validates local service startup, not production behavior.
- Saved `install_script`, `start_skill` and custom network domains
  `abortionclinic.ca` / `www.abortionclinic.ca` in the environment draft.
  Draft persistence was confirmed; publication and fresh-task restoration were
  not performed or verified. Review/save and publish are user environment actions.
- The original master specification remains unchanged; generated output is ignored.

## Remaining recovery plan

1. Apply the saved network-domain additions in environment settings; recheck
   production HTTPS through the provided proxy.
2. Preserve an evidence inventory outside served output: EN/FR URLs, page markup,
   assets, metadata, menus, footer, responsive layouts and interactive behavior.
3. Investigate source/export recovery through authorized OpenAI Sites access.
   No export tool or source credentials were available in this session. Published
   bundles must not be assumed to include original source or backend data.
4. Reconstruct the current visual system and verified behavior from evidence,
   retaining the informational-directory positioning in the master specification.
5. Populate one sourced bilingual provider database, restore sourced educational
   content, and obtain qualified clinical, Canadian French and legal review.
6. Add complete provider details/correction workflow, sitemap and accurate site
   structured data after the actual content inventory exists. No administrative
   address is available, so contact collection remains disabled.
7. Run real-browser desktop/mobile, keyboard, accessibility, language, search and
   metadata checks. Current Node tests do not establish browser rendering quality.
8. Commit reviewed work locally, then request explicit approval for any production
   cutover. No deployment or push is authorized by local reconstruction alone.
