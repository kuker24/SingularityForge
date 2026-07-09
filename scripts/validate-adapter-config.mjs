#!/usr/bin/env node
/**
 * SingularityForge Adapter Configuration Validator
 * Validates hookAdapters config in settings.json against registry.json.
 * Exit 0 = PASS | Exit 1 = FAIL
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const REGISTRY_PATH = process.env.SF_ADAPTER_REGISTRY || path.join(root, 'packages/hooks/adapters/registry.json');
const SETTINGS_PATH = process.env.SF_ADAPTER_SETTINGS || path.join(root, 'packages/settings/settings.json');
const ADAPTERS_DIR  = process.env.SF_ADAPTERS_DIR || path.join(root, 'packages/hooks/adapters');
const DEFAULT_SETTINGS_PATH = path.join(root, 'packages/settings/settings.json');

let exitCode = 0;

function pass(msg)  { console.log(`  PASS  ${msg}`); }
function warn(msg)  { console.log(`  WARN  ${msg}`); }
function fail(msg)  { console.error(`  FAIL  ${msg}`); exitCode = 1; }

console.log('=== SingularityForge Adapter Configuration Validator ===\n');

// --- Load registry ---
if (!fs.existsSync(REGISTRY_PATH)) {
  fail(`Registry not found: ${REGISTRY_PATH}`);
  process.exit(1);
}
const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
const registeredNames = new Set(registry.adapters.map((a) => a.name));

console.log(`Registry loaded: ${registry.adapters.length} adapters registered`);

// Verify each registered adapter has both bash and ps1 files present
for (const adapter of registry.adapters) {
  const bashPath = path.join(ADAPTERS_DIR, adapter.bash);
  const ps1Path  = path.join(ADAPTERS_DIR, adapter.powershell);

  if (!fs.existsSync(bashPath)) {
    fail(`Registry adapter '${adapter.name}': bash file missing → ${adapter.bash}`);
  } else {
    pass(`Registry adapter '${adapter.name}': bash file present`);
  }

  if (!fs.existsSync(ps1Path)) {
    warn(`Registry adapter '${adapter.name}': powershell file missing → ${adapter.powershell} (Windows Experimental)`);
  } else {
    pass(`Registry adapter '${adapter.name}': powershell file present`);
  }

  if (adapter.defaultEnabled !== false) {
    fail(`Registry adapter '${adapter.name}': defaultEnabled must be false (got ${adapter.defaultEnabled})`);
  } else {
    pass(`Registry adapter '${adapter.name}': defaultEnabled=false ✓`);
  }

  if (adapter.networkCall !== false) {
    fail(`Registry adapter '${adapter.name}': networkCall must be false (got ${adapter.networkCall})`);
  } else {
    pass(`Registry adapter '${adapter.name}': networkCall=false ✓`);
  }
}

// --- Load settings ---
console.log('');
if (!fs.existsSync(SETTINGS_PATH)) {
  fail(`settings.json not found: ${SETTINGS_PATH}`);
  process.exit(1);
}

let settings;
try {
  settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
} catch (e) {
  fail(`settings.json is not valid JSON: ${e.message}`);
  process.exit(1);
}

const sf = settings?.singularityForge;
if (!sf) {
  fail('settings.json missing "singularityForge" key');
  process.exit(1);
}

const ha = sf?.hookAdapters;
if (!ha) {
  fail('settings.json missing "singularityForge.hookAdapters" key');
  process.exit(1);
}

// Validate enabled must be boolean. Default repo settings must remain false.
if (typeof ha.enabled !== 'boolean') {
  fail(`hookAdapters.enabled must be boolean (got ${typeof ha.enabled})`);
} else if (path.resolve(SETTINGS_PATH) === path.resolve(DEFAULT_SETTINGS_PATH) && ha.enabled !== false) {
  fail(`default hookAdapters.enabled must be false (got ${JSON.stringify(ha.enabled)})`);
} else {
  pass(`hookAdapters.enabled=${ha.enabled} ✓`);
}

// Validate active must be an array
if (!Array.isArray(ha.active)) {
  fail(`hookAdapters.active must be an array (got ${typeof ha.active})`);
  process.exit(1);
} else {
  pass(`hookAdapters.active is array (${ha.active.length} entries)`);
}

// Validate each active adapter name against registry
for (const adapterName of ha.active) {
  if (!registeredNames.has(adapterName)) {
    fail(`hookAdapters.active contains unknown adapter: "${adapterName}" (not in registry)`);
  } else {
    const adapterMeta = registry.adapters.find((a) => a.name === adapterName);
    const bashFile = path.join(ADAPTERS_DIR, adapterMeta.bash);
    if (!fs.existsSync(bashFile)) {
      fail(`Active adapter "${adapterName}": bash file missing on disk → ${adapterMeta.bash}`);
    } else {
      pass(`Active adapter "${adapterName}": known in registry + bash file present`);
    }
  }
}

// Validate logDir is defined (fallback is safe but worth noting)
if (!ha.logDir) {
  warn('hookAdapters.logDir not set — adapters will fallback to default path');
} else {
  pass(`hookAdapters.logDir defined: "${ha.logDir}"`);
}

// Validate external integrations default OFF
const externalKeys = ['mcpDefault', 'repomixDefault'];
for (const key of externalKeys) {
  if (sf[key] && sf[key] !== 'off') {
    fail(`singularityForge.${key} must be "off" (got "${sf[key]}")`);
  } else {
    pass(`singularityForge.${key}="off" ✓`);
  }
}

// Validate external-placeholder adapter is not active when networkCall risk exists
if (ha.active.includes('external-placeholder') && ha.enabled === true) {
  warn('external-placeholder is in active list with enabled=true — ensure no network calls are wired');
}

console.log('');
console.log(`=== Validation Result: ${exitCode === 0 ? 'PASS' : 'FAIL'} ===`);
process.exit(exitCode);
