---
name: verify-before-done
description: Use before declaring a task complete to confirm changed files, commands, tests, risks, and remaining manual checks.
---

# Verify Before Done

## Required Checks

1. What changed?
2. What files were touched?
3. What command proves it works?
4. Did any command fail?
5. What could still be wrong?
6. What should the user do next?

## Verification Ladder

Choose the lowest sufficient level:

1. Static inspection.
2. Typecheck.
3. Unit test.
4. Integration test.
5. E2E/browser test.
6. Security scan.
7. Manual verification.

## Final Report

```txt
Files touched:
Commands run:
Verification result:
Risks:
Next step:
```

Never say `done` just because a file was edited.
