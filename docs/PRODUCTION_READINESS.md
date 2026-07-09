# Production Readiness - Stable Linux Runtime

Status: **Linux/CachyOS Verified**
Version target: v1.0.0

## Production Baseline

SingularityForge v1.0.0 freezes the Linux/CachyOS runtime baseline for global Claude Code usage.

Verified components:
- Global installer and local installer
- Dry-run behavior
- Non-destructive backup behavior
- Bash hooks and Bash adapters executable permissions
- Adapter registry and configuration validator
- Doctor command, JSON output, and permission repair
- Token optimizer and profile-aware benchmarks
- Skills verification and skills audit
- CI Linux runtime/profile checks
- Security workflow checks

## Required Local Gate

```bash
npm run typecheck
npm run test:unit
npm run test:coverage
npm run verify:skills
npm run audit:skills
npm run token:report
npm run token:benchmark
node scripts/token-benchmark.mjs --profile all
npm run validate:adapters
npm run doctor
node scripts/doctor.mjs --json
node scripts/doctor.mjs --fix-permissions
npm run verify:installers
bash installer/install.sh --dry-run
bash installer/install-local.sh --dry-run "/tmp/singularityforge stable test"
```

## Stable Policy

- Linux/CachyOS is the supported production baseline.
- Windows remains Experimental.
- External integrations remain default OFF.
- No network integrations are enabled by default.
- Doctor repairs only repo-local executable permissions when explicitly requested.
