# Chamber interiors and continuous exploration

Base: `c1fbe1529ad828d5c1b2555b8f2c38bb0dc57998` on `development/offline-research-review`.

Implemented fourteen chamber guides with distinct scope descriptions and theme tags, accented interior entrances, an ornamental reveal mechanism, a parchment reveal, adjacent-chamber navigation with wraparound, top-of-page atlas return, and a clear local-research empty state linking to the importer. Guides describe editorial scope and do not fabricate research records or historical findings.

All original chamber names, import protections, record rendering, reviewer notes, Observatory access and reveal progress remain. No production database or deployment changes.

Local validation: 19 Node regressions passed; prototype and browser-test scripts parsed successfully. Added Playwright coverage for all fourteen guide/reveal/navigation flows, wraparound, import-tool access, all fourteen interiors at 320/390/768px and fresh viewport screenshots of the atlas, Celestial Mysteries and Grimoires & Magical Texts.

Hosted QA and visual screenshot review pending at this implementation commit. Continue under the user's approved GitHub QA workflow; do not deploy. Show actual webpage screenshots directly in chat, with no requirement for the user to navigate GitHub to see them.
