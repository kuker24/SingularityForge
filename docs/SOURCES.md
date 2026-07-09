# Sources - SingularityForge

Dokumen ini membagi semua referensi menjadi level kepercayaan agar klaim teknis tidak bercampur dengan inspirasi tidak resmi.

## Level 1 - Official

Sumber resmi yang boleh dijadikan dasar implementasi.

| Source | URL | Purpose |
|---|---|---|
| Claude Code overview | https://code.claude.com/docs/en/overview | Install, CLI, platform support |
| Claude Code memory | https://code.claude.com/docs/en/memory | `CLAUDE.md`, memory scope, import, organization |
| Claude Code hooks | https://code.claude.com/docs/en/hooks | Hook lifecycle, PreToolUse, PostToolUse, Stop |
| Claude Code skills | https://code.claude.com/docs/en/skills | Skill folder, `SKILL.md`, supporting files |
| Anthropic Skills repo | https://github.com/anthropics/skills | Official examples, template, spec, plugin model |

## Level 2 - Trusted Implementation Reference

Sumber implementasi yang relevan dan bisa diadaptasi setelah audit.

| Source | URL | Purpose |
|---|---|---|
| AstralForge Senior Engineer Skills | https://github.com/kuker24/AstralForge-Senior-Engineer-Skills | Senior engineer skill set, verification matrix, QA/security tooling |
| Kepano Obsidian Skills | https://github.com/kepano/obsidian-skills | Obsidian skills, Markdown, JSON Canvas, Obsidian CLI |
| Matt Pocock writing-great-skills | https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-great-skills/SKILL.md | Skill writing discipline, progressive disclosure, token discipline |

## Level 3 - Inspiration Only

Sumber ini boleh dipakai untuk ide dan filosofi, tetapi tidak boleh dipakai untuk klaim resmi tanpa verifikasi tambahan.

| Source | URL | Purpose |
|---|---|---|
| CL4R1T4S | https://github.com/elder-plinius/CL4R1T4S | Unofficial prompt artifact analysis |
| Nate Herk Fable video | https://www.youtube.com/watch?v=XTBWVVcF3Pk | Process replication idea, five gates, model routing concept |
| Kun Chen dotfiles | https://github.com/kunchenguid/dotfiles | Agentic dev environment inspiration, dotfiles, memory symlink idea |

## Source Rules

1. Official docs override all third-party sources.
2. Third-party prompt artifacts are inspiration only.
3. AstralForge can be imported only after local audit.
4. Claims must point to `docs/VERIFICATION_MATRIX.md` and reports.
5. If source is stale or unreachable, mark related claim as `Unverified`.
