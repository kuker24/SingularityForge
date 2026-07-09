# Obsidian Memory Pack

## Apa Ini

Obsidian Memory Pack adalah package **opt-in** untuk durable project memory berbasis Markdown. Ia menyediakan vault template, project overview, tech stack, coding standards, ADR, debug note, session log, handoff, release note, dan daily note.

Tujuannya sederhana: Claude Code tidak perlu mulai dari nol setiap sesi. Claude dapat mencari catatan relevan, membaca hanya konteks yang dibutuhkan, bekerja, memverifikasi, lalu menulis session log atau handoff singkat.

## Mengapa Opt-in

Runtime Linux/CachyOS stable tidak memerlukan Obsidian. Pack ini tidak memasang aplikasi Obsidian, tidak mengubah `~/.claude`, tidak memasang package eksternal, dan tidak melakukan network call.

External integrations tetap default OFF:

```txt
MCP: OFF
Repomix: OFF
Serena: OFF
Context7: OFF
OMNI: OFF
webhook/network integrations: OFF
```

## Setup Vault

```bash
npm run obsidian:setup -- --dry-run --target ~/SingularityForge-Vault
npm run obsidian:setup -- --target ~/SingularityForge-Vault
npm run obsidian:verify
```

Default target adalah `./SingularityForge-Vault`. Setup bersifat non-destructive: file yang ada di-skip. Gunakan `--force` hanya jika Anda memang ingin menimpa file template yang sudah ada.

## Cara Pakai dengan Claude Code

### Saat mulai sesi Claude baru

Tempel instruksi ini di awal sesi:

```txt
Gunakan SingularityForge Obsidian Memory Pack.
Cari dulu catatan relevan di ~/SingularityForge-Vault sebelum bekerja.
Baca hanya note yang relevan.
Di akhir sesi, tulis session log dan handoff singkat ke vault.
Jangan simpan secret.
```

Tujuannya agar Claude melakukan alur:

```txt
task -> search notes -> read relevant notes -> work -> verify -> write session log/handoff
```

### Saat mulai project baru

Tempel instruksi ini ketika membuka project baru:

```txt
Buat project memory note untuk project ini di ~/SingularityForge-Vault/01-Projects/.
Isi project overview, tech stack, aturan coding, file penting, dan next step.
Gunakan format SingularityForge Obsidian Memory Pack.
Jangan simpan secret.
```

Minimal isi project memory note:

```md
# Project Name

## Project Purpose

## Tech Stack

## Important Files

## Coding Standards

## Current Status

## Next Step
```

### Saat selesai kerja

Tempel instruksi ini sebelum menutup sesi:

```txt
Tulis session log dan handoff ke ~/SingularityForge-Vault/05-Session-Logs/.
Cantumkan goal, files touched, commands run, verification result, risks, dan next step.
Jangan simpan secret.
```

Session log wajib ringkas. Jangan dump terminal log besar. Simpan hanya evidence summary, command penting, hasil verifikasi, risiko, dan next step.

## Struktur Vault

```txt
00-Inbox/          catatan belum diproses
01-Projects/       project overview
02-Architecture/   ADR dan arsitektur
03-Standards/      standar project
04-Skills/         notes workflow berulang
05-Session-Logs/   log dan handoff
06-Debug-Notes/    debugging history
07-Release-Notes/  release evidence
99-Archive/        arsip
```

## Template

- project overview
- tech stack
- coding standards
- architecture decision record
- session log
- session handoff
- debug note
- release note
- daily note

## Workflow yang Direkomendasikan

### 1. Search before read

Claude harus mencari catatan relevan dulu, bukan membaca semua vault.

```txt
Search notes first.
Read only relevant notes.
Do not load the whole vault.
```

### 2. Evidence before reasoning

Setiap keputusan penting sebaiknya berbasis evidence:

```txt
- file yang dibaca
- command yang dijalankan
- hasil verifikasi
- risk atau open question
```

### 3. Handoff before stop

Sebelum sesi ditutup, tulis handoff singkat agar sesi berikutnya bisa lanjut tanpa mengulang konteks.

```txt
Current state
What changed
Verified evidence
What not to repeat
Next best action
Files to inspect first
```

## Security dan Token Discipline

- Jangan menyimpan secret, API key, token, credential, private key, atau `.env` content.
- Summarize evidence; jangan dump terminal log besar.
- Link related files bila berguna.
- Baca note relevan saja.
- Jangan memakai vault sebagai tempat log mentah.

## Integrasi Eksternal

External Obsidian skills seperti `kepano/obsidian-skills` bersifat optional, tidak diinstal default, dan tidak memiliki network integration default. MCP, Repomix, Serena, Context7, OMNI, dan webhook tetap OFF.

## Verification

```bash
npm run obsidian:verify
```

Expected:

```txt
PASS count: 43
WARN count: 0
FAIL count: 0
```
