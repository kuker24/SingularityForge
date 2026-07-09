# Windows Native Hardening Verification Report

Generated: 2026-07-09
Version: v0.5.2
Status: **Experimental** (GitHub Actions `windows-latest` verified; native Windows user machine not yet validated)

---

## Scope

Laporan ini mendokumentasikan test harness yang ditambahkan di CI `windows-latest` untuk memverifikasi keandalan PowerShell Hook Adapter Framework pada kondisi edge-case yang sebelumnya belum diuji.

---

## Test Cases Ditambahkan di CI

### 1. `run-adapters.ps1` — Edge Case Settings

| Kondisi | Expected Exit Code | CI Status |
|---|:---:|:---:|
| Tidak ada `settings.json` | 0 | Verified via CI |
| `settings.json` kosong | 0 | Verified via CI |
| `settings.json` corrupt (invalid JSON) | 0 | Verified via CI |
| `hookAdapters.enabled = false` | 0 | Verified via CI |
| `hookAdapters.enabled = true`, `active = [noop]` | 0 | Verified via CI |
| `hookAdapters.active = []` (kosong) | 0 | Verified via CI |

### 2. `logging.ps1` — Write to Disk

| Test | Expected Behaviour | CI Status |
|---|---|:---:|
| Write `hooks.log` ke `$RUNNER_TEMP/sf-windows-log-test/logs/` | File exist, contains `test-hook` | Verified via CI |

### 3. `audit.ps1` — Write to Disk

| Test | Expected Behaviour | CI Status |
|---|---|:---:|
| Write `audit.log` ke `$RUNNER_TEMP/sf-windows-log-test/logs/` | File exist, contains `AUDIT` | Verified via CI |

### 4. `install-local.ps1 -DryRun`

| Test | Expected Behaviour | CI Status |
|---|---|:---:|
| DryRun ke `$RUNNER_TEMP/sf-win-installer-dryrun` | Exit 0, `.claude/` directory **tidak** dibuat | Verified via CI |

---

## Verifikasi Command (CI `windows-latest`)

```powershell
# run-adapters edge cases
Push-Location $dir_no_settings
powershell.exe -ExecutionPolicy Bypass -File run-adapters.ps1 "test-hook" "test-event"
# repeat per case...

# logging write test
$env:SF_HOOK_ADAPTERS_ENABLED = "true"
$env:SF_HOOK_ADAPTERS_LOG_DIR = $LogDir
powershell.exe -ExecutionPolicy Bypass -File logging.ps1 "test-hook" "test_message_12345"
Test-Path (Join-Path $LogDir "hooks.log")  # harus True

# audit write test
powershell.exe -ExecutionPolicy Bypass -File audit.ps1 "test-hook" "git push"
Test-Path (Join-Path $LogDir "audit.log")  # harus True

# installer dry-run
powershell.exe -ExecutionPolicy Bypass -File install-local.ps1 -TargetDir $TempTarget -DryRun
Test-Path (Join-Path $TempTarget ".claude")  # harus False
```

---

## Known Limitations

1. Semua tes dijalankan di GitHub Actions `windows-latest` (virtualized environment), bukan native Windows user machine.
2. `logging.ps1` dan `audit.ps1` belum diuji pada path dengan spasi atau karakter khusus Windows.
3. `run-adapters.ps1` belum diuji pada PowerShell versi < 5.1 atau Windows Server Core.
4. Status Windows tetap **Experimental** sampai ada evidence dari native Windows user machine yang disubmit.

---

## Status Keseluruhan

**Experimental** — CI `windows-latest` PASS, native user machine belum terverifikasi.
