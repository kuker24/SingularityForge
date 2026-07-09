# SingularityForge

**SingularityForge** adalah distribusi runtime global yang aman, modular, dan terstandardisasi untuk Claude Code dan AI coding agent. Repo ini menyediakan global memory, rules, skills, hooks (Bash & PowerShell), installer idempotent lintas OS, Obsidian second brain template, QA gate, security gate, release automation, dan evidence discipline.

Filosofi utama:
- **Teacher, not workhorse**: Mengajarkan agent berpikir, bukan hanya menulis baris kode.
- **Rules over vibes**: Mengandalkan aturan tertulis daripada asumsi model.
- **Evidence before reasoning**: Mencari fakta di file/logs sebelum mengambil kesimpulan.
- **Verify before done**: Menjalankan command verifikasi secara lokal sebelum selesai.
- **Skill over giant prompt**: Menjaga konteks tetap kecil dengan skill terisolasi.
- **Token discipline by default**: Meminimalkan konsumsi input token.

---

## Fitur Utama & Wiring Status

1. **Global Settings & Hook Wiring**:
   - `PreToolUse`: Melindungi environment dengan menghalangi command berbahaya (seperti `rm -rf /`) dan meminta konfirmasi tindakan destruktif.
   - `PostToolUse`: Menjalankan verifikasi skill secara otomatis ketika file skill berubah.
   - `Stop`: Mengingatkan agent untuk menyusun evidence report sebelum selesai.
2. **PowerShell Windows Support**: PowerShell hooks (`.ps1`) disediakan sejajar dengan Unix hooks untuk mendukung sistem Windows.
3. **Idempotent Lints & Installers**: Installer mendeteksi status Claude Code, membuat backup di `~/.claude.singularityforge.backup.<timestamp>`, memvalidasi source file sebelum menyalin, dan mengonfigurasi permissions secara otomatis.
4. **AstralForge Import Pipeline**: Scripts import modular `import-astralforge-skills.mjs` untuk mengunduh, mengaudit dari malware/destructive command, dan meletakkan skill baru ke staged review.
5. **Obsidian Integration**: Template Markdown siap pakai untuk Session Logs, Debug Notes, dan Architecture Decision Records (ADR).
6. **Token Cache & Memory Optimizer**: Mengompilasi dan memampatkan rules/skills relevan berdasarkan profile aktif (`minimal`/`coding`/`security`/dll.) ke dalam sebuah berkas memori tunggal `CLAUDE.md` teroptimasi secara dinamis guna menjaga budget context token tetap efisien.
7. **Linux Runtime Doctor & Adapter Validator**: `npm run doctor` memeriksa kesiapan runtime Linux/CachyOS, sedangkan `npm run validate:adapters` memvalidasi registry adapter, default OFF, dan tidak ada network call default.

---

## Quick Install & Usage

### Linux & macOS

1. **Dry Run** (Simulasikan tanpa memodifikasi data):
   ```bash
   bash installer/install.sh --dry-run
   ```
2. **Install**:
   ```bash
   bash installer/install.sh
   ```
3. **Verify**:
   ```bash
   bash installer/verify.sh
   ```
4. **Uninstall**:
   ```bash
   bash installer/uninstall.sh
   ```

### Windows (PowerShell)

1. **Dry Run**:
   ```powershell
   powershell -ExecutionPolicy Bypass -File installer/install.ps1 -DryRun
   ```
2. **Install**:
   ```powershell
   powershell -ExecutionPolicy Bypass -File installer/install.ps1
   ```
3. **Verify**:
   ```powershell
   powershell -ExecutionPolicy Bypass -File installer/verify.ps1
   ```
4. **Uninstall**:
   ```powershell
   powershell -ExecutionPolicy Bypass -File installer/uninstall.ps1
   ```

### Proyek Lokal (Workspace-Local Profile)

Untuk mem-bootstrap `.claude/` di root proyek tertentu agar tidak memengaruhi global settings secara destruktif:

1. **Dry Run**:
   ```bash
   bash installer/install-local.sh --dry-run /path/to/your/project
   ```
2. **Install**:
   ```bash
   bash installer/install-local.sh /path/to/your/project
   ```
   *Catatan: Jika berkas `.claude/settings.json` atau `CLAUDE.md` sudah ada di dalam proyek target, installer lokal akan secara otomatis membackup berkas tersebut dengan suffix timestamp.*

### Runtime Doctor & Adapter Validator

```bash
npm run doctor
npm run validate:adapters
```

Keduanya harus PASS pada baseline Linux/CachyOS. Doctor mengecek Node.js >=20, global memory, rules, skills, hook executable, adapter executable, registry, dan konfigurasi default OFF.

### Token Cache & Benchmark

Untuk mengompilasi aturan/skills secara dinamis serta mengukur tingkat penghematan token budget:

1. **Optimize Cache**:
   ```bash
   npm run token:optimize
   # Atau compile profile spesifik
   node scripts/optimize-token-cache.mjs --profile coding
   node scripts/optimize-token-cache.mjs --profile security
   node scripts/optimize-token-cache.mjs --profile all
   ```
2. **Run Savings Benchmark**:
   ```bash
   npm run token:benchmark
   # Atau ukur seluruh profile sekaligus
   node scripts/token-benchmark.mjs --profile all
   ```
   *Laporan statistik lengkap multi-profile disimpan di `reports/token/profile-token-benchmark.md`.*

---

## Profil Konteks (Profile Context Budget)

SingularityForge membatasi context window Claude Code berdasarkan profile aktif:
- `minimal` (default): Hanya memuat global memory dasar.
- `coding`: Menambahkan debug, unit tests, dan check.
- `repo-review`: Menambahkan repo intake dan visualisasi arsitektur.
- `security`: Menambahkan security audits.
- `release`: Menyiapkan log release dan checklist.

---

## Struktur Repositori

```txt
SingularityForge/
├── docs/                     # Dokumentasi arsitektur, PRD, security, hooks, release
├── installer/                # Installer (.sh, .ps1, .cmd)
├── packages/
│   ├── global-memory/        # CLAUDE.md global
│   ├── rules/                # Aturan domain (security, engineering, dll.)
│   ├── skills/               # Task-specific SKILL.md
│   ├── hooks/                # Bash & PowerShell hooks (termasuk adapters/)
│   ├── settings/             # Konfigurasi global settings.json
│   ├── obsidian/             # Vault template untuk Second Brain
│   └── templates/            # Template scaffold project
├── scripts/                  # CI, skill checkers, AstralForge pipeline
├── reports/                  # Evidence report lokal dan security scan
└── tests/                    # Smoke dan unit tests
```

---

## Status Verifikasi (Verification Matrix)

Lihat status terkini di [docs/VERIFICATION_MATRIX.md](docs/VERIFICATION_MATRIX.md). 
Laporan pengujian lokal yang sesungguhnya disimpan di folder [reports/](reports/).

## Safety Warning

- SingularityForge melarang penulisan credential, API key, atau token ke dalam repositori.
- Pastikan Anda memeriksa parameter hooks di `packages/settings/settings.json` sebelum melakukan modifikasi.
