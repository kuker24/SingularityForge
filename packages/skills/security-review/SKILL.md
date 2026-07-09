---
name: security-review
description: Use for security-sensitive code, secret handling, dependency review, auth/authz, input validation, and release checks.
---

# Security Review

## Review Checklist

- Secrets and credentials
- Authentication
- Authorization
- Input validation
- Injection risks
- Unsafe file access
- Unsafe shell execution
- Dependency vulnerability
- Logging of sensitive data
- CORS/network boundary
- Rate limit and abuse cases

## Commands

Use when available:

```bash
gitleaks git --redact .
semgrep scan --config p/default --metrics=off
osv-scanner scan source -r .
```

OSV is network-dependent. If it times out, report it as inconclusive, not passed.

## Output

```txt
Security scope:
Findings:
Fixes:
Commands run:
Residual risk:
```
