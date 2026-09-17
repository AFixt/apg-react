/**
 * Load Puppeteer from a CommonJS module.
 *
 * Puppeteer is ESM-only from v25, and v24 and earlier drag in a vulnerable
 * `extract-zip` (GHSA-jmr9-qjv8-65gv, CVSS 8.1), so staying on v24 is not an
 * option — and pinning `extract-zip` past the advisory is not either, because
 * its latest published release is itself inside the affected range.
 *
 * Jest's CJS runtime cannot `require()` an ES module, but it can `import()` one
 * when Node is started with `--experimental-vm-modules`, which is what the
 * `test:e2e` script does. Everything else in this directory stays plain
 * CommonJS.
 *
 * The same shim exists in AFixt/apg-jest for the same reason.
 */
let cached;

async function getPuppeteer() {
  if (!cached) {
    const mod = await import('puppeteer');
    cached = mod.default || mod;
  }
  return cached;
}

module.exports = { getPuppeteer };
