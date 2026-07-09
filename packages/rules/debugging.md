# Debugging Rules

## Debugging Discipline

Use this order:

1. Reproduce or identify the exact failure.
2. Collect evidence from logs, tests, source files, and config.
3. Separate confirmed cause from possible cause.
4. Apply the smallest safe fix.
5. Verify the fix.
6. Report cause, solution, verification, and remaining risk.

## Response Format for Debugging

```txt
Penyebab pasti:
Kemungkinan penyebab:
Solusi:
Cara verifikasi:
```

## Avoid

- Do not patch from guesswork.
- Do not ignore failing tests.
- Do not change unrelated architecture to fix a narrow bug.
- Do not call a task fixed without verification.
