# Realistic fantasy portals and atmosphere

Base: `7a0493ed99c2eb7bbedfe1e394b7c8c8979b0d14`, offline development branch.

The user approved a cinematic, physically textured fantasy direction and explicitly rejected repeating the same sample doorway everywhere. This implementation assigns fourteen different original generated environments to the fourteen archive chambers. These imagined scenes are decorative artwork, never historical evidence or real archive records.

## Implementation

- Locally hosted WebP thumbnails and larger interior images, loaded on demand; no third-party asset host or data request.
- Weathered stone, timber, copper, bronze, glass, roots and individual lighting environments replace the visible vector focal points. The original engravings remain in source as preserved prior work.
- Subtle mist drift and gradual lamplight modulation; fourteen distinct opening sequences replace rotating flat glyphs and generic zoom. These include insignia rotation, parchment unrolling, alchemical liquid reaction, sliding stone tablets, a book cover opening, sand brushing, releasing chains, constellation alignment, appearing tracks, a lantern sweep, lifting a case lid, turning an hourglass with sand flow, aligning astrolabe rings and unlocking a swinging vault door. Foreground effects use image-textured and shaded CSS layers over the scene artwork.
- Only visible surfaces animate. Background tabs and operating-system reduced-motion preference stop atmosphere; a Pause Atmosphere control also disables motion and animated scrolling.
- Existing chamber names, taxonomy, navigation, notes, import limits, quarantine and unsafe-URL/XSS protections remain.

## Validation

Local Node regression tests: 19 passed. Inline prototype and new browser-test scripts parse successfully.

Hosted browser QA and visual inspection are pending at this implementation commit. The expanded suite checks all fourteen assets and chamber assignments, download budgets, local-only requests, reduced motion, pause/resume, viewport overflow, and an actual browser recording of the entrance animation. Existing mobile, taxonomy, import and reviewer regressions remain included.

No Netlify deploy, Supabase change, publication of research, inventory or payment operation is authorized or performed. GitHub QA is authorized by the user. Use `[skip netlify]` on implementation commits and `[skip ci] [skip netlify]` on results-only documentation commits.
