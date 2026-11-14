# Verified archive access policy — 2026-11-10

Read-only inspection of `pg_policies` on Supabase project `orbis-arcanorum`, table `public.archive_resources`:

- Policy: `Published archive resources are publicly readable`
- Roles: `anon`, `authenticated`
- Command: `SELECT`
- Predicate: `publication_status = 'published'`
- No other archive_resources policies returned by the query.
- Prior inventory: 91 records, all draft.

## Verified implication
The current RLS policy does not permit ordinary anonymous or authenticated clients to read drafts. A public archive client that relies on this table will see no rows until records are approved and marked published. This is a plausible explanation for empty archive results, **not proof** of the public website's implementation.

## Security decisions
- Keep existing RLS unchanged.
- Do not give all authenticated users draft access.
- Do not expose service-role keys in client code.
- Reviewer access requires a verified identity and explicit approval; design a separate authorized server-side or narrowly scoped policy after approval.
- Preserve draft publication status and source evidence while mapping categories.

## Verification still needed
Check the live frontend's query path, inspect the project API grants and any alternate archive sources, and test with a genuine anonymous client. Test a protected reviewer flow before implementing it.
