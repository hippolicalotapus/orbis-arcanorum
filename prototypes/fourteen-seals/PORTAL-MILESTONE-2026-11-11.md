# Engraved chamber entrances — implementation checkpoint

Base: `efcc87e830d80c02e3fc47a48ca737c4f5586d97`, branch `development/offline-research-review`.

## Implemented

- Fourteen distinct, locally rendered SVG engravings, reused in each chamber's reveal mechanism.
- Arched stone-and-metal entrance treatment, individual muted accents, entry instructions and a compass ornament above the atlas.
- Compact Observatory control with expanded state, retaining direct access and the existing illustrative investigation board.
- Keyboard focus moves to the chamber heading, returns to the selected portal, and returns to the Observatory control on close. Reduced-motion preference controls programmatic scrolling.
- Discovered seals receive a persistent marker for this page session. Repeated reveals still count once.
- All existing chamber names, selectors, entrance/reveal controls, import limits, editorial quarantine, URL filtering and local reviewer tools remain in place. No production files outside the prototype or database records were changed.

## Verified

- GitHub branch HEAD and latest completed workflow were checked against the base commit.
- Run `42988876606`: success; taxonomy/converter regressions, browser tests and screenshot upload all succeeded.
- Downloaded and visually inspected that run's actual 390px screenshot, including the fourteen chamber tiles and importer below the atlas. This screenshot predates this checkpoint and does not verify the new portal appearance.
- Local Node taxonomy, converter and existing site tests: **19 passed**.
- Local Python archive tests with mocked network operations: **25 passed**.
- Inline prototype JavaScript and new browser-test JavaScript pass syntax checks.

## Browser verification completed — offline milestone signed off

The initial local execution environment denied Chromium's socket creation, and the preview browser rejected local-file URLs. Those restrictions were not bypassed. The user subsequently approved GitHub QA; the hosted browser suite completed successfully as recorded below.

Two new Playwright tests are ready: five viewport widths (320, 390, 430, 768 and 1280), distinct SVGs, unclipped content, touch targets, offline requests, importer placement, keyboard focus restoration, unique-seal counting, preservation of unsaved reviewer form values, and Observatory expanded state. Existing import/XSS/quarantine browser regressions are unchanged.

The existing QA workflow includes the new tests and collects both the original synthetic-import screenshot and the new clean mobile atlas screenshot. The local runner now runs the complete prototype suite.

Commit with `[skip ci] [skip netlify]` to preserve this checkpoint without triggering hosted CI or a deploy. No hosted workflow was dispatched. No Netlify, Supabase, generation service or paid research operation was invoked. User approval is required before any hosted run that could consume credits or allowance.

Next: run the prepared browser suite in a permitted environment; inspect `test-artifacts/fourteen-portals-mobile.png`; fix any visual or interaction failures before declaring this milestone complete. Deployment remains separately unapproved.

## Hosted QA authorization

On 2026-11-11, the user approved running the prepared GitHub QA workflow and its Actions allowance usage. This documentation update triggers only the existing offline branch QA. Deployment and all other spending remain unapproved. Results will be recorded after browser tests and screenshot inspection.

## Final verified result

- Approved QA run: https://github.com/hippolicalotapus/orbis-arcanorum/actions/runs/42993343268
- Tested commit: `13aee443d07ed542371b9de951ba49a02d8226e6` (portal implementation `3c10192590cf9f6e786245634895204d4d56d0aa`; only authorization documentation changed afterward).
- GitHub taxonomy/conversion regressions: **7 passed**. Playwright browser tests: **5 passed**, including all five viewport widths and navigation/form-preservation checks. No failed or skipped tests.
- Artifact `13841964779` contains `fourteen-portals-mobile.png` (clean atlas) and `fourteen-chambers-mobile.png` (clearly synthetic import fixture). Both fresh 390px screenshots were downloaded and visually inspected: all fourteen distinct engraved entrances render, labels fit, the Observatory control remains secondary and the importer sits below the atlas. No visible horizontal overflow or clipped tile text.
- Offline milestone is complete. Physical Android device testing and deployment remain separate; no claim is made that the live site has changed.
- This final results-only commit uses `[skip ci] [skip netlify]`; it makes no code changes and starts no additional QA run. No Netlify deployment or Supabase change was made.
