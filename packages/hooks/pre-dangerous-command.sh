#!/usr/bin/env bash
set -euo pipefail

INPUT="${1:-}"
if [[ -z "$INPUT" ]]; then
  INPUT="$(cat 2>/dev/null || true)"
fi

blocked_patterns=(
  "rm -rf /"
  "rm -rf ~"
  "rm -rf \$HOME"
  "cat ~/.ssh/id_rsa"
  "cat ~/.ssh/id_ed25519"
  "cat .env"
)

for pattern in "${blocked_patterns[@]}"; do
  if [[ "$INPUT" == *"$pattern"* ]]; then
    echo "Blocked dangerous command pattern: $pattern" >&2
    exit 2
  fi
done

approval_patterns=(
  "git reset --hard"
  "git clean -fdx"
  "git push --force"
  "docker system prune -af"
)

for pattern in "${approval_patterns[@]}"; do
  if [[ "$INPUT" == *"$pattern"* ]]; then
    echo "Command requires explicit user approval: $pattern" >&2
    exit 2
  fi
done

# Run Hook Adapter Framework
SCRIPT_DIR="$(dirname "${BASH_SOURCE[0]}")"
if [ -f "$SCRIPT_DIR/adapters/run-adapters.sh" ]; then
  bash "$SCRIPT_DIR/adapters/run-adapters.sh" "pre-dangerous-command" "$INPUT" || true
fi

exit 0
