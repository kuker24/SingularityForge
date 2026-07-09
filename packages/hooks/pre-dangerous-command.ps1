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

exit 0
