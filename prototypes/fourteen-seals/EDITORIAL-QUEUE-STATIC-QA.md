# Editorial queue verification — 2026-11-10

Inspected current source of `offline-editorial-queue.html` on `development/offline-research-review`.

## Static source checks (12/12 present)
- Local file reader: PASS
- JSON parser: PASS
- 5 MB file-size guard: PASS
- 10,000 record guard: PASS
- textContent rendering: PASS
- HTTP(S)-only source URL guard: PASS
- noreferrer/noopener external links: PASS
- Section filter: PASS
- Unreviewed-evidence filter: PASS
- Unverified-rights filter: PASS
- Clear loaded records: PASS
- 250-row rendering limit: PASS

**Scope limitation:** These are source-string checks, not execution of JavaScript, browser integration tests, accessibility tests, or proof of safe behavior for all inputs.

## Required runtime test matrix
1. Import a valid JSON array and a `{records:[...]}` object.
2. Reject malformed JSON and malformed record shapes; ensure prior loaded data stays visible.
3. Reject files over 5 MB and more than 10,000 entries.
4. Filter by section, search term, evidence, rights, and translation; verify counts.
5. Import title `<img src=x onerror=alert(1)>` and confirm it displays as inert text.
6. Import source URL `javascript:alert(1)` and confirm no clickable link is created.
7. Clear records and verify UI is empty.
8. Test narrow mobile viewport, keyboard focus, screen reader status announcements.
9. Verify no network requests are made during local import and filtering.

Do not expose real draft exports in public test artifacts. No deployment was performed.
