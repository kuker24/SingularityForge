# PowerShell implementation of stop-verify-before-done hook
Write-Host "Before stopping, confirm the final response includes:"
Write-Host "- Files touched"
Write-Host "- Commands run"
Write-Host "- Verification result"
Write-Host "- Risks"
Write-Host "- Next step"
exit 0
