# Approved baseline — Orbis Arcanorum

**Recorded:** 2026-11-09
**Branch:** `feature/vendor-directory-foundation`
**Status:** Approved development baseline; **not** production release or a claim of complete end-to-end testing.

## Locked-in project decisions
- Orbis Arcanorum is a source-led, globally inclusive archive and third-party vendor/collector marketplace. The platform does not own or stock merchandise.
- Preserve the original twelve chambers. Chamber XIII (Sacred Archives) is approved conceptually, not yet built; Chamber XIV (Lost Histories) has a development page.
- Respect distinctions among traditions, protected sacred knowledge, evidence classifications and source rights. Do not imply affiliation or endorsement.
- Potential Graham Hancock research/authorized retail collaboration is outreach only; no partnership or merchandise permission assumed.
- Netlify builds/deployments must be consolidated; no paid setup or production release without review.

## Verified content snapshot
- `data/twelve-archives-catalog.json`: **79 entries**, **79 unique IDs**, required fields present; includes three newly checked UNESCO-linked Lost Histories research leads.
- Catalog content blob SHA: `b3be1ec9e2cafe220644fcbacd4e840fd55cc286`.
- `lost-histories.html` content blob SHA: `268ca1118a32ea32c2e3ecfdfe41d17cdcf65c57`.
- `RELEASE_TEST_PLAN.md` content blob SHA at baseline: `09dd3b5bda6c0f324610e5e221b118e66e699ba0`.
- Seven-page static navigation audit: no unresolved local page links, duplicate IDs or missing referenced DOM IDs.

## Outstanding release blockers
- Browser/mobile rendering and console checks.
- Real account registration, email verification, vendor application and admin approval flow.
- Authorized Netlify preview access (unauthenticated preview returned HTTP 401).
- Security-warning review, merge approval and production smoke test.

## Change control
This file is a baseline record, not a technical lock preventing edits. Future edits must preserve approved decisions and document meaningful changes in the release plan. No automatic merge or deployment is authorized.
