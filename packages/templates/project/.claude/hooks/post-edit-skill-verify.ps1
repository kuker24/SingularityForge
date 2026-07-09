$GlobalHook = Join-Path $HOME ".claude/hooks/post-edit-skill-verify.ps1"
if (Test-Path $GlobalHook) {
  & $GlobalHook
} else {
  exit 0
}
