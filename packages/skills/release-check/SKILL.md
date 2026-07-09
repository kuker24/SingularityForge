---
name: release-check
description: Use before releasing, tagging, publishing, or claiming verified status.
---

# Release Check

## Checklist

1. Version is clear.
2. Changelog updated.
3. PRD and architecture docs are current.
4. Verification matrix updated.
5. Typecheck result known.
6. Test result known.
7. Security result known.
8. No secrets committed.
9. Release risk documented.

## Commands

```bash
npm run typecheck
npm run test:unit
npm run test:coverage
npm run verify:skills
npm run audit:skills
```

## Output

```txt
Release target:
Checks:
Security:
Known risks:
Go/no-go:
```
