# Formspree integration — September 11, 2026

The React/Vinext site retains its custom React form and same-origin AJAX submission to `/api/referrals`. After validation and durable D1 storage, the server posts a minimal team alert to `https://formspree.io/f/xkjnebre`. This adapts the React workflow to the existing private lead inbox; swapping the form for the basic `useForm` example would bypass that storage and its consent, rate-limit and idempotency controls. No additional dependency is required.

## What arrives in Formspree

Only `subject`, `reference`, `message` and `inbox` are sent. The inbox link uses the already-working Sites hostname and requires the existing admin sign-in. It contains no access token. Names, contact details, clinic preferences, source pages, consent choices, visitor IP headers and retry tokens are not forwarded. Formspree alerts the team according to the form owner's configured notification workflow; there is no automatic clinic forwarding or visitor autoresponder.

English and French forms disclose the notification processor, retain separate optional clinic-sharing permission, and record the updated consent wording version. Privacy pages explain Formspree's US infrastructure and that alert/email copies have separate retention from the private D1 inbox. See [Formspree's privacy policy](https://formspree.io/legal/privacy-policy/).

## Formspree account settings

These settings cannot be inferred from a public form endpoint and have not been verified in the owner's dashboard:

1. The form must be active, with the intended team recipient verified and its email notification workflow enabled. Confirm that a later authorized test appears in both Formspree and the intended mailbox; an API acceptance alone does not prove email delivery.
2. This is a server-to-server alert without a visitor email field. Do not require an `email` field, enable a visitor autoresponder, or configure actions that expect patient/contact data on this form.
3. Browser CAPTCHA challenges cannot be completed by this server request. If CAPTCHA is enabled for this alert form, configure an appropriate server-compatible notification workflow before relying on delivery. The site's public intake still enforces consent, a honeypot, same-origin checks and per-contact limits. No Formspree spam or account settings were changed. Formspree documents its [per-form CAPTCHA settings](https://help.formspree.io/articles/form-and-project-settings/recaptcha-settings/).
4. Browser-origin restrictions may reject server submissions without a browser referrer. Review any enabled domain restriction for compatibility with server submissions. The code deliberately does not fabricate a visitor referrer or forward browsing context.
5. Respect the plan's submission allowance and system limits. Review failed alerts in the private inbox and Formspree's dashboard. Manage retained notification copies and the team's mailbox separately when handling deletion requests.

## Failure and retry behavior

The saved request and its reference remain valid if Formspree rejects an alert, times out, returns a challenge, or is unavailable. Alert state is visible in both language versions of the admin inbox: pending, sending/unconfirmed, accepted, rejected or unknown. `accepted` means the API accepted it, not that an email reached the mailbox.

An atomic database claim prevents concurrent sends. Visitor retries never resend accepted, rejected or uncertain alerts. Authorized administrators can retry pending/rejected/uncertain alerts; interrupted sends become eligible for an explicit retry after one minute. An uncertain response can result in duplicate alerts if retried, so the UI explains that risk. There is no scheduled retry worker. Staff should continue checking the private inbox.

Existing requests default to `not_requested` and are not forwarded retroactively. Provider business corrections keep their existing separate workflow.

## Code and migration

- `lib/referral-notifications.ts`: fixed endpoint, explicit payload allowlist, bounded fetch, response classification and atomic claim.
- `app/api/referrals/route.ts`: save first, then alert; retain the receipt even if alerting fails.
- `app/api/admin/referrals/notification/route.ts`: authenticated, same-origin manual retry.
- `app/admin/referral-inbox.tsx`: bilingual alert status and retry feedback.
- `app/referral-form.tsx`, `lib/referral-content.ts`, `lib/content.ts`, `app/site.tsx`: bilingual disclosure, consent version and processor privacy link.
- `drizzle/0002_gorgeous_slapstick.sql`: append-only, nullable attempt timestamp and constant `not_requested` default for existing rows. Apply via Sites with the next authorized deployment. Local schema updated separately.

## Verification

`node scripts/check-referral-notifications.mjs` passed using an isolated in-memory SQLite database and mocked outbound HTTP. It exercises both languages/contact methods, actual intake SQL, consent and honeypot rejection, same-origin enforcement, payload minimization, the official Formspree success response, rejected/challenge/network responses, storage failures, idempotent retries, concurrent claims, explicit retry eligibility, existing requests and rate limits. It does not create production records or send emails. TypeScript, diff whitespace checks and the Sites production build passed.

The compiled local site returned the updated form and privacy content in both languages. Anonymous inbox reads and alert retries returned 403 with `no-store`. Browser checks confirmed French email validation, English telephone validation, language switching, the new consent text, and unchecked voicemail/contact/sharing permissions. The development preview had a stale module-loading error; these interactive checks used the successfully compiled production preview instead. No browser request was submitted.

Official integration references: [React library](https://help.formspree.io/articles/working-with-react/the-formspree-react-library/), [AJAX guide](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/), [SDK response types](https://github.com/formspree/formspree-js/blob/main/packages/formspree-core/src/submission.ts).

At the implementation handoff, this update had not yet been deployed and real mailbox delivery had not been tested. The owner subsequently requested publication; see the publication result in the task for the current deployment and verification status.
