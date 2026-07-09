#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
chmod +x "$SCRIPT_DIR"/*.sh 2>/dev/null || true
chmod +x "$SCRIPT_DIR"/../packages/hooks/*.sh 2>/dev/null || true
chmod +x "$SCRIPT_DIR"/../scripts/*.sh 2>/dev/null || true
exec bash "$SCRIPT_DIR/install.sh" "$@"
