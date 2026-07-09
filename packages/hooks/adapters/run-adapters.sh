#!/usr/bin/env bash
# SingularityForge Hook Adapter Runner
# Mengeksekusi adapter-adapter aktif secara berurutan dan fail-safe.

set -euo pipefail

HOOK_NAME="${1:-unknown}"
EVENT_MSG="${2:-}"

# Tentukan root repositori atau target konfigurasi .claude
# Kita cari settings.json di folder terdekat
SETTINGS_DIR=""
if [ -f "./.claude/settings.json" ]; then
  SETTINGS_DIR="./.claude"
elif [ -f "../.claude/settings.json" ]; then
  SETTINGS_DIR="../.claude"
elif [ -f "$HOME/.claude/settings.json" ]; then
  SETTINGS_DIR="$HOME/.claude"
fi

if [ -z "$SETTINGS_DIR" ]; then
  # Fallback: jika tidak ada settings, langsung bypass exit 0
  exit 0
fi

SETTINGS_FILE="$SETTINGS_DIR/settings.json"

# Parsing settings.json sederhana tanpa jq
# Mengecek "enabled": true di bawah hookAdapters
ENABLED=$(grep -A 5 -i "hookAdapters" "$SETTINGS_FILE" 2>/dev/null | grep -i "enabled" | sed -E 's/.*:[[:space:]]*([a-z]+).*/\1/' || echo "false")

if [ "$ENABLED" != "true" ]; then
  exit 0
fi

# Parsing active list (membaca array)
# Contoh line: "active": ["noop", "logging"]
ACTIVE_LINE=$(grep -A 5 -i "hookAdapters" "$SETTINGS_FILE" 2>/dev/null | grep -i "active" | sed -E 's/.*:[[:space:]]*\[(.*)\].*/\1/' | sed 's/"//g' | sed 's/,/ /g' || echo "noop")

# Dapatkan logDir
LOG_DIR_RAW=$(grep -A 5 -i "hookAdapters" "$SETTINGS_FILE" 2>/dev/null | grep -i "logDir" | sed -E 's/.*:[[:space:]]*"(.*)".*/\1/' || echo "~/.claude/logs")

# Resolve home directory shortcut
LOG_DIR="${LOG_DIR_RAW/#\~/$HOME}"

# Set environment variables untuk dilewatkan ke sub-adapters
export SF_HOOK_ADAPTERS_ENABLED="true"
export SF_HOOK_ADAPTERS_LOG_DIR="$LOG_DIR"

ADAPTERS_DIR="$SETTINGS_DIR/hooks/adapters"
if [ ! -d "$ADAPTERS_DIR" ]; then
  # Jika local adapters folder tidak ada, cari di packages/global
  ADAPTERS_DIR="$HOME/.claude/hooks/adapters"
fi

for adapter in $ACTIVE_LINE; do
  ADAPTER_SCRIPT="$ADAPTERS_DIR/$adapter.sh"
  if [ -f "$ADAPTER_SCRIPT" ]; then
    # Eksekusi secara fail-safe
    bash "$ADAPTER_SCRIPT" "$HOOK_NAME" "$EVENT_MSG" 2>/dev/null || true
  fi
done

exit 0
