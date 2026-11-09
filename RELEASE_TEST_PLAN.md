# Release gate — Orbis Arcanorum

Do not merge PR #1 or trigger a new Netlify build until these checks pass. No production changes or paid upgrades are authorized by this checklist.

## Verified 2026-11-09
- [x] GitHub development branch includes the homepage, catalog, vendor registration, vendor directory, admin review page and Chamber XIV preview.
- [x] Supabase public vendor_profiles, vendor_applications and collector_profiles have RLS enabled.
- [x] Anonymous role cannot SELECT vendor_applications; anonymous role has SELECT grant on vendor_profiles (RLS still applies).
- [x] Authenticated role can INSERT vendor_applications.
- [x] Supabase security advisor reviewed. Leaked-password protection remains a warning; internal schema tables with RLS and no policies were INFO findings.
- [x] Admin review page improved to show authorization and sign-in errors.
- [x] Static navigation audit of seven HTML pages: no unresolved local page links, duplicate element IDs, or missing referenced element IDs.

- [x] Research catalog expanded to 79 records; three new UNESCO source pages checked and catalog JSON schema/IDs validated.

- [x] Verified vendor application SELECT/INSERT/UPDATE policies, column-scoped UPDATE grants, and review/sync triggers in live Supabase metadata; no test account transactions performed.

- [x] Catalog expanded to 82 entries with three UNESCO-checked cultural heritage leads; unique IDs and required fields rechecked.
- [x] Homepage source updated to fetch shared catalog rather than hard-code eight records; browser verification still pending.

- [x] Catalog renamed in project terminology to Akashic Records; 83 entries checked for unique IDs and required fields. The Akashic Records concept entry is a research lead, not a verified supernatural claim.

## Required end-to-end checks (not yet verified)
- [ ] Serve HTML locally; check all internal links, JavaScript console errors and mobile layouts.
- [ ] Sign up with a non-admin test account and confirm email redirect.
- [ ] Submit a test vendor application; confirm applicant sees only their own status.
- [ ] Verify anonymous users cannot read pending applications.
- [ ] Sign in as confirmed admin and approve a test application.
- [ ] Confirm approved profile appears in public directory, and rejected/pending profiles do not.
- [ ] Verify review actions are rejected for non-admin accounts.
- [ ] Confirm Netlify preview is accessible to an authorized tester (currently HTTP 401 without session).
- [ ] Verify Chamber XIV, vendor pages and catalog in an authorized browser session.
- [ ] Resolve or explicitly accept outstanding prelaunch security warnings.
- [ ] Merge once, then run a single production smoke test.

## Environment notes
Netlify deploy previews may require authenticated access. Opening an existing preview does not require a new build. The current preview's HTTP 401 means access could not be established in the unauthenticated test, not that the code was validated.

## Verification update — 2026-11-09
- [x] Rechecked public site and PR #1 preview via external unauthenticated fetch: both returned HTTP 401; browser functionality remains blocked pending authorized access.
- [x] Rechecked Supabase RLS policy inventory for vendor applications, vendor profiles and collector profiles; policies remain present.
- [x] Re-ran Supabase security advisor: leaked-password protection disabled (WARN); two internal RLS tables without policies (INFO).
- [x] Homepage and catalog source changed to derive chamber names from data; shared catalog previously checked at 86 entries, 13 populated categories.
- [ ] Obtain authorized Netlify test session or intentionally enable preview access, then perform browser tests.
- [ ] Execute real applicant/admin/non-admin test-account flow and verify database state before and after cleanup.
- [ ] Resolve leaked-password protection warning in Supabase Auth settings before launch.
- [ ] Test billing and sponsorship inquiries only after payment provider and terms are approved.

## Development QA update — 2026-11-09
- [x] Temporary public test window: production and preview became publicly accessible, then both were restored to Private and Netlify confirmed both settings.
- [x] Browser smoke tests passed for homepage, catalog, vendors, registration, advertise, and lost histories; browser rendered 86 catalog entries and 13 populated chamber buttons. Search/filter navigation tested.
- [x] Found and fixed a literal `\\n` token in `admin-vendors.html` module JavaScript that would cause parsing failure. Commit `94f2dab`.
- [x] Updated vendor directory copy and obsolete Twelve Archives navigation. Commit `321c568`.
- [ ] Rebuild/redeploy updated admin page and perform real browser JavaScript and admin authentication tests.
- [ ] Vendor sign-up, application insertion, admin review, public profile sync, RLS negative tests and cleanup remain pending.
- [ ] Payment and advertising transactions remain disabled and untested.

## Archive growth verification — 2026-11-09
- [x] Four new UNESCO World Heritage leads checked at their institution pages and committed as oa-087 through oa-090.
- [x] Shared catalog now has 90 records, 90 unique IDs, required metadata complete; all new items flag pending item-level and multilingual review.
- [ ] Recheck the 90-entry catalog in a deployed browser preview after the next planned build; do not spend an extra deployment solely for this data change.

## Obscure-source verification — 2026-11-09
- [x] 12 independent and niche source leads logged in separate JSON discovery queue; 12 unique URLs.
- [x] 10 pages accessible in automated checks; Hermetic Library blocked automated access; Weird Science legacy link unreachable.
- [x] UKIYOVERSE identified as original mythology/creative material rather than independent historical corroboration.
- [ ] Review individual items, rights, source provenance and original-language translations before promotion into main research catalog.

## East Asian research and release status — 2026-11-09
- [x] Five Japanese and Chinese historical ritual/folklore research leads committed as oa-091 through oa-095; 95 records, 95 unique IDs and required metadata complete.
- [x] Four institutional/scholarly source pages opened and title checked; UC Press page blocked automated reading, explicitly flagged in record oa-094.
- [ ] Cross-check Japanese and Chinese primary-language names and bibliographic citations; English summaries are editorial, not manuscript translations.
- [ ] Perform real test-account signup, email confirmation, application submission, admin review, RLS negative tests and cleanup; prior six-page smoke test is NOT end-to-end workflow verification.
- [ ] Verify admin JavaScript fix and 95-record catalog on next planned deployment; production and preview remain private.

## Next-priority security and admin audit — 2026-11-09
- [x] Re-ran Supabase security advisors: leaked-password protection disabled (WARN); two internal-schema RLS tables without policies (INFO).
- [x] Updated admin review app-metadata check to accept boolean `true` and legacy string `"true"`; pending deployed browser verification.
- [ ] Enable leaked-password protection in Supabase Auth and re-run security advisor.
- [ ] Confirm configured email redirect allowlist covers the selected preview or staging host; test account confirmation with controlled disposable accounts.
- [ ] Run non-admin rejection, applicant-only access, admin approval, directory synchronization and cleanup tests in a controlled environment.
