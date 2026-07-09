#!/bin/bash
GLOBAL_HOOK="$HOME/.claude/hooks/stop-verify-before-done.sh"
if [ -f "$GLOBAL_HOOK" ]; then
  exec "$GLOBAL_HOOK"
else
  exit 0
fi
