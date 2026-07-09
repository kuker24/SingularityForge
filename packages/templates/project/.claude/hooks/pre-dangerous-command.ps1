$GlobalHook = Join-Path $HOME ".claude/hooks/pre-dangerous-command.ps1"
if (Test-Path $GlobalHook) {
  & $GlobalHook
} else {
  exit 0
}
