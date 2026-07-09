# Verification Matrix

Status vocabulary:

- `Verified`: command/run/evidence sudah tersedia di repo ini.
- `Supported`: desain dan scaffold tersedia, tetapi belum full verified atau bergantung tool/network eksternal.
- `Manual only`: tidak boleh dijalankan otomatis.
- `Unverified`: belum ada evidence.
- `Needs review`: ada potensi risiko atau belum cukup audit.

## Current Status

| Area | Status | Command | Evidence |
|---|---:|---|---|
| Repository foundation | Verified | GitHub connector create_file | Initial commits exist |
| PRD | Verified | n/a | `docs/PRD.md` |
| Architecture docs | Verified | n/a | `docs/ARCHITECTURE.md` |
| Source classification | Verified | n/a | `docs/SOURCES.md` |
| Global memory scaffold | Verified | `test -f packages/global-memory/CLAUDE.md` | repo file |
| Rules scaffold | Verified | `find packages/rules -type f` | repo files |
| Core skills scaffold | Verified | `npm run verify:skills` | local after clone |
| Skill substantive audit | Verified | `npm run audit:skills` | `reports/skill-audit-summary.md` |
| settings.json configuration | Verified | `test -f packages/settings/settings.json` | repo file & `docs/HOOKS.md` |
| Linux installer | Verified | `bash installer/install.sh --dry-run` | `reports/install-verification/dry-run.md` |
| Linux local installer | Verified | `bash installer/install-local.sh --dry-run` | `tests/smoke.test.mjs` |
| Token cache optimizer | Verified | `node scripts/optimize-token-cache.mjs` | `tests/smoke.test.mjs` |
| Token savings benchmark | Verified | `node scripts/token-benchmark.mjs --profile all` | `reports/token/profile-token-benchmark.md` |
| macOS installer | Supported | `bash installer/install-macos.sh --dry-run` | Script ready, not locally verified on macOS |
| Windows installer | Supported | `powershell -ExecutionPolicy Bypass -File installer/install.ps1 -DryRun` | Script ready, not locally verified on Windows |
| Obsidian vault template | Supported | `ls packages/obsidian` | scaffold provided |
| Hooks scaffold | Verified | `find packages/hooks -type f` | repo files |
| Hook Adapter Framework | Verified | `npm run test:unit` | `reports/hooks/hook-adapter-verification.md` |
| Windows Hook Adapters | Experimental | `pwsh -File installer/install-local.ps1 -DryRun` | `reports/hooks/windows-hook-adapter-verification.md` |
| PowerShell Hook Support | Experimental | `find packages/hooks -name "*.ps1"` | PowerShell hook files, not locally verified on Windows |
| TypeScript typecheck | Verified | `npm run typecheck` | `reports/tool-evidence/local-verification.md` |
| Unit tests | Verified | `npm run test:unit` | `reports/tool-evidence/local-verification.md` |
| Coverage | Verified | `npm run test:coverage` | `reports/tool-evidence/local-verification.md` |
| pre-commit | Supported | `pre-commit run --all-files` | config scaffold |
| Semgrep CE | Verified (CI) | `semgrep scan --config p/default --metrics=off` | GitHub Actions run, `reports/security/security-tooling-status.md` |
| OSV-Scanner | Supported | `osv-scanner scan source -r .` | network-dependent, not hard-blocking |
| Gitleaks | Verified (CI) | `gitleaks git --redact .` | GitHub Actions run, `reports/security/security-tooling-status.md` |
| Knip | Supported | `npx knip` | config scaffold |
| Playwright | Supported | `npx playwright test --project=chromium` | optional, placeholder |
| Repomix | Supported | `repomix --compress` | opt-in only |
| OMNI | Supported | `omni stats --detail` | opt-in integration note |
| Context7 Pi | Supported | profile-based | opt-in integration note |
| Serena MCP | Supported | profile-based | opt-in integration note |
| StrykerJS mutation | Manual only | `npm run mutation` | never auto-run |
| AstralForge import pipeline | Verified | `node scripts/import-astralforge-skills.mjs` | `docs/ASTRALFORGE_IMPORT_REPORT.md` |

## Verification Policy

1. Do not call something `Verified` without evidence.
2. Network-dependent tooling starts as `Supported` until a successful local or CI run exists.
3. Scanner JSON output must be ignored from git.
4. Mutation testing is `Manual only` because it can be slow and expensive.
5. Every release must update this matrix.
