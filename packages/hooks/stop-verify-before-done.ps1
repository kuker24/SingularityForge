# PowerShell implementation of stop-verify-before-done hook
Write-Host "Before stopping, confirm the final response includes:"
Write-Host "- Files touched"
Write-Host "- Commands run"
Write-Host "- Verification result"
Write-Host "- Risks"
Write-Host "- Next step"

# Run Hook Adapter Framework
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$AdapterRunner = Join-Path $ScriptDir "adapters\run-adapters.ps1"
if (Test-Path $AdapterRunner) {
    powershell.exe -ExecutionPolicy Bypass -File $AdapterRunner "stop-verify-before-done" "verify_reminders_shown" 2>$null
}

exit 0
