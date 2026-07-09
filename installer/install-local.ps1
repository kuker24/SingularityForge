# SingularityForge project-local installer for Windows
# Usage: powershell -ExecutionPolicy Bypass -File installer/install-local.ps1 [target_directory]

param (
    [string]$TargetDir = "."
)

if (-not (Test-Path $TargetDir)) {
    Write-Error "Error: Target directory '$TargetDir' does not exist."
    exit 1
}

$ClaudeDir = Join-Path $TargetDir ".claude"
Write-Host "Installing SingularityForge local profile to: $ClaudeDir"

# Create directories
New-Item -ItemType Directory -Force -Path $ClaudeDir | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $ClaudeDir "hooks") | Out-Null

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

# Copy template files
Copy-Item (Join-Path $RepoRoot "packages/templates/project/CLAUDE.md") -Destination (Join-Path $ClaudeDir "CLAUDE.md") -Force
Copy-Item (Join-Path $RepoRoot "packages/templates/project/.claude/settings.json") -Destination (Join-Path $ClaudeDir "settings.json") -Force

# Copy hook wrappers
Copy-Item (Join-Path $RepoRoot "packages/templates/project/.claude/hooks/*") -Destination (Join-Path $ClaudeDir "hooks") -Force -Recurse

Write-Host "Local profile installation complete."
Write-Host "You can now customize $(Join-Path $ClaudeDir 'settings.json') without affecting global configuration."
