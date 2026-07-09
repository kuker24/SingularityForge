# Windows PowerShell Hook Adapters (Experimental)

Dokumen ini mendokumentasikan implementasi modular Hook Adapter Framework untuk lingkungan Windows PowerShell.

## Status: Experimental
Karena verifikasi lingkungan pengembangan SingularityForge saat ini berfokus pada **Linux CachyOS**, dukungan PowerShell adapter di Windows diklasifikasikan sebagai **Experimental**. Seluruh berkas script telah dirancang dengan parity fungsional penuh, namun belum divalidasi secara lokal pada mesin Windows native.

---

## Arsitektur Parity Windows
Untuk setiap adapter Bash (`.sh`), SingularityForge menyertakan equivalent PowerShell script (`.ps1`) di dalam direktori `packages/hooks/adapters/`:
- `noop.ps1`
- `logging.ps1`
- `audit.ps1`
- `external-placeholder.ps1`
- `run-adapters.ps1` (Orchestrator runner)

---

## Contoh Konfigurasi settings.json di Windows

settings.json global (`$HOME\.claude\settings.json`) atau local (`.claude\settings.json`):
```json
{
  "singularityForge": {
    "profile": "minimal",
    "hookAdapters": {
      "enabled": true,
      "active": ["logging", "audit"],
      "logDir": "~/.claude/logs"
    }
  }
}
```

---

## Cara Uji Manual di Windows (PowerShell)

### 1. Dry Run Installer Lokal
```powershell
powershell -ExecutionPolicy Bypass -File installer/install-local.ps1 -TargetDir C:\Users\User\my-project -DryRun
```

### 2. Jalankan Runner Adapter secara Manual
```powershell
powershell -ExecutionPolicy Bypass -File packages/hooks/adapters/run-adapters.ps1 "pre-dangerous-command" "command_preview"
```
Jika diaktifkan, hasil output log akan terbuat di target folder (default `$HOME\.claude\logs\hooks.log` dan `$HOME\.claude\logs\audit.log`).
