# Installer Verification Evidence - Dry-run & Real Install

Timestamp: 2026-07-09T21:26:00Z
Status: Verified

## 1. Dry-run Verification

Command:
```bash
bash installer/install.sh --dry-run
```

Output:
```txt
SingularityForge installer
Repo: /home/fahmi/Downloads/LAB GITHUB/LAB SKILL/SingalarityForge
Target: /home/fahmi/.claude
Claude Code: not found
Install Claude Code manually if needed:
curl -fsSL https://claude.ai/install.sh | bash
[dry-run] cp -R "/home/fahmi/.claude" "/home/fahmi/.claude.singularityforge.backup.20260709-212524"
Backup: /home/fahmi/.claude.singularityforge.backup.20260709-212524
[dry-run] chmod +x "/home/fahmi/Downloads/LAB GITHUB/LAB SKILL/SingalarityForge"/installer/*.sh "/home/fahmi/Downloads/LAB GITHUB/LAB SKILL/SingalarityForge"/scripts/*.sh "/home/fahmi/Downloads/LAB GITHUB/LAB SKILL/SingalarityForge"/packages/hooks/*.sh 2>/dev/null || true
[dry-run] mkdir -p "/home/fahmi/.claude"
[dry-run] mkdir -p "/home/fahmi/.claude/rules" "/home/fahmi/.claude/skills" "/home/fahmi/.claude/hooks" "/home/fahmi/.claude/profiles"
[dry-run] cp "/home/fahmi/Downloads/LAB GITHUB/LAB SKILL/SingalarityForge/packages/global-memory/CLAUDE.md" "/home/fahmi/.claude/CLAUDE.md"
[dry-run] cp "/home/fahmi/Downloads/LAB GITHUB/LAB SKILL/SingalarityForge/packages/settings/settings.json" "/home/fahmi/.claude/settings.json"
[dry-run] cp -R "/home/fahmi/Downloads/LAB GITHUB/LAB SKILL/SingalarityForge/packages/rules/." "/home/fahmi/.claude/rules/"
[dry-run] cp -R "/home/fahmi/Downloads/LAB GITHUB/LAB SKILL/SingalarityForge/packages/skills/." "/home/fahmi/.claude/skills/"
[dry-run] cp -R "/home/fahmi/Downloads/LAB GITHUB/LAB SKILL/SingalarityForge/packages/hooks/." "/home/fahmi/.claude/hooks/"
[dry-run] cp -R "/home/fahmi/Downloads/LAB GITHUB/LAB SKILL/SingalarityForge/packages/profiles/." "/home/fahmi/.claude/profiles/"
[dry-run] cp "/home/fahmi/Downloads/LAB GITHUB/LAB SKILL/SingalarityForge/packages/templates/SingularityForge.md" "/home/fahmi/.claude/SingularityForge.md"
[dry-run] chmod +x "/home/fahmi/.claude"/hooks/*.sh 2>/dev/null || true
Install complete.
Next steps:
1. Verify the installation by running: bash installer/verify.sh
```

## 2. Real Install Verification

Command:
```bash
bash installer/install.sh
```

Followed by verify command:
```bash
bash installer/verify.sh
```

Output:
```txt
ok: /home/fahmi/.claude/CLAUDE.md
ok: /home/fahmi/.claude/SingularityForge.md
ok: /home/fahmi/.claude/settings.json
ok: /home/fahmi/.claude/rules/engineering.md
ok: /home/fahmi/.claude/rules/security.md
ok: /home/fahmi/.claude/rules/token-discipline.md
ok: /home/fahmi/.claude/skills/fable-mode/SKILL.md
ok: /home/fahmi/.claude/skills/token-router/SKILL.md
ok: /home/fahmi/.claude/skills/verify-before-done/SKILL.md
ok: /home/fahmi/.claude/hooks/pre-dangerous-command.sh
ok: /home/fahmi/.claude/hooks/post-edit-skill-verify.sh
ok: /home/fahmi/.claude/hooks/stop-verify-before-done.sh
ok: /home/fahmi/.claude/hooks/pre-dangerous-command.ps1
ok: /home/fahmi/.claude/hooks/post-edit-skill-verify.ps1
ok: /home/fahmi/.claude/hooks/stop-verify-before-done.ps1
ok: /home/fahmi/.claude/profiles/minimal.md
warning: claude command not found
SingularityForge verification passed.
```

Risiko tersisa:
- Pemasangan dan verifikasi live hooks pada Windows PowerShell hanya diuji secara statis (Supported, not locally verified on Windows OS).
