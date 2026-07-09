# SingularityForge project-local installer for Windows PowerShell
# Usage: powershell -ExecutionPolicy Bypass -File installer/install-local.ps1 [-TargetDir] <path> [-DryRun]

param (
    [string]$TargetDir = "",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

if (-not $TargetDir) {
    Write-Error "Error: Please specify a Target Directory."
    exit 1
}

$ResolvedTargetDir = Resolve-Path $TargetDir -ErrorAction SilentlyContinue
if (-not $ResolvedTargetDir) {
    Write-Error "Error: Target directory '$TargetDir' does not exist."
    exit 1
}

$ClaudeDir = Join-Path $ResolvedTargetDir ".claude"
Write-Host "Installing SingularityForge local profile to: $ClaudeDir"
if ($DryRun) {
    Write-Host "[dry-run] Enabled. No changes will be written."
}

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"

# Helper function to copy files safely with backup
function Safe-Copy($Src, $Dest) {
    if (-not (Test-Path $Src)) {
        Write-Warning "Source file not found: $Src"
        return
    }

    if (Test-Path $Dest) {
        $DestBackup = "$Dest.backup.$Stamp"
        if ($DryRun) {
            Write-Host "[dry-run] backup: '$Dest' to '$DestBackup'"
            Write-Host "[dry-run] copied: '$Src' to '$Dest'"
        } else {
            Copy-Item $Dest $DestBackup -Force
            Write-Host "backed up: '$Dest' to '$DestBackup'"
            Copy-Item $Src $Dest -Force
            Write-Host "copied: '$Src' to '$Dest'"
        }
    } else {
        if ($DryRun) {
            Write-Host "[dry-run] copied: '$Src' to '$Dest'"
        } else {
            Copy-Item $Src $Dest -Force
            Write-Host "copied: '$Src' to '$Dest'"
        }
    }
}

# Invoke steps
if ($DryRun) {
    Write-Host "[dry-run] created directory '$ClaudeDir'"
    Write-Host "[dry-run] created directory '$(Join-Path $ClaudeDir 'hooks')'"
    Write-Host "[dry-run] created directory '$(Join-Path $ClaudeDir 'hooks\adapters')'"
} else {
    New-Item -ItemType Directory -Force -Path $ClaudeDir | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $ClaudeDir "hooks") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $ClaudeDir "hooks\adapters") | Out-Null
    Write-Host "created: directory '$ClaudeDir'"
}

# Copy main files
Safe-Copy (Join-Path $RepoRoot "packages/templates/project/CLAUDE.md") (Join-Path $ClaudeDir "CLAUDE.md")
Safe-Copy (Join-Path $RepoRoot "packages/templates/project/.claude/settings.json") (Join-Path $ClaudeDir "settings.json")

# Copy proxy wrappers
$ProxyHooks = Get-ChildItem (Join-Path $RepoRoot "packages/templates/project/.claude/hooks/*")
foreach ($Hook in $ProxyHooks) {
    $HookDest = Join-Path $ClaudeDir "hooks\$($Hook.Name)"
    Safe-Copy $Hook.FullName $HookDest
}

# Copy adapters
$Adapters = Get-ChildItem (Join-Path $RepoRoot "packages/hooks/adapters/*")
foreach ($Adapter in $Adapters) {
    $AdapterDest = Join-Path $ClaudeDir "hooks\adapters\$($Adapter.Name)"
    Safe-Copy $Adapter.FullName $AdapterDest
}

# Trigger token optimization locally
if (-not $DryRun) {
    if (Test-Path (Join-Path $RepoRoot "scripts/optimize-token-cache.mjs")) {
        node (Join-Path $RepoRoot "scripts/optimize-token-cache.mjs") $ClaudeDir
    }
} else {
    Write-Host "[dry-run] node `"$RepoRoot\scripts\optimize-token-cache.mjs`" `"$ClaudeDir`""
}

Write-Host "Local profile installation complete."
Write-Host "You can now customize $(Join-Path $ClaudeDir 'settings.json') without affecting global configuration."
