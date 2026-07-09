#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const skillsDir = path.join(root, 'packages', 'skills');

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

function parseFrontmatter(content) {
  if (!content.startsWith('---\n')) return null;
  const end = content.indexOf('\n---', 4);
  if (end === -1) return null;
  const raw = content.slice(4, end).trim();
  const data = {};
  for (const line of raw.split('\n')) {
    const index = line.indexOf(':');
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
    data[key] = value;
  }
  return data;
}

const entries = await readdir(skillsDir, { withFileTypes: true });
const skillDirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();

const failures = [];
const results = [];

for (const skill of skillDirs) {
  const skillPath = path.join(skillsDir, skill, 'SKILL.md');
  if (!(await exists(skillPath))) {
    failures.push(`${skill}: missing SKILL.md`);
    continue;
  }

  const content = await readFile(skillPath, 'utf8');
  const frontmatter = parseFrontmatter(content);
  if (!frontmatter) failures.push(`${skill}: missing YAML frontmatter`);
  if (!frontmatter?.name) failures.push(`${skill}: missing frontmatter name`);
  if (!frontmatter?.description) failures.push(`${skill}: missing frontmatter description`);
  if (frontmatter?.name && frontmatter.name !== skill) {
    failures.push(`${skill}: frontmatter name must match folder name`);
  }

  const body = content.replace(/^---[\s\S]*?---\s*/, '').trim();
  if (body.length < 200) failures.push(`${skill}: body is too short`);

  results.push({ skill, name: frontmatter?.name ?? null, description: Boolean(frontmatter?.description) });
}

console.log(`Verified ${results.length} skill folders.`);

if (failures.length > 0) {
  console.error('Skill verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Skill verification passed.');
