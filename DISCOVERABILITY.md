# Search visibility and location coverage

Public content lives at https://abortionclinic.ca/ with English and French equivalents.

## Location policy

- Publish useful provincial/territorial service guides and sourced provider profiles.
- Do not generate indexable pages from municipality names, keyword combinations, search filters, or referral destinations.
- The 5,054-place dataset supports client-side community search and geographic matching. Search results link to a relevant curated city or regional guide, optionally with a client-side city filter. Dataset inclusion does not establish local clinic coverage.
- Retired municipal URLs and paginated geography lists permanently redirect to their province/territory guide. Do not restore these as landing pages or emit their URLs in navigation, structured data, or the sitemap.
- The bilingual clinic directory and national city-guide hubs (`/locations/` and `/fr/localites/`) are indexable at their base URLs. The hubs link to 97 curated city guides; search filters remain in the URL fragment and do not create separate indexable pages. Provider correction and visitor-report forms are noindex and excluded from the sitemap. Admin pages and APIs are also excluded from indexing. Private data additionally requires server-side authorization; noindex is not access control.
- Do not create fake clinic locations, affiliations, reviews, availability or medical-review claims. Provider information remains a selected public-source record, not provider confirmation.
- Visitors contact clinics directly using public phone numbers and official websites. Legacy connection form URLs redirect to the clinic directory. The public referral API returns 410, with no intake or alert. Previously submitted requests retain their private inbox and retention protections.
- New standalone location content requires original, source-supported information that answers a distinct user need. A place-name swap or a link to the same request form is insufficient.

## Verification

Run `node scripts/check-discoverability.mjs` to check every supported and retired route, bilingual alternates, consolidation targets, utility noindex settings, provider contact completeness, breadcrumbs and structured-data links. This verifies implementation rules, not Google's editorial judgment.

After a public release, check unauthenticated HTML and headers for homepage, regional guide, profile, sitemap and robots.txt. Check legacy redirects and anonymous admin denial. Validate crawl access through Google Search Console and Bing Webmaster Tools; submit only the canonical sitemap. Retain ownership verification meta tags.

Avoid separate indexable copies of the website. Canonicals, sitemap URLs and language alternates use the custom domain; www redirects to the root hostname. Do not submit the generated hosting subdomain as a second search property.

Sources: https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse and https://developers.google.com/search/docs/essentials/technical
