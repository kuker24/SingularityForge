# SingularityForge PowerShell Hook Adapter Runner
# Mengeksekusi adapter-adapter aktif secara berurutan dan fail-safe.

$ErrorActionPreference = "SilentlyContinue"

$hookName = if ($args[0]) { $args[0] } else { "unknown" }
$eventMsg = if ($args[1]) { $args[1] } else { "" }

# Cari settings.json di folder terdekat
$settingsFile = ""
if (Test-Path ".\.claude\settings.json") {
    $settingsFile = ".\.claude\settings.json"
} elseif (Test-Path "..\.claude\settings.json") {
    $settingsFile = "..\.claude\settings.json"
} elseif (Test-Path "$Home\.claude\settings.json") {
    $settingsFile = "$Home\.claude\settings.json"
}

if (-not $settingsFile -or -not (Test-Path $settingsFile)) {
    Exit 0
}

try {
    # Parsing JSON sederhana menggunakan ConvertFrom-Json bawaan PowerShell
    $settingsContent = Get-Content -Raw -Path $settingsFile -ErrorAction SilentlyContinue
    if (-not $settingsContent) {
        Exit 0
    }
    
    $settings = $settingsContent | ConvertFrom-Json -ErrorAction SilentlyContinue
    if (-not $settings -or -not $settings.singularityForge -or -not $settings.singularityForge.hookAdapters) {
        Exit 0
    }

    $enabled = $settings.singularityForge.hookAdapters.enabled
    if ($enabled -ne $true -and $enabled -ne "true") {
        Exit 0
    }

    $active = $settings.singularityForge.hookAdapters.active
    $logDirRaw = $settings.singularityForge.hookAdapters.logDir
    if (-not $logDirRaw) {
        $logDirRaw = "~/.claude/logs"
    }

    # Resolve home folder shortcut
    $logDir = $logDirRaw
    if ($logDirRaw.StartsWith("~")) {
        $logDir = Join-Path $Home $logDirRaw.Substring(2).Replace("/", "\")
    }

    # Set environment variables untuk sub-process
    $env:SF_HOOK_ADAPTERS_ENABLED = "true"
    $env:SF_HOOK_ADAPTERS_LOG_DIR = $logDir

    # Tentukan direktori adapters
    $settingsDir = [System.IO.Path]::GetDirectoryName($settingsFile)
    $adaptersDir = Join-Path $settingsDir "hooks\adapters"
    if (-not (Test-Path $adaptersDir)) {
        $adaptersDir = Join-Path $Home ".claude\hooks\adapters"
    }

    # Eksekusi setiap adapter
    foreach ($adapter in $active) {
        $adapterScript = Join-Path $adaptersDir "$adapter.ps1"
        if (Test-Path $adapterScript) {
            # Jalankan adapter secara fail-safe
            powershell.exe -ExecutionPolicy Bypass -File $adapterScript $hookName $eventMsg 2>$null
        }
    }
} catch {
    # Fail-safe: abaikan error agar tidak memblokir core hook
}

Exit 0
