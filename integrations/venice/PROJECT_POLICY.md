# Venice AI — Orbis Arcanorum (offline integration policy)

## Status
The adapter at `integrations/venice/client.py` is opt-in and defaults to offline mode. A GitHub Actions secret named `VENICE_API_KEY` may exist, but is **not available** to local scripts or Venice itself. This integration does not grant Venice repository access, launch an agent, or make the project autonomous.

## Project-specific review brief
Review all fifteen rooms and cinematic entrances. Preserve recovered visual work and original historical research. Flag missing assets and provenance, rights and privacy issues. Vendor directory must remain rights-safe; do not publish or expose private Fifteenth Room material.

## Safe workflow
1. Review current branch, README, existing approved assets, test scripts and outstanding defects before proposing changes.
2. Use only sanitized, non-secret, non-personal material in AI prompts. Never send source files wholesale without review; repository content may contain confidential data.
3. Run `python3 integrations/venice/client.py --self-test` locally. Dry runs require a model identifier and a UTF-8 prompt file; they make no network calls.
4. Existing project regression command: `node --test tests/site.test.cjs`. Run locally where dependencies exist; record failures or missing dependencies honestly.
5. Propose small changes and test them offline. Commit to the integration/development branch only after verification; do not modify main.
6. Do not run GitHub Actions, deploy, publish, make purchases, send messages, or call a paid API without separate approval.

## API controls
- Endpoint: `https://api.venice.ai/api/v1/chat/completions`.
- API key: local environment variable `VENICE_API_KEY` only, never committed, logged, pasted in prompts or exposed in browser JavaScript.
- Live mode is **not authorized** by this policy; the current adapter supports `--live` and therefore requires an operator to enforce approval before use. Do not invoke it during offline work.
- Never put the key into Netlify frontend assets or static pages.
- Before any future live request: confirm available credits, explicit authorization, data classification, request size and budget cap.

## Evidence and limits
A passing mocked API test proves only request construction, not real Venice connectivity. The repository secret alone does not make Venice an autonomous development agent. This document adds no workflow triggers.
