---
name: obsidian-sync
description: Use for durable project memory in Obsidian or Markdown vaults: notes, session continuity, ADRs, debug history, and handoffs.
---

# Obsidian Memory Sync

## Purpose

Use an opt-in Obsidian/Markdown vault as durable project memory without loading unnecessary context.

## Trigger

Use when the user asks for Obsidian, notes, vault, memory, long-running project continuity, session handoff, architecture decision, or debug history.

## Rules

1. Search before read.
2. Read only relevant files.
3. Write concise session logs.
4. Do not store secrets, tokens, API keys, credentials, private keys, or `.env` content.
5. Use ADR format for meaningful decisions.
6. Use handoff notes for session continuity.
7. Do not dump terminal logs; summarize evidence.
8. Link related project files when useful.
9. Keep external Obsidian skills and integrations opt-in; do not install or enable them by default.

## Workflow

1. Search note titles/content for the task.
2. Read the smallest relevant set of notes.
3. Work and gather command/file evidence.
4. Write or update a concise session log, ADR, debug note, release note, or handoff.
5. Record a next memory action.

## Output

```txt
Notes searched:
Notes read:
Notes written:
Summary:
Next memory action:
```
