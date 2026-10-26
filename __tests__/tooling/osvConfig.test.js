/**
 * Tooling contract: osv-scanner.toml's accepted advisories stay bounded.
 *
 * The OSV job in security.yml runs `osv-scanner --config=osv-scanner.toml`,
 * and an `[[IgnoredVulns]]` entry silences an advisory there. Each one must
 * carry an `ignoreUntil` date and a `reason`, so it cannot quietly become
 * permanent. Entries whose advisory no longer applies are retired (#275) and
 * must not come back: osv-scanner only warns about an unused ignore, so a dead
 * entry would otherwise sit there silencing a re-published advisory unseen.
 *
 * The TOML is read as text: the three keys used here are single-line
 * `key = value` pairs, and pulling in a TOML parser for that would add a
 * dependency to check a config file.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
/**
 * Ignores retired in #275, with why each one no longer applies.
 */
const RETIRED = {
  // extract-zip, via puppeteer's browser download. puppeteer 25 (#253) drops
  // extract-zip, so neither advisory has anything left to match.
  'GHSA-jmr9-qjv8-65gv': 'extract-zip',
  'GHSA-7pqw-9j4j-h8q3': 'extract-zip',
  // braces <= 3.0.3 (#269). The advisory was withdrawn on 2026-10-23.
  'GHSA-vfj7-8cjw-p6xm': 'braces (advisory withdrawn)',
};

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
    for (const entry of entries) {
      expect(entry.id).toMatch(/^(GHSA|CVE)-/);
      expect(entry.reason).toMatch(/#\d+/);
      expect(entry.ignoreUntil).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it.each(Object.entries(RETIRED))('does not ignore retired advisory %s (%s)', (id) => {
    expect(entries.map((entry) => entry.id)).not.toContain(id);
  });

  it('has no extract-zip left in the lockfile for those ignores to cover', () => {
    const inLockfile = Object.keys(lockfile.packages).some((key) =>
      key.endsWith('node_modules/extract-zip'),
    );
    expect(inLockfile).toBe(false);
  });
});
