# Milestone: Verified grants and publication gate

Read-only SQL checks (2026-11-10) on the `orbis-arcanorum` Supabase project:

- `information_schema.role_table_grants`: `anon` and `authenticated` each have `SELECT` only on `public.archive_resources`.
- `pg_policies` (previous milestone): the sole SELECT policy for these roles filters `publication_status = 'published'`.
- Current inventory: 91 draft, 0 published, 91 total.

**Conclusion:** Ordinary browser clients using either of these roles have no RLS-authorized draft records. The empty-public-archive symptom is consistent with these settings. This does not establish whether the deployed website actually queries this table.

## Safe implementation order
1. Identify and inspect the deployed website's actual query path and source code.
2. Verify the approved reviewer identities and implement a narrowly scoped authenticated reviewer mechanism, with deny-by-default checks. Do not assume a logged-in account is an approved reviewer.
3. Add read-only reviewer retrieval of draft rows, with publication state and evidence fields visible.
4. Verify anonymous access remains published-only, approved reviewer can read intended drafts, and non-reviewer authenticated access remains published-only.
5. Review individual records, including evidence/rights/translation, before any publication transition.
6. Deploy only after user approval of credit use.

No database writes or policy modifications were performed.
