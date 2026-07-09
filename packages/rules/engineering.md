# Engineering Rules

## Core Standards

1. Prefer simple architecture over clever architecture.
2. Preserve existing conventions unless there is a clear reason to change.
3. Keep changes scoped.
4. Do not introduce global abstractions prematurely.
5. Validate with tests or deterministic checks.
6. Document non-obvious decisions.

## Before Editing

- Identify the target files.
- Identify existing patterns.
- Identify likely side effects.
- Avoid broad rewrites unless requested.

## During Editing

- Keep diffs readable.
- Avoid unrelated formatting churn.
- Maintain type safety.
- Keep public APIs backward compatible unless migration is explicit.

## After Editing

Run the smallest meaningful verification first:

```bash
npm run typecheck
npm run test:unit
npm run verify:skills
```

If command is unavailable, state it clearly and provide manual verification steps.
