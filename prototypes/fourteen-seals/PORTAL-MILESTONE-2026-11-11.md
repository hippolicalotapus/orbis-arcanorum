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

## Browser verification pending — milestone not yet signed off

The current execution environment denied Chromium's socket creation, so Playwright could not launch. The separate preview browser also rejected local-file URLs. Neither restriction was bypassed.

Two new Playwright tests are ready: five viewport widths (320, 390, 430, 768 and 1280), distinct SVGs, unclipped content, touch targets, offline requests, importer placement, keyboard focus restoration, unique-seal counting, preservation of unsaved reviewer form values, and Observatory expanded state. Existing import/XSS/quarantine browser regressions are unchanged.

The existing QA workflow includes the new tests and collects both the original synthetic-import screenshot and the new clean mobile atlas screenshot. The local runner now runs the complete prototype suite.

Commit with `[skip ci] [skip netlify]` to preserve this checkpoint without triggering hosted CI or a deploy. No hosted workflow was dispatched. No Netlify, Supabase, generation service or paid research operation was invoked. User approval is required before any hosted run that could consume credits or allowance.

Next: run the prepared browser suite in a permitted environment; inspect `test-artifacts/fourteen-portals-mobile.png`; fix any visual or interaction failures before declaring this milestone complete. Deployment remains separately unapproved.
