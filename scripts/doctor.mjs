#!/usr/bin/env node
/** SingularityForge Doctor: Linux/CachyOS runtime readiness checker. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir, platform } from 'node:os';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const fixPermissions = args.includes('--fix-permissions');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const claudeDir = path.join(homedir(), '.claude');
const isLinux = platform() === 'linux';
const isWin = platform() === 'win32';
const checks = [];

function add(status, name, detail = '') { checks.push({ status, name, detail }); }
function pass(n, d='') { add('PASS', n, d); }
function warn(n, d='') { add('WARN', n, d); }
function fail(n, d='') { add('FAIL', n, d); }
function commandExists(cmd) {
  return spawnSync(isWin ? 'where' : 'command', isWin ? [cmd] : ['-v', cmd], { shell: !isWin, stdio: 'ignore' }).status === 0;
}
function isExecutable(p) { try { fs.accessSync(p, fs.constants.X_OK); return true; } catch { return false; } }
function chmodX(rel) { const p = path.join(root, rel); if (fs.existsSync(p)) fs.chmodSync(p, fs.statSync(p).mode | 0o111); }
function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, pred, out);
    else if (pred(p)) out.push(p);
  }
  return out;
}

if (fixPermissions) {
  for (const f of walk(path.join(root, 'installer'), (p) => p.endsWith('.sh'))) chmodX(path.relative(root, f));
  for (const f of walk(path.join(root, 'packages/hooks'), (p) => p.endsWith('.sh'))) chmodX(path.relative(root, f));
  pass('fix-permissions', 'set executable bit for installer/*.sh and packages/hooks/**/*.sh only');
}

const nodeMajor = Number(process.version.match(/^v(\d+)/)?.[1] || 0);
nodeMajor >= 20 ? pass('Node.js version', process.version) : fail('Node.js version', `${process.version}; requires >=20`);
commandExists('claude') ? pass('claude command', 'found') : warn('claude command', 'missing');

for (const [label, p] of [
  ['~/.claude dir', claudeDir], ['~/.claude/CLAUDE.md', path.join(claudeDir, 'CLAUDE.md')],
  ['~/.claude/settings.json', path.join(claudeDir, 'settings.json')], ['~/.claude/rules', path.join(claudeDir, 'rules')],
  ['~/.claude/skills', path.join(claudeDir, 'skills')], ['~/.claude/hooks', path.join(claudeDir, 'hooks')]
]) fs.existsSync(p) ? pass(label) : warn(label, 'missing; run installer first');

for (const rel of ['packages/global-memory/CLAUDE.md','packages/settings/settings.json','packages/rules/security.md','packages/rules/engineering.md','packages/rules/release.md','packages/rules/token-discipline.md']) {
  fs.existsSync(path.join(root, rel)) ? pass(rel) : fail(rel, 'missing');
}

const skillsDir = path.join(root, 'packages/skills');
if (!fs.existsSync(skillsDir)) fail('packages/skills', 'missing');
else {
  const dirs = fs.readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory());
  let bad = 0; for (const d of dirs) if (!fs.existsSync(path.join(skillsDir, d.name, 'SKILL.md'))) { fail(`skills/${d.name}/SKILL.md`, 'missing'); bad++; }
  if (!bad) pass('skills', `${dirs.length} skill folders have SKILL.md`);
}

for (const rel of ['packages/hooks/pre-dangerous-command.sh','packages/hooks/post-edit-skill-verify.sh','packages/hooks/stop-verify-before-done.sh']) {
  const p = path.join(root, rel); !fs.existsSync(p) ? fail(rel, 'missing') : (isLinux && !isExecutable(p) ? fail(rel, 'not executable') : pass(rel, isLinux ? 'executable' : 'present'));
}
for (const rel of ['packages/hooks/adapters/noop.sh','packages/hooks/adapters/logging.sh','packages/hooks/adapters/audit.sh','packages/hooks/adapters/external-placeholder.sh','packages/hooks/adapters/run-adapters.sh']) {
  const p = path.join(root, rel); !fs.existsSync(p) ? fail(rel, 'missing') : (isLinux && !isExecutable(p) ? fail(rel, 'not executable') : pass(rel, isLinux ? 'executable' : 'present'));
}

try {
  const reg = JSON.parse(fs.readFileSync(path.join(root, 'packages/hooks/adapters/registry.json'), 'utf8'));
  Array.isArray(reg.adapters) ? pass('adapter registry', `${reg.adapters.length} adapters`) : fail('adapter registry', 'adapters must be array');
  reg.adapters?.every((a) => a.defaultEnabled === false) ? pass('adapter registry defaults', 'all defaultEnabled=false') : fail('adapter registry defaults', 'must be false');
  reg.adapters?.every((a) => a.networkCall === false) ? pass('adapter registry network', 'all networkCall=false') : fail('adapter registry network', 'must be false');
} catch (e) { fail('adapter registry', e.message); }

try {
  const s = JSON.parse(fs.readFileSync(path.join(root, 'packages/settings/settings.json'), 'utf8'));
  s?.singularityForge?.hookAdapters?.enabled === false ? pass('hookAdapters.enabled', 'default OFF') : fail('hookAdapters.enabled', 'must be false by default');
  s?.singularityForge?.mcpDefault === 'off' ? pass('mcpDefault', 'off') : fail('mcpDefault', 'must be off');
  s?.singularityForge?.repomixDefault === 'off' ? pass('repomixDefault', 'off') : fail('repomixDefault', 'must be off');
} catch (e) { fail('settings.json', e.message); }

const failures = checks.filter((c) => c.status === 'FAIL');
const warnings = checks.filter((c) => c.status === 'WARN');
const status = failures.length ? 'FAIL' : (warnings.length ? 'WARN' : 'PASS');
const summary = { pass: checks.filter((c) => c.status === 'PASS').length, warn: warnings.length, fail: failures.length };
if (jsonMode) console.log(JSON.stringify({ status, checks, summary, warnings, failures }, null, 2));
else {
  console.log('=== SingularityForge Doctor ===');
  for (const c of checks) console[c.status === 'FAIL' ? 'error' : 'log'](`  ${c.status}  ${c.name}${c.detail ? '  →  ' + c.detail : ''}`);
  console.log(`=== Doctor Result: ${status} ===`);
}
process.exit(failures.length ? 1 : 0);
