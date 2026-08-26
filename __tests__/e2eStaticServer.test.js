/**
 * Contract for the E2E static server's path resolution (#135).
 *
 * The server the E2E suite boots did `path.join(ROOT, decodeURIComponent(url))`
 * and streamed the result. `path.join` normalises `..` *after* joining, so a
 * request for `/../../../../etc/passwd` resolved outside `storybook-static/`
 * and was answered with a 200 and the file. This was the repo's entire open
 * CodeQL backlog: four `js/path-injection` alerts, all in globalSetup.js.
 *
 * The resolver is unit-tested here rather than only through the E2E suite so
 * the guarantee is checked on every run, without needing a Storybook build or a
 * real browser. `e2e/staticServer.e2e.js` drives the same cases over HTTP.
 */
const path = require('path');
const { resolveStaticPath } = require('../e2e/resolveStaticPath');

const ROOT = path.resolve(__dirname, '..', 'storybook-static');

describe('resolveStaticPath', () => {
  describe('serves ordinary requests', () => {
    test.each([
      ['/index.html', 'index.html'],
      ['/iframe.html?id=button--default', 'iframe.html'],
      ['/assets/main.js', path.join('assets', 'main.js')],
      ['/assets/main.js#fragment', path.join('assets', 'main.js')],
      ['/a%20b.js', 'a b.js'],
    ])('%s', (url, expected) => {
      expect(resolveStaticPath(ROOT, url)).toBe(path.join(ROOT, expected));
    });

    test('the root itself resolves to the root', () => {
      expect(resolveStaticPath(ROOT, '/')).toBe(ROOT);
    });

    test('a filename merely containing dots is not traversal', () => {
      expect(resolveStaticPath(ROOT, '/a..b/c.js')).toBe(path.join(ROOT, 'a..b', 'c.js'));
      expect(resolveStaticPath(ROOT, '/...js')).toBe(path.join(ROOT, '...js'));
    });
  });

  describe('refuses anything that leaves the root', () => {
    test.each([
      ['plain traversal', '/../package.json'],
      ['deep traversal', '/../../../../etc/passwd'],
      ['percent-encoded traversal', '/%2e%2e%2fpackage.json'],
      ['double-encoded separator', '/..%2Fpackage.json'],
      ['backslash separator', '/..\\package.json'],
      ['traversal mid-path', '/assets/../../package.json'],
      ['traversal that lands back inside', '/assets/../index.html'],
    ])('%s', (_name, url) => {
      expect(resolveStaticPath(ROOT, url)).toBeNull();
    });

    test('a resolved path never escapes the root', () => {
      const urls = [
        '/../package.json',
        '/%2e%2e%2fpackage.json',
        '/../../../../etc/passwd',
        '/..\\package.json',
        '/./../../package.json',
      ];

      urls.forEach((url) => {
        const resolved = resolveStaticPath(ROOT, url);
        if (resolved !== null) {
          expect(resolved.startsWith(ROOT + path.sep)).toBe(true);
        }
      });
    });
  });

  describe('refuses malformed input', () => {
    test.each([
      ['malformed percent-encoding', '/%'],
      ['lone percent mid-path', '/assets/%zz.js'],
      ['embedded NUL', '/foo%00.js'],
    ])('%s', (_name, url) => {
      expect(resolveStaticPath(ROOT, url)).toBeNull();
    });

    test.each([
      ['undefined', undefined],
      ['null', null],
      ['a number', 42],
    ])('%s', (_name, url) => {
      expect(resolveStaticPath(ROOT, url)).toBeNull();
    });
  });
});
