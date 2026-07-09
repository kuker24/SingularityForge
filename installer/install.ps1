param(
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$ClaudeDir = Join-Path $HOME ".claude"
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupDir = Join-Path $HOME ".claude.singularityforge.backup.$Stamp"

function Invoke-Step($Description, [scriptblock]$Action) {
  if ($DryRun) {
    Write-Host "[dry-run] $Description"
  } else {
    & $Action
  }
}

Write-Host "SingularityForge installer"
Write-Host "Repo: $RepoRoot"
Write-Host "Target: $ClaudeDir"

$ClaudeCommand = Get-Command claude -ErrorAction SilentlyContinue
if ($ClaudeCommand) {
  Write-Host "Claude Code: found"
  try { claude --version } catch { }
} else {
  Write-Host "Claude Code: not found"
  Write-Host "Install Claude Code manually if needed:"
  Write-Host "irm https://claude.ai/install.ps1 | iex"
}

if (Test-Path $ClaudeDir) {
  Invoke-Step "Backup $ClaudeDir to $BackupDir" { Copy-Item -Recurse -Force $ClaudeDir $BackupDir }
}

Invoke-Step "Create Claude directories" {
  New-Item -ItemType Directory -Force $ClaudeDir | Out-Null
  New-Item -ItemType Directory -Force (Join-Path $ClaudeDir "rules") | Out-Null
  New-Item -ItemType Directory -Force (Join-Path $ClaudeDir "skills") | Out-Null
  New-Item -ItemType Directory -Force (Join-Path $ClaudeDir "hooks") | Out-Null
  New-Item -ItemType Directory -Force (Join-Path $ClaudeDir "profiles") | Out-Null
}

Invoke-Step "Install files" {
  Copy-Item -Force (Join-Path $RepoRoot "packages/global-memory/CLAUDE.md") (Join-Path $ClaudeDir "CLAUDE.md")
  Copy-Item -Recurse -Force (Join-Path $RepoRoot "packages/rules/*") (Join-Path $ClaudeDir "rules")
  Copy-Item -Recurse -Force (Join-Path $RepoRoot "packages/skills/*") (Join-Path $ClaudeDir "skills")
  Copy-Item -Recurse -Force (Join-Path $RepoRoot "packages/hooks/*") (Join-Path $ClaudeDir "hooks")
  Copy-Item -Recurse -Force (Join-Path $RepoRoot "packages/profiles/*") (Join-Path $ClaudeDir "profiles")
  Copy-Item -Force (Join-Path $RepoRoot "packages/templates/SingularityForge.md") (Join-Path $ClaudeDir "SingularityForge.md")
}

Write-Host "Install complete. Run: powershell -ExecutionPolicy Bypass -File installer/verify.ps1"
