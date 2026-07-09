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
  # Ensure the directory is not empty before backing up, or handle backup cleanly
  if [[ -n "$(ls -A "$CLAUDE_DIR" 2>/dev/null)" ]]; then
    run "cp -R \"$CLAUDE_DIR\" \"$BACKUP_DIR\""
    say "Backup: $BACKUP_DIR"
  else
    say "Target folder exists but is empty, skipping backup."
  fi
fi

# Dry-run validation of source directories and files before copying
for file in "packages/global-memory/CLAUDE.md" "packages/settings/settings.json" "packages/templates/SingularityForge.md"; do
  if [[ ! -f "$REPO_ROOT/$file" ]]; then
    say "Error: Source file $REPO_ROOT/$file not found." >&2
    exit 1
  fi
done

for dir in "packages/rules" "packages/skills" "packages/hooks" "packages/profiles"; do
  if [[ ! -d "$REPO_ROOT/$dir" ]]; then
    say "Error: Source directory $REPO_ROOT/$dir not found." >&2
    exit 1
  fi
done

# Ensure local files have execute permissions in dry-run/real run
run "chmod +x \"$REPO_ROOT\"/installer/*.sh \"$REPO_ROOT\"/scripts/*.sh \"$REPO_ROOT\"/packages/hooks/*.sh 2>/dev/null || true"

run "mkdir -p \"$CLAUDE_DIR\""
run "mkdir -p \"$CLAUDE_DIR/rules\" \"$CLAUDE_DIR/skills\" \"$CLAUDE_DIR/hooks\" \"$CLAUDE_DIR/profiles\""
run "cp \"$REPO_ROOT/packages/global-memory/CLAUDE.md\" \"$CLAUDE_DIR/CLAUDE.md\""
run "cp \"$REPO_ROOT/packages/settings/settings.json\" \"$CLAUDE_DIR/settings.json\""
run "cp -R \"$REPO_ROOT/packages/rules/.\" \"$CLAUDE_DIR/rules/\""
run "cp -R \"$REPO_ROOT/packages/skills/.\" \"$CLAUDE_DIR/skills/\""
run "cp -R \"$REPO_ROOT/packages/hooks/.\" \"$CLAUDE_DIR/hooks/\""
run "cp -R \"$REPO_ROOT/packages/profiles/.\" \"$CLAUDE_DIR/profiles/\""
run "cp \"$REPO_ROOT/packages/templates/SingularityForge.md\" \"$CLAUDE_DIR/SingularityForge.md\""

# Ensure all scripts/hooks in target folder have execute permissions
run "chmod +x \"$CLAUDE_DIR\"/hooks/*.sh 2>/dev/null || true"

# Compile and optimize token cache
if [ "$DRY_RUN" = false ]; then
  node "$REPO_ROOT/scripts/optimize-token-cache.mjs"
else
  echo "[dry-run] node \"$REPO_ROOT/scripts/optimize-token-cache.mjs\""
fi

say "Install complete."
say "Next steps:"
say "1. Verify the installation by running: bash installer/verify.sh"
say "2. Note that hooks are configured globally in ~/.claude/settings.json."
say "3. You can override settings locally in your project folder under .claude/settings.json."
say "4. Keep token usage in mind; default profile is 'minimal'."
