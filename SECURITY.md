# Security Policy

## Supported Scope

This repository contains agent configuration, skills, hooks, installers, and documentation. Security reports may involve:

- secret exposure risk
- unsafe installer behavior
- unsafe hooks
- malicious prompt or skill instruction
- dependency vulnerability
- CI security issue

## Reporting

Open a private security advisory if available, or contact the maintainer through GitHub.

Do not include raw secrets in public issues.

## Secret Policy

If a secret is found:

1. Do not repeat it.
2. Remove it from tracked files.
3. Rotate the exposed credential.
4. Add or update detection rules.
5. Document the incident in redacted form.

## Tooling

Security tooling is described in `docs/SECURITY_MODEL.md` and `docs/TOOLING.md`.
