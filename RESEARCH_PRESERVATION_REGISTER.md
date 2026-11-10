# Orbis Arcanorum — Research Preservation Register

Updated 2026-11-09. Source of truth for this snapshot: GitHub development branch `feature/vendor-directory-foundation`.

## Confirmed committed research collections

| File | Count | Blob SHA |
| --- | ---: | --- |
| `data/archive-catalog.json` | 360 entries | `9c03638dc38c2fe3efd24844056474fcac7482d3` |
| `data/archive-chambers.json` | 14 chambers | `3ee386364ec66c37041d5c8545c96cfeb31337e6` |
| `data/archive-resources.json` | 10 resources | `cc82748087e7ebb11f1b5cc8c654d47df4752cb8` |
| `archive-editorial-policy.md` | present | `68ac62e61fe4911a87c86a27c204531333ec52d4` |

These counts establish file presence, **not** item-level source verification or completeness. Do not claim 10,000 entries exist.

## Non-destructive development rules

1. Never overwrite or truncate research datasets for a visual redesign.
2. Preserve original-language titles, provenance, source URLs, evidence classification, translation status, and rights information where available.
3. Before changing datasets, record previous counts and Git blob SHAs; after changing, report additions, removals, duplicates, and schema errors.
4. Do not delete suspected duplicates automatically: review aliases, editions, translations, and different historical sources.
5. Maintain a separate backlog for research discussed in conversations but not yet located in committed project files. Never claim it was saved until verified.
6. Verify GitHub commit, automated checks, browser rendering, and Netlify publication separately.
7. Keep development changes on a branch and request approval before publishing.

## Recovery

Git history and the blob identifiers above provide a way to locate these committed snapshots. An independent exported backup and restore test remain **pending**; Git history is not a substitute for off-platform backups.

## Next verification work

- [ ] Export versioned JSON backups to a separate storage destination and test restoration.
- [ ] Audit source and translation status for all catalog records.
- [ ] Reconcile earlier conversations, handoffs, and any other research files against the 360 committed catalog entries.
- [ ] Run non-destructive dataset diff checks on every archive update.
