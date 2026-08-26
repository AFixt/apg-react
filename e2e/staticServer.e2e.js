/**
 * The E2E static server, over real HTTP (#135).
 *
 * `__tests__/e2eStaticServer.test.js` unit-tests the resolver. This drives the
 * running server, because the property that matters is what the *server*
 * answers -- a resolver that returns null is only useful if the request handler
 * turns that into a refusal rather than reading the file anyway.
 *
 * No browser needed; these are plain requests against E2E_BASE_URL.
 */
const http = require('http');

/** Issue a raw GET without letting a URL parser normalise the path first. */
const rawGet = (pathAndQuery) =>
  new Promise((resolve, reject) => {
    const base = new URL(process.env.E2E_BASE_URL);
    const req = http.request(
      {
        hostname: base.hostname,
        port: base.port,
        method: 'GET',
        // Passed through verbatim: using `new URL()` here would collapse the
        // "..") client-side and the server would never see the attempt.
        path: pathAndQuery,
      },
      (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => resolve({ status: res.statusCode, body }));
      },
    );
    req.on('error', reject);
    req.end();
  });

describe('E2E static server path containment', () => {
  test('serves a file inside the root', async () => {
    const res = await rawGet('/index.html');
    expect(res.status).toBe(200);
  });

  test.each([
    ['/../package.json'],
    ['/../../package.json'],
    ['/%2e%2e%2fpackage.json'],
    ['/..%2Fpackage.json'],
    ['/../../../../etc/passwd'],
  ])('refuses %s with 403', async (path) => {
    const res = await rawGet(path);
    expect(res.status).toBe(403);
  });

  test('does not disclose package.json under any of them', async () => {
    const attempts = ['/../package.json', '/%2e%2e%2fpackage.json', '/..%2Fpackage.json'];

    for (const attempt of attempts) {
      const res = await rawGet(attempt);
      expect(res.body).not.toContain('"@afixt/apg-react"');
    }
  });

  test('refuses malformed percent-encoding', async () => {
    const res = await rawGet('/%');
    expect(res.status).toBe(403);
  });
});
