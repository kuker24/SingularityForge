#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const root = process.cwd();

// Profile mapping definition
const PROFILE_MAP = {
  minimal: {
    rules: ['rules/token-discipline.md'],
    skills: ['skills/token-router/SKILL.md'],
    budget: 500,
    warnLimit: 650
  },
  coding: {
    rules: ['rules/token-discipline.md', 'rules/engineering.md', 'rules/debugging.md', 'rules/testing.md'],
    skills: ['skills/token-router/SKILL.md', 'skills/verify-before-done/SKILL.md'],
    budget: 1200,
    warnLimit: 1500
  },
  security: {
    rules: ['rules/token-discipline.md', 'rules/security.md'],
    skills: ['skills/token-router/SKILL.md', 'skills/security-review/SKILL.md'],
    budget: 1200,
    warnLimit: 1500
  },
  'repo-review': {
    rules: ['rules/token-discipline.md', 'rules/engineering.md'],
    skills: ['skills/token-router/SKILL.md', 'skills/repo-intake/SKILL.md', 'skills/architecture-review/SKILL.md'],
    budget: 1400,
    warnLimit: 1800
  },
  release: {
    rules: ['rules/token-discipline.md', 'rules/release.md'],
    skills: ['skills/token-router/SKILL.md', 'skills/release-check/SKILL.md'],
    budget: 900,
    warnLimit: 1100
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
    ],
    budget: 2500,
    warnLimit: 3000
  }
};

// Parse command line arguments
let targetDirArg = null;
let forcedProfile = null;

for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === '--profile' || arg === '-p') {
    forcedProfile = process.argv[i + 1];
    i++;
  } else {
    targetDirArg = arg;
  }
}

// Validate forced profile if set
if (forcedProfile && forcedProfile !== 'all' && !PROFILE_MAP[forcedProfile]) {
  console.error(`Error: Invalid profile '${forcedProfile}'. Supported profiles: ${Object.keys(PROFILE_MAP).join(', ')}, all`);
  process.exit(1);
}

// Determine target configuration directory
let targetDir = targetDirArg;
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
let defaultProfile = 'minimal';

if (existsSync(settingsPath)) {
  try {
    const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
    if (settings.singularityForge && settings.singularityForge.profile) {
      defaultProfile = settings.singularityForge.profile;
    }
  } catch (e) {
    // Defaulting
  }
}

// Determine profile(s) to run
const profilesToRun = [];
if (forcedProfile === 'all') {
  profilesToRun.push(...Object.keys(PROFILE_MAP));
} else if (forcedProfile) {
  profilesToRun.push(forcedProfile);
} else {
  profilesToRun.push(defaultProfile);
}

// Helper to count lines, words, and estimated tokens
function getStats(text) {
  const lines = text.split('\n').length;
  const words = text.split(/\s+/).filter(Boolean).length;
  const tokens = Math.ceil(words * 1.3);
  return { lines, words, tokens };
}

function resolveSourcePath(fileRel) {
  let filePath = path.join(root, 'packages', fileRel);
  if (!existsSync(filePath)) {
    filePath = path.join(targetDir, fileRel);
  }
  if (!existsSync(filePath)) {
    filePath = path.join(os.homedir(), '.claude', fileRel);
  }
  return filePath;
}

// Pre-calculate baseline maximum token size for context budget savings math
let maxProfileTokens = 0;
const maxConfig = PROFILE_MAP.max;
let maxWordsSum = 0;

const originalClaudePath = path.join(root, 'packages/global-memory/CLAUDE.md');
if (existsSync(originalClaudePath)) {
  const content = readFileSync(originalClaudePath, 'utf8');
  maxWordsSum += getStats(content).words;
}
for (const ruleRel of maxConfig.rules) {
  const filePath = resolveSourcePath(ruleRel);
  if (existsSync(filePath)) {
    maxWordsSum += getStats(readFileSync(filePath, 'utf8')).words;
  }
}
for (const skillRel of maxConfig.skills) {
  const filePath = resolveSourcePath(skillRel);
  if (existsSync(filePath)) {
    maxWordsSum += getStats(readFileSync(filePath, 'utf8')).words;
  }
}
maxProfileTokens = Math.ceil(maxWordsSum * 1.3);

const benchmarkResults = [];
let overallStatus = 'PASS';

for (const profileName of profilesToRun) {
  const config = PROFILE_MAP[profileName];
  
  // Calculate original metrics (raw summation before profile dynamic filtering)
  // We treat the "Max profile" as the unoptimized state where all project capabilities are loaded.
  const originalTokens = maxProfileTokens;

  let optimizedLines = 0;
  let optimizedWords = 0;
  let optimizedTokens = 0;
  const sourceFiles = [];

  function compressMarkdown(content) {
    return content
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\n\s*\n/g, '\n')
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .join('\n');
  }

  // Add CLAUDE.md template if global memory is loaded
  if (existsSync(originalClaudePath)) {
    const content = readFileSync(originalClaudePath, 'utf8');
    const stats = getStats(content);
    
    const compressed = compressMarkdown(content);
    const optStats = getStats(compressed);
    optimizedLines += optStats.lines;
    optimizedWords += optStats.words;
    optimizedTokens += optStats.tokens;

    sourceFiles.push({ name: 'CLAUDE.md (template)', ...stats, optWords: optStats.words });
  }

  for (const ruleRel of config.rules) {
    const filePath = resolveSourcePath(ruleRel);
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf8');
      const stats = getStats(content);
      
      const compressed = compressMarkdown(content);
      const optStats = getStats(compressed);
      optimizedLines += optStats.lines;
      optimizedWords += optStats.words;
      optimizedTokens += optStats.tokens;

      sourceFiles.push({ name: ruleRel, ...stats, optWords: optStats.words });
    }
  }

  for (const skillRel of config.skills) {
    const filePath = resolveSourcePath(skillRel);
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf8');
      const stats = getStats(content);
      
      const compressed = compressMarkdown(content);
      const optStats = getStats(compressed);
      optimizedLines += optStats.lines;
      optimizedWords += optStats.words;
      optimizedTokens += optStats.tokens;

      sourceFiles.push({ name: skillRel, ...stats, optWords: optStats.words });
    }
  }

  // Calculate compiled cache metrics
  const headerOverheadWords = 10;
  const compiledLines = optimizedLines + 4;
  const compiledWords = optimizedWords + headerOverheadWords;
  const compiledTokens = Math.ceil(compiledWords * 1.3);

  // We measure context savings relative to loading the entire Max profile capabilities
  const savingsTokens = originalTokens > 0 ? ((originalTokens - compiledTokens) / originalTokens * 100).toFixed(1) : '0.0';

  // Budget Status Evaluation
  let status = 'PASS';
  let recommendation = 'Keep up the good work. Token budget is well-optimized.';

  // Check safety validations
  let safetyPassed = true;
  const rulesList = config.rules.map(r => path.basename(r));
  
  if (profileName === 'security' && !rulesList.includes('security.md')) {
    status = 'FAIL (Security Rules Missing)';
    recommendation = 'Security profile must retain security rules to prevent security model degradation.';
    safetyPassed = false;
  } else if (profileName === 'coding' && (!rulesList.includes('engineering.md') || !rulesList.includes('debugging.md') || !rulesList.includes('testing.md'))) {
    status = 'FAIL (Coding Rules Missing)';
    recommendation = 'Coding profile must contain engineering, debugging, and testing rules.';
    safetyPassed = false;
  } else if (profileName === 'release' && !rulesList.includes('release.md')) {
    status = 'FAIL (Release Rules Missing)';
    recommendation = 'Release profile must contain release process and checklist rules.';
    safetyPassed = false;
  }

  if (safetyPassed) {
    if (compiledTokens > config.warnLimit) {
      status = 'FAIL';
      recommendation = `Estimated token count (${compiledTokens}) exceeds the profile FAIL limit of ${config.warnLimit}. Please reduce rule/skill footprint.`;
    } else if (compiledTokens > config.budget) {
      status = 'WARN';
      recommendation = `Estimated token count (${compiledTokens}) is above the budget goal of ${config.budget}. Keep rules and skills compact.`;
    }
  }

  if (status.startsWith('FAIL')) {
    overallStatus = 'FAIL';
  } else if (status === 'WARN' && overallStatus !== 'FAIL') {
    overallStatus = 'WARN';
  }

  benchmarkResults.push({
    profile: profileName,
    originalTokens,
    optimizedTokens: compiledTokens,
    savings: `${savingsTokens}%`,
    budget: config.budget,
    status,
    recommendation,
    sourceFiles,
    compiledLines,
    compiledWords
  });
}

// Print results to console
console.log(`=== SingularityForge Profile Token Savings Benchmark ===`);
console.log(`Target Scope: ${targetDir}`);
console.log(`Overall Status: ${overallStatus}`);
console.log(`--------------------------------------------------------------------------------`);
console.log(String('Profile').padEnd(15) + ' | ' + String('Original').padEnd(10) + ' | ' + String('Optimized').padEnd(10) + ' | ' + String('Savings').padEnd(8) + ' | ' + String('Budget').padEnd(8) + ' | ' + String('Status'));
console.log(`--------------------------------------------------------------------------------`);
for (const res of benchmarkResults) {
  console.log(
    res.profile.padEnd(15) + ' | ' +
    String(res.originalTokens).padEnd(10) + ' | ' +
    String(res.optimizedTokens).padEnd(10) + ' | ' +
    res.savings.padEnd(8) + ' | ' +
    String(res.budget).padEnd(8) + ' | ' +
    res.status
  );
}
console.log(`--------------------------------------------------------------------------------`);

// Generate Markdown Profile Report
const reportMarkdown = `# Profile-Aware Token Savings Benchmark Report

Generated: ${new Date().toISOString()}
Target Directory: \`${targetDir}\`
Overall Status: **${overallStatus}**

## Multi-Profile Comparison Table

| Profile | Original (Max) Tokens | Optimized Tokens | Context Savings | Budget Goal | Status | Recommendation |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
${benchmarkResults.map(res => `| \`${res.profile}\` | ${res.originalTokens} | ${res.optimizedTokens} | ${res.savings} | ${res.budget} | **${res.status}** | ${res.recommendation} |`).join('\n')}

## Detailed Profile Inventories

${benchmarkResults.map(res => `
### Profile: \`${res.profile}\`
- Baseline Max Weight: **${res.originalTokens}** estimated tokens.
- Optimized Profile Weight: **${res.compiledLines}** lines, **${res.compiledWords}** words, **${res.optimizedTokens}** estimated tokens.
- Status: **${res.status}**

#### Source Files Included:
| File / Component | Lines | Words | Estimated Tokens |
| :--- | :---: | :---: | :---: |
${res.sourceFiles.map(f => `| ${f.name} | ${f.lines} | ${f.words} | ${f.tokens} |`).join('\n')}
`).join('\n')}

---
## Verification Conclusion
Benchmark completed with overall status: **${overallStatus}**. All safety validation criteria have been checked.
`;

// Save report files
const reportDir = path.join(root, 'reports/token');
if (!existsSync(reportDir)) {
  mkdirSync(reportDir, { recursive: true });
}

// Write profile-specific report
writeFileSync(path.join(reportDir, 'profile-token-benchmark.md'), reportMarkdown, 'utf8');
console.log(`Wrote benchmark report to: ${path.join(reportDir, 'profile-token-benchmark.md')}`);

// Also overwrite default token-benchmark.md to keep them aligned
writeFileSync(path.join(reportDir, 'token-benchmark.md'), reportMarkdown, 'utf8');

if (overallStatus.startsWith('FAIL')) {
  process.exit(1);
}
process.exit(0);
