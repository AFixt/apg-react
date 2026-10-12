/**
 * Tooling contract: osv-scanner.toml's accepted advisories stay bounded.
 *
 * The OSV job in security.yml runs `osv-scanner --config=osv-scanner.toml`,
 * and an `[[IgnoredVulns]]` entry silences an advisory there. Each one must
 * carry an `ignoreUntil` date and a `reason`, so it cannot quietly become
 * permanent. The braces acceptance (GHSA-vfj7-8cjw-p6xm, #269) is pinned to
 * its 2026-12-02 fleet window, and must leave the file in the same change that
 * takes braces out of the lockfile.
 *
 * The TOML is read as text: the three keys used here are single-line
 * `key = value` pairs, and pulling in a TOML parser for that would add a
 * dependency to check a config file.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const BRACES = 'GHSA-vfj7-8cjw-p6xm';

/**
 * The `[[IgnoredVulns]]` tables, each reduced to its id/ignoreUntil/reason.
 * Comment lines are skipped.
 *
 * @param {string} text - The TOML source.
 * @returns {Array<{id?: string, ignoreUntil?: string, reason?: string}>} One object per table.
 */
function ignoredVulns(text) {
  return text
    .split(/^\[\[IgnoredVulns\]\]\s*$/m)
    .slice(1)
    .map((block) => {
      const entry = {};
      for (const line of block.split('\n')) {
        if (line.trimStart().startsWith('#')) continue;
        const eq = line.indexOf('=');
        if (eq === -1) continue;
        const key = line.slice(0, eq).trim();
        if (!['id', 'ignoreUntil', 'reason'].includes(key)) continue;
        const value = line.slice(eq + 1).trim();
        entry[key] = value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1) : value;
      }
      return entry;
    });
}

const entries = ignoredVulns(fs.readFileSync(path.join(ROOT, 'osv-scanner.toml'), 'utf8'));
const lockfile = JSON.parse(fs.readFileSync(path.join(ROOT, 'package-lock.json'), 'utf8'));

describe('osv-scanner.toml accepted advisories', () => {
  it('gives every entry an advisory id, an issue-citing reason and a date', () => {
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.id).toMatch(/^(GHSA|CVE)-/);
      expect(entry.reason).toMatch(/#\d+/);
      expect(entry.ignoreUntil).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('accepts braces GHSA-vfj7-8cjw-p6xm until 2026-12-02, citing #269', () => {
    const braces = entries.find((entry) => entry.id === BRACES);
    expect(braces).toBeDefined();
    expect(braces.ignoreUntil).toBe('2026-12-02');
    expect(braces.reason).toMatch(/#269/);
  });

  it('keeps the braces entry only while braces is in the lockfile', () => {
    const inLockfile = Object.keys(lockfile.packages).some((key) =>
      key.endsWith('node_modules/braces'),
    );
    // When this fails because braces has left the tree, delete the entry and
    // the braces test above: the acceptance has nothing left to accept.
    expect(entries.some((entry) => entry.id === BRACES)).toBe(inLockfile);
  });
});
