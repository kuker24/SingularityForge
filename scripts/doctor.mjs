#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { homedir, platform } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function commandExists(command) {
  const checker = platform() === 'win32' ? 'where' : 'command';
  const args = platform() === 'win32' ? [command] : ['-v', command];
  const result = spawnSync(checker, args, { shell: platform() !== 'win32', stdio: 'ignore' });
  return result.status === 0;
}

const claudeDir = path.join(homedir(), '.claude');
const checks = [
  ['OS', platform()],
  ['Claude command', commandExists('claude') ? 'found' : 'missing'],
  ['~/.claude', existsSync(claudeDir) ? 'found' : 'missing'],
  ['~/.claude/CLAUDE.md', existsSync(path.join(claudeDir, 'CLAUDE.md')) ? 'found' : 'missing'],
  ['~/.claude/skills', existsSync(path.join(claudeDir, 'skills')) ? 'found' : 'missing'],
  ['~/.claude/rules', existsSync(path.join(claudeDir, 'rules')) ? 'found' : 'missing'],
];

for (const [name, value] of checks) console.log(`${name}: ${value}`);
