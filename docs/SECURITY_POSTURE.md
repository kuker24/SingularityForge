# Security Posture

Version target: v1.0.0
Status: **Stable Linux baseline**

## Secure Defaults

- Hook adapters default OFF.
- External integrations default OFF.
- Adapter registry requires `defaultEnabled=false` and `networkCall=false` for built-in adapters.
- Dangerous shell commands are guarded by Bash hooks.
- Logging/audit adapters redact secret-like values before writing logs.
- Installer uses non-destructive backup behavior before overwriting existing runtime files.

## Verification

Security posture is backed by:
- `npm run validate:adapters`
- `npm run doctor`
- `npm run verify:installers`
- GitHub Actions Security workflow (`gitleaks`, `semgrep`, dependency scan note)

## Non-goals

- No automatic network calls.
- No default webhook dispatch.
- No MCP/Repomix/Serena/Context7/OMNI activation by default.
- No secret storage in repository runtime files.

## Remaining Constraints

Windows remains Experimental. Linux/CachyOS is the stable production baseline.
