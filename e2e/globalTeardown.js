module.exports = async function globalTeardown() {
  if (global.__E2E_BROWSER__) await global.__E2E_BROWSER__.close();
  if (global.__E2E_SERVER__) {
    await new Promise((resolve) => global.__E2E_SERVER__.close(resolve));
  }
};
