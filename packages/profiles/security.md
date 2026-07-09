# Profile: security

Use for security-sensitive work.

## Enabled

- security rules
- security-review skill
- secret protection hooks

## Optional Commands

```bash
gitleaks git --redact .
semgrep scan --config p/default --metrics=off
osv-scanner scan source -r .
```

OSV is network-dependent and should be reported as inconclusive if it times out.
