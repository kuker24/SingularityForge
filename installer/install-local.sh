#!/bin/bash
set -euo pipefail

# SingularityForge project-local installer
# Usage: bash installer/install-local.sh [--dry-run] [target_directory]

DRY_RUN=false
TARGET_DIR=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    -*)
      echo "Error: Unknown option $1" >&2
      exit 1
      ;;
    *)
      if [[ -z "$TARGET_DIR" ]]; then
        TARGET_DIR="$1"
      else
        echo "Error: Multiple target directories specified" >&2
        exit 1
      fi
      shift
      ;;
  esac
done

TARGET_DIR="${TARGET_DIR:-.}"

if [ ! -d "$TARGET_DIR" ]; then
  echo "Error: Target directory '$TARGET_DIR' does not exist." >&2
  exit 1
fi

CLAUDE_DIR="$TARGET_DIR/.claude"
echo "Installing SingularityForge local profile to: $CLAUDE_DIR"
if [ "$DRY_RUN" = true ]; then
  echo "[dry-run] Enabled. No changes will be written."
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Create directories
if [ "$DRY_RUN" = true ]; then
  echo "[dry-run] created directory '$CLAUDE_DIR'"
  echo "[dry-run] created directory '$CLAUDE_DIR/hooks'"
else
  mkdir -p "$CLAUDE_DIR"
  mkdir -p "$CLAUDE_DIR/hooks"
  echo "created: directory '$CLAUDE_DIR'"
  echo "created: directory '$CLAUDE_DIR/hooks'"
fi

safe_copy() {
  local src="$1"
  local dest="$2"
  
  if [ -f "$dest" ]; then
    # File exists, back it up
    local timestamp
    timestamp=$(date +%Y%m%d-%H%M%S)
    local backup_file="${dest}.backup.${timestamp}"
    
    if [ "$DRY_RUN" = true ]; then
      echo "[dry-run] backed up '$dest' to '$backup_file'"
      echo "[dry-run] copied '$src' to '$dest'"
    else
      cp "$dest" "$backup_file"
      cp "$src" "$dest"
      echo "backed up: '$dest' to '$backup_file'"
      echo "copied: '$src' to '$dest'"
    fi
  else
    # File does not exist, copy directly
    if [ "$DRY_RUN" = true ]; then
      echo "[dry-run] copied '$src' to '$dest'"
    else
      cp "$src" "$dest"
      echo "copied: '$src' to '$dest'"
    fi
  fi
}

safe_copy "$REPO_ROOT/packages/templates/project/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"
safe_copy "$REPO_ROOT/packages/templates/project/.claude/settings.json" "$CLAUDE_DIR/settings.json"

for src_hook in "$REPO_ROOT/packages/templates/project/.claude/hooks/"*; do
  if [ -f "$src_hook" ]; then
    hook_name=$(basename "$src_hook")
    safe_copy "$src_hook" "$CLAUDE_DIR/hooks/$hook_name"
  fi
done

# Copy hook adapters to local directory
if [ "$DRY_RUN" = true ]; then
  echo "[dry-run] created directory '$CLAUDE_DIR/hooks/adapters'"
else
  mkdir -p "$CLAUDE_DIR/hooks/adapters"
  echo "created: directory '$CLAUDE_DIR/hooks/adapters'"
fi

for src_adapter in "$REPO_ROOT/packages/hooks/adapters/"*; do
  if [ -f "$src_adapter" ]; then
    adapter_name=$(basename "$src_adapter")
    safe_copy "$src_adapter" "$CLAUDE_DIR/hooks/adapters/$adapter_name"
  fi
done

if [ "$DRY_RUN" = true ]; then
  echo "[dry-run] chmod ok: executable permissions for hook wrappers"
  echo "[dry-run] chmod ok: executable permissions for hook adapters"
else
  chmod +x "$CLAUDE_DIR/hooks/"*.sh 2>/dev/null || true
  chmod +x "$CLAUDE_DIR/hooks/adapters/"*.sh 2>/dev/null || true
  echo "chmod ok: executable permissions for hook wrappers"
  echo "chmod ok: executable permissions for hook adapters"
fi

# Verification of hooks locally
if [ "$DRY_RUN" = false ]; then
  for sh_hook in "$CLAUDE_DIR/hooks/"*.sh; do
    if [ -f "$sh_hook" ]; then
      if [ -x "$sh_hook" ]; then
        echo "verified: executable '$sh_hook'"
      else
        echo "warning: not executable '$sh_hook'" >&2
      fi
    fi
  done
  
  # Run token cache optimizer for workspace local
  node "$REPO_ROOT/scripts/optimize-token-cache.mjs" "$CLAUDE_DIR"
else
  echo "[dry-run] node \"$REPO_ROOT/scripts/optimize-token-cache.mjs\" \"$CLAUDE_DIR\""
fi

echo "Local profile installation complete."
echo "You can now customize $CLAUDE_DIR/settings.json without affecting global configuration."
