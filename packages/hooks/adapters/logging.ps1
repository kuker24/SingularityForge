# SingularityForge PowerShell Logging Hook Adapter
# Menulis log minimal dari trigger hook secara aman.

$ErrorActionPreference = "Stop"

$enabled = $env:SF_HOOK_ADAPTERS_ENABLED
$logDir = $env:SF_HOOK_ADAPTERS_LOG_DIR

if ($enabled -ne "true") {
    Exit 0
}

if (-not $logDir) {
    $logDir = Join-Path $Home ".claude\logs"
}

if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Force -Path $logDir | Out-Null
}

$timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")
$eventType = if ($args[0]) { $args[0] } else { "unknown" }
$eventMsg = if ($args[1]) { $args[1] } else { "no_message" }

# Redact potential sensitive info (simple token regex representation)
$safeMsg = $eventMsg -replace '[a-zA-Z0-9_-]{24,}', '[REDACTED]'

$logFile = Join-Path $logDir "hooks.log"
"[$timestamp] [$eventType] $safeMsg" | Out-File -Append -FilePath $logFile -Encoding utf8

Exit 0
