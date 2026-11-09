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
