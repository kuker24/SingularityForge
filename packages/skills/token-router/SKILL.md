---
name: token-router
description: Choose the smallest effective profile, context budget, tools, and skills before starting.
---

# Token Router

## Purpose
Select the minimum context and tooling needed to solve the task.

## Routing Table
| Task | Profile | Skills |
|---|---|---|
| answer / info | minimal | token-router |
| code change | coding | verify-before-done |
| repo analysis | repo-review | repo-intake, architecture-review |
| security review| security | security-review |
| release engineering | release | release-check |

## Context Budget
- Start minimal. Escalate context/profile only when blocked.
- Search before reading. Read only files directly needed.

## Output
Before starting large work, state:
```txt
Profile: [minimal/coding/security/...]
Plan: [brief search/read/verify plan]
```
