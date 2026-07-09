# Token Discipline Rules

## Defaults

- Start in `minimal` profile.
- Do not load broad context unless needed.
- Prefer search, then targeted read.
- Use skills only when they add value.
- Keep final reports concise and evidence-based.

## Forbidden Patterns

- Reading every file before defining scope.
- Pasting full JSON scanner output into chat.
- Loading all skills for every task.
- Running Repomix by default.
- Using max profile without explaining why.

## Escalation

Escalate profile only when needed:

```txt
minimal -> coding -> repo-review/security/release -> max
```

When escalating, state why.
