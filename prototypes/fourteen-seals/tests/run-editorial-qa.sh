#!/usr/bin/env bash
# Run locally from repository root; never invokes Netlify or Supabase.
set -euo pipefail
cd "$(dirname "$0")/../../.."
node --version
if ! node -e "import('playwright')" >/dev/null 2>&1; then
  echo "Playwright is missing. Install locally: npm install --no-save --no-package-lock playwright@1.58.2"
  exit 2
fi
node --test prototypes/fourteen-seals/tests/editorial-queue.test.mjs
