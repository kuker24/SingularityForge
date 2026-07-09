#!/usr/bin/env bash
set -euo pipefail

DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    *) echo "Unknown argument: $arg" >&2; exit 1 ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CLAUDE_DIR="$HOME/.claude"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$HOME/.claude.singularityforge.backup.$STAMP"

say() { printf '%s\n' "$*"; }
run() {
  if [[ "$DRY_RUN" == "1" ]]; then
    say "[dry-run] $*"
  else
    eval "$@"
  fi
}

say "SingularityForge installer"
say "Repo: $REPO_ROOT"
say "Target: $CLAUDE_DIR"

if command -v claude >/dev/null 2>&1; then
  say "Claude Code: found ($(claude --version 2>/dev/null || true))"
else
  say "Claude Code: not found"
  say "Install Claude Code manually if needed:"
  say "curl -fsSL https://claude.ai/install.sh | bash"
fi

if [[ -d "$CLAUDE_DIR" ]]; then
  run "cp -R \"$CLAUDE_DIR\" \"$BACKUP_DIR\""
  say "Backup: $BACKUP_DIR"
fi

run "mkdir -p \"$CLAUDE_DIR\""
run "mkdir -p \"$CLAUDE_DIR/rules\" \"$CLAUDE_DIR/skills\" \"$CLAUDE_DIR/hooks\" \"$CLAUDE_DIR/profiles\""
run "cp \"$REPO_ROOT/packages/global-memory/CLAUDE.md\" \"$CLAUDE_DIR/CLAUDE.md\""
run "cp -R \"$REPO_ROOT/packages/rules/.\" \"$CLAUDE_DIR/rules/\""
run "cp -R \"$REPO_ROOT/packages/skills/.\" \"$CLAUDE_DIR/skills/\""
run "cp -R \"$REPO_ROOT/packages/hooks/.\" \"$CLAUDE_DIR/hooks/\""
run "cp -R \"$REPO_ROOT/packages/profiles/.\" \"$CLAUDE_DIR/profiles/\""
run "cp \"$REPO_ROOT/packages/templates/SingularityForge.md\" \"$CLAUDE_DIR/SingularityForge.md\""

say "Install complete. Run: bash installer/verify.sh"
