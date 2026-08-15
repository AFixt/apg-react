import react from '@vitejs/plugin-react';
import { readdirSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const rootDirectory = fileURLToPath(new URL('.', import.meta.url));
const demosDirectory = resolve(rootDirectory, 'demos');

// One Rollup entry per demo page. Discovered from disk so adding a demo is a
// matter of adding `demos/<pattern>.html` — no config edit required.
const htmlEntries = Object.fromEntries(
  readdirSync(demosDirectory)
    .filter((name) => name.endsWith('.html'))
    .map((name) => [name.replace(/\.html$/, ''), resolve(demosDirectory, name)]),
);

// Vite's default host is `localhost`, which Node resolves to `::1` on most
// modern systems — so the demo server ends up listening on IPv6 loopback only.
// Anything that resolves `localhost` to 127.0.0.1 instead then fails to reach
// it. That bit the Cypress suite: curl (which prefers ::1) saw 200 while
// Cypress (which landed on 127.0.0.1) got `socket hang up`.
//
// `host: true` makes Vite pass no host to `listen()`, so Node binds the `::`
// wildcard dual-stack and accepts both IPv4 and IPv6. Resolution order stops
// mattering.
const HOST = true;

// The port stays 8080 by default, but a wildcard bind collides with anything
// else already holding the port on *any* address — and `strictPort` turns that
// into a hard failure rather than a silent hop to 8081. Local Docker stacks
// commonly claim 8080, so leave an escape hatch that does not require editing
// this file. Consumers already read APG_BASE_URL; this is the server-side half.
const PORT = Number(process.env.APG_DEMO_PORT) || 8080;

export default defineConfig({
  root: rootDirectory,
  base: './',
  plugins: [react()],
  server: {
    host: HOST,
    port: PORT,
    strictPort: true,
    open: false,
  },
  preview: {
    host: HOST,
    port: PORT,
    strictPort: true,
  },
  build: {
    outDir: resolve(rootDirectory, 'demos-dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: htmlEntries,
    },
  },
});
