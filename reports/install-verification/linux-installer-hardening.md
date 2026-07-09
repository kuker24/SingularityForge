# Linux Installer & Environment Hardening Verification

Generated: 2026-07-09
Version: v0.7.0
Platform: Linux/CachyOS local + GitHub Actions ubuntu-latest
Status: **Verified after command execution**

## Scope

v0.7.0 hardens Linux installer verification and environment doctor checks.

## Automated Verification Script

Command:
```bash
npm run verify:installers
```

The script `scripts/verify-linux-installers.mjs` creates isolated temporary workspaces under `/tmp/singularityforge-verify-*` and uses a temporary `HOME` with spaces in the path. It does not write to the real user HOME.

## Covered Test Cases

| Area | Expected Result |
|---|---|
| `installer/install.sh --dry-run` | Exit 0; no `.claude` created in temp HOME |
| Global install in temp HOME | `.claude` created with CLAUDE.md, settings, hooks, adapters |
| Global reinstall | Timestamped backup created |
| Global second reinstall | Backup path remains unique; no overwrite |
| Bash hook permissions | `.sh` hooks executable |
| Bash adapter permissions | `.sh` adapters executable |
| `installer/install-local.sh --dry-run <target>` | Exit 0; no `.claude` created |
| Local install to path with spaces | Hooks/adapters copied |
| Local reinstall | `.backup.<timestamp>` files created |
| Local second reinstall | Backup files not overwritten |
| Cache exclusion | `.cache` or `cache` not copied to installed runtime |
| Adapter default OFF | `hookAdapters.enabled=false` |
| External integrations default OFF | `mcpDefault=off`, `repomixDefault=off` |

## Doctor Hardening

Commands:
```bash
npm run doctor
node scripts/doctor.mjs --json
node scripts/doctor.mjs --fix-permissions
```

- `--json` emits valid JSON with `status`, `checks`, `summary`, `warnings`, and `failures`.
- `--fix-permissions` only changes executable bits for `installer/*.sh` and `packages/hooks/**/*.sh` inside the repository.
- No network calls and no adapter activation are performed.

## Adapter Validator Hardening

Command:
```bash
node scripts/validate-adapter-config.mjs --settings packages/settings/settings.json
```

Covered by smoke tests:
- Default settings PASS
- `enabled=false` PASS
- `enabled=true` + `active=["noop"]` PASS for custom settings
- Unknown adapter FAIL
- Missing adapter file FAIL
- `active` not array FAIL
- Invalid JSON FAIL
- Missing `logDir` WARN but exit 0

## Known Limitations

- Windows remains **Experimental**.
- Installer verification uses temp HOME, not real user HOME.
- `zsh` is reported as WARN if unavailable; Bash installers are explicit Bash scripts.
