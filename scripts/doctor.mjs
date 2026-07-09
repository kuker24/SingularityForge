#!/usr/bin/env node
/**
 * SingularityForge Doctor
 * Memeriksa kesiapan runtime Linux/CachyOS secara menyeluruh.
 * Exit 0 = PASS/WARN | Exit 1 = FAIL
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir, platform } from 'node:os';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root       = path.resolve(__dirname, '..');
const claudeDir  = path.join(homedir(), '.claude');
const isLinux    = platform() === 'linux';
const isWin      = platform() === 'win32';

let hasFail = false;

function pass(label, detail = '') {
  console.log(`  PASS  ${label}${detail ? '  →  ' + detail : ''}`);
}
function warn(label, detail = '') {
  console.log(`  WARN  ${label}${detail ? '  →  ' + detail : ''}`);
}
function fail(label, detail = '') {
  console.error(`  FAIL  ${label}${detail ? '  →  ' + detail : ''}`);
  hasFail = true;
}

function commandExists(cmd) {
  const result = spawnSync(isWin ? 'where' : 'command', isWin ? [cmd] : ['-v', cmd], {
    shell: !isWin,
    stdio: 'ignore',
  });
  return result.status === 0;
}

function isExecutable(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

console.log('=== SingularityForge Doctor ===');
console.log(`Platform: ${platform()}`);
console.log('');

// ── 1. Node.js version ────────────────────────────────────────────────────────
console.log('[ Node.js ]');
const nvMatch = process.version.match(/^v(\d+)/);
const nodeMajor = nvMatch ? parseInt(nvMatch[1], 10) : 0;
if (nodeMajor >= 20) {
  pass('Node.js version', process.version);
} else {
  fail('Node.js version', `${process.version} — requires >=20`);
}

// ── 2. Claude CLI ─────────────────────────────────────────────────────────────
console.log('');
console.log('[ Claude CLI ]');
if (commandExists('claude')) {
  pass('claude command', 'found');
} else {
  warn('claude command', 'not found — install Claude Code manually');
}

// ── 3. Global memory & settings ──────────────────────────────────────────────
console.log('');
console.log('[ Global Memory ]');
const requiredClaudeFiles = [
  ['~/.claude dir',       claudeDir],
  ['~/.claude/CLAUDE.md', path.join(claudeDir, 'CLAUDE.md')],
  ['~/.claude/settings.json', path.join(claudeDir, 'settings.json')],
  ['~/.claude/rules',     path.join(claudeDir, 'rules')],
  ['~/.claude/skills',    path.join(claudeDir, 'skills')],
  ['~/.claude/hooks',     path.join(claudeDir, 'hooks')],
];
for (const [label, p] of requiredClaudeFiles) {
  if (fs.existsSync(p)) pass(label);
  else warn(label, 'missing — run installer first');
}

// ── 4. Repo source files ──────────────────────────────────────────────────────
console.log('');
console.log('[ Repo Source Files ]');
const requiredRepoFiles = [
  'packages/global-memory/CLAUDE.md',
  'packages/settings/settings.json',
  'packages/rules/security.md',
  'packages/rules/engineering.md',
  'packages/rules/release.md',
  'packages/rules/token-discipline.md',
];
for (const rel of requiredRepoFiles) {
  const p = path.join(root, rel);
  if (fs.existsSync(p)) pass(rel);
  else fail(rel, 'missing from repo source');
}

// ── 5. Skills validation ──────────────────────────────────────────────────────
console.log('');
console.log('[ Skills ]');
const skillsDir = path.join(root, 'packages/skills');
if (!fs.existsSync(skillsDir)) {
  fail('packages/skills', 'directory missing');
} else {
  const skillFolders = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory());
  let skillFail = false;
  for (const sf of skillFolders) {
    const skillMd = path.join(skillsDir, sf.name, 'SKILL.md');
    if (!fs.existsSync(skillMd)) {
      fail(`skills/${sf.name}/SKILL.md`, 'missing');
      skillFail = true;
    }
  }
  if (!skillFail) pass(`${skillFolders.length} skill folders`, 'all have SKILL.md');
}

// ── 6. Bash hooks executable ──────────────────────────────────────────────────
console.log('');
console.log('[ Bash Hooks ]');
const bashHooks = [
  'packages/hooks/pre-dangerous-command.sh',
  'packages/hooks/post-edit-skill-verify.sh',
  'packages/hooks/stop-verify-before-done.sh',
];
for (const rel of bashHooks) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    fail(rel, 'file missing');
  } else if (isLinux && !isExecutable(p)) {
    fail(rel, 'not executable — run: chmod +x ' + rel);
  } else {
    pass(rel, isLinux ? 'executable' : 'present (exec check skipped on non-Linux)');
  }
}

// ── 7. Bash adapters executable ───────────────────────────────────────────────
console.log('');
console.log('[ Bash Hook Adapters ]');
const bashAdapters = [
  'packages/hooks/adapters/noop.sh',
  'packages/hooks/adapters/logging.sh',
  'packages/hooks/adapters/audit.sh',
  'packages/hooks/adapters/external-placeholder.sh',
  'packages/hooks/adapters/run-adapters.sh',
];
for (const rel of bashAdapters) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    fail(rel, 'file missing');
  } else if (isLinux && !isExecutable(p)) {
    fail(rel, 'not executable — run: chmod +x ' + rel);
  } else {
    pass(rel, isLinux ? 'executable' : 'present (exec check skipped on non-Linux)');
  }
}

// ── 8. Adapter registry ───────────────────────────────────────────────────────
console.log('');
console.log('[ Adapter Registry ]');
const registryPath = path.join(root, 'packages/hooks/adapters/registry.json');
if (!fs.existsSync(registryPath)) {
  fail('registry.json', 'missing');
} else {
  try {
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    if (!Array.isArray(registry.adapters)) {
      fail('registry.json', '"adapters" key must be an array');
    } else {
      const allDefaultOff = registry.adapters.every((a) => a.defaultEnabled === false);
      const allNoNetwork  = registry.adapters.every((a) => a.networkCall === false);
      if (!allDefaultOff) fail('registry.json', 'one or more adapters have defaultEnabled !== false');
      else pass('registry.json', `${registry.adapters.length} adapters, all defaultEnabled=false`);
      if (!allNoNetwork) fail('registry.json', 'one or more adapters have networkCall !== false');
      else pass('registry.json', 'all adapters networkCall=false');
    }
  } catch (e) {
    fail('registry.json', `invalid JSON — ${e.message}`);
  }
}

// ── 9. settings.json hookAdapters default OFF ────────────────────────────────
console.log('');
console.log('[ Settings Defaults ]');
const settingsPath = path.join(root, 'packages/settings/settings.json');
try {
  const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  const ha = settings?.singularityForge?.hookAdapters;
  if (!ha) {
    fail('hookAdapters', 'key missing in settings.json');
  } else if (ha.enabled !== false) {
    fail('hookAdapters.enabled', `must be false by default (got ${JSON.stringify(ha.enabled)})`);
  } else {
    pass('hookAdapters.enabled=false', 'default OFF ✓');
  }

  // External integrations default OFF
  const extKeys = ['mcpDefault', 'repomixDefault'];
  for (const key of extKeys) {
    const val = settings?.singularityForge?.[key];
    if (val && val !== 'off') {
      fail(`singularityForge.${key}`, `must be "off" (got "${val}")`);
    } else {
      pass(`singularityForge.${key}`, '"off" ✓');
    }
  }
} catch (e) {
  fail('settings.json', `cannot parse — ${e.message}`);
}

// ── 10. Summary ───────────────────────────────────────────────────────────────
console.log('');
if (hasFail) {
  console.error('=== Doctor Result: FAIL ===');
  process.exit(1);
} else {
  console.log('=== Doctor Result: PASS ===');
  process.exit(0);
}
