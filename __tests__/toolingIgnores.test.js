/**
 * Tooling contract: the local gate must not walk gitignored directories.
 *
 * `.gitignore` lists `.claude/` and `release_announcement/`, so git already
 * agrees they are not part of the project. ESLint, markdownlint-cli2 and Jest
 * do not consult it, and each has its own reason to descend anyway:
 *
 *   - `.claude/worktrees/<agent>/` can hold a *whole second checkout* of this
 *     repo, complete with its own `node_modules/` and `__tests__/`.
 *   - markdownlint-cli2's `#node_modules` command-line glob anchors at the top
 *     level, so the vendored `node_modules/` inside that checkout is linted.
 *   - Jest's `testMatch` finds `__tests__/**` in that second checkout exactly
 *     as readily as the real one.
 *
 * The failure this guards against is one-directional and quiet: it only ever
 * *invents* problems, turning a clean branch red locally while CI — which
 * checks out fresh, where the directory does not exist — stays green. That is
 * the direction that erodes trust in the local gate, so it is worth pinning.
 *
 * Measured on a checkout with one `.claude/worktrees/` present, before the
 * exclusions existed: `npm run lint` reported 2 errors, `npm run markdownlint`
 * 2 issues in a vendored `node_modules/**\/README.md`, and Jest discovered an
 * extra test file. All three are clean with the same directory in place now.
 * See #242.
 *
 * Where a tool exposes its own predicate, these assertions run it rather than
 * checking how the config is spelled. markdownlint-cli2 exposes none and its
 * config is JSONC (comments, trailing commas), so that one is a text contract
 * on the config file — the approach the stylesheet contract tests already take,
 * for the same reason: the thing that matters is a relationship no runtime
 * check in this suite can see.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

/** Paths that must never reach any of the three tools. */
const IGNORED_PATHS = [
  '.claude/worktrees/agent-abc123/components/Accordion/Accordion.tsx',
  '.claude/worktrees/agent-abc123/node_modules/some-pkg/index.js',
  'release_announcement/capture.js',
];

/** Paths the tools must still see, so an over-broad ignore is caught too. */
const LINTED_PATHS = ['components/Accordion/Accordion.tsx', 'demos/src/mount.tsx'];

/**
 * Ask ESLint itself whether it would ignore each path.
 *
 * Run in a child Node process rather than in-band: `eslint.config.mjs` is ESM,
 * ESLint reaches it by dynamic import, and Jest's VM rejects that without
 * `--experimental-vm-modules`. Turning that flag on for the whole suite to
 * satisfy one test is the wrong trade; a child process is Node's ordinary
 * loader and gives the real answer. One process resolves every path at once.
 *
 * @returns {Record<string, boolean>} Path (repo-relative) to ignored-or-not.
 */
function resolveEslintIgnores() {
  const script = `
    const path = require('path');
    const { ESLint } = require('eslint');
    const paths = ${JSON.stringify([...IGNORED_PATHS, ...LINTED_PATHS])};
    (async () => {
      const eslint = new ESLint({ cwd: ${JSON.stringify(ROOT)} });
      const entries = [];
      for (const p of paths) {
        entries.push([p, await eslint.isPathIgnored(path.join(${JSON.stringify(ROOT)}, p))]);
      }
      process.stdout.write(JSON.stringify(Object.fromEntries(entries)));
    })().catch((error) => {
      process.stderr.write(String(error && error.stack ? error.stack : error));
      process.exit(1);
    });
  `;
  return JSON.parse(
    execFileSync(process.execPath, ['-e', script], {
      cwd: ROOT,
      encoding: 'utf8',
      // A hang here would otherwise sit until Jest's own timeout with nothing
      // to show for it. Well clear of the measured cost (~1s warm, ~4s cold).
      timeout: 60_000,
    }),
  );
}

describe('tooling ignores gitignored local directories (#242)', () => {
  describe('ESLint', () => {
    /** @type {Record<string, boolean>} */
    let ignored;

    // Spawning Node and letting ESLint load the whole flat config costs about
    // a second warm and four cold -- measured, and the cold figure is the one
    // CI hits on a fresh checkout. Jest's default hook timeout is 5s, close
    // enough to that to flake, so it is raised rather than left to chance.
    const SPAWN_TIMEOUT_MS = 60_000;

    beforeAll(() => {
      ignored = resolveEslintIgnores();
    }, SPAWN_TIMEOUT_MS);

    it.each(IGNORED_PATHS)('ignores %s', (relative) => {
      expect(ignored[relative]).toBe(true);
    });

    it.each(LINTED_PATHS)('still lints %s, so the exclusions are not over-broad', (relative) => {
      expect(ignored[relative]).toBe(false);
    });
  });

  describe('Jest', () => {
    // `testPathIgnorePatterns` entries are regex source strings matched against
    // the full path, so this runs the real predicate.
    const { testPathIgnorePatterns } = require('../jest.config.js');
    const isIgnored = (candidate) =>
      testPathIgnorePatterns.some((pattern) => new RegExp(pattern).test(candidate));

    it('does not collect tests from a worktree under .claude', () => {
      expect(
        isIgnored(path.join(ROOT, '.claude/worktrees/agent-abc123/__tests__/tabs.test.js')),
      ).toBe(true);
    });

    it("still collects this project's own tests", () => {
      expect(isIgnored(path.join(ROOT, '__tests__/tabs.test.js'))).toBe(false);
    });
  });

  describe('markdownlint-cli2', () => {
    const config = fs.readFileSync(path.join(ROOT, '.markdownlint-cli2.jsonc'), 'utf8');

    it.each(['".claude/"', '"release_announcement/"'])(
      'excludes %s in the config file rather than only on the command line',
      (entry) => {
        expect(config).toContain(entry);
      },
    );
  });
});
