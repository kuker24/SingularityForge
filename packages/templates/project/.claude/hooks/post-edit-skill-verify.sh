#!/bin/bash
GLOBAL_HOOK="$HOME/.claude/hooks/post-edit-skill-verify.sh"
if [ -f "$GLOBAL_HOOK" ]; then
  exec "$GLOBAL_HOOK"
else
  exit 0
fi
