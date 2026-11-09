# Orbis Arcanorum — Ancient Library Upgrade Plan

Status: development branch, not approved for production deployment.

## Verified baseline (2026-11-09)
- Netlify project: orbis-arcanorum; displayed as Private; GitHub deploy source.
- Site address: https://orbis-arcanorum.netlify.app
- Existing repository contains static index.html, catalog.html, and netlify.toml.
- Supabase archive: 91 records, all draft at last audit. No public data connection has been proven.
- Existing README deployment statement is outdated; do not assume its other status claims are current.

## Approved creative direction
- Keep the ancient library, illuminated manuscripts, celestial globe, stone architecture, warm gold accents, and cinematic visual quality.
- Retain Twelve Archives concept and motto: Omnia Quaerenda. Nihil Obliviscendum.
- No Kira character or feature.
- Distinct from QuestForge; avoid copying its imagery or product identity.
- Mobile-first, accessible, responsive; optimized assets, reduced-motion support and readable text.

## Functional release gates
1. Confirm current homepage, catalog, and chamber links work on mobile and desktop.
2. Validate search, filters, empty states, keyboard navigation and no JavaScript errors.
3. Connect to Supabase only with a public-safe API and explicit RLS policies; never ship service-role secrets.
4. Publish only editorially approved records. Do not expose draft records or private source leads.
5. Confirm image licensing and attribution; do not host unverified PDFs.
6. Run performance, accessibility and security checks before merging.
7. Preview on branch first; review credit impact before production deployment.
8. Verify Netlify deployment and perform post-deploy smoke tests.

## Out of scope for this release
Payments, auctions, vendor checkout, paid upgrades, public launch, and automatic publishing.
