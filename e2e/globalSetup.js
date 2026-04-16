/**
 * E2E globalSetup: boots a static HTTP server that serves ./storybook-static
 * and launches a single shared Puppeteer browser. Test files reuse the
 * browser via the process env.
 */
const path = require("path");
const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");

const PORT = process.env.E2E_PORT || 6007;
const ROOT = path.resolve(__dirname, "..", "storybook-static");

const MIME = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ico": "image/x-icon",
    ".map": "application/json",
};

function startServer() {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(ROOT)) {
            return reject(
                new Error(
                    `E2E: ${ROOT} does not exist. Run "npm run build-storybook" first.`
                )
            );
        }
        const server = http.createServer((req, res) => {
            const urlPath = decodeURIComponent(req.url.split("?")[0]);
            let filePath = path.join(ROOT, urlPath);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
                filePath = path.join(filePath, "index.html");
            }
            if (!fs.existsSync(filePath)) {
                // SPA fallback
                filePath = path.join(ROOT, "index.html");
            }
            const ext = path.extname(filePath).toLowerCase();
            const type = MIME[ext] || "application/octet-stream";
            res.writeHead(200, { "Content-Type": type });
            fs.createReadStream(filePath).pipe(res);
        });
        server.listen(PORT, () => resolve(server));
        server.on("error", reject);
    });
}

function findChrome() {
    const fs = require("fs");
    const candidates = [
        process.env.PUPPETEER_EXECUTABLE_PATH,
        process.env.CHROME_PATH,
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/usr/bin/google-chrome-stable",
        "/usr/bin/google-chrome",
        "/usr/bin/chromium-browser",
        "/usr/bin/chromium",
    ];
    for (const p of candidates) {
        if (p && fs.existsSync(p)) return p;
    }
    return undefined; // fall back to Puppeteer's bundled Chromium
}

module.exports = async function globalSetup() {
    const server = await startServer();
    const executablePath = findChrome();
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    // Stash references so globalTeardown can clean up.
    global.__E2E_SERVER__ = server;
    global.__E2E_BROWSER__ = browser;
    process.env.E2E_BASE_URL = `http://localhost:${PORT}`;
    process.env.E2E_BROWSER_WS_ENDPOINT = browser.wsEndpoint();
};
