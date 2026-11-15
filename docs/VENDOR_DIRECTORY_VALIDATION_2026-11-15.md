# Vendor directory validation checkpoint

Base: `756f0eed5f736be0aa1388dc1175e37ee33e45a9` on `development/recovered-cinematic-entrances-20261114`.

The public directory now validates exact approved status and bounded display fields before populating cards or filter options. Malformed rows no longer abort the entire directory. Optional storefront links must parse as absolute HTTPS URLs with a hostname and no credentials, whitespace, controls or backslashes. Names remain text rather than HTML. Archive data, rooms, visuals and backend configuration are unchanged.

Six behavioral fixtures execute the shipped page script and its filter events with DOM/network boundary substitutes. The baseline produced four expected failures; all six pass with this patch. The documented offline suite passes 82 tests, zero failures:

`node --test tests/*.test.cjs prototypes/fourteen-seals/tests/chamber-mapping.test.mjs prototypes/fourteen-seals/tests/convert-archive-export.test.mjs`

The lead independently reran this suite. Independent review passed for scope and quality. The recovered source is a partial snapshot with 129 baseline blobs verified against GitHub, not a claim of full repository reconstruction.

Six broader browser suites fail before execution because Playwright cannot be resolved through their ESM imports. A separate focused Chromium launch is blocked by socket restrictions. No actual browser, live database permissions, authentication or RLS verification is claimed. The existing contract has no explicit consent evidence; approval validation does not establish vendor consent. No schema or permission changes were made.

Prepared for a separate development branch. No deployment, publication, purchases or workflow runs were requested. Commit includes skip markers; no pull request is opened.
