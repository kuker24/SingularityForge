#!/usr/bin/env bash
set -euo pipefail

if [[ -f package.json && -f scripts/verify-skills.mjs ]]; then
  npm run verify:skills
else
  echo "skip: skill verifier not available in this repo"
fi

# Run Hook Adapter Framework
SCRIPT_DIR="$(dirname "${BASH_SOURCE[0]}")"
if [ -f "$SCRIPT_DIR/adapters/run-adapters.sh" ]; then
  bash "$SCRIPT_DIR/adapters/run-adapters.sh" "post-edit-skill-verify" "skills_verified" || true
fi

