# PRD - SingularityForge

Version: 0.2
Status: Draft foundation
Owner: kuker24
Target repo: https://github.com/kuker24/SingularityForge

## 1. Product Summary

SingularityForge adalah distribusi runtime global untuk Claude Code dan AI coding agent. Produk ini menyediakan global memory, rules, skills, hooks, installer lintas OS, Obsidian second brain, QA gate, security gate, dan evidence model.

Tujuan utamanya bukan membuat satu prompt super panjang, tetapi membangun sistem kerja agentic yang modular, hemat token, bisa diverifikasi, dan bisa dipasang di semua project.

## 2. Philosophy

```txt
Teacher, not workhorse.
Rules over vibes.
Evidence before reasoning.
Verify before done.
Skill over giant prompt.
Token discipline by default.
```

Makna praktis:

- AI bertindak sebagai orchestrator yang menulis method, bukan worker yang membaca semua konteks tanpa batas.
- Aturan penting harus tertulis di file, bukan hanya diingat di sesi chat.
- Keputusan harus berbasis evidence dari file, log, docs, command, atau source yang jelas.
- Tugas belum selesai sebelum ada verifikasi.
- Skill kecil lebih baik daripada prompt global raksasa.
- Context hanya dibuka sesuai kebutuhan.

## 3. Problem Statement

Workflow AI coding sering gagal karena:

1. Prompt global terlalu panjang dan boros token.
2. Agent membaca repo terlalu luas tanpa strategi.
3. AI sering mengulang kesalahan yang sama lintas sesi.
4. Tidak ada global standard untuk semua project.
5. Skill banyak tapi tidak punya router.
6. Security dan testing dilakukan belakangan.
7. Obsidian atau second brain tidak tersambung rapi ke coding session.
8. Installer tidak lintas OS.
9. Klaim `Verified` tidak punya evidence yang jelas.

## 4. Goals

### Product goals

1. Menyediakan sistem global Claude Code untuk semua project.
2. Menyediakan installer Linux, macOS, Windows PowerShell, dan Windows CMD.
3. Menyediakan default profile yang hemat token.
4. Menyediakan skill router dan skill inti.
5. Menyediakan hooks guardrail untuk operasi berisiko.
6. Menyediakan Obsidian second brain template.
7. Menyediakan QA/security verification matrix.
8. Menyediakan evidence discipline sejak commit awal.

### Engineering goals

1. Semua file konfigurasi bisa dibaca dan diaudit.
2. Installer harus idempotent.
3. Installer harus backup config lama sebelum menulis.
4. Hooks default soft-fail, kecuali secret/destructive guard.
5. MCP, Repomix, Serena, Context7, dan tool mahal harus opt-in.
6. Semua scanner output besar harus ignored dari git.
7. Semua claim status harus masuk `docs/VERIFICATION_MATRIX.md`.

## 5. Non-Goals

1. Tidak membuat model AI baru.
2. Tidak mengklaim model tertentu berubah menjadi model lain.
3. Tidak mengaktifkan semua MCP secara default.
4. Tidak menjalankan mutation testing otomatis.
5. Tidak menimpa konfigurasi user tanpa backup.
6. Tidak menyimpan API key, token, private key, atau `.env`.
7. Tidak memaksa editor tertentu.

## 6. Target Users

- Full stack engineer
- AI automation builder
- Security-conscious developer
- Monorepo maintainer
- Pengguna Claude Code lintas project
- Pengguna Obsidian
- Pengguna Linux CachyOS, Linux umum, macOS, Windows, dan WSL

## 7. Platform Support

MVP wajib mendukung:

```txt
Linux generic
Linux CachyOS via Linux generic path
macOS
Windows PowerShell
Windows CMD compatibility note
WSL
```

Catatan: CachyOS diperlakukan sebagai Linux generic, bukan platform official terpisah.

## 8. Core Architecture

```txt
SingularityForge
├── docs/
├── packages/
│   ├── global-memory/
│   ├── rules/
│   ├── skills/
│   ├── hooks/
│   ├── profiles/
│   ├── obsidian/
│   └── templates/
├── installer/
├── scripts/
├── tests/
├── reports/
└── .github/workflows/
```

Installed layout:

```txt
~/.claude/
├── CLAUDE.md
├── rules/
├── skills/
├── hooks/
├── profiles/
└── SingularityForge.md
```

Project template layout:

```txt
project/
├── CLAUDE.md
├── .claude/
│   ├── settings.json
│   ├── rules/
│   ├── hooks/
│   └── skills/
└── docs/
```

## 9. Memory Requirements

Global `CLAUDE.md` harus:

1. Ringkas.
2. Tidak menjadi prompt raksasa.
3. Mengarahkan agent memakai rules dan skills modular.
4. Mewajibkan evidence before reasoning.
5. Mewajibkan verify before done.
6. Meminta report yang mencantumkan file touched, command, result, risk, dan next step.

## 10. Skill Requirements

Skill MVP:

```txt
fable-mode
repo-intake
architecture-review
debug-e2e
verify-before-done
security-review
frontend-design-review
token-router
session-log
obsidian-sync
installer-doctor
release-check
```

Setiap skill wajib:

1. Punya `SKILL.md`.
2. Punya YAML frontmatter `name` dan `description`.
3. Punya instruksi ringkas.
4. Memakai progressive disclosure jika detail panjang.
5. Tidak menyimpan secret.
6. Bisa diaudit oleh `scripts/verify-skills.mjs`.

## 11. Hook Requirements

Hooks MVP:

```txt
pre-dangerous-command
pre-secret-read
post-edit-format
post-edit-lint
post-edit-skill-verify
stop-verify-before-done
session-log-write
```

Hook default tidak boleh destruktif. Pre hooks boleh memblokir:

- `rm -rf /`
- akses private key
- akses `.env` tanpa alasan jelas
- command yang memuat token secara literal
- destructive git command tanpa approval

## 12. Token Efficiency Requirements

1. Default profile `minimal`.
2. Global memory singkat.
3. Skill router memilih skill sesuai task.
4. Obsidian search dulu, baca file relevan saja.
5. MCP off by default.
6. Repomix opt-in.
7. Scanner output JSON tidak ditempel ke chat.
8. Session log berupa ringkasan.
9. Long reference disimpan di `references/`, bukan di `SKILL.md`.

## 13. Obsidian Requirements

Vault template:

```txt
SingularityForge-Vault/
├── 00-Inbox/
├── 01-Projects/
├── 02-Architecture/
├── 03-Standards/
├── 04-Skills/
├── 05-Session-Logs/
├── 06-Debug-Notes/
├── 07-Release-Notes/
└── 99-Archive/
```

Obsidian bersifat optional. User yang belum punya Obsidian tetap bisa memakai folder markdown biasa.

## 14. Quality Gate Requirements

Command target:

```bash
npm run typecheck
npm run test:unit
npm run test:coverage
npm run verify:skills
npm run audit:skills
pre-commit run --all-files
```

Tool optional/profile-based:

```bash
semgrep scan --config p/default --metrics=off
osv-scanner scan source -r .
gitleaks git --redact .
npx knip
npx playwright test --project=chromium
repomix --compress
```

Mutation testing manual only:

```bash
npm run mutation
```

## 15. Security Requirements

1. `.env`, private key, token, dan credential tidak boleh commit.
2. Gitleaks config disediakan.
3. Semgrep workflow tersedia.
4. OSV-Scanner status Supported, network-dependent, not hard-blocking by default.
5. Hooks memblokir akses rahasia yang jelas berisiko.
6. Security report disimpan di `reports/security/` dan file hasil scan besar di-ignore.

## 16. Installer Requirements

Installer flow:

```txt
1. Detect OS
2. Detect shell
3. Detect Claude Code
4. Backup ~/.claude jika ada
5. Install global memory
6. Install rules
7. Install skills
8. Install hooks
9. Install profiles
10. Optional install Obsidian vault template
11. Run verify
12. Print next step
```

Installer harus menyediakan:

```txt
installer/install.sh
installer/install-linux.sh
installer/install-macos.sh
installer/install.ps1
installer/verify.sh
installer/verify.ps1
installer/uninstall.sh
installer/uninstall.ps1
```

## 17. Profile Requirements

Profiles:

- `minimal`: default, hemat token
- `coding`: coding harian
- `repo-review`: intake dan review repo
- `security`: audit security
- `release`: release preparation
- `max`: task besar dengan approval ketat

## 18. Evidence Model

Status yang boleh dipakai:

- `Verified`: sudah ada evidence command/run.
- `Supported`: tersedia, tapi belum full verified atau bergantung network/tool eksternal.
- `Manual only`: tidak boleh otomatis.
- `Unverified`: belum ada evidence.
- `Needs review`: ada potensi masalah atau belum diaudit cukup.

Semua status wajib dicatat di `docs/VERIFICATION_MATRIX.md`.

## 19. Acceptance Criteria

MVP selesai jika:

1. Repo punya struktur lengkap.
2. Installer Linux, macOS, dan Windows tersedia.
3. Global memory bisa dipasang ke `~/.claude/CLAUDE.md`.
4. Minimal 8 skill inti tersedia.
5. Skill verifier PASS.
6. Skill audit membuat report.
7. Hooks scaffold tersedia.
8. Obsidian vault template tersedia.
9. CI workflow tersedia.
10. Security workflow tersedia.
11. README menjelaskan install, verify, uninstall, safety.
12. Semua klaim status punya evidence atau ditandai belum verified.

## 20. Definition of Done v1.0

```txt
1. Install works on Linux CachyOS via Linux generic path.
2. Install works on macOS.
3. Install works on Windows PowerShell.
4. Verify scripts PASS.
5. CI green.
6. Security workflow green.
7. Skill audit green.
8. Docs complete.
9. Release tag created.
10. Evidence report stored.
```
