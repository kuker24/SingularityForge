# Known Limitations

## Windows

Windows PowerShell support remains **Experimental**. GitHub Actions `windows-latest` verifies basic behavior, but native Windows user-machine evidence is not yet sufficient to mark it Supported or Verified.

## External Integrations

The following integrations remain default OFF and are not enabled automatically:
- MCP
- Repomix
- Serena
- Context7
- OMNI
- Webhooks
- Network-based adapters

## Doctor

`doctor --fix-permissions` only repairs executable bits for:
- `installer/*.sh`
- `packages/hooks/**/*.sh`

It does not rewrite user configuration, install dependencies, run network calls, or enable adapters.

## Adapter Validator

The adapter validator checks registry/config/file presence/default safety. It does not execute adapters or external integrations.

## Security Scanners

Network-dependent scanners can be CI-supported but should not be treated as mandatory local hard blockers unless their dependencies and credentials are available.
