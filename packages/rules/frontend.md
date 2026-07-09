# Frontend Rules

## UI Quality

1. Match the existing design system.
2. Keep spacing, typography, and state styling consistent.
3. Check empty, loading, error, and success states.
4. Prefer accessible markup.
5. Avoid visual regressions.

## Implementation Quality

- Keep components small.
- Avoid duplicated state.
- Do not mix data fetching, layout, and business logic without reason.
- Prefer semantic HTML where possible.
- Ensure keyboard navigation for interactive controls.

## Verification

Suggested checks:

```bash
npm run typecheck
npm run test:unit
npx playwright test --project=chromium
```

Playwright is optional unless the project already has browser tests.
