# Tooling Integration

SingularityForge follows an evidence-first tooling model inspired by AstralForge Senior Engineer Skills.

## Tool Status

| Tool | Target Status | Default | Command |
|---|---:|---:|---|
| TypeScript Typecheck | Supported | CI | `npm run typecheck` |
| Unit Test | Supported | CI | `npm run test:unit` |
| Coverage | Supported | CI | `npm run test:coverage` |
| Source skill verifier | Supported | CI | `npm run verify:skills` |
| Skill substantive audit | Supported | CI | `npm run audit:skills` |
| pre-commit | Supported | opt-in local | `pre-commit run --all-files` |
| Semgrep CE | Supported | security workflow | `semgrep scan --config p/default --metrics=off` |
| OSV-Scanner | Supported | opt-in | `osv-scanner scan source -r .` |
| Gitleaks | Supported | security workflow | `gitleaks git --redact .` |
| Knip | Supported | opt-in | `npx knip` |
| Playwright | Supported | opt-in | `npx playwright test --project=chromium` |
| Repomix | Supported | opt-in | `repomix --compress` |
| OMNI | Supported | opt-in | `omni stats --detail` |
| Context7 Pi | Supported | opt-in profile | profile-based |
| Serena MCP | Supported | opt-in profile | profile-based |
| StrykerJS | Manual only | never automatic | `npm run mutation` |

## Rules

1. `Verified` requires actual evidence in this repo.
2. Third-party evidence can inform planning but does not become repo-local verification.
3. OSV is network-dependent and must not hard-block default CI until configured.
4. StrykerJS is manual only.
5. Raw outputs must be ignored unless intentionally stored as redacted evidence.
