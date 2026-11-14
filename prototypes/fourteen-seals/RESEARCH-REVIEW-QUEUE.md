# Research review queue — verified inventory (2026-11-10)

Read-only query of `public.archive_resources`:
- Total: 91
- Source URLs present: 91 (nonempty, not independently checked for availability or authority)
- Evidence class `unreviewed`: 78
- Rights status `unverified`: 91
- Publication status `draft`: 91

## Editorial gates (no automatic publication)
1. Verify source URL resolves and identifies the claimed source; check institution/catalogue provenance.
2. Classify evidence and document confidence; distinguish folklore, belief, historical claims, and modern speculation.
3. Check reproduction rights for text, image, and scanned material. Linking to sources and reproducing them are different actions.
4. Review English translations, noting original language and whether a human checked the translation.
5. Assign visual chamber using provisional mapping, and route culturally sensitive/unmapped categories to manual review.
6. Obtain explicit editorial approval before setting `publication_status='published'`.

## Reviewer interface specification
- Show title, original/English title, source name and URL, archive_section, evidence_class, rights_status, translation_status, publication_status.
- Sort drafts by incomplete review fields; offer filters by section and review state.
- Store reviewer comments separately with actor, timestamp, and audit trail.
- Read-only access to drafts must be authorized server-side; ordinary authenticated users must not see them.
- Do not embed secret/service-role keys or pre-export all drafts to a public asset.

## Acceptance criteria
- 91 draft records remain intact until approved.
- No anonymous or unapproved authenticated draft access.
- Published records only are returned by public queries.
- Browser, keyboard, and mobile tests performed before deployment.
- Netlify deployment only with explicit credit authorization.
