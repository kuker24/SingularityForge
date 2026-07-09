# AstralForge Integration Plan

Upstream reference:

```txt
https://github.com/kuker24/AstralForge-Senior-Engineer-Skills
```

## Purpose

AstralForge is used as a trusted implementation reference for senior engineering skills, QA gates, security tooling, skill audit, and evidence-based status tracking.

## Import Policy

1. Do not blindly copy global instructions.
2. Import skill ideas only after local review.
3. Preserve source attribution in references.
4. Run `npm run verify:skills` after import.
5. Run `npm run audit:skills` after import.
6. Update `docs/VERIFICATION_MATRIX.md`.

## Status Mapping

| AstralForge Status | SingularityForge Handling |
|---|---|
| Verified | Can become Supported until repo-local evidence exists |
| Supported | Keep Supported |
| Manual only | Keep Manual only |
| Needs review | Do not install globally |
| Unverified | Do not install globally |

## Tooling Notes

- OSV-Scanner stays Supported because it is network-dependent.
- StrykerJS stays Manual only.
- Playwright starts Supported until real browser smoke tests exist.
- Repomix stays opt-in to protect token budget.

## First Import Candidates

1. security-review patterns
2. dependency-review patterns
3. type-safety patterns
4. QA verification patterns
5. ADR patterns
6. release-check patterns
