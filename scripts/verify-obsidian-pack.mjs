#!/usr/bin/env node
/** Verifies optional Obsidian Memory Pack and its non-destructive setup behavior. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pack = path.join(root, 'packages/obsidian');
const folders = ['00-Inbox','01-Projects','02-Architecture','03-Standards','04-Skills','05-Session-Logs','06-Debug-Notes','07-Release-Notes','99-Archive'];
const templates = ['project-overview.md','tech-stack.md','coding-standards.md','architecture-decision-record.md','session-log.md','session-handoff.md','debug-note.md','release-note.md','daily-note.md'];
let pass = 0, warn = 0, fail = 0;
function check(ok, msg, warning = false) { const tag = ok ? (warning ? 'WARN' : 'PASS') : 'FAIL'; console[ok ? 'log' : 'error'](`${tag} ${msg}`); if (!ok) fail++; else if (warning) warn++; else pass++; }
function run(args, target) { return spawnSync('node', [path.join(root, 'scripts/setup-obsidian-vault.mjs'), ...args, '--target', target], { cwd: root, encoding: 'utf8' }); }

check(fs.existsSync(path.join(pack, 'README.md')), 'packages/obsidian/README.md exists');
for (const d of folders) check(fs.existsSync(path.join(pack, 'vault-template', d)), `vault folder ${d} exists`);
for (const t of templates) {
  const p = path.join(pack, 'templates', t); check(fs.existsSync(p), `template ${t} exists`);
  if (fs.existsSync(p)) check(!/(api[_ -]?key\s*[:=]\s*['"][A-Za-z0-9_-]{12,}|BEGIN (RSA|OPENSSH) PRIVATE KEY|\.env\b)/i.test(fs.readFileSync(p, 'utf8')), `template ${t} has no secret-like content`);
}
const skill = path.join(root, 'packages/skills/obsidian-sync/SKILL.md');
check(fs.existsSync(skill), 'obsidian-sync skill exists');
if (fs.existsSync(skill)) {
  const text = fs.readFileSync(skill, 'utf8').toLowerCase();
  for (const phrase of ['search before read','read only relevant','concise session logs','do not store secrets','adr','handoff']) check(text.includes(phrase), `obsidian-sync contains "${phrase}"`);
  check(text.startsWith('---\n'), 'obsidian-sync frontmatter present');
}
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'sf-obsidian-verify-'));
try {
  const target = path.join(temp, 'vault'); const spaced = path.join(temp, 'vault with spaces');
  let r = run(['--dry-run'], target); check(r.status === 0, 'setup dry-run exits 0'); check(!fs.existsSync(target), 'dry-run does not create target');
  r = run([], target); check(r.status === 0, 'setup real temp dir exits 0');
  const overview = path.join(target, 'templates/project-overview.md'); check(fs.existsSync(overview), 'real setup copies templates');
  fs.writeFileSync(overview, '# user content\n', 'utf8'); r = run([], target); check(r.status === 0, 'setup re-run exits 0'); check(fs.readFileSync(overview, 'utf8') === '# user content\n', 're-run does not overwrite by default');
  r = run([], spaced); check(r.status === 0 && fs.existsSync(path.join(spaced, '00-Inbox')), 'setup path with spaces exits 0');
} finally { fs.rmSync(temp, { recursive: true, force: true }); }
console.log(`\nPASS count: ${pass}\nWARN count: ${warn}\nFAIL count: ${fail}`);
process.exit(fail ? 1 : 0);
