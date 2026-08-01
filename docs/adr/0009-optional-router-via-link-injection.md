# ADR 0009: Optional router support via link-component injection

- Status: accepted
- Date: 2026-08-01
- Deciders: @karlgroves

## Context

`Link` and `Breadcrumb` imported `react-router-dom` at the top level, so the
built bundle required it unconditionally. Importing `@afixt/apg-react` threw
`Cannot find module 'react-router-dom'` for anyone who had not installed a
router — despite `package.json` declaring the dependency as optional. Versions
1.2.0 and 1.3.0 were both affected.

A component library implementing the WAI-ARIA APG has no business dictating a
consumer's routing stack. Two components out of 31 were forcing a router on
every consumer of the barrel, including consumers who never render a link.

The constraint that shapes the solution: the package ships **both** CJS and ESM
bundles, and whatever mechanism resolves the router has to work in both, plus
under SSR.

## Decision

Resolve the element used to render a link through injection, in this order:

1. an explicit `linkComponent` prop,
2. the value supplied to the nearest `LinkComponentProvider`,
3. a plain `<a href>` — the dependency-free default.

Nothing in the module graph imports a router. Applications that want client-side
navigation opt in once at the root by passing their router's link component to
`LinkComponentProvider`.

`undefined` and `null` are deliberately not equivalent: omitting `linkComponent`
defers to the provider, while an explicit `null` opts a single instance back out
to a plain anchor.

## Consequences

**Easier.** The package installs and imports with no router present. Any router
whose link component accepts a `to` prop works — React Router, TanStack Router,
or a hand-rolled wrapper — so the library is no longer coupled to one library's
release cadence. Bundle size drops for consumers who do not use a router, and
the `.size-limit.json` ignore lists no longer hide a router import.

**Harder.** Router users must add a provider; this is a breaking change,
released as 2.0.0 and documented in the README's "Router integration" section.
Injection also splits the contract: the library forwards extra props verbatim,
which makes the injected component responsible for passing `onClick`,
`onKeyDown`, and the rest through to the anchor it renders. A component that
drops them silently disables the consumer's handlers.

The plain-anchor fallback puts `to` into `href` without rewriting it. That is
ordinary `<a>` behaviour, but it differs from the router-resolved path that
consumers had through 1.3.0, and it is called out in the README.

**Follow-up risk.** A future top-level router import would silently restore the
old failure. `__tests__/package-no-router.test.js` guards against it by packing
the real tarball and loading it from a directory containing only `react` and
`react-dom`.

## Alternatives considered

- **Conditional `require('react-router-dom')` in a try/catch** — works in the
  CJS bundle, but leaves a bare `require` in the ESM output, which breaks in
  browsers and in bundlers that treat ESM as static. Rejected.
- **Dynamic `import()` of the router** — resolves the ESM problem but makes link
  rendering asynchronous, which complicates SSR and the first paint for a
  component that should be trivially synchronous. Rejected.
- **Splitting `Link` and `Breadcrumb` into a separate `@afixt/apg-react-router`
  package** — keeps the barrel clean, but doubles the release surface and leaves
  consumers who want a router importing components from two packages for no
  benefit over injection. Rejected.
- **Keeping the hard dependency and documenting it** — the status quo. Rejected:
  it makes a router mandatory for the 29 components that have nothing to do with
  routing.
