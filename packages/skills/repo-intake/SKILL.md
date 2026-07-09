---
name: repo-intake
description: Use when entering a repository for the first time or when building an implementation plan from existing files.
---

# Repo Intake

## Goal

Understand a repository with the smallest useful context.

## Steps

1. Inspect top-level files.
2. Read README, package/config files, and docs index.
3. Identify language, framework, package manager, test runner, CI, and deployment model.
4. Map source directories.
5. Identify quality/security tooling.
6. Produce a short architecture summary.

## Suggested Commands

```bash
pwd
ls
find . -maxdepth 2 -type f | sort | head -200
```

Use package-specific commands only after detecting the project type.

## Output

```txt
Repo summary:
Tech stack:
Important files:
Available commands:
Architecture notes:
Risks:
Next steps:
```

## Token Rule

Do not read the entire repo unless explicitly requested.
