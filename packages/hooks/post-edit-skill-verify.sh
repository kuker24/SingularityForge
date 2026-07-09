#!/usr/bin/env bash
set -euo pipefail

if [[ -f package.json && -f scripts/verify-skills.mjs ]]; then
  npm run verify:skills
else
  echo "skip: skill verifier not available in this repo"
fi
