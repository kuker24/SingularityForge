# Installation

## Clone

```bash
git clone https://github.com/kuker24/SingularityForge.git
cd SingularityForge
```

## Linux and macOS

Dry run:

```bash
bash installer/install.sh --dry-run
```

Install:

```bash
bash installer/install.sh
```

Verify:

```bash
bash installer/verify.sh
```

Uninstall:

```bash
bash installer/uninstall.sh
```

## CachyOS

CachyOS uses the Linux generic path:

```bash
bash installer/install-linux.sh
bash installer/verify.sh
```

## macOS

```bash
bash installer/install-macos.sh
bash installer/verify.sh
```

## Windows PowerShell

Dry run:

```powershell
powershell -ExecutionPolicy Bypass -File installer/install.ps1 -DryRun
```

Install:

```powershell
powershell -ExecutionPolicy Bypass -File installer/install.ps1
```

Verify:

```powershell
powershell -ExecutionPolicy Bypass -File installer/verify.ps1
```

Uninstall:

```powershell
powershell -ExecutionPolicy Bypass -File installer/uninstall.ps1
```

## Claude Code Detection

Installer checks:

```bash
command -v claude
claude --version
```

If Claude Code is not installed, installer prints the official install command for the detected OS.

## Backup Policy

Before writing to `~/.claude`, installer creates:

```txt
~/.claude.singularityforge.backup.<timestamp>
```

## Installed Files

```txt
~/.claude/
├── CLAUDE.md
├── SingularityForge.md
├── rules/
├── skills/
├── hooks/
└── profiles/
```

## Safety Notes

1. Review installer before running.
2. Use `--dry-run` first.
3. Do not store API keys in this repo.
4. Obsidian integration is optional.
5. MCP integration is opt-in.
