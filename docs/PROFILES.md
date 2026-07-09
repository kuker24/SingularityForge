# Profiles

Profiles control how much context, tooling, and verification should be active.

## minimal

Default mode.

Use for:

- small edits
- normal Q&A
- quick repo tasks
- low-token operation

Enabled:

- global memory
- token router
- relevant rules only

Disabled by default:

- MCP
- Repomix
- broad repo scan
- browser tests

## coding

Use for regular implementation.

Enabled:

- engineering rules
- debugging rules
- testing rules
- verify-before-done

Suggested commands:

```bash
npm run typecheck
npm run test:unit
npm run verify:skills
```

## repo-review

Use for repository intake, architecture review, or migration planning.

Enabled:

- repo-intake
- architecture-review
- token-router

Optional:

```bash
repomix --compress
```

## security

Use for security-sensitive changes.

Enabled:

- security rules
- security-review skill
- secret protection hooks

Optional commands:

```bash
semgrep scan --config p/default --metrics=off
osv-scanner scan source -r .
gitleaks git --redact .
```

## release

Use before publishing or tagging.

Enabled:

- release rules
- release-check skill
- verification matrix review

Suggested commands:

```bash
npm run typecheck
npm run test:unit
npm run test:coverage
npm run verify:skills
npm run audit:skills
```

## max

Use only for large tasks with explicit approval.

Enabled:

- broad context allowed
- multiple skills
- optional MCP
- optional Repomix
- stronger verification

Rules:

1. Must state why max profile is needed.
2. Must not run destructive command without approval.
3. Must summarize context instead of dumping large outputs.
