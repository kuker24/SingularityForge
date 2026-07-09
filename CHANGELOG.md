# Changelog

## 0.3.0 - Token Cache / Global Memory Optimizer

### Added
- Automated token cache compiler and optimizer script (`scripts/optimize-token-cache.mjs`) that minifies, strips comments, and compiles profile-relevant rules and skills into a single `CLAUDE.md`.
- Fallback resolution paths for workspace-local builds to leverage global or package templates without local file duplication.
- Lifecycle hooks in Linux installers to trigger cache optimization automatically upon profile configuration changes.

## 0.2.1 - Workspace-Local Profile Implementation

### Added
- Project-local installation scripts (`installer/install-local.sh` and `installer/install-local.ps1`) to bootstrap workspace-level profiles.
- Template-driven proxy hooks (`packages/templates/project/.claude/hooks/`) that delegate execution to global hooks dynamically.
- Integration tests demonstrating successful proxy mapping on Linux CachyOS.

## 0.2.0 - Hardened Global Claude Code Runtime Distribution

### Added
- Claude Code settings configuration for global hook wiring (`packages/settings/settings.json`).
- PowerShell ports for Windows hook support (`pre-dangerous-command.ps1`, `post-edit-skill-verify.ps1`, `stop-verify-before-done.ps1`).
- Robust backup mechanisms, path validation, and idempotence in Linux, macOS, and Windows installers.
- Comprehensive Hook configuration guide (`docs/HOOKS.md`).
- Release checklist and standards documentation (`docs/RELEASE_PROCESS.md` & `docs/RELEASE_CHECKLIST.md`).
- AstralForge staged-review import pipeline with automated safety filters (`scripts/import-astralforge-skills.mjs`).
- Tool execution evidence logging in `reports/`.

### Fixed
- Prevent CI security workflow hard-failure on missing optional Semgrep app token.
- Installer execution permission issues.

## 0.1.0 - Initial foundation

### Added

- PRD v0.2
- Architecture documentation
- Source classification
- Verification matrix
- Token discipline guide
- Security model
- Installation guide
- Profile model
- Obsidian second brain guide
- Core global memory
- Modular rules
- Core skills
- Hooks scaffold
- Cross-OS installer scaffold
- Verification scripts
- CI workflow
- Security workflow
- Reports directory
