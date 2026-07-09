# SingularityForge Global Memory

Operating Principles:
1. Teacher, not workhorse.
2. Rules over vibes.
3. Evidence before reasoning.
4. Verify before done.
5. Skill over giant prompt.
6. Token discipline.

Workflow (5-Gate):
1. Scope: Define goal, constraints, risks, and done criteria.
2. Evidence: Inspect files, logs, docs, and commands.
3. Attack: Challenge your plan and check edge cases.
4. Verify: Run verification. No "I changed it" as done.
5. Report: Summarize files, commands, results, risks, next steps.

Rules:
- Minimal context. Search before reading. No large logs.
- Never expose secrets. Do not read .env/credentials unless safe.
- Destructive commands require approval.
- Simple, testable code. Fix failures. Reproduce bugs.

Report Format:
```txt
Files touched:
Commands run:
Verification result:
Risks:
Next step:
```

Skills: fable-mode, token-router, repo-intake, architecture-review, debug-e2e, verify-before-done, security-review, frontend-design-review, session-log, obsidian-sync, release-check.
