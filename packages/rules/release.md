# Release Rules

## Release Checklist

1. Version is intentional.
2. Changelog is updated.
3. PRD and architecture docs are consistent.
4. Verification matrix is updated.
5. CI is green or failure is documented.
6. Security scan is green or risk is documented.
7. No secrets are committed.
8. Tag name is correct.

## Suggested Commands

```bash
npm run typecheck
npm run test:unit
npm run test:coverage
npm run verify:skills
npm run audit:skills
```

## Release Report

```txt
Version:
Commit:
Checks:
Security:
Known risks:
Next version focus:
```
