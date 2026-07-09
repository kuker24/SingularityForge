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
SingularityForge installer
Repo: /home/fahmi/Downloads/LAB GITHUB/LAB SKILL/SingalarityForge
Target: /home/fahmi/.claude
Claude Code: found (2.1.205 (Claude Code))
Backup: /home/fahmi/.claude.singularityforge.backup.20260709-214857
Install complete.
Next steps:
1. Verify the installation by running: bash installer/verify.sh
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
ok: claude command found
SingularityForge verification passed.
```

## 3. Workspace-Local Install Verification

We verified the local installer (`install-local.sh`) behavior on Linux CachyOS.

### Dry-run Local Installation
```bash
$ mkdir -p /tmp/sf-local-test
$ bash installer/install-local.sh --dry-run /tmp/sf-local-test
Installing SingularityForge local profile to: /tmp/sf-local-test/.claude
[dry-run] Enabled. No changes will be written.
[dry-run] created directory '/tmp/sf-local-test/.claude'
[dry-run] created directory '/tmp/sf-local-test/.claude/hooks'
[dry-run] copied 'packages/templates/project/CLAUDE.md' to '/tmp/sf-local-test/.claude/CLAUDE.md'
[dry-run] copied 'packages/templates/project/.claude/settings.json' to '/tmp/sf-local-test/.claude/settings.json'
[dry-run] copied 'packages/templates/project/.claude/hooks/pre-dangerous-command.sh' to '/tmp/sf-local-test/.claude/hooks/pre-dangerous-command.sh'
...
[dry-run] chmod ok: executable permissions for hook wrappers
Local profile installation complete.
```

### Real Local Installation & Overwrite Backup Check
Command:
```bash
$ bash installer/install-local.sh /tmp/sf-local-test
$ bash installer/install-local.sh /tmp/sf-local-test
```

Output:
```txt
Installing SingularityForge local profile to: /tmp/sf-local-test/.claude
created: directory '/tmp/sf-local-test/.claude'
created: directory '/tmp/sf-local-test/.claude/hooks'
backed up: '/tmp/sf-local-test/.claude/CLAUDE.md' to '/tmp/sf-local-test/.claude/CLAUDE.md.backup.20260709-215834'
copied: 'packages/templates/project/CLAUDE.md' to '/tmp/sf-local-test/.claude/CLAUDE.md'
backed up: '/tmp/sf-local-test/.claude/settings.json' to '/tmp/sf-local-test/.claude/settings.json.backup.20260709-215834'
copied: 'packages/templates/project/.claude/settings.json' to '/tmp/sf-local-test/.claude/settings.json'
chmod ok: executable permissions for hook wrappers
verified: executable '/tmp/sf-local-test/.claude/hooks/pre-dangerous-command.sh'
Local profile installation complete.
```

## 4. Token Cache Optimizer Verification

We verified the token cache compiler and optimizer behavior on Linux CachyOS.

Command:
```bash
$ node scripts/optimize-token-cache.mjs
```

Output log (Active Profile: coding):
```txt
Optimizing Token Cache for directory: /home/fahmi/Downloads/LAB GITHUB/LAB SKILL/SingalarityForge/.claude
Active Profile: coding (Scope: Local Workspace)

Token Optimization Report:
- Output File: /home/fahmi/Downloads/LAB GITHUB/LAB SKILL/SingalarityForge/.claude/CLAUDE.md
- Original Token Weight (Word Count): 693 words
- Optimized Token Weight (Word Count): 693 words
- Token Budget Savings: 0.0% reduced context footprint
Optimization Completed Successfully.
```

Risiko tersisa:
- Pemasangan dan verifikasi live hooks pada Windows PowerShell hanya diuji secara statis (Supported, not locally verified on Windows OS).


