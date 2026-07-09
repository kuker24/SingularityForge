# Obsidian Second Brain

Obsidian integration is optional. If Obsidian is not installed, the same structure works as normal Markdown folders.

## Goals

1. Store durable context outside chat sessions.
2. Keep project overview, decisions, and session logs searchable.
3. Avoid reading entire vaults into context.
4. Support future Claude Code Obsidian skills.

## Vault Template

```txt
SingularityForge-Vault/
├── 00-Inbox/
├── 01-Projects/
├── 02-Architecture/
├── 03-Standards/
├── 04-Skills/
├── 05-Session-Logs/
├── 06-Debug-Notes/
├── 07-Release-Notes/
└── 99-Archive/
```

## Suggested Notes

### Project Overview

```md
# Project Overview

Name:
Purpose:
Platform:
Tech stack:
Current status:
Important links:
```

### Session Log

```md
# Session Log - YYYY-MM-DD

## Goal

## Files touched

## Commands run

## Decisions

## Verification

## Risks

## Next steps
```

### Architecture Decision Record

```md
# ADR-0001 - Title

Date:
Status:

## Context

## Decision

## Consequences

## Alternatives
```

## Agent Rules

1. Search notes before reading full files.
2. Read only relevant notes.
3. Write session logs after meaningful work.
4. Do not store secrets in the vault.
5. Keep notes factual and concise.
