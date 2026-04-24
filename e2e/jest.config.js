/**
 * Separate Jest config for end-to-end tests.
 *
 * E2E tests drive a real Chromium instance via Puppeteer against a running
 * Storybook (static build served on http://localhost:6007 by default).
 *
 * Run:
 *   npm run build-storybook     # produce ./storybook-static
 *   npm run test:e2e            # starts http-server + runs this config
 */
module.exports = {
  rootDir: __dirname,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.e2e.js'],
  globalSetup: '<rootDir>/globalSetup.js',
  globalTeardown: '<rootDir>/globalTeardown.js',
  setupFilesAfterEach: [],
  testTimeout: 30000,
  verbose: false,
  transform: {
    '^.+\\.[t|j]sx?$': [
      'babel-jest',
      { presets: [['@babel/preset-env', { targets: { node: 'current' } }]] },
    ],
  },
};
