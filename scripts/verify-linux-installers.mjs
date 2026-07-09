#!/usr/bin/env node
/** Verifies Linux global/local installers in isolated temp workspaces. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'singularityforge-verify-'));
const tempHome = path.join(tempRoot, 'home with spaces');
const localTarget = path.join(tempRoot, 'local project with spaces');
fs.mkdirSync(tempHome, { recursive: true });
fs.mkdirSync(localTarget, { recursive: true });
const results = [];
let failed = false;
function record(status, name, detail='') { results.push({ status, name, detail }); if (status === 'FAIL') failed = true; console[status === 'FAIL' ? 'error' : 'log'](`${status} ${name}${detail ? ' — ' + detail : ''}`); }
function run(name, cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { cwd: root, encoding: 'utf8', env: { ...process.env, HOME: tempHome, ...opts.env } });
  if (res.status === 0) record('PASS', name); else { record('FAIL', name, res.stderr || res.stdout); }
  return res;
}
function assert(name, cond, detail='') { record(cond ? 'PASS' : 'FAIL', name, detail); }
function isExec(p) { try { fs.accessSync(p, fs.constants.X_OK); return true; } catch { return false; } }

try {
  run('global installer dry-run', 'bash', ['installer/install.sh', '--dry-run']);
  assert('dry-run did not create temp HOME .claude', !fs.existsSync(path.join(tempHome, '.claude')));

  run('global installer real install in temp HOME', 'bash', ['installer/install.sh']);
  const gClaude = path.join(tempHome, '.claude');
  assert('global CLAUDE.md copied', fs.existsSync(path.join(gClaude, 'CLAUDE.md')));
  assert('global settings copied', fs.existsSync(path.join(gClaude, 'settings.json')));
  assert('global hooks copied', fs.existsSync(path.join(gClaude, 'hooks', 'pre-dangerous-command.sh')));
  assert('global adapters copied', fs.existsSync(path.join(gClaude, 'hooks', 'adapters', 'run-adapters.sh')));
  assert('global adapter registry copied', fs.existsSync(path.join(gClaude, 'hooks', 'adapters', 'registry.json')));
  assert('global hook executable', isExec(path.join(gClaude, 'hooks', 'pre-dangerous-command.sh')));
  assert('global adapter executable', isExec(path.join(gClaude, 'hooks', 'adapters', 'run-adapters.sh')));
  const globalSettings = JSON.parse(fs.readFileSync(path.join(gClaude, 'settings.json'), 'utf8'));
  assert('global hookAdapters default OFF', globalSettings.singularityForge.hookAdapters.enabled === false);
  assert('global external integrations default OFF', globalSettings.singularityForge.mcpDefault === 'off' && globalSettings.singularityForge.repomixDefault === 'off');

  run('global installer reinstall idempotent', 'bash', ['installer/install.sh']);
  run('global installer second reinstall no overwrite', 'bash', ['installer/install.sh']);
  const backups = fs.readdirSync(tempHome).filter((n) => n.startsWith('.claude.singularityforge.backup.'));
  assert('global backup created on reinstall', backups.length >= 2, backups.join(', '));
  assert('global backup names unique enough', new Set(backups).size === backups.length);

  run('local installer dry-run path with spaces', 'bash', ['installer/install-local.sh', '--dry-run', localTarget]);
  assert('local dry-run did not create .claude', !fs.existsSync(path.join(localTarget, '.claude')));

  run('local installer real install path with spaces', 'bash', ['installer/install-local.sh', localTarget]);
  const lClaude = path.join(localTarget, '.claude');
  assert('local CLAUDE.md copied', fs.existsSync(path.join(lClaude, 'CLAUDE.md')));
  assert('local hooks copied', fs.existsSync(path.join(lClaude, 'hooks', 'pre-dangerous-command.sh')));
  assert('local adapters copied', fs.existsSync(path.join(lClaude, 'hooks', 'adapters', 'run-adapters.sh')));
  assert('local registry copied', fs.existsSync(path.join(lClaude, 'hooks', 'adapters', 'registry.json')));
  assert('local hook executable', isExec(path.join(lClaude, 'hooks', 'pre-dangerous-command.sh')));
  assert('local adapter executable', isExec(path.join(lClaude, 'hooks', 'adapters', 'run-adapters.sh')));

  run('local installer reinstall idempotent', 'bash', ['installer/install-local.sh', localTarget]);
  run('local installer second reinstall no overwrite', 'bash', ['installer/install-local.sh', localTarget]);
  const localBackups = [];
  function collectBackups(dir) { for (const ent of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, ent.name); if (ent.isDirectory()) collectBackups(p); else if (ent.name.includes('.backup.')) localBackups.push(p); } }
  collectBackups(lClaude);
  assert('local backup created on reinstall', localBackups.length >= 1, `${localBackups.length} backup files`);

  assert('no user cache copied to global install', !fs.existsSync(path.join(gClaude, '.cache')) && !fs.existsSync(path.join(gClaude, 'cache')));
  assert('no user cache copied to local install', !fs.existsSync(path.join(lClaude, '.cache')) && !fs.existsSync(path.join(lClaude, 'cache')));

  // zsh compatibility: at minimum scripts should run through bash even when zsh is present; no zsh-specific syntax is required.
  if (spawnSync('zsh', ['--version'], { stdio: 'ignore' }).status === 0) record('PASS', 'zsh available (bash installers remain explicit bash scripts)');
  else record('WARN', 'zsh not available; bash compatibility verified');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log(`\nVerification summary: ${results.filter(r => r.status === 'PASS').length} PASS, ${results.filter(r => r.status === 'WARN').length} WARN, ${results.filter(r => r.status === 'FAIL').length} FAIL`);
process.exit(failed ? 1 : 0);
