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
  $Items = Get-ChildItem $ClaudeDir -ErrorAction SilentlyContinue
  if ($Items) {
    Invoke-Step "Backup $ClaudeDir to $BackupDir" { Copy-Item -Recurse -Force $ClaudeDir $BackupDir }
  } else {
    Write-Host "Target folder exists but is empty, skipping backup."
  }
}

# Validation of source files
$SourceFiles = @(
  "packages/global-memory/CLAUDE.md",
  "packages/settings/settings.json",
  "packages/templates/SingularityForge.md"
)
foreach ($File in $SourceFiles) {
  $FullPath = Join-Path $RepoRoot $File
  if (-not (Test-Path $FullPath)) {
    Write-Error "Error: Source file $FullPath not found."
    exit 1
  }
}

$SourceDirs = @(
  "packages/rules",
  "packages/skills",
  "packages/hooks",
  "packages/profiles"
)
foreach ($Dir in $SourceDirs) {
  $FullPath = Join-Path $RepoRoot $Dir
  if (-not (Test-Path $FullPath)) {
    Write-Error "Error: Source directory $FullPath not found."
    exit 1
  }
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
  Copy-Item -Force (Join-Path $RepoRoot "packages/settings/settings.json") (Join-Path $ClaudeDir "settings.json")
  Copy-Item -Recurse -Force (Join-Path $RepoRoot "packages/rules/*") (Join-Path $ClaudeDir "rules")
  Copy-Item -Recurse -Force (Join-Path $RepoRoot "packages/skills/*") (Join-Path $ClaudeDir "skills")
  Copy-Item -Recurse -Force (Join-Path $RepoRoot "packages/hooks/*") (Join-Path $ClaudeDir "hooks")
  Copy-Item -Recurse -Force (Join-Path $RepoRoot "packages/profiles/*") (Join-Path $ClaudeDir "profiles")
  Copy-Item -Force (Join-Path $RepoRoot "packages/templates/SingularityForge.md") (Join-Path $ClaudeDir "SingularityForge.md")
}

Write-Host "Install complete."
Write-Host "Next steps:"
Write-Host "1. Verify the installation by running: powershell -ExecutionPolicy Bypass -File installer/verify.ps1"
Write-Host "2. Note that hooks are configured globally in ~/.claude/settings.json."
Write-Host "3. You can override settings locally in your project folder under .claude/settings.json."
Write-Host "4. Keep token usage in mind; default profile is 'minimal'."
