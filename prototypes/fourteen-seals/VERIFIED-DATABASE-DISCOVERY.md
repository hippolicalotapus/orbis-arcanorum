# Verified database discovery — 2026-11-10

Read-only Supabase metadata inspection confirmed the project named `orbis-arcanorum`, project ref `brxptqbdrlxixvsafvlf`, with `public.archive_resources` containing **91 records** at inspection time.

## Critical finding
A read-only `GROUP BY archive_section, publication_status` query returned **all 91 records as `draft`** across 34 distinct `archive_section` labels. This is NOT evidence that 91 records are public or that the public website shows the same records. Do not expose draft records through a public browser key or bundle them into a public JSON file.

## Existing fields
`id`, `slug`, `title`, `archive_section`, `description`, `source_name`, `source_url`, `resource_type`, `evidence_class`, `rights_status`, `publication_status`, `original_language`, `original_title`, `english_title`, `english_description`, `translation_status`, `institution_catalog_id`, `source_collection`, `acquisition_status`, `last_source_checked_at`, etc.

RLS is enabled on the table. **Do not change policies or publish drafts** as a shortcut.

## Integration decision
1. Preserve the canonical database; don't overwrite or duplicate the 91 records.
2. Build a mapping layer from 34 source categories to the 14 visual chambers. Mapping needs explicit review, especially for cross-archive and culturally specific entries; do not silently force-fit records.
3. Only query records explicitly marked `published` using a read-only client with appropriate RLS, or use an approved authenticated reviewer flow for draft research.
4. Never put a Supabase service-role/secret key in the frontend.
5. Preserve `evidence_class`, `rights_status`, and translation review status in the UI.
6. Test published-only queries, RLS behavior, and mobile rendering before deployment.

## Next action
Inspect current access policies and the production frontend's actual data source, then implement an access-safe adapter. No changes to production database or deployment were made during this milestone.
