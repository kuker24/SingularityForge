#!/usr/bin/env node
/** Non-destructive, opt-in Obsidian Memory Pack setup. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const targetIndex = args.indexOf('--target');
const target = path.resolve(targetIndex >= 0 && args[targetIndex + 1] ? args[targetIndex + 1] : './SingularityForge-Vault');
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');
if (targetIndex >= 0 && !args[targetIndex + 1]) { console.error('FAIL --target requires a path'); process.exit(1); }

const source = path.join(root, 'packages/obsidian');
const entries = [
  ['templates', 'templates'],
  ['README.md', 'README.md'],
];
const summary = { target, created: 0, skipped: 0, overwritten: 0, dryRun };
function copyTree(src, dst) {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      if (!fs.existsSync(to)) { if (!dryRun) fs.mkdirSync(to, { recursive: true }); summary.created++; }
      copyTree(from, to);
    } else if (fs.existsSync(to)) {
      if (force) { if (!dryRun) fs.copyFileSync(from, to); summary.overwritten++; }
      else summary.skipped++;
    } else {
      if (!dryRun) fs.mkdirSync(path.dirname(to), { recursive: true });
      if (!dryRun) fs.copyFileSync(from, to);
      summary.created++;
    }
  }
}
try {
  if (!fs.existsSync(source)) throw new Error('Obsidian source pack missing');
  if (!fs.existsSync(target)) { if (!dryRun) fs.mkdirSync(target, { recursive: true }); summary.created++; }
  // A setup target is the vault root: copy vault-template contents directly to it.
  copyTree(path.join(source, 'vault-template'), target);
  for (const [from, to] of entries) {
    const src = path.join(source, from); const dst = path.join(target, to);
    if (fs.statSync(src).isDirectory()) { if (!fs.existsSync(dst) && !dryRun) fs.mkdirSync(dst, { recursive: true }); copyTree(src, dst); }
    else if (fs.existsSync(dst)) { if (force) { if (!dryRun) fs.copyFileSync(src, dst); summary.overwritten++; } else summary.skipped++; }
    else { if (!dryRun) fs.copyFileSync(src, dst); summary.created++; }
  }
  console.log(JSON.stringify(summary, null, 2));
} catch (error) { console.error(`FAIL ${error.message}`); process.exit(1); }
