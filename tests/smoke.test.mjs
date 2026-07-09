#!/usr/bin/env node
import { existsSync, rmSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const required = [
  'README.md',
  'docs/PRD.md',
  'docs/ARCHITECTURE.md',
  'docs/VERIFICATION_MATRIX.md',
  'packages/global-memory/CLAUDE.md',
  'packages/skills/fable-mode/SKILL.md',
  'installer/install.sh',
  'installer/install.ps1',
  'installer/install-local.sh',
  'installer/install-local.ps1'
];

const missing = required.filter((file) => !existsSync(path.join(root, file)));
if (missing.length > 0) {
  console.error('Missing required files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

// Test install-local.sh behavior programmatically
const testDir = path.join(root, 'tests/tmp-local-test');
if (existsSync(testDir)) {
  rmSync(testDir, { recursive: true, force: true });
}
mkdirSync(testDir, { recursive: true });

// Dry-run test
const dryRun = spawnSync('bash', [path.join(root, 'installer/install-local.sh'), '--dry-run', testDir], { encoding: 'utf8' });
if (dryRun.status !== 0 || !dryRun.stdout.includes('[dry-run] copied')) {
  console.error('install-local.sh --dry-run failed:', dryRun.stderr || dryRun.stdout);
  process.exit(1);
}

// Real install 1
const realInstall1 = spawnSync('bash', [path.join(root, 'installer/install-local.sh'), testDir], { encoding: 'utf8' });
if (realInstall1.status !== 0 || !realInstall1.stdout.includes('copied:')) {
  console.error('install-local.sh real install 1 failed:', realInstall1.stderr || realInstall1.stdout);
  process.exit(1);
}

// Real install 2 (backup check)
const realInstall2 = spawnSync('bash', [path.join(root, 'installer/install-local.sh'), testDir], { encoding: 'utf8' });
if (realInstall2.status !== 0 || !realInstall2.stdout.includes('backed up:')) {
  console.error('install-local.sh real install 2 backup check failed:', realInstall2.stderr || realInstall2.stdout);
  process.exit(1);
}

// Clean up
rmSync(testDir, { recursive: true, force: true });

console.log('Smoke test passed.');
