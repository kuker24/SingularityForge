#!/usr/bin/env bash
# SingularityForge Logging Hook Adapter
# Menulis log minimal dari trigger hook secara aman.

set -euo pipefail

# Selalu exit 0 jika settings.json tidak membolehkan logging atau dinonaktifkan
ENABLED="${SF_HOOK_ADAPTERS_ENABLED:-false}"
LOG_DIR="${SF_HOOK_ADAPTERS_LOG_DIR:-$HOME/.claude/logs}"

if [ "$ENABLED" != "true" ]; then
  exit 0
fi

# Pastikan folder target log ada
mkdir -p "$LOG_DIR"

TIMESTAMP=$(date -Iseconds)
EVENT_TYPE="${1:-unknown}"
EVENT_MSG="${2:-no_message}"

# Redact potential sensitive info
SAFE_MSG=$(echo "$EVENT_MSG" | sed -E 's/[a-zA-Z0-9_-]{24,}/[REDACTED]/g')

echo "[$TIMESTAMP] [$EVENT_TYPE] $SAFE_MSG" >> "$LOG_DIR/hooks.log"
exit 0
