param(
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$ClaudeDir = Join-Path $HOME ".claude"

function Invoke-Step($Description, [scriptblock]$Action) {
  if ($DryRun) {
    Write-Host "[dry-run] $Description"
  } else {
    & $Action
  }
}

if (!(Test-Path $ClaudeDir)) {
  Write-Host "Nothing to uninstall. $ClaudeDir does not exist."
  exit 0
}

Invoke-Step "Remove SingularityForge marker" { Remove-Item -Force -ErrorAction SilentlyContinue (Join-Path $ClaudeDir "SingularityForge.md") }
Invoke-Step "Remove rules" { Remove-Item -Recurse -Force -ErrorAction SilentlyContinue (Join-Path $ClaudeDir "rules") }
Invoke-Step "Remove skills" { Remove-Item -Recurse -Force -ErrorAction SilentlyContinue (Join-Path $ClaudeDir "skills") }
Invoke-Step "Remove hooks" { Remove-Item -Recurse -Force -ErrorAction SilentlyContinue (Join-Path $ClaudeDir "hooks") }
Invoke-Step "Remove profiles" { Remove-Item -Recurse -Force -ErrorAction SilentlyContinue (Join-Path $ClaudeDir "profiles") }

Write-Host "SingularityForge uninstall complete. Existing CLAUDE.md is not removed automatically. Restore from backup if needed."
