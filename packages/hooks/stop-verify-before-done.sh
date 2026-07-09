#!/usr/bin/env bash
set -euo pipefail

cat <<'EOF'
Before stopping, confirm the final response includes:
- Files touched
- Commands run
- Verification result
- Risks
- Next step
EOF

# Run Hook Adapter Framework
SCRIPT_DIR="$(dirname "${BASH_SOURCE[0]}")"
if [ -f "$SCRIPT_DIR/adapters/run-adapters.sh" ]; then
  bash "$SCRIPT_DIR/adapters/run-adapters.sh" "stop-verify-before-done" "verify_reminders_shown" || true
fi

exit 0
