---
name: session-log
description: Use after meaningful work to write a concise, safe durable session log for future continuation.
---

# Session Log

## Purpose

Write durable context without dumping chat history or terminal output.

## Required Sections

- Goal
- Files touched
- Commands run
- Verification result
- Decisions made
- Risks / open questions
- Next step

## Rules

1. Keep logs factual and concise.
2. Do not store secrets, tokens, API keys, credentials, private keys, or `.env` content.
3. Mention failed commands honestly.
4. Prefer summaries over raw output.
5. Include related files when useful.
6. Write next steps that can be resumed later.
7. Create a handoff note when another session should continue the work.
