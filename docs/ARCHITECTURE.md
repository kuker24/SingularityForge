# Architecture - SingularityForge

## Architecture Principle

SingularityForge memakai arsitektur berlapis:

```txt
Global memory -> modular rules -> skill router -> task skills -> hooks/adapters -> validator/doctor -> evidence reports
```

Tujuannya agar Claude Code bekerja dengan konteks kecil, aturan jelas, verifikasi kuat, dan hasil bisa diulang lintas project.

## Runtime Layers

### 1. Global Memory Layer

Lokasi source repo:

```txt
packages/global-memory/CLAUDE.md
```

Lokasi install:

```txt
~/.claude/CLAUDE.md
```

Fungsi:

- Menentukan perilaku dasar agent.
- Mengarahkan agent ke rules dan skills.
- Menetapkan output report format.
- Menjaga token discipline.

### 2. Rules Layer

Lokasi source:

```txt
packages/rules/*.md
```

Lokasi install:

```txt
~/.claude/rules/*.md
```

Rules berisi aturan domain-specific:

- engineering
- security
- debugging
- testing
- frontend
- release
- token discipline

### 3. Skills Layer

Lokasi source:

```txt
packages/skills/<skill-name>/SKILL.md
```

Lokasi install:

```txt
~/.claude/skills/<skill-name>/SKILL.md
```

Skill dipakai untuk workflow berulang seperti repo intake, debug, review security, dan verify before done.

### 4. Hooks Layer

Lokasi source:

```txt
packages/hooks/
```

Lokasi install:

```txt
~/.claude/hooks/
```

Hooks menjadi enforcement layer untuk operasi yang perlu guardrail nyata. Hook Adapter Framework berada di bawah `packages/hooks/adapters/` dan divalidasi oleh `registry.json` + `scripts/validate-adapter-config.mjs`.

### 5. Runtime Validation Layer

Lokasi source:

```txt
scripts/doctor.mjs
scripts/validate-adapter-config.mjs
packages/hooks/adapters/registry.json
```

Fungsi:

- Memastikan Node.js >=20.
- Memastikan rules/skills/global memory tersedia.
- Memastikan Bash hooks dan Bash adapters executable pada Linux.
- Memperbaiki executable bit repo-local via `doctor --fix-permissions` untuk `installer/*.sh` dan `packages/hooks/**/*.sh`.
- Menghasilkan output machine-readable via `doctor --json`.
- Memastikan adapter resmi terdaftar, default OFF, dan tidak memiliki network call default.
- Memastikan konfigurasi eksternal tetap default OFF.
- Memverifikasi installer Linux di temp HOME via `npm run verify:installers`.

### 6. Profiles Layer

Lokasi source:

```txt
packages/profiles/
```

Profile menentukan seberapa banyak konteks dan tool yang boleh aktif.

### 7. Obsidian Layer

Lokasi source:

```txt
packages/obsidian/
```

Obsidian second brain menyimpan context jangka panjang, session logs, architecture notes, dan debug notes.

## Data Flow

```txt
User task
  -> CLAUDE.md reads the task
  -> token-router decides profile and skill
  -> selected skill scopes work
  -> evidence is gathered from files/docs/commands
  -> agent attacks assumptions
  -> hook or command verification runs
  -> session log and report are written
```

## Installed File Tree

```txt
~/.claude/
├── CLAUDE.md
├── SingularityForge.md
├── rules/
│   ├── engineering.md
│   ├── security.md
│   ├── debugging.md
│   ├── testing.md
│   ├── frontend.md
│   ├── release.md
│   └── token-discipline.md
├── skills/
│   ├── fable-mode/
│   ├── token-router/
│   ├── repo-intake/
│   ├── architecture-review/
│   ├── debug-e2e/
│   ├── verify-before-done/
│   ├── security-review/
│   ├── frontend-design-review/
│   ├── session-log/
│   └── obsidian-sync/
├── hooks/
│   ├── pre-dangerous-command.sh
│   ├── post-edit-skill-verify.sh
│   ├── stop-verify-before-done.sh
│   └── adapters/
│       ├── registry.json
│       ├── noop.sh
│       ├── logging.sh
│       ├── audit.sh
│       ├── external-placeholder.sh
│       └── run-adapters.sh
└── profiles/
```

## Project Template

```txt
project/
├── CLAUDE.md
├── .claude/
│   ├── settings.json
│   ├── rules/
│   ├── hooks/
│   └── skills/
├── docs/
│   ├── architecture.md
│   ├── decisions/
│   └── runbook.md
└── scripts/
    ├── verify.sh
    └── doctor.sh
```

## Token Discipline Architecture

Default mode adalah `minimal`.

SingularityForge tidak memuat semua skill sekaligus. Global memory hanya memuat prinsip inti dan mengarahkan agent memakai skill yang relevan.

Long context strategy:

1. Search dulu.
2. Read file relevan saja.
3. Gunakan summary notes.
4. Jangan paste scanner JSON besar ke chat.
5. Simpan evidence di file.

## Safety Architecture

Guardrail dibagi menjadi 3 level:

### Advisory

Rules dan skills memberi instruksi perilaku.

### Soft enforcement

Hooks menjalankan check dan memberi feedback.

### Hard block

Pre hooks dapat memblokir command destructive atau secret access.

## Integration Boundaries

### Default on

- Global memory
- Rules
- Core skills
- Basic verify scripts

### Opt-in

- Obsidian vault
- MCP
- Repomix
- Serena
- Context7
- OSV network scan
- Playwright browser test
- Mutation testing

## Design Decisions

1. `CLAUDE.md` global harus pendek.
2. Rules dipisahkan agar mudah dirawat.
3. Skills menggunakan official `SKILL.md` folder structure.
4. Hooks tidak destructive by default.
5. Evidence report menjadi source of truth klaim status.
6. Upstream third-party prompt artifact hanya inspiration, bukan source resmi.
