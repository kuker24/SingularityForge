#!/bin/bash
set -e

# SingularityForge project-local installer
# Usage: bash installer/install-local.sh [target_directory]

TARGET_DIR="${1:-.}"

if [ ! -d "$TARGET_DIR" ]; then
  echo "Error: Target directory '$TARGET_DIR' does not exist."
  exit 1
fi

CLAUDE_DIR="$TARGET_DIR/.claude"
echo "Installing SingularityForge local profile to: $CLAUDE_DIR"

# Create directories
mkdir -p "$CLAUDE_DIR"
mkdir -p "$CLAUDE_DIR/hooks"

# Copy template files
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cp "$REPO_ROOT/packages/templates/project/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"
cp "$REPO_ROOT/packages/templates/project/.claude/settings.json" "$CLAUDE_DIR/settings.json"

# Copy hook wrappers
cp "$REPO_ROOT/packages/templates/project/.claude/hooks/"* "$CLAUDE_DIR/hooks/"

# Make hook wrappers executable
chmod +x "$CLAUDE_DIR/hooks/"*.sh 2>/dev/null || true

echo "Local profile installation complete."
echo "You can now customize $CLAUDE_DIR/settings.json without affecting global configuration."
