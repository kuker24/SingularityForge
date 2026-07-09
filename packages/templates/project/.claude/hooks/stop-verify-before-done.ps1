$GlobalHook = Join-Path $HOME ".claude/hooks/stop-verify-before-done.ps1"
if (Test-Path $GlobalHook) {
  & $GlobalHook
} else {
  exit 0
}
