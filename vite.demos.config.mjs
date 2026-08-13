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

export default defineConfig({
  root: rootDirectory,
  base: './',
  plugins: [react()],
  server: {
    port: 8080,
    strictPort: true,
    open: false,
  },
  preview: {
    port: 8080,
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
