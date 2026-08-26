/**
 * Resolve a request URL to a file path confined to a root directory.
 *
 * Extracted from globalSetup so it can be unit-tested without building
 * Storybook and booting a server, and so the containment check sits in one
 * place rather than being repeated at each filesystem call.
 *
 * The defect this exists to prevent: `path.join(ROOT, urlPath)` normalises `..`
 * segments *after* joining, so a request for `/../../../../etc/passwd` resolves
 * outside the root and is served. `decodeURIComponent` runs first, so `%2e%2e%2f`
 * reaches the same place.
 */
const path = require('path');

/**
 * @param {string} root - Directory requests are confined to.
 * @param {string} requestUrl - Raw `req.url`, query string and fragment included.
 * @returns {string|null} An absolute path inside `root`, or null if the request
 *   is malformed or escapes the root.
 */
function resolveStaticPath(root, requestUrl) {
  if (typeof requestUrl !== 'string') return null;

  let urlPath;
  try {
    urlPath = decodeURIComponent(requestUrl.split('?')[0].split('#')[0]);
  } catch {
    // Malformed percent-encoding, e.g. "%".
    return null;
  }

  // A NUL can truncate the path at the syscall boundary on some platforms.
  if (urlPath.includes('\0')) return null;

  // Backslashes are folded first so a Windows-style separator cannot smuggle a
  // segment past the check below.
  const posixPath = urlPath.replace(/\\/g, '/');

  // Reject traversal outright rather than normalising it away. Collapsing it
  // silently would be safe, but it would answer a traversal attempt with a
  // 200 and the SPA fallback, which is indistinguishable from an ordinary
  // miss. A browser resolves ".." before it ever sends a request, so a ".."
  // segment arriving here is never a legitimate static request.
  if (posixPath.split('/').includes('..')) return null;

  const normalised = path.posix.normalize(`/${posixPath}`);
  const rootDir = path.resolve(root);
  const resolved = path.resolve(rootDir, `.${normalised}`);

  // Belt and braces. The rejection above should make this unreachable, but it
  // is the check that states the invariant, and the one a reader (or a scanner)
  // can see without reasoning about normalize's semantics.
  if (resolved !== rootDir && !resolved.startsWith(rootDir + path.sep)) return null;

  return resolved;
}

module.exports = { resolveStaticPath };
