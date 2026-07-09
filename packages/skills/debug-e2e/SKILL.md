---
name: debug-e2e
description: Use when debugging failures, broken builds, runtime errors, flaky tests, or user-reported bugs.
---

# Debug E2E

## Discipline

1. Reproduce or locate the exact failure.
2. Gather logs, stack traces, config, and relevant source.
3. Identify confirmed cause.
4. List possible contributing causes separately.
5. Patch the smallest safe area.
6. Verify with the most relevant command.
7. Report clearly.

## Response Format

```txt
Penyebab pasti:
Kemungkinan penyebab:
Solusi:
Cara verifikasi:
```

## Suggested Commands

```bash
npm run typecheck
npm run test:unit
npm run build
```

Only run commands that match the repo.
