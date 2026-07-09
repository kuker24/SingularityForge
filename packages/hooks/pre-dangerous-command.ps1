# PowerShell implementation of pre-dangerous-command hook
param(
  [string]$InputObject
)

# If no input parameter, read from pipeline stdin
if (-not $InputObject) {
  if ($Input) {
    $InputObject = $Input | Out-String
  }
}

if (-not $InputObject) {
  # Accept empty input safely
  exit 0
}

# Parse input JSON
try {
  $Json = ConvertFrom-Json $InputObject -ErrorAction Stop
} catch {
  # If not valid JSON, treat it as raw command string
  $Json = [PSCustomObject]@{
    tool_input = [PSCustomObject]@{
      command = $InputObject
    }
  }
}

$Command = $Json.tool_input.command
if (-not $Command) {
  exit 0
}

$BlockedPatterns = @(
  "rm -rf /",
  "rm -rf ~",
  "rm -rf `$HOME",
  "cat ~/.ssh/id_rsa",
  "cat ~/.ssh/id_ed25519",
  "cat .env"
)

foreach ($Pattern in $BlockedPatterns) {
  if ($Command -like "*$Pattern*") {
    [Console]::Error.WriteLine("Blocked dangerous command pattern: $Pattern")
    exit 2
  }
}

$ApprovalPatterns = @(
  "git reset --hard",
  "git clean -fdx",
  "git push --force",
  "docker system prune -af"
)

foreach ($Pattern in $ApprovalPatterns) {
  if ($Command -like "*$Pattern*") {
    [Console]::Error.WriteLine("Command requires explicit user approval: $Pattern")
    exit 2
  }
}

# Run Hook Adapter Framework
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$AdapterRunner = Join-Path $ScriptDir "adapters\run-adapters.ps1"
if (Test-Path $AdapterRunner) {
    powershell.exe -ExecutionPolicy Bypass -File $AdapterRunner "pre-dangerous-command" $Command 2>$null
}

exit 0
