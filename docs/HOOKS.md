# Hook Architecture

This document describes how hooks are configured in Claude Code settings for SingularityForge.

## Hook Events

Claude Code supports the following hook events:
- `PreToolUse`: Called before a tool is executed. Can block tool execution by returning exit code 2 or writing structured JSON.
- `PostToolUse`: Called after a tool executes. Can replace tool output or verify changes.
- `Stop`: Called when stopping execution or completing a task. Used to remind the agent to verify before done.

## Config Format in `settings.json`

The global settings file is configured in `~/.claude/settings.json` (or locally at `.claude/settings.json` in project directories).

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/pre-dangerous-command.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/post-edit-skill-verify.sh"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/stop-verify-before-done.sh"
          }
        ]
      }
    ]
  }
}
```

For Windows PowerShell:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -ExecutionPolicy Bypass -File \"$HOME\\.claude\\hooks\\pre-dangerous-command.ps1\""
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -ExecutionPolicy Bypass -File \"$HOME\\.claude\\hooks\\post-edit-skill-verify.ps1\""
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -ExecutionPolicy Bypass -File \"$HOME\\.claude\\hooks\\stop-verify-before-done.ps1\""
          }
        ]
      }
    ]
  }
}
```

## References
1. Claude Code Hooks Documentation: https://code.claude.com/docs/en/hooks
2. Claude Code Hooks Guide: https://code.claude.com/docs/en/hooks-guide
3. SingularityForge Hook Adapter Framework: [docs/HOOK_ADAPTERS.md](HOOK_ADAPTERS.md)
