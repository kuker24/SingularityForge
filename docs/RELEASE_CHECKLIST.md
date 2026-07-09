# Release Checklist - SingularityForge

Use this checklist for every release cycle to ensure quality, security, and reproducibility.

## Pre-Release Phase

- [ ] Version number bumped in `package.json` according to SemVer guidelines.
- [ ] No local uncommitted changes exist (clean working copy).
- [ ] All package dependencies are up to date and scanned.
- [ ] No hardcoded API keys, private keys, or secrets exist in the repository.

## Verification & Testing Phase

- [ ] Run syntax check:
  ```bash
  npm run typecheck
  ```
- [ ] Run unit smoke tests:
  ```bash
  npm run test:unit
  ```
- [ ] Run skill structure verification:
  ```bash
  npm run verify:skills
  ```
- [ ] Run skill content validation:
  ```bash
  npm run audit:skills
  ```
- [ ] Run token usage report:
  ```bash
  npm run token:report
  ```
- [ ] Run token benchmarks:
  ```bash
  npm run token:benchmark
  node scripts/token-benchmark.mjs --profile all
  ```
- [ ] Run adapter validator and doctor:
  ```bash
  npm run validate:adapters
  npm run doctor
  node scripts/doctor.mjs --json
  node scripts/doctor.mjs --fix-permissions
  ```
- [ ] Run installer hardening verification:
  ```bash
  npm run verify:installers
  bash installer/install.sh --dry-run
  bash installer/install-local.sh --dry-run "/tmp/singularityforge release test"
  ```
- [ ] Verify that all Unix hook scripts are marked executable:
  ```bash
  chmod +x installer/*.sh scripts/*.sh packages/hooks/*.sh
  ```
- [ ] (Optional/Local OS) Verify install and verify scripts run fully:
  ```bash
  bash installer/install.sh
  bash installer/verify.sh
  ```

## Security & Scan Phase

- [ ] Git history scanned with Gitleaks (no secrets detected).
- [ ] Static analysis checks with Semgrep passed.
- [ ] Dependency scans with OSV-Scanner completed.

## Documentation Phase

- [ ] Verification matrix in `docs/VERIFICATION_MATRIX.md` updated with the latest execution results and status.
- [ ] Changelog in `CHANGELOG.md` updated with changes for the version.
- [ ] Safety warnings and installation commands in `README.md` verified.

## Release Phase

- [ ] Confirm tag does not already exist:
  ```bash
  git tag --list "vX.Y.Z"
  git ls-remote --tags origin vX.Y.Z
  ```
- [ ] Git commit created with release-specific title.
- [ ] Git tag created locally matching `vX.Y.Z`.
- [ ] Branch pushed to `main`.
- [ ] Tags pushed to `origin`.
- [ ] GitHub Release created with release notes and summary.
- [ ] Verify tag and release live:
  ```bash
  git ls-remote --tags origin vX.Y.Z
  gh release view vX.Y.Z
  ```
