#!/usr/bin/env node
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'README.md',
  'docs/PRD.md',
  'docs/ARCHITECTURE.md',
  'docs/VERIFICATION_MATRIX.md',
  'packages/global-memory/CLAUDE.md',
  'packages/skills/fable-mode/SKILL.md',
  'installer/install.sh',
  'installer/install.ps1'
];

const missing = required.filter((file) => !existsSync(path.join(root, file)));
if (missing.length > 0) {
  console.error('Missing required files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

console.log('Smoke test passed.');
