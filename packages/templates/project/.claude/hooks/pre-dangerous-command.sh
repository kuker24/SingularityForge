#!/bin/bash
GLOBAL_HOOK="$HOME/.claude/hooks/pre-dangerous-command.sh"
if [ -f "$GLOBAL_HOOK" ]; then
  exec "$GLOBAL_HOOK"
else
  exit 0
fi
