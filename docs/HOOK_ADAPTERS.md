# Hook Adapter Framework

Hook Adapter Framework di SingularityForge memungkinkan pengembang mengintegrasikan tool audit, logging, atau webhook pihak ketiga ke dalam Claude Code hooks secara modular tanpa menyentuh source code inti hooks (`pre-dangerous-command`, `stop-verify-before-done`, dll.).

## Konsep Arsitektur

Secara default, core hooks mendelegasikan event lifecycle-nya ke folder `hooks/adapters/` jika diaktifkan.
```txt
Claude Code Hook Event ──> Core Hook (Bash/PowerShell)
                             │
                             └──> [Hook Adapter Framework]
                                    │
                                    ├──> noop.sh (Default)
                                    ├──> logging.sh (OFF)
                                    ├──> audit.sh (OFF)
                                    └──> external-placeholder.sh (OFF)
```

## Kebijakan Default (Default OFF)
Sesuai dengan **Security Model SingularityForge**, seluruh adapter hooks memiliki status default **OFF** (`enabled: false`).
Tidak ada request jaringan otomatis yang dipicu secara default, dan tidak ada credentials/secrets yang disimpan dalam file adapter.

## Cara Konfigurasi (settings.json)

Untuk mengonfigurasi adapter, edit berkas settings `~/.claude/settings.json`:
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

### Parameter Konfigurasi:
1. `enabled` (`boolean`): Mengaktifkan/menonaktifkan framework adapter secara global.
2. `active` (`array` of strings): Daftar adapter aktif yang akan dieksekusi secara berurutan. Pilihan: `noop`, `logging`, `audit`, `external-placeholder`.
3. `logDir` (`string`): Lokasi direktori target log audit dan logging.

---

## Aturan Keamanan (Security Rules)
1. **Pencegahan Leak**: Setiap log atau audit data wajib melewati penapisan regex (`sed`) untuk menyamarkan rahasia (kunci token, password, credential command line, token auth).
2. **Fail-Safe**: Kegagalan pada adapter tidak boleh memblokir jalannya Claude Code utama. Seluruh adapter harus menangani error secara internal dan mengembalikan exit code `0`.

---

## Contoh Custom Logging Lokal
Berikut adalah contoh log yang dihasilkan oleh logging adapter di `~/.claude/logs/hooks.log`:
```txt
[2026-07-09T22:35:10+07:00] [pre-dangerous-command] Attempted to run: rm -rf /tmp/test
[2026-07-09T22:35:15+07:00] [stop-verify-before-done] Checked output target verification status: PASS
```

## Batasan (Known Limitations)
Pada rilis `v0.5.0`, Hook Adapter Framework hanya diuji dan diverifikasi secara resmi untuk platform **Linux CachyOS** menggunakan Bash runtime. Dukungan untuk PowerShell di Windows direncanakan untuk iterasi selanjutnya.
