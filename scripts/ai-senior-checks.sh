#!/usr/bin/env bash
set -euo pipefail

npm run typecheck
npm run test:unit
npm run verify:skills
npm run audit:skills

echo "Senior checks passed."
