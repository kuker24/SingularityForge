#!/usr/bin/env bash
set -euo pipefail

CLAUDE_DIR="$HOME/.claude"
missing=0
check() {
  local path="$1"
  if [[ -e "$path" ]]; then
    echo "ok: $path"
  else
    echo "missing: $path" >&2
    missing=1
  fi
}

check "$CLAUDE_DIR/CLAUDE.md"
check "$CLAUDE_DIR/SingularityForge.md"
check "$CLAUDE_DIR/settings.json"
check "$CLAUDE_DIR/rules/engineering.md"
check "$CLAUDE_DIR/rules/security.md"
check "$CLAUDE_DIR/rules/token-discipline.md"
check "$CLAUDE_DIR/skills/fable-mode/SKILL.md"
check "$CLAUDE_DIR/skills/token-router/SKILL.md"
check "$CLAUDE_DIR/skills/verify-before-done/SKILL.md"
check "$CLAUDE_DIR/hooks/pre-dangerous-command.sh"
check "$CLAUDE_DIR/hooks/post-edit-skill-verify.sh"
check "$CLAUDE_DIR/hooks/stop-verify-before-done.sh"
check "$CLAUDE_DIR/hooks/pre-dangerous-command.ps1"
check "$CLAUDE_DIR/hooks/post-edit-skill-verify.ps1"
check "$CLAUDE_DIR/hooks/stop-verify-before-done.ps1"
check "$CLAUDE_DIR/profiles/minimal.md"

if command -v claude >/dev/null 2>&1; then
  echo "ok: claude command found"
else
  echo "warning: claude command not found"
fi

if [[ "$missing" -ne 0 ]]; then
  echo "SingularityForge verification failed." >&2
  exit 1
fi

echo "SingularityForge verification passed."
