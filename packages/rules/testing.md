# Testing Rules

## Testing Priority

1. Typecheck first.
2. Unit tests for logic.
3. Integration tests for boundaries.
4. E2E tests for critical user flow.
5. Coverage as signal, not as fake confidence.

## Required Habit

Before saying done, choose the smallest test that proves the change.

Suggested commands:

```bash
npm run typecheck
npm run test:unit
npm run test:coverage
```

## When Tests Are Missing

If the repo has no test setup:

1. Do not invent that tests passed.
2. Explain what was manually verified.
3. Recommend the smallest test setup needed.
