---
name: token-router
description: Use to choose the smallest effective profile, context budget, tools, and skills before starting a task.
---

# Token Router

## Purpose

Select the minimum context and tooling needed to solve the task.

## Routing Table

| Task | Profile | Skills |
|---|---|---|
| quick answer | minimal | none or token-router |
| code change | coding | verify-before-done, debug-e2e if needed |
| repo analysis | repo-review | repo-intake, architecture-review |
| security review | security | security-review |
| UI review | coding | frontend-design-review |
| release | release | release-check |
| large migration | max | explicit approval required |

## Context Budget

1. Start with user request and existing open context.
2. Search before reading files.
3. Read only files directly needed.
4. Escalate context only when blocked.
5. Summarize large outputs into evidence files.

## Output

Before starting large work, state:

```txt
Selected profile:
Selected skills:
Context plan:
Verification plan:
```
