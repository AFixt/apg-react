# ADR 0001: Keep Jest rather than migrating to Vitest

- Status: accepted
- Date: 2026-04-23
- Deciders: @karlgroves

## Context

Issue #61 proposes adopting a standardized tooling stack that includes Vitest
for unit and integration tests. This project currently uses Jest with
`jest-environment-jsdom`, `babel-jest`, `@testing-library/react`, and
`@testing-library/jest-dom`. There are 295 passing tests across 32 suites,
including a custom accessibility contract test layer (`__tests__/helpers/a11y.js`)
that validates ARIA semantics without external a11y libraries.

Issue #61's ground rule: "Do not replace anything that already exists in this
project unless the new proposal leads to a demonstrably higher quality outcome."

## Decision

Keep Jest. Do not migrate to Vitest as part of this tooling initiative.

## Consequences

- Existing tests continue to run unchanged.
- No migration risk for snapshots or the custom a11y helper.
- The ESLint config for this project will lint test files under the Jest
  globals convention rather than Vitest globals.
- If a future need arises (e.g., adopting Vite as the Storybook builder
  demands Vitest integration), this ADR can be superseded.

## Alternatives considered

- **Migrate to Vitest now** — rejected. No demonstrated quality or speed win
  for a component library of this size; the migration effort (295 tests,
  custom helper, Babel → Vite build chain) is high risk with no user-visible
  improvement. Storybook already uses Vite as its builder, so dev-server
  speed is not blocked on the test runner.
- **Run both in parallel** — rejected. Dual toolchains increase maintenance
  burden and confuse contributors.
