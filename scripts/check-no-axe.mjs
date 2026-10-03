#!/usr/bin/env node
/**
 * Fails if axe-core is resolvable in this project's dependency tree.
 *
 * axe-core is banned in this repository (see CLAUDE.md), directly and
 * transitively. package.json carries an override that redirects any axe-core
 * request to an empty package, but an override is easy to drop by accident
 * during a dependency bump -- this check makes that a build failure instead of
 * a silent regression.
 *
 * It reads package-lock.json rather than running `npm ls`, so it needs no
 * network and no installed node_modules.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const lockPath = join(repoRoot, 'package-lock.json');

/** Any package whose name is axe-core or lives under the @axe-core scope. */
const isAxePackageName = (name) => name === 'axe-core' || name.startsWith('@axe-core/');

/** The last path segment of a node_modules key, e.g. "a/node_modules/b" -> "b". */
const packageNameFromLockKey = (key) => {
  const marker = 'node_modules/';
  const index = key.lastIndexOf(marker);
  return index === -1 ? key : key.slice(index + marker.length);
};

let lock;
try {
  lock = JSON.parse(readFileSync(lockPath, 'utf8'));
} catch (error) {
  console.error(`Could not read ${lockPath}: ${error.message}`);
  process.exit(2);
}

const offenders = [];

for (const [key, entry] of Object.entries(lock.packages ?? {})) {
  if (key === '') continue;
  if (!isAxePackageName(packageNameFromLockKey(key))) continue;

  // An entry is only a real axe-core if it actually resolves to the axe-core
  // tarball. The override leaves an entry keyed "axe-core" that resolves to
  // empty-npm-package; that is the desired state, not a violation.
  const resolved = entry.resolved ?? '';
  if (/\/(@axe-core\/[^/]+|axe-core)\/-\//.test(resolved)) {
    offenders.push({ key, resolved, version: entry.version });
  }
}

// A direct dependency on axe-core is a violation even if an override currently
// neutralises it, because the intent is wrong and the override may be removed.
const manifest = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
const bannedDirect = [
  'axe-core',
  'jest-axe',
  '@types/jest-axe',
  'vitest-axe',
  'cypress-axe',
  'axe-playwright',
  'axe-puppeteer',
];
const declared = [
  ...Object.keys(manifest.dependencies ?? {}),
  ...Object.keys(manifest.devDependencies ?? {}),
].filter((name) => bannedDirect.includes(name) || isAxePackageName(name));

if (offenders.length === 0 && declared.length === 0) {
  console.log('OK: axe-core does not resolve anywhere in the dependency tree.');
  process.exit(0);
}

console.error('axe-core is banned in this repository (see CLAUDE.md).\n');

if (declared.length > 0) {
  console.error('Declared in package.json:');
  for (const name of declared) console.error(`  - ${name}`);
  console.error('\nRemove these dependencies from package.json, then re-run `npm install`.\n');
}

if (offenders.length > 0) {
  console.error('Resolving to a real axe-core tarball in package-lock.json:');
  for (const { key, version, resolved } of offenders) {
    console.error(`  - ${key} @ ${version}\n      ${resolved}`);
  }
  console.error(
    '\nAdd or restore the override in package.json:\n' +
      '  "overrides": { "axe-core": "npm:empty-npm-package@1.0.0" }\n' +
      'then re-run `npm install`.',
  );
}

process.exit(1);
