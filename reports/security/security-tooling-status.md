# Security Tooling Status

Timestamp: 2026-07-09T21:26:00Z
Status: Supported

This report summarizes the status of security tools configured for SingularityForge.

## Security Tooling Summary

| Tool | Status | Run Command | Findings / Notes |
|---|---|---|---|
| Gitleaks | Supported | `gitleaks git --redact .` | Run in GitHub Action workflow to scan history for credentials and tokens. |
| Semgrep CE | Supported | `semgrep scan --config p/default` | Run in GitHub Action workflow to check code quality/security bugs. Bypass token dependency. |
| OSV-Scanner | Supported | `osv-scanner scan source -r .` | Network-dependent dependency vulnerability check. |
| Pre-dangerous-command Hook | Verified | `packages/hooks/pre-dangerous-command.sh` | Verified local execution blocks dangerous patterns like `rm -rf /` and `cat ~/.ssh/id_rsa`. |
| PowerShell Hook | Supported | `packages/hooks/pre-dangerous-command.ps1` | PowerShell port added for Windows runtime environment. |

## Pre-ToolUse Security Hook Tests

We tested the `pre-dangerous-command.sh` hook logic with dangerous input simulated:

```bash
$ echo "rm -rf /" | bash packages/hooks/pre-dangerous-command.sh
Blocked dangerous command pattern: rm -rf /
Exit code: 2 (Blocked)
```

And a safe command:
```bash
$ echo "npm test" | bash packages/hooks/pre-dangerous-command.sh
Exit code: 0 (Allowed)
```
The guard operates as expected under Unix.
For Windows, PowerShell script `packages/hooks/pre-dangerous-command.ps1` provides the corresponding guardrail logic.

Risiko tersisa:
- Keberhasilan integrasi gitleaks dan semgrep bergantung pada eksekusi runners di Github Actions.
