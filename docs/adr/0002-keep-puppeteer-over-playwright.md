# ADR 0002: Keep Puppeteer rather than migrating to Playwright

- Status: accepted
- Date: 2026-04-23
- Deciders: @karlgroves

## Context

Issue #61 proposes Playwright for E2E tests. This project currently uses
Puppeteer driven by a Jest config (`e2e/jest.config.js`) against a built
Storybook (`storybook-static/`). The E2E layer exercises keyboard interaction
on every APG component.

## Decision

Keep Puppeteer + Jest for E2E.

## Consequences

- No rewrite of E2E suite.
- CI already has working `PUPPETEER_DISABLE_DEV_SHM_USAGE` handling.
- If a future need arises (cross-browser validation, trace viewer, codegen),
  this ADR can be superseded by migrating to Playwright.

## Alternatives considered

- **Migrate to Playwright** — rejected. Cross-browser E2E is not a
  requirement for this APG component library; the patterns under test are
  keyboard- and DOM-level and do not depend on browser-specific rendering.
  The migration cost (rewriting every `e2e/*.e2e.js` file, new CI setup)
  outweighs the marginal benefit.
