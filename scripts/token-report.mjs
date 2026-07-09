#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const files = [
  'packages/global-memory/CLAUDE.md',
  'docs/TOKEN_DISCIPLINE.md'
];

async function collectSkillFiles() {
  const dir = path.join(root, 'packages', 'skills');
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => `packages/skills/${entry.name}/SKILL.md`);
}

function words(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const all = [...files, ...(await collectSkillFiles())];
console.log('| File | Words | Lines |');
console.log('|---|---:|---:|');
for (const file of all) {
  const content = await readFile(path.join(root, file), 'utf8');
  console.log(`| ${file} | ${words(content)} | ${content.split('\n').length} |`);
}
