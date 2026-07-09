# Security Rules

## Non-Negotiables

1. Never print or commit secrets.
2. Do not read credential files unless explicitly required.
3. Redact tokens, keys, and private values.
4. Treat `.env`, `.ssh`, `.aws`, `.gnupg`, `*.pem`, and `*.key` as sensitive.
5. Destructive commands require explicit approval.

## Required Review Areas

- Authentication
- Authorization
- Input validation
- Injection risk
- Secrets handling
- Dependency risk
- File system access
- Network calls
- Logging of sensitive data

## Suggested Commands

```bash
gitleaks git --redact .
semgrep scan --config p/default --metrics=off
osv-scanner scan source -r .
```

OSV is network-dependent and should not hard-block default local workflow unless configured by the project.
