# PowerShell implementation of post-edit-skill-verify hook
# Check if package.json and scripts/verify-skills.mjs are present in working directory, then verify skills
if ((Test-Path "package.json") -and (Test-Path "scripts/verify-skills.mjs")) {
  npm run verify:skills
} else {
  Write-Host "skip: skill verifier not available in this repo"
}

# Run Hook Adapter Framework
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$AdapterRunner = Join-Path $ScriptDir "adapters\run-adapters.ps1"
if (Test-Path $AdapterRunner) {
    powershell.exe -ExecutionPolicy Bypass -File $AdapterRunner "post-edit-skill-verify" "skills_verified" 2>$null
}

exit 0
