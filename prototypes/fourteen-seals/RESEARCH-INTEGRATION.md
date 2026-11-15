# Research integration and source quality contract

Status: PROPOSED; not yet connected to production data.

## Preserve production data
Do not replace, truncate, or seed the existing live research database with demo content. Map chamber IDs and names from the actual application before changing routing. Create a read-only adapter first and test against a staging environment.

## Record fields
Each record should provide: stable id, canonical chamber id, title, short visual caption, longer research text, evidence classification (documented / contested / folklore / unverified), sources[], image assets[], last reviewed date, and original language. Never treat a category label as proof that the claim is documented.

Each source: exact URL, title, institution/publisher, source type (primary / academic / museum / secondary / general reference), access date, supports_claim (description), verification status (verified / pending / broken). Wikipedia is general reference, not automatically invalid, but never substitute a generic institutional homepage for an exact supporting citation.

Each image: URL, descriptive alt text, creator, license or rights basis, attribution, original collection URL, and image classification (historical original / reconstruction / concept). No unlicensed scraping or unsupported authenticity claims.

## Acceptance checks
1. All 14 chamber IDs resolve to actual production categories.
2. Chamber counts agree with the read-only source dataset.
3. Each research card links to a stable detail view and its exact supporting source.
4. Broken, generic, and Wikipedia-only citations are flagged for editorial review.
5. Visuals have attribution and meaningful alt text.
6. Mobile and keyboard interaction works; reduced-motion option is respected.
7. No changes to production records or paid services without explicit approval.
8. Back up and record current deployment/version before merging.

## Prototype limitations
The standalone Fourteen Seals prototype currently contains only illustrative labels and animations. It has no live data connection and does not claim that sources, images, or animations are historically verified.
