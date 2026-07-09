#!/usr/bin/env node
/**
 * scripts/import-astralforge-skills.mjs
 *
 * Imports senior engineering skills from AstralForge.
 * Fetches skill files, reviews security rules (no destructive commands, no secrets),
 * stores them in staged review directory rather than overwriting verified local skills directly.
 */

import { mkdir, readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import https from 'node:https';

const root = process.cwd();
const stagedDir = path.join(root, 'packages', 'skills-staged-review');
const reportsDir = path.join(root, 'reports');

// Upstream details
const UPSTREAM_URL = 'https://raw.githubusercontent.com/kuker24/AstralForge-Senior-Engineer-Skills/main';
const REPO_URL = 'https://github.com/kuker24/AstralForge-Senior-Engineer-Skills';

// Skills we want to check or import
const CANDIDATES = [
  'security-review',
  'dependency-review',
  'type-safety',
  'qa-verification',
  'adr-patterns',
  'release-check'
];

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 404) {
        resolve(null);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch ${url}: Status ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', (err) => reject(err));
  });
}

function auditContent(content) {
  const issues = [];
  const blockedPatterns = [
    /rm\s+-rf\s+\//i,
    /rm\s+-rf\s+~/i,
    /rm\s+-rf\s+\$HOME/i,
    /cat\s+~\/\.ssh/i,
    /api_key/i,
    /secret/i,
    /token/i
  ];

  for (const pattern of blockedPatterns) {
    if (pattern.test(content)) {
      issues.push(`Content matched blocked pattern/word: ${pattern.toString()}`);
    }
  }
  return issues;
}

async function main() {
  console.log(`Starting AstralForge Import Pipeline...`);
  console.log(`Upstream Repository: ${REPO_URL}`);
  
  await mkdir(stagedDir, { recursive: true });
  await mkdir(reportsDir, { recursive: true });

  const summary = [];
  let totalImported = 0;
  let totalRejected = 0;

  for (const candidate of CANDIDATES) {
    const url = `${UPSTREAM_URL}/packages/skills/${candidate}/SKILL.md`;
    console.log(`Fetching candidate '${candidate}' from: ${url}`);
    
    try {
      const content = await fetchUrl(url);
      if (!content) {
        console.log(`Candidate '${candidate}' not found in upstream. Skipping.`);
        summary.push({
          skill: candidate,
          status: 'Not Found',
          notes: 'File not present on upstream repository main branch',
          attribution: REPO_URL
        });
        continue;
      }

      // Security audit
      const issues = auditContent(content);
      if (issues.length > 0) {
        console.warn(`WARNING: Candidate '${candidate}' failed security audit! Rejecting.`);
        totalRejected += 1;
        summary.push({
          skill: candidate,
          status: 'Rejected',
          notes: `Audit failed: ${issues.join('; ')}`,
          attribution: REPO_URL
        });
        continue;
      }

      // Safe to write to staged review
      const targetSubdir = path.join(stagedDir, candidate);
      await mkdir(targetSubdir, { recursive: true });
      await writeFile(path.join(targetSubdir, 'SKILL.md'), content, 'utf8');
      
      console.log(`Successfully staged candidate '${candidate}' for review.`);
      totalImported += 1;
      summary.push({
        skill: candidate,
        status: 'Staged / Needs review',
        notes: 'Successfully downloaded, security audit passed, staged for manual inspection.',
        attribution: REPO_URL
      });

    } catch (error) {
      console.error(`Error processing candidate '${candidate}':`, error.message);
      summary.push({
        skill: candidate,
        status: 'Error',
        notes: error.message,
        attribution: REPO_URL
      });
    }
  }

  // Generate Report MD content
  const timestamp = new Date().toISOString();
  
  let reportMd = `# AstralForge Import Report

Timestamp: ${timestamp}
Upstream Source: [AstralForge Senior Engineer Skills](${REPO_URL})

## Import Summary

- **Total Staged**: ${totalImported}
- **Total Rejected**: ${totalRejected}
- **Total Skipped / Not Found**: ${CANDIDATES.length - totalImported - totalRejected}

## Imported/Staged Skill Details

| Skill Name | Status | Notes | Attribution |
|---|---|---|---|
`;

  for (const item of summary) {
    reportMd += `| ${item.skill} | ${item.status} | ${item.notes} | [AstralForge](${item.attribution}) |\n`;
  }

  const detailedReportPath = path.join(reportsDir, 'astralforge-import-summary.md');
  const docsReportPath = path.join(root, 'docs', 'ASTRALFORGE_IMPORT_REPORT.md');

  await writeFile(detailedReportPath, reportMd, 'utf8');
  await writeFile(docsReportPath, reportMd, 'utf8');
  
  console.log(`Wrote import reports to:`);
  console.log(`- ${detailedReportPath}`);
  console.log(`- ${docsReportPath}`);
}

main().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
