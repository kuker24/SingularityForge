#!/usr/bin/env bash
set -euo pipefail

CLAUDE_DIR="$HOME/.claude"
DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    *) echo "Unknown argument: $arg" >&2; exit 1 ;;
  esac
done

run() {
  if [[ "$DRY_RUN" == "1" ]]; then
    echo "[dry-run] $*"
  else
    eval "$@"
  fi
}

if [[ ! -d "$CLAUDE_DIR" ]]; then
  echo "Nothing to uninstall. $CLAUDE_DIR does not exist."
  exit 0
fi

run "rm -f \"$CLAUDE_DIR/SingularityForge.md\""
run "rm -rf \"$CLAUDE_DIR/rules\""
run "rm -rf \"$CLAUDE_DIR/skills\""
run "rm -rf \"$CLAUDE_DIR/hooks\""
run "rm -rf \"$CLAUDE_DIR/profiles\""

echo "SingularityForge uninstall complete. Existing CLAUDE.md is not removed automatically. Restore from backup if needed."
