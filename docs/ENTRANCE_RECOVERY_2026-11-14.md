# Original entrance recovery — 2026-11-14

This is a recovery checkpoint, not completion of the fifteen-room visual brief.

## Sources

- Existing site and research baseline: `fix/orbis-fourteen-chamber-homepage-20261114`, `3fe8c3cb8ede2d6c8fe5a3e9384c79cfc574eb9c`.
- Original prototype branch `feature/fourteen-seals-prototype` at `26d74bffce93b5abaa658f53c47d2649013a68e1` contains the early interaction prototype, without the later artwork.
- Original design branch `design/ancient-library-review` at `377413332839dae85e2e8636929f8d59ae474a7a` contains early styling and catalog design notes, without the later artwork.
- The complete later portal implementation was recovered from `development/navigation-checkpoint-20261111`, `8a0f4358c56a7a6d5db71a5274d8976e2992c315`.

## Preserved work

Restored all 63 original files beneath `prototypes/fourteen-seals/`: fourteen distinct scenes and opening mechanisms, 28 scene/thumbnail WebPs, four physical prop WebPs, Keeper’s Observatory/investigation board, keyboard navigation, notes, import tools, and tests. Every restored file matches its source Git blob SHA exactly. The homepage now offers a direct link to the recovered experience. Current research files, current chamber taxonomy, current catalog navigation, and the existing gated Fifteenth Room remain intact.

The prototype’s conceptual chamber labels differ from the current research taxonomy. This checkpoint does not silently remap records or imply database integration. Its Observatory retains original reviewer access; the root Fifteenth Room retains its catalog-visit gate. Unifying those experiences is still pending.

## Executed verification

`node --test tests/*.test.cjs prototypes/fourteen-seals/tests/chamber-mapping.test.mjs prototypes/fourteen-seals/tests/convert-archive-export.test.mjs`

51 passed, 0 failed. The new homepage-link regression was observed failing before the link was added, and passing afterwards. Restored JavaScript parses; all fourteen opening definitions are distinct; all 32 WebP files were recovered and the scene image lengths were checked. All 63 recovered files were compared byte-for-byte through their Git blob hashes.

## Browser verification blocked

The full recovered browser suite was attempted. System Chromium cannot start in this execution sandbox: `process_singleton_posix.cc socket() failed: Operation not permitted`. Running local Chromium with elevated permissions was rejected by the session approval policy. The expected Playwright headless-shell executable is absent and the official browser download failed. The separate browser cannot reach the local HTTP preview; file navigation is disallowed there.

No new Chromium screenshots were captured. Existing documentation’s older browser evidence is historical and is not evidence of this recovered combination. No new cinematic or mobile-layout modifications are included in this checkpoint.

## Remaining work

- Run the complete recovered browser suite in an execution environment that supports Chromium.
- Test each of the fourteen scene/animation/reading-room journeys at narrow-phone, normal-phone, tablet and desktop widths; inspect intermediate animation frames.
- Reconcile the root Fifteenth Room with the original Observatory and provide its own cinematic entrance while preserving existing access semantics.
- Connect preserved research without silently reclassifying records or forcing sensitive categories into unrelated chambers.
- Fix observed failures, capture genuine current screenshots for all fifteen rooms, and commit only those verified follow-up changes.

No deployment, publication, GitHub Actions run, account/database change, payment or paid service was performed. No PR is opened. Recovery commit includes `[skip ci] [skip netlify]` and targets a development branch outside the preserved workflow’s push filters.
