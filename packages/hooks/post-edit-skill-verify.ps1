# PowerShell implementation of post-edit-skill-verify hook
# Check if package.json and scripts/verify-skills.mjs are present in working directory, then verify skills
if ((Test-Path "package.json") -and (Test-Path "scripts/verify-skills.mjs")) {
  npm run verify:skills
} else {
  Write-Host "skip: skill verifier not available in this repo"
}
exit 0
