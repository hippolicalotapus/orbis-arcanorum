# Research import contract and verification plan

This is an **offline prototype contract**, not an export from the production archives. Never substitute synthetic fixtures for real research.

## Accepted JSON
Top-level array or object with `records` array, maximum 10,000 entries and 5 MiB file size.
Each record:
- `title`: required nonempty string
- `chamber`: required string, exact existing chamber name (case-insensitive)
- `summary`: optional plain-text string
- `sources`: optional array of `{ "label": "...", "url": "https://..." }`

All imported data stays in page memory; no server requests or database writes. The viewer creates text nodes for titles and summaries, and only HTTP(S) source links.

## Test procedure before deployment
1. Import `sample-research-import.json`; expect two records in two chambers. These are explicitly test data, not verified historical facts.
2. Import malformed JSON; expect a rejection, no crash.
3. Import an unknown chamber; expect a rejection with record position.
4. Import a source URL using `javascript:`; expect no clickable link.
5. Open the Observatory and chamber; verify navigation and record counts.
6. Save a reviewer note, reload, export JSON, and verify notes are intact.
7. Test narrow mobile viewport, keyboard-only navigation, and screen reader labels.

## Blocker: real archive source
The GitHub repository currently does not establish the actual live archive data schema or its read-only export endpoint. Do not invent records, endpoints, provenance, or link mappings. Before integrating, identify the deployed archive's actual storage and map each record to its canonical chamber ID. Keep the production database read-only and require an explicit deployment review.

## Evidence policy
Documented historical relationships need cited source URLs and a clear explanation. Similar motifs or speculative associations must not be presented as proven connections. No fabricated bibliography, unlicensed images, or invented provenance.
