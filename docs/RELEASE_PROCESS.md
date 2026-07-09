# Release Process - SingularityForge

This document outlines the standard release process for SingularityForge global runtime.

## Release Process Flow

```txt
1. Bump Version -> 2. Run Local Verification Checks -> 3. CI/CD Pipeline (Security & Tests)
   -> 4. Mutation Testing (Manual) -> 5. Verification Matrix Update
   -> 6. Commit Changelog -> 7. Git Tag & Push -> 8. Post-Release Verification
```

## Step 1: Versioning

We use Semantic Versioning (SemVer) for version numbers: `MAJOR.MINOR.PATCH`.
- **PATCH**: bug fixes, minor documentation updates, secure defaults hardening.
- **MINOR**: adding new core rules, skills, profiles, or hooks.
- **MAJOR**: backwards-incompatible changes to settings schemas, installation layout, or breaking changes in hook behavior.

To bump version:
1. Update `package.json` version.
2. Update references to version numbers in PRD and other docs if relevant.

## Step 2: Local Verification Checks

Before pushing, maintainers MUST run:
```bash
npm run typecheck
npm run test:unit
npm run verify:skills
npm run audit:skills
npm run token:report
```

All commands must output zero errors.

## Step 3: CI/CD Pipeline

Ensure the GitHub Actions runs are completely green:
- **CI Workflow**: Verifies typechecks, unit tests, verify/audit skills, and token reports.
- **Security Workflow**: Checks dependencies and secret leaks.

## Step 4: Mutation Testing (Manual Only)

Mutation testing is not automated in CI/CD due to execution cost and duration.
Run it manually using:
```bash
npm run mutation
```
Review Stryker outputs to identify untested branches or missing assertions in verification tooling.

## Step 5: Verification Matrix Update

Before creating a release, update the `docs/VERIFICATION_MATRIX.md` to reflect the latest status of installers, scripts, and hooks. Include the timestamp, runner environment details, and execution results.

## Step 6: Changelog and Documentation

Update `CHANGELOG.md` with:
- Added features (new skills, profiles, hooks).
- Security improvements.
- Fixed bugs.
- Breaking changes.

Ensure all documentation (`README.md`, `docs/`) is up-to-date.

## Step 7: Git Tag & Push

Once verified, tag the commit:
```bash
git add .
git commit -m "release: cut version vX.Y.Z"
git tag -a vX.Y.Z -m "SingularityForge release vX.Y.Z"
git push origin main --tags
```

## Step 8: Rollback Plan

If a release breaks client-side environments:
1. Advise users to run the uninstaller:
   ```bash
   bash installer/uninstall.sh
   ```
   Or for Windows:
   ```powershell
   powershell -ExecutionPolicy Bypass -File installer/uninstall.ps1
   ```
2. Revert the commit and push a hotfix release or instruct users to install the previous tag.
