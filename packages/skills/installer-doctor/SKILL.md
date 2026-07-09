---
name: installer-doctor
description: Use to diagnose installation, shell, path, Claude Code, profile, hooks, and permission issues across Linux, macOS, Windows, and WSL.
---

# Installer Doctor

## Checks

1. OS and shell.
2. Claude Code command availability.
3. `~/.claude` existence.
4. Installed global memory.
5. Installed rules.
6. Installed skills.
7. Installed hooks.
8. Backup folder.
9. Permission problems.

## Suggested Commands

Linux/macOS:

```bash
uname -a
command -v claude || true
claude --version || true
ls -la ~/.claude || true
bash installer/verify.sh
```

Windows PowerShell:

```powershell
Get-Command claude -ErrorAction SilentlyContinue
claude --version
Test-Path $HOME\.claude
powershell -ExecutionPolicy Bypass -File installer/verify.ps1
```

## Output

```txt
Environment:
Detected issue:
Likely cause:
Fix:
Verification:
```
