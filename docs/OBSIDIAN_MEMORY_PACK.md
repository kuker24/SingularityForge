# Obsidian Memory Pack

## Apa Ini

Obsidian Memory Pack adalah package **opt-in** untuk durable project memory berbasis Markdown. Ia menyediakan vault template, project overview, ADR, debug note, session log, handoff, release note, dan daily note.

## Mengapa Opt-in

Runtime Linux/CachyOS stable tidak memerlukan Obsidian. Pack ini tidak memasang aplikasi Obsidian, tidak mengubah `~/.claude`, tidak memasang package eksternal, dan tidak melakukan network call.

## Setup Vault

```bash
npm run obsidian:setup -- --dry-run --target ~/SingularityForge-Vault
npm run obsidian:setup -- --target ~/SingularityForge-Vault
```

Default target adalah `./SingularityForge-Vault`. Setup bersifat non-destructive: file yang ada di-skip. Gunakan `--force` hanya untuk menimpa file template yang Anda pilih.

## Cara Pakai dengan Claude Code

1. Search notes first.
2. Read relevant notes only.
3. Work dan kumpulkan evidence.
4. Write session log ringkas.
5. Write handoff bila session lain harus melanjutkan.

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

## Security dan Token Discipline

- Jangan menyimpan secret, API key, token, credential, private key, atau `.env` content.
- Summarize evidence; jangan dump terminal log besar.
- Link related files bila berguna.

## Integrasi Eksternal

External Obsidian skills seperti `kepano/obsidian-skills` bersifat optional, tidak diinstal default, dan tidak memiliki network integration default. MCP, Repomix, Serena, Context7, OMNI, dan webhook tetap OFF.

## Verification

```bash
npm run obsidian:verify
```
