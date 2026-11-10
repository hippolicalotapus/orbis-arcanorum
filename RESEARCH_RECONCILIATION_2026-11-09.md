# Research reconciliation — preservation audit

Date: 2026-11-09. Branch: `feature/vendor-directory-foundation`. This is an inventory and reconciliation checkpoint, **not** an item-level factual verification or an independent off-platform backup.

## GitHub inventory verified
- `data/archive-catalog.json`: **360** entries; **0 duplicate record IDs**; **0 missing source_url**; **0 missing rights fields**.
- `data/archive-chambers.json`: **14** chamber definitions.
- `data/archive-resources.json`: **10** resources (separate collection, not additive to catalog without deduplication).
- `data/independent-obscure-source-leads.json`: **13** source leads (not verified archive items).
- `MULTILINGUAL_ARCHIVE_STANDARD.md`: present.
- `MANUAL_SOURCE_ACCESS_QUEUE.md`: present; blocked and broken sources retained for manual review.
- `archive-editorial-policy.md`: present.

## Data-quality observations
- **331/360** catalog entries do not contain an `original_language` field. This is a metadata gap, not evidence that 331 items need translation; many entries may be English-language or general subject records.
- Many `source_status` values explicitly indicate discovery leads, incomplete item-level verification, or unchecked URLs. A populated archive does not mean its content has been fact-checked.
- Source URL and rights *fields* being present does not establish URL reachability, licenses, or reproduction permission.

## Prior-work reconciliation queue
Prior project discussions mention these assets and leads. Their presence in the current catalog has **not yet been individually cross-matched**, and they must not be silently treated as lost or recovered:

| Prior work or lead | Reconciliation action |
| --- | --- |
| Voynich Manuscript, Yale Beinecke MS 408, provenance materials | Match item IDs and exact catalog URLs; check provenance and reuse permissions |
| British Library manuscript and sacred-text collections | Resolve changed URLs; preserve original discovery references |
| Smithsonian Open Access and Library of Congress maps | Match item-level records and rights metadata |
| Internet Sacred Text Archive | Separate discovery gateway from specific verified texts |
| Met collection objects 553617, 553477, 329795 | Confirm exact item references, accession IDs and rights |
| Historical `archives/research-leads.json` (reported 26 leads) and `archives/index.html` (reported eight source records) | Search Git history/branches; compare with current files before importing |
| Private draft research reported in earlier project discussions | Locate authoritative export/database, confirm access controls, compare IDs and sources; do not assume GitHub contains it |
| Dark-web and independent occult research leads | Preserve safe public metadata, provenance, and legal/rights constraints; no unverified claims promoted as facts |
| Translation and regional sacred-tradition research | Apply multilingual standard, community-sensitive review and permissions |

## Preservation decisions
1. **No destructive changes** to existing catalog, chambers, or source files in this pass.
2. No records have been added merely because they appeared in a prior conversation; first confirm source and avoid duplicates.
3. Preserve `source_status`, `rights`, original citations, and language information in future migrations.
4. Next: locate historical branch files and external draft exports, compare by ID + normalized title + source URL, and create an additive review queue for genuinely missing records.
5. Next: independent backup/export with a tested restore procedure; GitHub history alone is not an off-platform backup.


## Recovery verification update — 2026-11-10
**Previously discussed materials found in live systems:**
- GitHub `main/archives/research-leads.json`: **26 records** confirmed; blob `0f850cc78347ba0bf3be7afe14a3912f1927616f`. This historical file was not listed in the current development-branch tree, so it must be compared before any import.
- GitHub `main/archives/index.html`: historical archive index confirmed present (6,854 UTF-8 characters). Eight displayed source cards previously reported; card count not independently parsed in this audit.
- Supabase project `orbis-arcanorum` (read-only count check): `public.archive_resources` **91 rows**, `orbis_internal.source_leads` **5 rows**, `orbis_internal.work_register` **15 rows**. These are separate datasets; **do not add counts together** as unique research items without cross-matching.
- GitHub development branch: **360** catalog entries, **13** independent source leads, **10** archive resources.

**Outstanding:** Compare 26 historical leads and 91 Supabase archive rows with 360 GitHub catalog entries using stable IDs, source URLs and normalized titles; preserve unpublished/draft states and private access controls. Do not expose private Supabase records or merge blindly. Independent off-platform backup and restore test remain pending.
