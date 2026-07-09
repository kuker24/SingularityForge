# Profile-Aware Token Savings Benchmark Report

Generated: 2026-07-09T16:57:20.692Z
Target Directory: `/home/fahmi/.claude`
Overall Status: **PASS**

## Multi-Profile Comparison Table

| Profile | Original (Max) Tokens | Optimized Tokens | Context Savings | Budget Goal | Status | Recommendation |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `minimal` | 1965 | 359 | 81.7% | 500 | **PASS** | Keep up the good work. Token budget is well-optimized. |
| `coding` | 1965 | 921 | 53.1% | 1200 | **PASS** | Keep up the good work. Token budget is well-optimized. |
| `security` | 1965 | 645 | 67.2% | 1200 | **PASS** | Keep up the good work. Token budget is well-optimized. |
| `repo-review` | 1965 | 823 | 58.1% | 1400 | **PASS** | Keep up the good work. Token budget is well-optimized. |
| `release` | 1965 | 585 | 70.2% | 900 | **PASS** | Keep up the good work. Token budget is well-optimized. |
| `max` | 1965 | 1978 | -0.7% | 2500 | **PASS** | Keep up the good work. Token budget is well-optimized. |

## Detailed Profile Inventories


### Profile: `minimal`
- Baseline Max Weight: **1965** estimated tokens.
- Optimized Profile Weight: **57** lines, **276** words, **359** estimated tokens.
- Status: **PASS**

#### Source Files Included:
| File / Component | Lines | Words | Estimated Tokens |
| :--- | :---: | :---: | :---: |
| CLAUDE.md (template) | 34 | 135 | 176 |
| rules/token-discipline.md | 7 | 47 | 62 |
| skills/token-router/SKILL.md | 23 | 84 | 110 |


### Profile: `coding`
- Baseline Max Weight: **1965** estimated tokens.
- Optimized Profile Weight: **154** lines, **708** words, **921** estimated tokens.
- Status: **PASS**

#### Source Files Included:
| File / Component | Lines | Words | Estimated Tokens |
| :--- | :---: | :---: | :---: |
| CLAUDE.md (template) | 34 | 135 | 176 |
| rules/token-discipline.md | 7 | 47 | 62 |
| rules/engineering.md | 37 | 128 | 167 |
| rules/debugging.md | 29 | 99 | 129 |
| rules/testing.md | 30 | 93 | 121 |
| skills/token-router/SKILL.md | 23 | 84 | 110 |
| skills/verify-before-done/SKILL.md | 40 | 112 | 146 |


### Profile: `security`
- Baseline Max Weight: **1965** estimated tokens.
- Optimized Profile Weight: **114** lines, **496** words, **645** estimated tokens.
- Status: **PASS**

#### Source Files Included:
| File / Component | Lines | Words | Estimated Tokens |
| :--- | :---: | :---: | :---: |
| CLAUDE.md (template) | 34 | 135 | 176 |
| rules/token-discipline.md | 7 | 47 | 62 |
| rules/security.md | 32 | 110 | 143 |
| skills/token-router/SKILL.md | 23 | 84 | 110 |
| skills/security-review/SKILL.md | 43 | 110 | 143 |


### Profile: `repo-review`
- Baseline Max Weight: **1965** estimated tokens.
- Optimized Profile Weight: **146** lines, **633** words, **823** estimated tokens.
- Status: **PASS**

#### Source Files Included:
| File / Component | Lines | Words | Estimated Tokens |
| :--- | :---: | :---: | :---: |
| CLAUDE.md (template) | 34 | 135 | 176 |
| rules/token-discipline.md | 7 | 47 | 62 |
| rules/engineering.md | 37 | 128 | 167 |
| skills/token-router/SKILL.md | 23 | 84 | 110 |
| skills/repo-intake/SKILL.md | 46 | 132 | 172 |
| skills/architecture-review/SKILL.md | 38 | 97 | 127 |


### Profile: `release`
- Baseline Max Weight: **1965** estimated tokens.
- Optimized Profile Weight: **115** lines, **450** words, **585** estimated tokens.
- Status: **PASS**

#### Source Files Included:
| File / Component | Lines | Words | Estimated Tokens |
| :--- | :---: | :---: | :---: |
| CLAUDE.md (template) | 34 | 135 | 176 |
| rules/token-discipline.md | 7 | 47 | 62 |
| rules/release.md | 34 | 87 | 114 |
| skills/token-router/SKILL.md | 23 | 84 | 110 |
| skills/release-check/SKILL.md | 39 | 87 | 114 |


### Profile: `max`
- Baseline Max Weight: **1965** estimated tokens.
- Optimized Profile Weight: **382** lines, **1521** words, **1978** estimated tokens.
- Status: **PASS**

#### Source Files Included:
| File / Component | Lines | Words | Estimated Tokens |
| :--- | :---: | :---: | :---: |
| CLAUDE.md (template) | 34 | 135 | 176 |
| rules/token-discipline.md | 7 | 47 | 62 |
| rules/engineering.md | 37 | 128 | 167 |
| rules/debugging.md | 29 | 99 | 129 |
| rules/testing.md | 30 | 93 | 121 |
| rules/security.md | 32 | 110 | 143 |
| rules/release.md | 34 | 87 | 114 |
| skills/token-router/SKILL.md | 23 | 84 | 110 |
| skills/verify-before-done/SKILL.md | 40 | 112 | 146 |
| skills/security-review/SKILL.md | 43 | 110 | 143 |
| skills/repo-intake/SKILL.md | 46 | 132 | 172 |
| skills/architecture-review/SKILL.md | 38 | 97 | 127 |
| skills/release-check/SKILL.md | 39 | 87 | 114 |
| skills/fable-mode/SKILL.md | 73 | 190 | 247 |


---
## Verification Conclusion
Benchmark completed with overall status: **PASS**. All safety validation criteria have been checked.
