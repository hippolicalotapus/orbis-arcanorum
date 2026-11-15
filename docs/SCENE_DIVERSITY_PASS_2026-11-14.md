# Scene diversity and campaign captures — first three rooms

## User direction

The user rejected the repeated stone-arch model and requested distinct environments. Screenshots are intended for the incorporation GoFundMe. Campaign material must represent actual development previews honestly, excluding GIM, One Heart and adult content.

## Implemented

- Grimoires: close, angled manuscript and archive composition; page-turn and drifting parchment dust.
- Alchemy: view across a working laboratory, with a foreground retort, copper condensers, daylight and furnace; steam-rise and furnace-light animation.
- Lost Civilizations: downward excavation into a buried city; moving sand/dust and a shaft of light.
- These three scenes use rectangular frames rather than the repeated arched crop. Original v1 artwork remains preserved.
- A compact sticky Orbis header identifies room screenshots as Research Archives / Development Preview.
- Existing room order, research, imports, review notes, reading-room navigation and the Fifteenth Room gate are preserved.

These are the first three replacements. The other eleven original scene artworks and Fifteenth Room still need the user's requested diversity pass. QuestForge was inspected read-only; its saved website remains a simple prototype shell with several placeholders, while the newer development branch contains Level 1 player/DM maps, adventure material and print handouts. Its live deployment was not verified or changed in this pass.

## Artwork generation

The built-in image generator created the three original bitmap scenes. No paid external image service or API key was used. The image-generation prompts requested portrait photoreal cinematic environments, no UI or text, and no central doorway/stone arch. Composition briefs:

1. Grimoires: enormous illuminated manuscript in a close angled view; tactile parchment, broken wax seal and a deep irregular manuscript aisle.
2. Alchemy: corner-of-workbench perspective; large green retort, diagonal condenser tubing, brick furnace, timber ceiling, small spiral stair and cool dawn light.
3. Lost Civilizations: steep downward view from an excavation shelter; rope ladder, sand strata, terraces, a rectangular plaza, damaged statues and a deep chasm.

The generated bitmap is embedded in a self-contained SVG transport file for repository delivery; no vector substitute artwork is used. Embedded WebP bytes and source dimensions are checked. Original generated PNGs and the earlier artworks remain preserved.

## Verification

53 Node source/content checks passed. The new diversity gate failed before implementation and passed afterwards.

Current Chromium checks: all three new 768px scene images loaded; each played different observed animations; each reached ready and entered its reading room; no document horizontal overflow at 390px, 320px or 768px. Packaged image assets were checked again in Chromium, and the three campaign screenshots were captured from the functioning 390px preview. Raw observations are included with the screenshot archive.

The standalone shell Playwright suite remains unavailable in this sandbox; these current browser checks used the supported preview route. No claim of physical-phone testing or complete project readiness is made.

No Netlify publication, GitHub Actions run, public campaign post, payment or purchase was performed. Netlify still serves the older public site.
