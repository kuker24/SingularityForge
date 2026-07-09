# Linux Doctor Hardening Evidence

Generated: 2026-07-09
Version: v0.7.0
Status: Verified locally and required in CI

## Commands

```bash
npm run doctor
node scripts/doctor.mjs --json
node scripts/doctor.mjs --fix-permissions
```

## Expected Behavior

- `npm run doctor` exits 0 when all failures are absent. WARN is allowed for optional tools.
- `node scripts/doctor.mjs --json` exits 0 and emits parseable JSON with:
  - `status`
  - `checks`
  - `summary`
  - `warnings`
  - `failures`
- `node scripts/doctor.mjs --fix-permissions` exits 0 and only changes executable bits for:
  - `installer/*.sh`
  - `packages/hooks/**/*.sh`

## Safety Properties

- Does not write outside repository for permission repair.
- Does not modify user `~/.claude`.
- Does not perform network calls.
- Does not enable adapters.
- External integrations remain default OFF.
