# Cinematic entrance focus verification — 2026-11-15

## Change

Automatic completion of an entrance could hide the keyboard-focused Skip button, leaving keyboard users without a visible focus position. The fourteen chamber entrances and shared Fifteenth Room component now move focus from that disappearing button to the available entry control. Completion leaves focus elsewhere untouched. Cancelled chamber openings cannot move focus or enable entry.

All original artworks, physical opening mechanisms, responsive framing, reading rooms, research catalog records, and the standalone Fifteenth Room discovery gate are preserved.

## Executed verification

Baseline: `development/recovered-cinematic-entrances-20261114` at `a8969f94450d812899d950c432c3203dfeea206f`.

- `node --test tests/site.test.cjs`: 42 passed before the change.
- `node --test tests/*.test.cjs prototypes/fourteen-seals/tests/chamber-mapping.test.mjs prototypes/fourteen-seals/tests/convert-archive-export.test.mjs`: 62 passed, 0 failed after the change.
- New regressions failed against the original focus behavior before the implementation. Final-seal coverage exercises timer, animation, reduced-motion and background completion. Chamber coverage exercises completion, focus elsewhere and cancellation.
- The executed interaction tests evaluate production JavaScript with controlled DOM and timer adapters. They do not establish real-browser focus rendering or visual quality.
- All 32 original WebP files were recovered through the GitHub connector with base64 encoding. Asset-integrity tests validate complete WebP bytes and embedded scene images.

Chromium could not start in the shell environment: its process singleton failed to create a socket with `Operation not permitted`, followed by a ptrace restriction. Browser tests and fresh mobile visual inspection remain unexecuted in this checkpoint. No browser pass is claimed.

## Branch preservation and release prerequisites

`integration/venice-offline-20261114` remains at `57389309aa336a43749983e4c2ffb3c6ea03e4a0`. The recovered development baseline is seven commits ahead and four behind that integration branch. Neither branch has been blindly merged or rewritten.

Before release, reconcile the integration branch deliberately; run fresh real-browser checks on all fifteen entrances at 320px, 390px and desktop widths, including visible keyboard focus and skip/replay behavior; confirm asset rights and intended source SHA; establish authenticated access to the existing Netlify site and a rollback target; and obtain publication approval. Keep the prior release handoff's gate and category-mapping requirements.

No deployment, GitHub Actions dispatch, production update, paid service, external outreach or Netlify authentication retry was performed.
