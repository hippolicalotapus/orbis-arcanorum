# Portal completion and local reading rooms

Base: `6172841dd0c89782dc26ad8e9ef96691ce654b08`, branch `development/offline-research-review`.

Preserves the fourteen generated fantasy scenes, physical opening props, individual animations, reviewer notes, Observatory and safe local importer.

## Implemented

- Explicit sealed → opening → ready → reading flow. Discovery is counted on completion or deliberate skip, not on the first click.
- Opening progress status, disabled entry while opening, Skip Opening and Enter Reading Room controls. Reduced-motion or pausing atmosphere finishes an active opening immediately.
- Completion follows the actual animation-end event, with a guarded fallback. Leaving/changing a chamber cancels pending completion so an old timer cannot unlock or count another chamber.
- Focus moves into a dedicated reading view and returns to the same ready portal. Imported records and unsaved reviewer notes are retained.
- Case-insensitive title/summary search, clear search, 12-record pages, visible match/page totals and bounded page controls. Replaces the old silent 200-record display cap; all accepted local records remain accessible.
- Clear distinction between local imported research and published/live data; no example records are added to the application automatically. Browser screenshot/video fixtures are explicitly synthetic.

## Validation checkpoint

19 local Node regressions passed; inline and browser-test scripts parse. Added browser tests for completion, skip, cancellation, pause/reduced motion, focus, local search, paging, records beyond 200, unsafe URL/XSS handling, notes/data preservation and reading-room viewport overflow.

Updated one existing empty-state navigation test to enter the new reading view before using its import-tools button. All original import/security and fourteen-opening tests remain.

Hosted QA, screenshots and actual opening-to-reading-room recording are pending at this commit. Do not deploy, alter Supabase or publish research. Existing user approval covers the GitHub QA workflow; implementation commits use `[skip netlify]`.

## Verified completion

- Tested code: `73d6bdf876271b7e25bfcbf887c7683885111b3e`.
- GitHub QA: https://github.com/hippolicalotapus/orbis-arcanorum/actions/runs/43005697208 — **21 passed** (7 taxonomy/conversion + 14 browser), zero failed/skipped. Also 19 local Node regressions passed.
- Actual 390px reading-room webpage screenshots and opening-to-reading-room recording were downloaded from artifact `13847807949` and inspected. The screenshots contain explicitly labelled synthetic playtest records, not live research.
- Verified lifecycle completion, skip and cancellation, reduced motion, focus restoration, title/summary search, three-page browsing, access to record 241, preserved notes/import counts, unsafe-link rejection and no horizontal overflow at 320/390/430/768px.
- Existing fourteen-opening, responsive atlas, importer/XSS/quarantine and Observatory regressions continue to pass. All prior artwork is unchanged.
- Milestone complete offline. No deployment, production data change or research publication. Results-only documentation commit skips CI and Netlify.
