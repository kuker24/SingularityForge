# Profile-Aware Token Savings Benchmark Report

Generated: 2026-07-09T15:26:39.636Z
Target Directory: `/home/fahmi/.claude`
Overall Status: **WARN**

## Multi-Profile Comparison Table

| Profile | Original (Max) Tokens | Optimized Tokens | Context Savings | Budget Goal | Status | Recommendation |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `minimal` | 2218 | 613 | 72.4% | 500 | **WARN** | Estimated token count (613) is above the budget goal of 500. Keep rules and skills compact. |
| `coding` | 2218 | 1174 | 47.1% | 1200 | **PASS** | Keep up the good work. Token budget is well-optimized. |
| `security` | 2218 | 899 | 59.5% | 1200 | **PASS** | Keep up the good work. Token budget is well-optimized. |
| `repo-review` | 2218 | 1077 | 51.4% | 1400 | **PASS** | Keep up the good work. Token budget is well-optimized. |
| `release` | 2218 | 839 | 62.2% | 900 | **PASS** | Keep up the good work. Token budget is well-optimized. |
| `max` | 2218 | 2231 | -0.6% | 2500 | **PASS** | Keep up the good work. Token budget is well-optimized. |

## Detailed Profile Inventories


### Profile: `minimal`
- Baseline Max Weight: **2218** estimated tokens.
- Optimized Profile Weight: **83** lines, **471** words, **613** estimated tokens.
- Status: **WARN**

#### Source Files Included:
| File / Component | Lines | Words | Estimated Tokens |
| :--- | :---: | :---: | :---: |
| CLAUDE.md (template) | 51 | 257 | 335 |
| rules/token-discipline.md | 16 | 84 | 110 |
| skills/token-router/SKILL.md | 30 | 120 | 156 |


### Profile: `coding`
- Baseline Max Weight: **2218** estimated tokens.
- Optimized Profile Weight: **180** lines, **903** words, **1174** estimated tokens.
- Status: **PASS**

#### Source Files Included:
| File / Component | Lines | Words | Estimated Tokens |
| :--- | :---: | :---: | :---: |
| CLAUDE.md (template) | 51 | 257 | 335 |
| rules/token-discipline.md | 16 | 84 | 110 |
| rules/engineering.md | 37 | 128 | 167 |
| rules/debugging.md | 29 | 99 | 129 |
| rules/testing.md | 30 | 93 | 121 |
| skills/token-router/SKILL.md | 30 | 120 | 156 |
| skills/verify-before-done/SKILL.md | 40 | 112 | 146 |


### Profile: `security`
- Baseline Max Weight: **2218** estimated tokens.
- Optimized Profile Weight: **140** lines, **691** words, **899** estimated tokens.
- Status: **PASS**

#### Source Files Included:
| File / Component | Lines | Words | Estimated Tokens |
| :--- | :---: | :---: | :---: |
| CLAUDE.md (template) | 51 | 257 | 335 |
| rules/token-discipline.md | 16 | 84 | 110 |
| rules/security.md | 32 | 110 | 143 |
| skills/token-router/SKILL.md | 30 | 120 | 156 |
| skills/security-review/SKILL.md | 43 | 110 | 143 |


### Profile: `repo-review`
- Baseline Max Weight: **2218** estimated tokens.
- Optimized Profile Weight: **172** lines, **828** words, **1077** estimated tokens.
- Status: **PASS**

#### Source Files Included:
| File / Component | Lines | Words | Estimated Tokens |
| :--- | :---: | :---: | :---: |
| CLAUDE.md (template) | 51 | 257 | 335 |
| rules/token-discipline.md | 16 | 84 | 110 |
| rules/engineering.md | 37 | 128 | 167 |
| skills/token-router/SKILL.md | 30 | 120 | 156 |
| skills/repo-intake/SKILL.md | 46 | 132 | 172 |
| skills/architecture-review/SKILL.md | 38 | 97 | 127 |


### Profile: `release`
- Baseline Max Weight: **2218** estimated tokens.
- Optimized Profile Weight: **141** lines, **645** words, **839** estimated tokens.
- Status: **PASS**

#### Source Files Included:
| File / Component | Lines | Words | Estimated Tokens |
| :--- | :---: | :---: | :---: |
| CLAUDE.md (template) | 51 | 257 | 335 |
| rules/token-discipline.md | 16 | 84 | 110 |
| rules/release.md | 34 | 87 | 114 |
| skills/token-router/SKILL.md | 30 | 120 | 156 |
| skills/release-check/SKILL.md | 39 | 87 | 114 |


### Profile: `max`
- Baseline Max Weight: **2218** estimated tokens.
- Optimized Profile Weight: **408** lines, **1716** words, **2231** estimated tokens.
- Status: **PASS**

#### Source Files Included:
| File / Component | Lines | Words | Estimated Tokens |
| :--- | :---: | :---: | :---: |
| CLAUDE.md (template) | 51 | 257 | 335 |
| rules/token-discipline.md | 16 | 84 | 110 |
| rules/engineering.md | 37 | 128 | 167 |
| rules/debugging.md | 29 | 99 | 129 |
| rules/testing.md | 30 | 93 | 121 |
| rules/security.md | 32 | 110 | 143 |
| rules/release.md | 34 | 87 | 114 |
| skills/token-router/SKILL.md | 30 | 120 | 156 |
| skills/verify-before-done/SKILL.md | 40 | 112 | 146 |
| skills/security-review/SKILL.md | 43 | 110 | 143 |
| skills/repo-intake/SKILL.md | 46 | 132 | 172 |
| skills/architecture-review/SKILL.md | 38 | 97 | 127 |
| skills/release-check/SKILL.md | 39 | 87 | 114 |
| skills/fable-mode/SKILL.md | 73 | 190 | 247 |


---
## Verification Conclusion
Benchmark completed with overall status: **WARN**. All safety validation criteria have been checked.
