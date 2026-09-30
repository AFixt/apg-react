/**
 * @jest-environment node
 */
/**
 * Tests for scripts/run-trufflehog.sh — the secret scan the pre-commit hook
 * runs as `TRUFFLEHOG_MODE=staged` (#260, ported from AFixt/shareable#191).
 *
 * The hook used to run `trufflehog git file://. --since-commit HEAD`, which
 * (a) scanned no staged content at all, because a staged change is not a
 * commit yet, and (b) errored in a git worktree, where `.git` is a pointer
 * file. These drive the real script against throwaway fixture repositories —
 * a normal checkout and a worktree of it — and assert on the exit code, which
 * is what the hook reacts to: 183 is trufflehog's "found something" under
 * --fail, 0 is clean, anything else is a scan that did not work.
 *
 * The canary is a random GitHub-token-shaped string built at run time, so no
 * credential-shaped literal lives in this file. It is not a real token; it can
 * never verify, so most tests widen the result filter with TRUFFLEHOG_RESULTS
 * instead of relying on the hook's default. What is under test is whether the
 * staged content reaches the scanner at all.
 *
 * Skipped when trufflehog is not installed, exactly as the script itself
 * skips.
 */
import { execFile, spawn, spawnSync } from 'node:child_process';
import { randomInt } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const SCRIPT = path.join(__dirname, '..', '..', 'scripts', 'run-trufflehog.sh');
const FOUND = 183;

const hasTrufflehog = spawnSync('trufflehog', ['--version'], { encoding: 'utf8' }).status === 0;
const describeIfTrufflehog = hasTrufflehog ? describe : describe.skip;

/**
 * How long one scan may take before the test kills it and fails with a
 * message saying so (AFixt/detect-features#112). Unloaded, a run takes a few
 * seconds; on a heavily loaded machine one took minutes. The scans are
 * asynchronous because jest cannot time out synchronous code: a spawnSync
 * that hangs would hang the suite silently. A killed run has no exit status,
 * so the deadline can only ever fail a test — never pass one.
 */
const SCAN_DEADLINE = 110_000;
jest.setTimeout(SCAN_DEADLINE + 10_000);

/**
 * The error a scan that outlived SCAN_DEADLINE fails with, so load shows up
 * as a timeout rather than as a verdict.
 * @param {string} what the command that was killed
 * @param {ErrorOptions} [options] e.g. the underlying error as `cause`
 * @returns {Error}
 */
function deadlineError(what, options) {
  return new Error(
    `${what} did not finish within ${String(SCAN_DEADLINE / 1000)}s ` +
      '(machine load?). This is a timeout, not a scan result.',
    options,
  );
}

/**
 * SIGKILL a detached child's whole process group; it may already be gone.
 * @param {number | undefined} pid
 */
function killGroup(pid) {
  if (pid === undefined) return;
  try {
    process.kill(-pid, 'SIGKILL');
  } catch {
    // Already exited: nothing left to kill.
  }
}

/**
 * TMPDIR for the script under test: a directory inside the current test's
 * fixture root, set by beforeEach. The staged scan exports into
 * `$TMPDIR/staged-secrets.*` and removes it from an EXIT trap, but a run
 * SIGKILLed at SCAN_DEADLINE never runs that trap. Keeping the export under
 * the fixture root means the suite's own afterEach removes it either way,
 * instead of leaving it in the system temp directory.
 * @type {string}
 */
let scanTmpdir;

/**
 * A random ASCII letter, either case.
 * @returns {string}
 */
function randomLetter() {
  const index = randomInt(52);
  return String.fromCodePoint(index < 26 ? 0x41 + index : 0x61 + index - 26);
}

/**
 * A fresh, random, never-valid GitHub-PAT-shaped string.
 *
 * Letters and digits alternate, so no two letters are ever adjacent
 * (AFixt/detect-features#112). trufflehog discards an unverified result whose
 * value contains a dictionary word, case-insensitively, as a likely false
 * positive. The canary used to be 36 fully random alphanumerics, and about 1
 * in 300 of those contains a word, which trufflehog then dropped: the
 * staged-canary test failed at random. With no letter pairs there is no word
 * to find.
 * @returns {string}
 */
function canary() {
  let body = '';
  for (let index = 0; index < 36; index++) {
    body += index % 2 === 0 ? randomLetter() : String(randomInt(10));
  }
  return `ghp_${body}`;
}

/**
 * `process.env` with the variables git uses to locate a repository removed.
 *
 * If this suite ever runs inside a hook or wrapper that has GIT_DIR,
 * GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR or GIT_OBJECT_DIRECTORY set
 * (the pre-push hook runs `npm test`), those take precedence over `cwd` for
 * every git invocation below — a fixture-scoped `git init`/`add`/`commit`/
 * `worktree add` would silently operate on whatever repo the inherited
 * variables name instead of the throwaway fixture, up to and including
 * writing commits with the fixture's fake identity into a real repository.
 * Stripping them here is what makes `cwd` the sole source of truth for every
 * spawn in this file.
 * @param {Record<string, string | undefined>} [extra]
 * @returns {Record<string, string | undefined>}
 */
function isolatedEnv(extra = {}) {
  const env = { ...process.env };
  for (const name of [
    'GIT_DIR',
    'GIT_WORK_TREE',
    'GIT_INDEX_FILE',
    'GIT_COMMON_DIR',
    'GIT_OBJECT_DIRECTORY',
    'GIT_ALTERNATE_OBJECT_DIRECTORIES',
  ]) {
    delete env[name];
  }
  return { ...env, ...extra };
}

/**
 * Run git in `cwd`, isolated from the user's global hooks and signing.
 * @param {string} cwd
 * @param {...string} args
 * @returns {string}
 */
function git(cwd, ...args) {
  const result = spawnSync(
    'git',
    [
      '-c',
      'core.hooksPath=/dev/null',
      '-c',
      'commit.gpgsign=false',
      '-c',
      'user.name=fixture',
      '-c',
      'user.email=fixture@example.com',
      ...args,
    ],
    { cwd, encoding: 'utf8', env: isolatedEnv() },
  );
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${result.stderr}`);
  }
  return result.stdout;
}

/** The widened result filter most tests use; see the file header. */
const WIDE = { TRUFFLEHOG_RESULTS: 'unknown,unverified' };

/**
 * Run the script under test in `cwd` and resolve with its exit status and
 * output. A run that outlives SCAN_DEADLINE is killed and rejected with a
 * message naming the timeout, so load shows up as a timeout rather than as a
 * verdict.
 * @param {string} cwd
 * @param {'staged' | 'full'} mode
 * @param {Record<string, string>} [env] extra environment; defaults to WIDE
 * @returns {Promise<{ status: number | null, output: string }>}
 */
function scan(cwd, mode, env = WIDE) {
  return new Promise((resolve, reject) => {
    // Detached, so the script leads its own process group and the deadline
    // can kill trufflehog with it. Killing only bash would orphan the
    // scanner, which would keep running on the already overloaded machine.
    const child = spawn('bash', [SCRIPT], {
      cwd,
      detached: true,
      env: isolatedEnv({ TRUFFLEHOG_MODE: mode, TMPDIR: scanTmpdir, ...env }),
    });
    const timer = setTimeout(() => {
      killGroup(child.pid);
      reject(deadlineError('run-trufflehog.sh'));
    }, SCAN_DEADLINE);
    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk.toString()));
    child.stderr.on('data', (chunk) => (output += chunk.toString()));
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('close', (status) => {
      clearTimeout(timer);
      resolve({ status, output });
    });
  });
}

/**
 * Stage a random canary in `cwd`.
 * @param {string} cwd
 */
function stageCanary(cwd) {
  fs.writeFileSync(path.join(cwd, 'config.txt'), `token = "${canary()}"\n`);
  git(cwd, 'add', 'config.txt');
}

/**
 * Stage a submodule (a gitlink, which has no content of its own) in `cwd`,
 * cloned from a throwaway repository under `root`.
 * @param {string} cwd
 * @param {string} root
 */
function stageGitlink(cwd, root) {
  const sub = path.join(root, 'sub');
  fs.mkdirSync(sub);
  git(sub, 'init', '-q');
  git(sub, 'commit', '-q', '--allow-empty', '-m', 'sub');
  git(cwd, '-c', 'protocol.file.allow=always', 'submodule', 'add', '-q', sub, 'vendor/sub');
}

/**
 * A directory under `root` holding a `git` that behaves like the real one
 * except that `checkout-index` swallows its input and writes nothing: an
 * export that "succeeds" without exporting.
 * @param {string} root
 * @returns {string}
 */
function gitWithSilentExport(root) {
  const realGit = spawnSync('bash', ['-c', 'command -v git'], {
    encoding: 'utf8',
    env: isolatedEnv(),
  }).stdout.trim();
  const bin = path.join(root, 'shim-bin');
  fs.mkdirSync(bin);
  const shim = path.join(bin, 'git');
  fs.writeFileSync(
    shim,
    [
      '#!/usr/bin/env bash',
      'if [ "$1" = checkout-index ]; then cat >/dev/null; exit 0; fi',
      `exec "${realGit}" "$@"`,
      '',
    ].join('\n'),
  );
  fs.chmodSync(shim, 0o755);
  return bin;
}

describeIfTrufflehog('run-trufflehog.sh', () => {
  let root;
  let checkout;
  let worktree;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'trufflehog-gate-'));
    checkout = path.join(root, 'checkout');
    worktree = path.join(root, 'worktree');
    scanTmpdir = path.join(root, 'tmp');
    fs.mkdirSync(scanTmpdir);
    fs.mkdirSync(checkout);
    git(checkout, 'init', '-q');
    fs.writeFileSync(path.join(checkout, 'README.md'), 'fixture\n');
    git(checkout, 'add', 'README.md');
    git(checkout, 'commit', '-q', '-m', 'init');
    git(checkout, 'worktree', 'add', '-q', worktree, '-b', 'review');
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('the fixture worktree really has a .git pointer file', () => {
    expect(fs.statSync(path.join(worktree, '.git')).isFile()).toBe(true);
  });

  it('every canary the tests can generate is one trufflehog reports (AFixt/detect-features#112)', async () => {
    // The premise of every "catches" test below. 1000 canaries in one scan;
    // under the old fully random shape, about 3 of them went missing.
    const dir = path.join(root, 'canaries');
    fs.mkdirSync(dir);
    const count = 1000;
    for (let index = 0; index < count; index++) {
      fs.writeFileSync(path.join(dir, `c${String(index)}.txt`), `token = "${canary()}"\n`);
    }

    // Asynchronous with a deadline, for the same reason as scan().
    let stdout;
    try {
      ({ stdout } = await promisify(execFile)(
        'trufflehog',
        [
          'filesystem',
          dir,
          '--results=unknown,unverified',
          '--no-verification',
          '--no-update',
          '--json',
        ],
        {
          encoding: 'utf8',
          timeout: SCAN_DEADLINE,
          killSignal: 'SIGKILL',
          env: isolatedEnv(),
          maxBuffer: 64 * 1024 * 1024,
        },
      ));
    } catch (error) {
      // execFile reports its own timeout as a bare "Command failed"; say
      // plainly that this was the deadline, not trufflehog's verdict.
      if (error && error.killed && error.signal === 'SIGKILL') {
        throw deadlineError('trufflehog filesystem', { cause: error });
      }
      throw error;
    }

    const found = new Set(
      stdout
        .trim()
        .split('\n')
        .map((line) => JSON.parse(line).Raw),
    );
    expect(found.size).toBe(count);
  });

  describe.each([
    ['a normal checkout', () => checkout],
    ['a git worktree', () => worktree],
  ])('staged mode in %s', (_label, dir) => {
    it('catches a staged canary', async () => {
      const cwd = dir();
      stageCanary(cwd);

      const { status, output } = await scan(cwd, 'staged');

      expect(output).not.toMatch(/not a directory/);
      expect(status).toBe(FOUND);
    });

    it('scans the staged version, not the working tree', async () => {
      const cwd = dir();
      fs.writeFileSync(path.join(cwd, 'config.txt'), 'token = "placeholder"\n');
      git(cwd, 'add', 'config.txt');
      // Unstaged edit: this is not what the commit would contain.
      fs.writeFileSync(path.join(cwd, 'config.txt'), `token = "${canary()}"\n`);

      expect((await scan(cwd, 'staged')).status).toBe(0);
    });

    it('passes when only deletions are staged', async () => {
      const cwd = dir();
      git(cwd, 'rm', '-q', 'README.md');

      const { status, output } = await scan(cwd, 'staged');

      expect(status).toBe(0);
      expect(output).toMatch(/nothing staged/);
    });

    it('still catches a canary staged alongside a submodule', async () => {
      const cwd = dir();
      stageGitlink(cwd, root);
      stageCanary(cwd);

      const { status, output } = await scan(cwd, 'staged');

      expect(output).not.toMatch(/refusing/);
      expect(status).toBe(FOUND);
    });
  });

  describe('staged mode fails closed (AFixt/detect-features#112)', () => {
    it('blocks when verification cannot complete, under the hook default filter', async () => {
      // A dead proxy makes every verification request fail, as a timeout on a
      // loaded or offline machine does. trufflehog then reports the canary as
      // "unknown"; --only-verified used to drop it and exit 0.
      stageCanary(checkout);
      const deadProxy = 'http://127.0.0.1:9';

      const { status } = await scan(checkout, 'staged', {
        HTTPS_PROXY: deadProxy,
        https_proxy: deadProxy,
        NO_PROXY: '',
        no_proxy: '',
        TRUFFLEHOG_RESULTS: '',
      });

      expect(status).toBe(FOUND);
    });

    it('refuses to report clean when the export wrote fewer files than are staged', async () => {
      stageCanary(checkout);
      const shimBin = gitWithSilentExport(root);

      const { status, output } = await scan(checkout, 'staged', {
        ...WIDE,
        PATH: `${shimBin}${path.delimiter}${process.env.PATH ?? ''}`,
      });

      expect(output).toMatch(/exported 0 of 1 staged files/);
      expect(status).toBe(1);
    });
  });

  describe.each([
    ['a normal checkout', () => checkout],
    ['a git worktree', () => worktree],
  ])('full mode in %s', (_label, dir) => {
    it('catches a committed canary', async () => {
      const cwd = dir();
      fs.writeFileSync(path.join(cwd, 'config.txt'), `token = "${canary()}"\n`);
      git(cwd, 'add', 'config.txt');
      git(cwd, 'commit', '-q', '-m', 'add config');

      const { status, output } = await scan(cwd, 'full');

      expect(output).not.toMatch(/not a directory/);
      expect(status).toBe(FOUND);
    });
  });
});
