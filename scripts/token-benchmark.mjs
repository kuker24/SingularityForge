#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const root = process.cwd();

// Profile mapping definition (same as in optimize-token-cache.mjs to maintain alignment)
const PROFILE_MAP = {
  minimal: {
    rules: ['rules/token-discipline.md'],
    skills: ['skills/token-router/SKILL.md']
  },
  coding: {
    rules: ['rules/token-discipline.md', 'rules/engineering.md', 'rules/debugging.md', 'rules/testing.md'],
    skills: ['skills/token-router/SKILL.md', 'skills/verify-before-done/SKILL.md']
  },
  security: {
    rules: ['rules/token-discipline.md', 'rules/security.md'],
    skills: ['skills/token-router/SKILL.md', 'skills/security-review/SKILL.md']
  },
  'repo-review': {
    rules: ['rules/token-discipline.md', 'rules/engineering.md'],
    skills: ['skills/token-router/SKILL.md', 'skills/repo-intake/SKILL.md', 'skills/architecture-review/SKILL.md']
  },
  release: {
    rules: ['rules/token-discipline.md', 'rules/release.md'],
    skills: ['skills/token-router/SKILL.md', 'skills/release-check/SKILL.md']
  },
  max: {
    rules: [
      'rules/token-discipline.md',
      'rules/engineering.md',
      'rules/debugging.md',
      'rules/testing.md',
      'rules/security.md',
      'rules/release.md'
    ],
    skills: [
      'skills/token-router/SKILL.md',
      'skills/verify-before-done/SKILL.md',
      'skills/security-review/SKILL.md',
      'skills/repo-intake/SKILL.md',
      'skills/architecture-review/SKILL.md',
      'skills/release-check/SKILL.md',
      'skills/fable-mode/SKILL.md'
    ]
  }
};

// Determine target configuration directory
let targetDir = process.argv[2];
let isLocal = false;

if (targetDir) {
  targetDir = path.resolve(targetDir);
  const globalClaudePath = path.resolve(path.join(os.homedir(), '.claude'));
  if (targetDir !== globalClaudePath) {
    isLocal = true;
  }
} else {
  if (existsSync(path.join(root, '.claude/settings.json'))) {
    targetDir = path.join(root, '.claude');
    isLocal = true;
  } else {
    targetDir = path.join(os.homedir(), '.claude');
  }
}

const settingsPath = path.join(targetDir, 'settings.json');
let profile = 'minimal';

if (existsSync(settingsPath)) {
  try {
    const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
    if (settings.singularityForge && settings.singularityForge.profile) {
      profile = settings.singularityForge.profile;
    }
  } catch (e) {
    // Defaulting
  }
}

const config = PROFILE_MAP[profile] || PROFILE_MAP.minimal;

// Helper to count lines, words and tokens
function getStats(text) {
  const lines = text.split('\n').length;
  const words = text.split(/\s+/).filter(Boolean).length;
  const tokens = Math.ceil(words * 1.3); // 1 word = ~1.3 tokens rule of thumb
  return { lines, words, tokens };
}

// Calculate original metrics
let originalLines = 0;
let originalWords = 0;
let originalTokens = 0;
const sourceFiles = [];

// Resolve and read helper
function resolveSourcePath(fileRel) {
  let filePath = path.join(targetDir, fileRel);
  if (!existsSync(filePath)) {
    filePath = path.join(root, 'packages', fileRel);
  }
  if (!existsSync(filePath)) {
    filePath = path.join(os.homedir(), '.claude', fileRel);
  }
  return filePath;
}

// Add CLAUDE.md template if global memory is loaded
const originalClaudePath = path.join(root, 'packages/global-memory/CLAUDE.md');
if (existsSync(originalClaudePath)) {
  const content = readFileSync(originalClaudePath, 'utf8');
  const stats = getStats(content);
  originalLines += stats.lines;
  originalWords += stats.words;
  originalTokens += stats.tokens;
  sourceFiles.push({ name: 'CLAUDE.md (template)', ...stats });
}

for (const ruleRel of config.rules) {
  const filePath = resolveSourcePath(ruleRel);
  if (existsSync(filePath)) {
    const content = readFileSync(filePath, 'utf8');
    const stats = getStats(content);
    originalLines += stats.lines;
    originalWords += stats.words;
    originalTokens += stats.tokens;
    sourceFiles.push({ name: ruleRel, ...stats });
  }
}

for (const skillRel of config.skills) {
  const filePath = resolveSourcePath(skillRel);
  if (existsSync(filePath)) {
    const content = readFileSync(filePath, 'utf8');
    const stats = getStats(content);
    originalLines += stats.lines;
    originalWords += stats.words;
    originalTokens += stats.tokens;
    sourceFiles.push({ name: skillRel, ...stats });
  }
}

// Calculate compiled metrics
const compiledClaudePath = path.join(targetDir, 'CLAUDE.md');
let compiledLines = 0;
let compiledWords = 0;
let compiledTokens = 0;
let cacheExists = false;

if (existsSync(compiledClaudePath)) {
  cacheExists = true;
  const content = readFileSync(compiledClaudePath, 'utf8');
  const stats = getStats(content);
  compiledLines = stats.lines;
  compiledWords = stats.words;
  compiledTokens = stats.tokens;
}

// Optimization percentages
const savingsLines = originalLines > 0 ? ((originalLines - compiledLines) / originalLines * 100).toFixed(1) : '0.0';
const savingsWords = originalWords > 0 ? ((originalWords - compiledWords) / originalWords * 100).toFixed(1) : '0.0';
const savingsTokens = originalTokens > 0 ? ((originalTokens - compiledTokens) / originalTokens * 100).toFixed(1) : '0.0';

// Status determination
let status = 'PASS';
if (!cacheExists) {
  status = 'FAIL (No Cache Found)';
} else if (compiledWords > originalWords) {
  status = 'FAIL';
} else if (compiledWords === originalWords) {
  status = 'WARN';
}

console.log(`=== SingularityForge Token Savings Benchmark ===`);
console.log(`Profile: ${profile}`);
console.log(`Directory Scope: ${targetDir}`);
console.log(`-----------------------------------------------`);
console.log(`Original Files Total:`);
console.log(`  - Lines:  ${originalLines}`);
console.log(`  - Words:  ${originalWords}`);
console.log(`  - Tokens: ${originalTokens} (est)`);
console.log(`Compiled CLAUDE.md Cache:`);
console.log(`  - Lines:  ${compiledLines}`);
console.log(`  - Words:  ${compiledWords}`);
console.log(`  - Tokens: ${compiledTokens} (est)`);
console.log(`-----------------------------------------------`);
console.log(`Budget Savings Summary:`);
console.log(`  - Line Savings:  ${savingsLines}%`);
console.log(`  - Word Savings:  ${savingsWords}%`);
console.log(`  - Token Savings: ${savingsTokens}%`);
console.log(`  - Benchmark Status: ${status}`);

// Generate Markdown Report
const reportMarkdown = `# Token Savings Benchmark Report

Generated: ${new Date().toISOString()}
Target Profile: \`${profile}\`
Target Directory: \`${targetDir}\`
Benchmark Status: **${status}**

## Detailed Source File Weights

| File / Component | Lines | Words | Estimated Tokens |
| :--- | :---: | :---: | :---: |
${sourceFiles.map(f => `| ${f.name} | ${f.lines} | ${f.words} | ${f.tokens} |`).join('\n')}
| **TOTAL ORIGINAL** | **${originalLines}** | **${originalWords}** | **${originalTokens}** |

## Compiled Memory Cache Comparison

| Metric | Original Weight | Optimized Cache | Savings (%) |
| :--- | :---: | :---: | :---: |
| Lines | ${originalLines} | ${compiledLines} | ${savingsLines}% |
| Words | ${originalWords} | ${compiledWords} | ${savingsWords}% |
| Tokens (est) | ${originalTokens} | ${compiledTokens} | ${savingsTokens}% |

## Conclusion
The Token Cache Optimizer compiled all active profiles and modules into a singular optimized \`CLAUDE.md\` cache.
Status: **${status}**
`;

// Save report file
const reportDir = path.join(root, 'reports/token');
if (!existsSync(reportDir)) {
  mkdirSync(reportDir, { recursive: true });
}
writeFileSync(path.join(reportDir, 'token-benchmark.md'), reportMarkdown, 'utf8');
console.log(`Wrote benchmark report to: ${path.join(reportDir, 'token-benchmark.md')}`);

if (status.startsWith('FAIL')) {
  process.exit(1);
}
process.exit(0);
