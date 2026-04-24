# ADR 0003: Keep Rollup for the library build

- Status: accepted
- Date: 2026-04-23
- Deciders: @karlgroves

## Context

Issue #61 proposes Vite as the build tool. This project is published to npm
as `@afixt/apg-react` and must emit CJS, ESM, CSS, and per-component `.d.ts`
files. The current build is Rollup (`rollup.config.mjs`) with
`@rollup/plugin-typescript` handling declarations and
`rollup-plugin-postcss` extracting styles.

Vite is an application bundler; it is not the recommended tool for building
library packages with multiple output formats and emitted type declarations.
Storybook already uses Vite as its *dev-server* builder
(`@storybook/react-vite`), which is separate from the library build.

## Decision

Keep Rollup as the library build tool. Vite remains the Storybook builder.

## Consequences

- Published package continues to ship CJS + ESM + CSS + `.d.ts`.
- Two bundlers in the repo: Rollup (publish) and Vite (Storybook). This
  is idiomatic and documented in the Storybook ecosystem.

## Alternatives considered

- **Migrate to Vite library mode** — rejected. Vite library mode does not
  emit type declarations natively; it would require `vite-plugin-dts` and
  post-processing. The Rollup pipeline already works, and swapping would
  introduce churn in published artifacts.
- **Use tsup** — rejected. Same reasoning; current Rollup config is stable
  and produces correct per-component `.d.ts` files.
