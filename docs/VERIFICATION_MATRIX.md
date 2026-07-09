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
| Skill substantive audit | Supported | `npm run audit:skills` | scaffold provided |
| Linux installer | Supported | `bash installer/install.sh --dry-run` | scaffold provided |
| macOS installer | Supported | `bash installer/install-macos.sh --dry-run` | scaffold provided |
| Windows installer | Supported | `powershell -ExecutionPolicy Bypass -File installer/install.ps1 -DryRun` | scaffold provided |
| Obsidian vault template | Supported | `ls packages/obsidian` | scaffold provided |
| Hooks scaffold | Supported | `find packages/hooks -type f` | repo files |
| TypeScript typecheck | Supported | `npm run typecheck` | package script |
| Unit tests | Supported | `npm run test:unit` | placeholder test |
| Coverage | Supported | `npm run test:coverage` | placeholder test |
| pre-commit | Supported | `pre-commit run --all-files` | config scaffold |
| Semgrep CE | Supported | `semgrep scan --config p/default --metrics=off` | workflow scaffold |
| OSV-Scanner | Supported | `osv-scanner scan source -r .` | network-dependent, not hard-blocking |
| Gitleaks | Supported | `gitleaks git --redact .` | workflow scaffold |
| Knip | Supported | `npx knip` | config scaffold |
| Playwright | Supported | `npx playwright test --project=chromium` | optional, placeholder |
| Repomix | Supported | `repomix --compress` | opt-in only |
| OMNI | Supported | `omni stats --detail` | opt-in integration note |
| Context7 Pi | Supported | profile-based | opt-in integration note |
| Serena MCP | Supported | profile-based | opt-in integration note |
| StrykerJS mutation | Manual only | `npm run mutation` | never auto-run |

## Verification Policy

1. Do not call something `Verified` without evidence.
2. Network-dependent tooling starts as `Supported` until a successful local or CI run exists.
3. Scanner JSON output must be ignored from git.
4. Mutation testing is `Manual only` because it can be slow and expensive.
5. Every release must update this matrix.
