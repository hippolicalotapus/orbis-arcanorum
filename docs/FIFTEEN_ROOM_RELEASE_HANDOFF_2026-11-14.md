# Fifteen-room cinematic release handoff (not deployed)

## Verified baseline

- Preserve the recovered fourteen distinct portal entrances, reading-room journeys and original Keeper's Observatory.
- Preserve the Fifteenth Room's final-seal cinematic, fourteen-visit discovery gate, skip/replay controls, and responsive behavior.
- The existing QA report `docs/FIFTEEN_ROOM_QA_2026-11-14.md` records 52 passing tests and mobile Chromium observations. These are historical results, not a new execution in this handoff.
- Production Netlify remains the older twelve-room build according to the QA checkpoint. **Do not describe the fifteen-room experience as live.**

## Release prerequisites

1. Confirm authenticated access to the correct Netlify site and its GitHub branch/build settings. The previous authentication attempt failed with `Invalid state key`; do not retry blindly.
2. Verify that the intended build source is `development/recovered-cinematic-entrances-20261114` at an explicitly recorded commit SHA; preserve the current production build as a rollback target.
3. Run the repository's documented offline tests and a fresh static-site smoke test on the exact release artifact; resolve any failures before publication.
4. Inspect all fifteen entrances and navigation on 320px, 390px and desktop widths; verify skip/replay, reduced-motion behavior, keyboard focus, and no horizontal overflow.
5. Confirm the fourteen catalog categories and their records have not been silently remapped to provisional portal labels; verify permissions for third-party assets and vendor links.
6. Obtain explicit publication approval, deploy once, verify the public URL, and record deployment ID, commit SHA, smoke-test outcome and rollback procedure.

## Stop conditions

Do not deploy if authentication is unavailable, tests fail, assets or rights are unverified, or the release SHA is not confirmed. No paid services or GitHub Actions are required for this handoff document.
