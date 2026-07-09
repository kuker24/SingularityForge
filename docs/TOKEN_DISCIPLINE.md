# Token Discipline

SingularityForge dirancang untuk hemat token sejak awal.

## Core Rules

1. Default profile adalah `minimal`.
2. Global `CLAUDE.md` harus pendek dan tidak menjadi prompt raksasa.
3. Skill harus modular.
4. `SKILL.md` hanya memuat instruksi inti.
5. Detail panjang masuk `references/`, `examples/`, atau `scripts/`.
6. Search sebelum read.
7. Read file relevan saja.
8. Jangan dump scanner JSON, coverage output, atau Repomix full output ke chat.
9. MCP off by default.
10. Repomix opt-in.

## Profile Context Budget

| Profile | Context Strategy | Default Tools |
|---|---|---|
| minimal | Only global memory, router, task-relevant rules | none |
| coding | Add debug, testing, verify skills | lint/test |
| repo-review | Add repo-intake and architecture review | optional Repomix |
| security | Add security-review | Semgrep/Gitleaks optional |
| release | Add release-check | CI/status/changelog |
| max | Explicit high-context mode | user approval required |

## Skill Loading Rules

- Use `token-router` first for ambiguous tasks.
- Invoke only the skill needed for the task.
- Do not read all `packages/skills` just because skills exist.
- Prefer `references/sources.md` over copying long context into `SKILL.md`.

## Obsidian Rules

- Search vault first.
- Read only matching notes.
- Write summary session logs.
- Do not paste entire vault context into the chat.

## Report Rules

Final report should include:

```txt
Files touched:
Commands run:
Verification result:
Risks:
Next step:
```

Keep it direct and evidence-based.
