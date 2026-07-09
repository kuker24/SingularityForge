# SingularityForge

**SingularityForge** adalah distribusi runtime global untuk Claude Code dan AI coding agent. Repo ini menyimpan PRD, arsitektur, global memory, rules, skills, hooks, installer lintas OS, Obsidian second brain template, QA gate, security gate, dan evidence model.

Filosofi utama:

```txt
Teacher, not workhorse.
Rules over vibes.
Evidence before reasoning.
Verify before done.
Skill over giant prompt.
Token discipline by default.
```

## Tujuan

SingularityForge dibuat untuk memasang satu sistem global yang bisa dipakai di semua project:

- Global Claude memory untuk semua repo
- Skill system modular berbasis `SKILL.md`
- Skill router agar hemat token
- Hooks guardrail untuk verifikasi otomatis
- Obsidian second brain untuk memori lintas sesi
- Installer Linux, macOS, Windows PowerShell, dan Windows CMD
- QA/security gate dengan evidence report
- Profile mode: `minimal`, `coding`, `repo-review`, `security`, `release`, `max`

## Sumber dan referensi

### Official

- Claude Code docs: https://code.claude.com/docs/en/overview
- Claude Code memory: https://code.claude.com/docs/en/memory
- Claude Code hooks: https://code.claude.com/docs/en/hooks
- Claude Code skills: https://code.claude.com/docs/en/skills
- Anthropic Skills: https://github.com/anthropics/skills

### Trusted implementation reference

- AstralForge Senior Engineer Skills: https://github.com/kuker24/AstralForge-Senior-Engineer-Skills
- Obsidian Skills by Kepano: https://github.com/kepano/obsidian-skills

### Inspiration only

- CL4R1T4S Fable prompt artifact: https://github.com/elder-plinius/CL4R1T4S
- Nate Herk video: https://www.youtube.com/watch?v=XTBWVVcF3Pk
- Kun Chen dotfiles: https://github.com/kunchenguid/dotfiles
- Matt Pocock writing great skills: https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-great-skills/SKILL.md

## Quick install

> Installer masih tahap scaffold awal. Jalankan setelah review isi file.

Linux atau macOS:

```bash
bash installer/install.sh
bash installer/verify.sh
```

Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File installer/install.ps1
powershell -ExecutionPolicy Bypass -File installer/verify.ps1
```

## Struktur repo

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

## Status awal

Repo ini dimulai sebagai fondasi untuk membangun sistem penuh. Semua klaim `Verified`, `Supported`, `Manual only`, dan `Unverified` harus ditulis di `docs/VERIFICATION_MATRIX.md` dan didukung evidence di `reports/`.
