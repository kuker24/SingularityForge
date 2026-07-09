# SingularityForge PowerShell Audit Hook Adapter
# Menulis catatan audit eksekusi perintah hook.

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
$hookName = if ($args[0]) { $args[0] } else { "unknown_hook" }
$commandPreview = if ($args[1]) { $args[1] } else { "unknown_cmd" }

# Sanitize command preview to avoid secret exposure
$safeCmd = $commandPreview -replace '(--auth-token|-t|--token|--key|--password|-p)[[:space:]:=]+[^[:space:]]+', '$1 [REDACTED]'

$logFile = Join-Path $logDir "audit.log"
"[$timestamp] [AUDIT] Hook: $hookName | Cmd: $safeCmd" | Out-File -Append -FilePath $logFile -Encoding utf8

Exit 0
