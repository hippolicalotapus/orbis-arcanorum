# Orbis Arcanorum: 10,000-Record Acquisition Standard
Date: 2026-11-09
Goal: 10,000 unique, source-backed catalog records; thousands of linked digital objects where reuse rights allow.

## Baseline (verified live)
44 database records, 33 distinct source URLs, 0 published, 0 hosted files.
These are largely research leads, NOT 44 validated individual artifacts.

## Collection targets
- Grimoires, witchcraft and ceremonial magic: 1200
- Alchemy, Hermeticism and occult philosophy: 900
- Tantra, Buddhism and Hindu esotericism: 1000
- Sacred traditions, mysticism and theology: 1100
- Ghosts, spiritualism and hauntings: 900
- UFOs, cryptids and unexplained phenomena: 800
- Lost civilizations and ancient mysteries: 1100
- Folklore, mythology and magical creatures: 900
- Divination, astrology, tarot and symbolism: 800
- Ritual objects, amulets and occult botany: 1300

## Admission criteria
1. Specific individual item, not merely a museum homepage or general topic.
2. Stable original catalog identifier and canonical URL.
3. Title, institution, creator/date if known, item type, original description, geographic/cultural context.
4. Rights classification separately for metadata, thumbnail, and original binary.
5. Distinguish primary evidence, scholarship, belief/tradition, and speculative claims.
6. De-duplicate by institution + catalog ID; fallback canonical URL and fingerprint.
7. Publish only after editorial checks. Never fabricate missing fields.
8. Never expose restricted sacred or culturally sensitive material without contextual review.

## Acquisition pipeline
DISCOVER -> NORMALIZE -> DEDUPLICATE -> VERIFY SOURCE -> RIGHTS REVIEW -> EDITORIAL REVIEW -> PUBLISH.
Download binary only when authorized; store SHA-256, MIME, bytes, original URL, acquisition timestamp and provenance.
Prefer metadata linking for copyrighted or uncertain materials.
Batch 100 individual items at a time with audit results before scaling to 1000+.
Do not create paid infrastructure without checking plan limits and getting approval.

## Acceptance tests
- 10,000 unique individual catalog IDs, not 10,000 topics or search results.
- 100% records have a working canonical source reference.
- 100% published records have rights and editorial status reviewed.
- Public read access only to published records; anonymous write forbidden.
- Search, filters, pagination and mobile accessibility tested.
- Published files virus-checked and verified as genuine supported formats.
