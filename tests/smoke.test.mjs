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
  'installer/install-local.ps1',
  'scripts/optimize-token-cache.mjs',
  'scripts/token-benchmark.mjs'
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

// Profile compilation and safety tests
const testProfiles = ['minimal', 'coding', 'security'];
const tempProfileDir = path.join(root, 'tests/tmp-profile-test');

if (existsSync(tempProfileDir)) {
  rmSync(tempProfileDir, { recursive: true, force: true });
}
mkdirSync(tempProfileDir, { recursive: true });

// Copy a basic settings.json so optimizer works in target dir
mkdirSync(path.join(tempProfileDir, '.claude'), { recursive: true });
const dummySettings = JSON.stringify({ singularityForge: { profile: 'minimal' } });
const fs = await import('node:fs');
fs.writeFileSync(path.join(tempProfileDir, '.claude/settings.json'), dummySettings, 'utf8');

// 1. Profile compilation tests
for (const p of testProfiles) {
  const compResult = spawnSync('node', [
    path.join(root, 'scripts/optimize-token-cache.mjs'),
    '--profile', p,
    path.join(tempProfileDir, '.claude')
  ], { encoding: 'utf8' });
  if (compResult.status !== 0 || !compResult.stdout.includes('Optimization Completed Successfully.')) {
    console.error(`Profile optimizer compile failed for '${p}':`, compResult.stderr || compResult.stdout);
    process.exit(1);
  }
}

// 2. Security profile must not lose security rule check
const securityCachePath = path.join(tempProfileDir, '.claude/CLAUDE.md'); // Since it was the last compiled single forced profile
const securityCacheContent = fs.readFileSync(securityCachePath, 'utf8');
if (!securityCacheContent.includes('Security Rules') && !securityCacheContent.includes('security.md')) {
  console.error('Security verification failed: security profile lost security rules!');
  process.exit(1);
}

// 3. Benchmark all test
const benchResult = spawnSync('node', [
  path.join(root, 'scripts/token-benchmark.mjs'),
  '--profile', 'all',
  path.join(tempProfileDir, '.claude')
], { encoding: 'utf8' });
if (benchResult.status !== 0 || !benchResult.stdout.includes('Profile Token Savings Benchmark')) {
  console.error('Benchmark all failed to run correctly:', benchResult.stderr || benchResult.stdout);
  process.exit(1);
}

// 4. Invalid profile error test
const invalidResult = spawnSync('node', [
  path.join(root, 'scripts/optimize-token-cache.mjs'),
  '--profile', 'invalid-profile-name',
  path.join(tempProfileDir, '.claude')
], { encoding: 'utf8' });
if (invalidResult.status !== 1 || !invalidResult.stderr.includes('Invalid profile')) {
  console.error('Invalid profile error validation failed:', invalidResult.stderr || invalidResult.stdout);
  process.exit(1);
}

// 5. Hook adapters test validation
const adapterFiles = [
  'noop.sh', 'logging.sh', 'audit.sh', 'external-placeholder.sh', 'run-adapters.sh',
  'noop.ps1', 'logging.ps1', 'audit.ps1', 'external-placeholder.ps1', 'run-adapters.ps1'
];
const adaptersPath = path.join(root, 'packages/hooks/adapters');

for (const file of adapterFiles) {
  const fullPath = path.join(adaptersPath, file);
  if (!existsSync(fullPath)) {
    console.error(`Adapter file missing: ${file}`);
    process.exit(1);
  }
  
  // Executable check (skipped on Windows, but run on Linux)
  if (process.platform !== 'win32' && file.endsWith('.sh')) {
    const permResult = spawnSync('test', ['-x', fullPath]);
    if (permResult.status !== 0) {
      console.error(`Adapter file not executable: ${file}`);
      process.exit(1);
    }
  }

  // Secrets scan
  const content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes('API_KEY') || content.includes('SECRET') || content.match(/[a-zA-Z0-9_-]{30,}/) && !file.includes('run-adapters.sh') && !file.includes('logging.sh') && !file.includes('audit.sh')) {
    // Basic heuristics to prevent secrets leakage
    console.error(`Potential secrets/token hardcoded in adapter: ${file}`);
    process.exit(1);
  }
}

// 6. Test execution code returns 0
const noopExec = spawnSync('bash', [path.join(adaptersPath, 'noop.sh')]);
if (noopExec.status !== 0) {
  console.error('noop.sh execution failed (status non-zero)');
  process.exit(1);
}

const placeholderExec = spawnSync('bash', [path.join(adaptersPath, 'external-placeholder.sh')]);
if (placeholderExec.status !== 0 || !placeholderExec.stdout.includes('External Hook Adapter is disabled')) {
  console.error('external-placeholder.sh execution failed or did not report disabled state');
  process.exit(1);
}

// 7. Verify settings default hookAdapters value
const masterSettings = JSON.parse(fs.readFileSync(path.join(root, 'packages/settings/settings.json'), 'utf8'));
if (!masterSettings.singularityForge.hookAdapters || masterSettings.singularityForge.hookAdapters.enabled !== false) {
  console.error('Default settings.json hookAdapters must be disabled by default!');
  process.exit(1);
}

// 8. Adapter registry validation
const registryPath = path.join(root, 'packages/hooks/adapters/registry.json');
if (!existsSync(registryPath)) {
  console.error('Adapter registry.json missing!');
  process.exit(1);
}
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
if (!Array.isArray(registry.adapters) || registry.adapters.length === 0) {
  console.error('registry.json adapters must be a non-empty array!');
  process.exit(1);
}
for (const adapter of registry.adapters) {
  if (adapter.defaultEnabled !== false) {
    console.error(`Registry adapter '${adapter.name}' must have defaultEnabled=false`);
    process.exit(1);
  }
  if (adapter.networkCall !== false) {
    console.error(`Registry adapter '${adapter.name}' must have networkCall=false`);
    process.exit(1);
  }
  // Bash file must exist
  if (!existsSync(path.join(adaptersPath, adapter.bash))) {
    console.error(`Registry adapter '${adapter.name}' bash file missing: ${adapter.bash}`);
    process.exit(1);
  }
}

// 9. validate-adapter-config.mjs test cases
const validatorScript = path.join(root, 'scripts/validate-adapter-config.mjs');
const validateResult = spawnSync('node', [validatorScript], { encoding: 'utf8' });
if (validateResult.status !== 0) {
  console.error('validate-adapter-config.mjs FAIL on default settings:', validateResult.stderr || validateResult.stdout);
  process.exit(1);
}
if (!validateResult.stdout.includes('PASS')) {
  console.error('validate-adapter-config.mjs did not output PASS:', validateResult.stdout);
  process.exit(1);
}

const validatorTmp = path.join(root, 'tests/tmp-validator-test');
if (existsSync(validatorTmp)) rmSync(validatorTmp, { recursive: true, force: true });
mkdirSync(validatorTmp, { recursive: true });
const tmpSettingsPath = path.join(validatorTmp, 'settings.json');
const tmpRegistryPath = path.join(validatorTmp, 'registry.json');
const baseSettings = JSON.parse(fs.readFileSync(path.join(root, 'packages/settings/settings.json'), 'utf8'));
const baseRegistry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
fs.writeFileSync(tmpRegistryPath, JSON.stringify(baseRegistry, null, 2), 'utf8');
function runValidator(settings, extraEnv = {}) {
  fs.writeFileSync(tmpSettingsPath, JSON.stringify(settings, null, 2), 'utf8');
  return spawnSync('node', [validatorScript, '--settings', tmpSettingsPath, '--registry', tmpRegistryPath], {
    encoding: 'utf8',
    env: { ...process.env, ...extraEnv }
  });
}

// enabled=false valid
let settingsCase = structuredClone(baseSettings);
settingsCase.singularityForge.hookAdapters.enabled = false;
if (runValidator(settingsCase).status !== 0) {
  console.error('Validator failed enabled=false valid case');
  process.exit(1);
}

// enabled=true active=[noop] valid for non-default custom settings
settingsCase = structuredClone(baseSettings);
settingsCase.singularityForge.hookAdapters.enabled = true;
settingsCase.singularityForge.hookAdapters.active = ['noop'];
if (runValidator(settingsCase).status !== 0) {
  console.error('Validator failed enabled=true active=[noop] valid case');
  process.exit(1);
}

// unknown adapter must FAIL
settingsCase = structuredClone(baseSettings);
settingsCase.singularityForge.hookAdapters.active = ['not-a-real-adapter'];
if (runValidator(settingsCase).status === 0) {
  console.error('Validator should fail unknown adapter case');
  process.exit(1);
}

// missing adapter file must FAIL
const missingAdapterDir = path.join(validatorTmp, 'missing-adapters');
mkdirSync(missingAdapterDir, { recursive: true });
settingsCase = structuredClone(baseSettings);
settingsCase.singularityForge.hookAdapters.active = ['noop'];
if (runValidator(settingsCase, { SF_ADAPTERS_DIR: missingAdapterDir }).status === 0) {
  console.error('Validator should fail missing adapter file case');
  process.exit(1);
}

// active not array must FAIL
settingsCase = structuredClone(baseSettings);
settingsCase.singularityForge.hookAdapters.active = 'noop';
if (runValidator(settingsCase).status === 0) {
  console.error('Validator should fail non-array active case');
  process.exit(1);
}

// empty logDir fallback is WARN but valid
settingsCase = structuredClone(baseSettings);
delete settingsCase.singularityForge.hookAdapters.logDir;
if (runValidator(settingsCase).status !== 0) {
  console.error('Validator failed empty logDir fallback case');
  process.exit(1);
}

// invalid JSON must FAIL
fs.writeFileSync(tmpSettingsPath, '{ invalid json', 'utf8');
const invalidJsonResult = spawnSync('node', [validatorScript, '--settings', tmpSettingsPath, '--registry', tmpRegistryPath], { encoding: 'utf8' });
if (invalidJsonResult.status === 0) {
  console.error('Validator should fail invalid JSON case');
  process.exit(1);
}

// external-placeholder remains default OFF and no network call
const externalPlaceholder = baseRegistry.adapters.find((a) => a.name === 'external-placeholder');
if (!externalPlaceholder || externalPlaceholder.defaultEnabled !== false || externalPlaceholder.networkCall !== false || externalPlaceholder.placeholder !== true) {
  console.error('external-placeholder registry metadata must be placeholder=true, defaultEnabled=false, networkCall=false');
  process.exit(1);
}

rmSync(validatorTmp, { recursive: true, force: true });

// 10. doctor.mjs exits 0 (PASS or WARN) and JSON mode is valid
const doctorScript = path.join(root, 'scripts/doctor.mjs');
const doctorResult = spawnSync('node', [doctorScript], { encoding: 'utf8' });
if (doctorResult.status !== 0) {
  console.error('doctor.mjs exited with FAIL:', doctorResult.stderr || doctorResult.stdout);
  process.exit(1);
}
const doctorJsonResult = spawnSync('node', [doctorScript, '--json'], { encoding: 'utf8' });
if (doctorJsonResult.status !== 0) {
  console.error('doctor.mjs --json exited with FAIL:', doctorJsonResult.stderr || doctorJsonResult.stdout);
  process.exit(1);
}
try {
  const parsedDoctor = JSON.parse(doctorJsonResult.stdout);
  if (!parsedDoctor.status || !Array.isArray(parsedDoctor.checks) || !parsedDoctor.summary || !Array.isArray(parsedDoctor.warnings) || !Array.isArray(parsedDoctor.failures)) {
    console.error('doctor.mjs --json missing required fields');
    process.exit(1);
  }
} catch (error) {
  console.error('doctor.mjs --json output is not valid JSON:', error.message);
  process.exit(1);
}

if (!existsSync(path.join(root, 'scripts/verify-linux-installers.mjs'))) {
  console.error('verify-linux-installers.mjs missing');
  process.exit(1);
}

// Clean up
rmSync(tempProfileDir, { recursive: true, force: true });

console.log('Smoke test passed.');
