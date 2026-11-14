# Fifteen-room cinematic verification — 2026-11-14

## Result

The recovered original fourteen portal scenes and opening sequences now have current Chromium evidence. A shared final-seal cinematic was added to the existing Fifteenth Room and original Keeper’s Observatory. The separate public Netlify deployment remains the old twelve-room build; this checkpoint has not changed production.

## Changes

- Preserve all fourteen original artworks, physical prop assets, opening mechanisms, reading-room journeys and original Observatory investigation board.
- Add a fourteen-point seal alignment and two doors opening into the recovered observatory artwork. The fifteenth animation has its own three keyframes, skip/replay controls, status text, and a continuation into the original Observatory.
- Preserve the standalone Fifteenth Room’s existing fourteen-unique-catalog-visit gate. The original Observatory’s reviewer entrance remains available, as before. This local-storage gate is a discovery feature, not authentication or protection for confidential content.
- Fix the standalone Fifteenth Room’s narrow-screen box sizing: its former 90% width plus fixed padding exceeded narrow viewports.
- Add a direct continuation from the unlocked Fifteenth Room to the preserved Observatory.
- Honor reduced-motion CSS, paused atmosphere, background tabs, keyboard focus and 44px controls in the new component.

## Current executed checks

Command:

`node --test tests/*.test.cjs prototypes/fourteen-seals/tests/chamber-mapping.test.mjs prototypes/fourteen-seals/tests/convert-archive-export.test.mjs`

52 passed, 0 failed. The added final-seal source gate was observed failing before implementation and passing after implementation.

Current Chromium checks used the supported managed preview. Responsive layouts were exercised inside a same-origin iframe with genuine 320px, 390px and 768px document viewports; this is CSS viewport testing, not Android hardware or mobile-UA emulation.

- All fourteen original opening journeys at 390px: image loaded at 768px source width, each distinct animation name observed while opening, ready state reached, reading-room entry worked, return to entrance and atlas worked.
- Every room at 320px and 768px: no document horizontal overflow. The fourteen reading-room entries passed at 320px with the page’s Pause Atmosphere control enabled.
- Fifteenth Room at 390px: final-left-open, final-right-open and final-align observed, ready state reached, continuation reached the original board with fourteen pins.
- Fifteenth Room at 320px: no horizontal overflow; Skip Opening and Replay Entrance both reached ready state.
- All fourteen current research catalog chambers were entered through their homepage links. Progress advanced from 1/14 through 13/14, then the final seal unlocked. The standalone revealed room and its Observatory continuation were then verified.
- Actual phone screenshots were captured and visually reviewed for all fifteen rooms. Additional intermediate animation frames and raw browser observations are included in the screenshot evidence archive.

The full standalone Playwright suite still cannot launch Chromium in the shell sandbox. That earlier environment failure has not been relabeled as a passing test suite. The supported browser preview allowed the current interaction and visual checks above instead. OS-level reduced-motion emulation and physical Android testing remain separate from the exercised Pause Atmosphere behavior.

## Preview repair

The default static preview injected its live-reload script into a JavaScript SVG string, breaking the preview’s inline script. A separate QA checkout now uses a plain static dev server through the same supported preview daemon, without source rewriting. No production application code was changed to work around that preview-only issue.

## Preserved distinctions and remaining release work

The original portal design uses provisional thematic labels that differ from the research catalog’s current fourteen categories. This checkpoint preserves both, without silently reclassifying any of the 360 catalog records. The prototype’s reading-room import is still separate from the root research catalog.

Netlify login returned Invalid state key after Google verification, and a fresh dashboard check remained signed out. Repeated login was stopped. No production branch update, Netlify deployment, GitHub Actions run, payment, new hosting purchase or database mutation was performed. Publishing the verified build to the existing Netlify site remains pending account access.

Continue from the recovery development branch, keeping skip-ci and skip-Netlify commit markers until an intentional deployment is possible.
