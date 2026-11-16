# Source metadata and licensing queue — internal only
Reviewed from `data/archive-catalog.json` on 2026-11-14. These are structural inventory counts, **not independent verification of the linked content or licensing**.

## Actual record inventory
- 360 records; 360 populated `source_url` and `rights` fields.
- Evidence classifications: Documented 121; Research lead 230; Unverified 5; Disputed 2; Folklore & Legend 2.
- 29 records explicitly include `original_language` and `english_translation_status`. Do not invent those fields for other items.
- 176 `source_status` strings include opened/checked/accessed/reviewed wording. These are *previously recorded claims*, not fresh verification performed in this review.
- Domains appearing frequently: archive.org (136), en.wikipedia.org (42), britannica.com (39), whc.unesco.org (19), loc.gov (15). Domain affiliation does not establish item-level provenance, factual reliability or reuse rights.

## Prioritized improvements
1. For each of the 42 Wikipedia-linked discovery entries, locate a relevant primary institution, scholarly publication or documented archival item before claiming stronger source verification. Do not erase Wikipedia as a secondary research lead merely to improve a metric.
2. Inspect the 136 archive.org links individually for edition, uploader, publication date, provenance, rights and text accessibility. Historical subject age alone does not authorize redistribution of modern scans or translations.
3. Distinguish an institution's *search gateway* from an item-specific permanent identifier. Enter a call number or accession number only when independently confirmed.
4. Add creator, original language, edition, date, access date, permalink, and permission reference when verified. Use `unknown` or omit absent metadata rather than inventing it.
5. Collector consent, exhibition, digital scans, reproduction, print-on-demand, translations and resale require separate recorded permissions and human review.
6. Preserve direct links and original editorial summaries; never ingest protected media or entire texts under a link-only claim.

## Cinematic navigation status
The fourteen original cinematic entrances are preserved verbatim. Four portal names match a research chamber *exactly*. The other ten are unresolved and must default to an unfiltered catalog until reviewed. The new offline `tools/chamber-bridge.cjs` resolves only exact matching names. This is an internal mapping gate; **the visitor-facing cinematic UI is not yet wired to that module**.

## Verification limitations
Focused navigation/rights fixtures were run locally; the full repository remains unavailable for cloning because the runtime could not resolve github.com. No full-repository Node or browser suite was executed. Do not represent a partial fixture pass as production readiness.
