# Contributing

## Development Flow

1. Read `docs/PRD.md`.
2. Read `docs/ARCHITECTURE.md`.
3. Keep changes scoped.
4. Run verification before submitting.
5. Update evidence docs when changing tooling status.

## Commands

```bash
npm run typecheck
npm run test:unit
npm run verify:skills
npm run audit:skills
```

## Skill Changes

Every skill must include:

- `SKILL.md`
- YAML frontmatter with `name` and `description`
- useful body instructions
- no secrets
- concise wording

## Evidence Policy

Do not mark a feature `Verified` unless this repo has evidence. Use `Supported` if scaffold exists but local or CI verification is not complete.

## Security

Never commit secrets, raw private logs, `.env`, private keys, or unredacted scanner outputs.
