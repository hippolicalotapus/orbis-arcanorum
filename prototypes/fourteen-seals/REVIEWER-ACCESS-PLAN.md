# Draft research access and category-mapping milestone

## Confirmed from read-only database inspection
- Supabase project: orbis-arcanorum.
- public.archive_resources: 91 records; all currently marked draft.
- 34 source archive_section labels.
- RLS enabled.

## Navigation mapping
The companion archive-section-mapping.json maps 26 of 34 source category labels provisionally into the fourteen visual chambers, with eight categories reserved for manual review. This is a **navigation proposal**, not a database migration or scholarly assertion. No record is reclassified by this file.

Do not interpret the visual chamber name “Forbidden Knowledge” as proof that the source is forbidden. Similarly, “Questionable & Disputed” must be assigned based on an explicit evidence review, not an arbitrary source category.

## Secure reviewer flow — implementation prerequisites
1. Verify existing auth/RLS policies and identify approved reviewer identities. Do not grant access to all signed-in users.
2. Implement read-only draft access for approved reviewers only, with server-side authorization. Do not embed service-role keys in browser code.
3. Show provenance, evidence class, translation review, rights, and publication status per record.
4. Record reviewer findings separately from canonical source content, with audit history.
5. Require explicit editorial approval before changing publication_status from draft to published.
6. Verify that anonymous requests cannot retrieve drafts and that approved reviewer requests can only retrieve intended records.

## Tests still pending
- Inspect actual RLS policies and public site's query implementation.
- Verify mapping against real record titles and source evidence, especially the eight review-required categories.
- Browser tests of importer, offline notes, and narrow-screen layout.
- Deployment approval and Netlify credit estimate.

No database changes, reviewer grants, or deployments were performed in this milestone.
