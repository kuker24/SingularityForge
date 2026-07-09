# Changelog

## 0.6.0 - Linux Runtime Completeness

### Added
- `packages/hooks/adapters/registry.json` — official adapter registry dengan metadata defaultEnabled, networkCall, bash/ps1 paths.
- `scripts/validate-adapter-config.mjs` — validator adapter config terhadap registry; exit 1 jika ada adapter tidak dikenal atau missing file.
- `scripts/doctor.mjs` (rewrite) — doctor penuh: Node.js version, Claude CLI, global memory, source files, skills, bash hooks executable, bash adapters executable, registry, settings defaults.
- `npm run validate:adapters` script alias.
- CI `ubuntu-latest` ditambah: token benchmark all profiles, validate:adapters, doctor.
- `reports/install-verification/linux-runtime-completeness.md` — evidence report lengkap Linux runtime.
- Smoke test diperluas: registry validation, validate-adapter-config PASS, doctor PASS.

## 0.5.2 - Native Windows Hardening (Experimental)

### Added
- CI `windows-latest` edge-case tests untuk `run-adapters.ps1`: no settings.json, empty, corrupt, enabled=false, enabled=true+noop, active=[].
- CI `windows-latest` write-to-disk tests untuk `logging.ps1` (hooks.log) dan `audit.ps1` (audit.log).
- CI `windows-latest` installer dry-run test: verifikasi tidak ada file ditulis saat `-DryRun`.
- Evidence report baru: `reports/hooks/windows-native-hardening-verification.md`.
- Updated `docs/WINDOWS_HOOK_ADAPTERS.md` dengan section Native Windows Hardening.

## 0.5.1 - Windows PowerShell Hook Adapter Parity (Experimental)

### Added
- Experimental Windows PowerShell hook adapter equivalents (`noop.ps1`, `logging.ps1`, `audit.ps1`, `external-placeholder.ps1`, `run-adapters.ps1`).
- Ported fail-safe adapter runner for Windows environments.
- Updated Windows installers (`install.ps1` and `install-local.ps1`) to support non-destructive adapter directory copy.
- Detailed developer documentation in `docs/WINDOWS_HOOK_ADAPTERS.md`.

## 0.5.0 - Hook Adapter Framework

### Added
- Modular Hook Adapter Framework supporting `noop`, `logging`, `audit`, and `external-placeholder` integrations.
- Fail-safe adapter execution pipeline (`run-adapters.sh`) wrapped in core Bash hooks.
- Configurable settings model (`hookAdapters` schema) in settings configuration.
- Detailed developer and operations documentation in `docs/HOOK_ADAPTERS.md`.

## 0.4.1 - Minimal Profile Token Reduction

### Fixed
- Reduced word counts and trimmed redundancy in minimal profile files (`CLAUDE.md`, `token-discipline.md`, `SKILL.md`) to lower target to 359 estimated tokens.
- All profiles verified as PASS under the budget limit targets on CachyOS/Linux.

## 0.4.0 - Profile-Aware Token Budgets & Safety Checks

### Added
- Implemented Profile-Aware Token Budget policies (`docs/PROFILE_TOKEN_BUDGETS.md`) for all active configurations.
- Extended `scripts/optimize-token-cache.mjs` with `--profile <name>` flag and `all` profile target compilation.
- Extended `scripts/token-benchmark.mjs` to measure relative context savings compared to unoptimized `max` capability baseline.
- Implemented multi-profile verification safety validations (ensuring `security`, `coding`, and `release` keep their mandatory rules).
- Auto-generation of multi-profile report in `reports/token/profile-token-benchmark.md`.

## 0.3.1 - Token Savings Benchmark Evidence

### Added
- Integrated empirical Token Savings Benchmark engine (`scripts/token-benchmark.mjs`) to measure compression efficiency.
- Auto-generation of benchmark report in `reports/token/token-benchmark.md`.
- Comprehensive benchmark guide in `docs/TOKEN_BENCHMARK.md`.

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
