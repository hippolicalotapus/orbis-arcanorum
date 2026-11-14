# Anonymous RLS test — 2026-11-10

Read-only transaction executed against Supabase project `orbis-arcanorum`:

```sql
begin read only;
set local role anon;
select count(*) as anonymous_visible_records from public.archive_resources;
rollback;
```

**Observed result:** `anonymous_visible_records = 0`.

This directly tests database row-level security with the `anon` role. It does **not** prove the browser client, authentication, or website query path works, and it does not test approved reviewer access.

No database writes, policy changes, or deployment were performed.

## Outstanding browser checks
- Valid JSON import and category filters
- Invalid JSON and oversized file handling
- Search and priority filters
- Safe rendering of HTML-like text and source URLs
- Clear records behavior
- Mobile and keyboard accessibility
