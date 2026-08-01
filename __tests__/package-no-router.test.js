/**
 * Regression test for the optional-router contract.
 *
 * The published bundle must not require `react-router-dom`. Importing the
 * barrel used to throw `Cannot find module 'react-router-dom'` for any consumer
 * who did not install a router (see @afixt/apg-react <= 1.3.0).
 *
 * The other suites cannot catch this: `react-router-dom` is a devDependency, so
 * it always resolves from this repo's node_modules. This test therefore packs a
 * real tarball, installs it into a throwaway directory containing only `react`
 * and `react-dom`, and loads it from a child process so resolution is genuinely
 * isolated from this repo.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const distCjs = path.join(repoRoot, 'dist', 'index.cjs.js');
const distEsm = path.join(repoRoot, 'dist', 'index.esm.js');

/** Number of components the barrel is expected to export (see index.ts). */
const EXPECTED_COMPONENT_COUNT = 31;

let consumerDir;
let tmpRoot;

/**
 * Runs a command, returning its stdout and letting failures surface with output.
 *
 * @param {string} cmd - Executable to run.
 * @param {string[]} args - Arguments for the executable.
 * @param {object} [opts] - Extra options for execFileSync.
 * @returns {string} The command's stdout, trimmed.
 */
const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: 'utf8', stdio: 'pipe', ...opts }).trim();

/**
 * Newest mtime under a directory tree, ignoring nothing — cheap enough for the
 * component sources and far more reliable than trusting that `dist/` is fresh.
 *
 * @param {string} dir - Directory to walk.
 * @returns {number} The highest mtime in milliseconds, or 0 for a missing tree.
 */
const newestMtime = (dir) => {
  if (!fs.existsSync(dir)) {
    return 0;
  }

  return fs.readdirSync(dir, { withFileTypes: true }).reduce((newest, entry) => {
    const full = path.join(dir, entry.name);
    const mtime = entry.isDirectory() ? newestMtime(full) : fs.statSync(full).mtimeMs;
    return Math.max(newest, mtime);
  }, 0);
};

beforeAll(() => {
  // `npm test` runs before `npm run build` in CI, so build on demand. Existence
  // alone is not enough: a stale dist/ left by another branch would let this
  // suite pass against artifacts that no longer match the source, which is the
  // one failure mode a regression guard must not have.
  //
  // The build inputs include the build configuration, not just the sources: a
  // change to rollup.config.mjs or tsconfig.json alone would otherwise leave a
  // stale dist/ looking fresh.
  const distMtime = fs.existsSync(distCjs) ? fs.statSync(distCjs).mtimeMs : 0;
  const sourceMtime = Math.max(
    newestMtime(path.join(repoRoot, 'components')),
    ...['index.ts', 'package.json', 'rollup.config.mjs', 'tsconfig.json'].map(
      (file) => fs.statSync(path.join(repoRoot, file)).mtimeMs,
    ),
  );

  if (distMtime < sourceMtime) {
    run('npm', ['run', 'build'], { cwd: repoRoot });
  }

  tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'apg-react-pack-'));
  consumerDir = path.join(tmpRoot, 'consumer');
  const modulesDir = path.join(consumerDir, 'node_modules');
  const packageDir = path.join(modulesDir, '@afixt', 'apg-react');
  fs.mkdirSync(packageDir, { recursive: true });

  fs.writeFileSync(
    path.join(consumerDir, 'package.json'),
    JSON.stringify({ name: 'consumer', version: '1.0.0', private: true }),
  );

  // Pack the real tarball so the `files` and `exports` fields are exercised.
  //
  // `--ignore-scripts` is load-bearing, not tidiness: packing a local directory
  // that declares a `prepare` script makes npm reify the project's own
  // node_modules, which can empty it out from under a concurrent test run.
  // dist/ is already built above, so no lifecycle script is needed here.
  const tarball = run(
    'npm',
    ['pack', '--pack-destination', tmpRoot, '--ignore-scripts', '--silent'],
    {
      cwd: repoRoot,
    },
  )
    .split('\n')
    .pop();

  run('tar', ['-xzf', path.join(tmpRoot, tarball), '-C', packageDir, '--strip-components=1']);

  // Provide only the required peers. `react-router-dom` is deliberately absent.
  for (const peer of ['react', 'react-dom']) {
    fs.symlinkSync(path.join(repoRoot, 'node_modules', peer), path.join(modulesDir, peer), 'dir');
  }
}, 300_000);

afterAll(() => {
  if (tmpRoot) {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
});

describe('published package without react-router-dom', () => {
  test('the isolated consumer really cannot resolve react-router-dom', () => {
    expect(() =>
      run('node', ['-e', "require.resolve('react-router-dom')"], { cwd: consumerDir }),
    ).toThrow();
  });

  test('requiring the CJS bundle does not throw', () => {
    const output = run('node', ['-e', "require('@afixt/apg-react'); console.log('loaded');"], {
      cwd: consumerDir,
    });
    expect(output).toBe('loaded');
  });

  test('every component export loads', () => {
    const output = run(
      'node',
      [
        '-e',
        `const m = require('@afixt/apg-react');
         const missing = Object.entries(m).filter(([, v]) => v == null).map(([k]) => k);
         if (missing.length) { throw new Error('null exports: ' + missing.join(', ')); }
         console.log(Object.keys(m).length);`,
      ],
      { cwd: consumerDir },
    );
    // 31 components plus the LinkComponentProvider escape hatch.
    expect(Number(output)).toBe(EXPECTED_COMPONENT_COUNT + 1);
  });

  test('Link and Breadcrumb render to static markup without a router', () => {
    const output = run(
      'node',
      [
        '-e',
        `const React = require('react');
         const { renderToStaticMarkup } = require('react-dom/server');
         const { Link, Breadcrumb } = require('@afixt/apg-react');
         console.log(renderToStaticMarkup(React.createElement(Link, { to: '/home' }, 'Home')));
         console.log(renderToStaticMarkup(React.createElement(Breadcrumb, {
           items: [{ path: '/', label: 'Home' }, { path: '/a', label: 'A' }],
         })));`,
      ],
      { cwd: consumerDir },
    );
    // `class="link"` is what the component's stylesheet selects on — the
    // anchor's `link` role is implicit, so a role selector cannot match it.
    expect(output).toContain('<a href="/home" class="link">Home</a>');
    expect(output).toContain('<a href="/">Home</a>');
    expect(output).toContain('aria-current="page"');
  });

  test('importing the ESM bundle does not throw', () => {
    const output = run(
      'node',
      [
        '--input-type=module',
        '-e',
        `import * as m from '@afixt/apg-react';
         console.log(Object.keys(m).length);`,
      ],
      { cwd: consumerDir },
    );
    expect(Number(output)).toBe(EXPECTED_COMPONENT_COUNT + 1);
  });

  test('package.json is reachable through the exports map', () => {
    const output = run(
      'node',
      ['-e', "console.log(require('@afixt/apg-react/package.json').name);"],
      { cwd: consumerDir },
    );
    expect(output).toBe('@afixt/apg-react');
  });
});

describe('built bundles', () => {
  /**
   * Import/require of the router at statement position. Anchoring to the start
   * of a line keeps the ` * import ... from 'react-router-dom'` usage examples
   * in the bundled doc comments from matching.
   */
  const ROUTER_IMPORT = [
    /^\s*import\s[^\n]*\sfrom\s*['"]react-router-dom['"]/m,
    /^\s*import\s*['"]react-router-dom['"]/m,
    /require\(\s*['"]react-router-dom['"]\s*\)/,
  ];

  test('neither bundle imports react-router-dom', () => {
    for (const bundle of [distCjs, distEsm]) {
      const code = fs.readFileSync(bundle, 'utf8');
      for (const pattern of ROUTER_IMPORT) {
        expect(code).not.toMatch(pattern);
      }
    }
  });

  test('the regexes do catch a real import (guards the guard)', () => {
    const samples = [
      "import { Link } from 'react-router-dom';",
      "import 'react-router-dom';",
      "var reactRouterDom = require('react-router-dom');",
    ];
    for (const sample of samples) {
      expect(ROUTER_IMPORT.some((pattern) => pattern.test(sample))).toBe(true);
    }
  });
});
