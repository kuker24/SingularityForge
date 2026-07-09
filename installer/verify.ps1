$ErrorActionPreference = "Stop"
$ClaudeDir = Join-Path $HOME ".claude"
$Missing = @()

function Check-Path($Path) {
  if (Test-Path $Path) {
    Write-Host "ok: $Path"
  } else {
    Write-Host "missing: $Path"
    $script:Missing += $Path
  }
}

Check-Path (Join-Path $ClaudeDir "CLAUDE.md")
Check-Path (Join-Path $ClaudeDir "SingularityForge.md")
Check-Path (Join-Path $ClaudeDir "settings.json")
Check-Path (Join-Path $ClaudeDir "rules/engineering.md")
Check-Path (Join-Path $ClaudeDir "rules/security.md")
Check-Path (Join-Path $ClaudeDir "rules/token-discipline.md")
Check-Path (Join-Path $ClaudeDir "skills/fable-mode/SKILL.md")
Check-Path (Join-Path $ClaudeDir "skills/token-router/SKILL.md")
Check-Path (Join-Path $ClaudeDir "skills/verify-before-done/SKILL.md")
Check-Path (Join-Path $ClaudeDir "hooks/pre-dangerous-command.sh")
Check-Path (Join-Path $ClaudeDir "hooks/post-edit-skill-verify.sh")
Check-Path (Join-Path $ClaudeDir "hooks/stop-verify-before-done.sh")
Check-Path (Join-Path $ClaudeDir "hooks/pre-dangerous-command.ps1")
Check-Path (Join-Path $ClaudeDir "hooks/post-edit-skill-verify.ps1")
Check-Path (Join-Path $ClaudeDir "hooks/stop-verify-before-done.ps1")
Check-Path (Join-Path $ClaudeDir "profiles/minimal.md")

if (Get-Command claude -ErrorAction SilentlyContinue) {
  Write-Host "ok: claude command found"
} else {
  Write-Host "warning: claude command not found"
}

if ($Missing.Count -gt 0) {
  Write-Error "SingularityForge verification failed."
  exit 1
}

Write-Host "SingularityForge verification passed."
