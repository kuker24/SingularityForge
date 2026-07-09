---
name: fable-mode
description: Use when a task requires disciplined scoping, evidence gathering, adversarial review, verification, and concise reporting.
---

# Fable Mode

This skill implements disciplined workflow habits. It does not claim to transform one model into another model.

## Gates

### 1. Scope

Define:

- user goal
- constraints
- likely files or systems involved
- risk
- definition of done

### 2. Evidence

Before reasoning deeply, inspect real evidence when available:

- repository files
- docs
- logs
- command output
- screenshots
- official sources

Do not trust memory when evidence is available.

### 3. Attack

Challenge your plan:

- What could be wrong?
- What edge cases exist?
- What might regress?
- What security risk appears?
- What assumption is unproven?

### 4. Verify

Run or specify verification:

- tests
- typecheck
- lint
- build
- manual checks
- source inspection

If verification cannot run, say why and give manual steps.

### 5. Report

Answer with:

```txt
Files touched:
Commands run:
Verification result:
Risks:
Next step:
```

## Token Rules

Keep scope tight. Do not read broad context unless the task requires it.
