#!/usr/bin/env bash
# SingularityForge Audit Hook Adapter
# Menulis catatan audit eksekusi perintah hook.

set -euo pipefail

ENABLED="${SF_HOOK_ADAPTERS_ENABLED:-false}"
LOG_DIR="${SF_HOOK_ADAPTERS_LOG_DIR:-$HOME/.claude/logs}"

if [ "$ENABLED" != "true" ]; then
  exit 0
fi

mkdir -p "$LOG_DIR"

TIMESTAMP=$(date -Iseconds)
HOOK_NAME="${1:-unknown_hook}"
COMMAND_PREVIEW="${2:-unknown_cmd}"

# Sanitize command preview to avoid secret exposure
SAFE_CMD=$(echo "$COMMAND_PREVIEW" | sed -E 's/(--auth-token|-t|--token|--key|--password|-p)[[:space:]:=]+[^[:space:]]+/\\1 [REDACTED]/g')

echo "[$TIMESTAMP] [AUDIT] Hook: $HOOK_NAME | Cmd: $SAFE_CMD" >> "$LOG_DIR/audit.log"
exit 0
