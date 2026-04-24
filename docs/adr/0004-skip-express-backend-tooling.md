# ADR 0004: Skip backend-specific tooling from the issue #61 template

- Status: accepted
- Date: 2026-04-23
- Deciders: @karlgroves

## Context

Issue #61 is a cross-project tooling template. Several sections apply only to
projects with a Node/Express backend:

- `helmet`, `cors`, `express-rate-limit`, `express-slow-down`
- `pino` structured logging
- `zod` + `zod-to-openapi` request validation
- `supertest` for route testing
- `dotenv` + `envalid`
- `tsx` dev runtime, `tsup` build
- OWASP ZAP baseline scans of a deployed preview
- `msw` HTTP mocking
- SSR/SSG, `react-helmet-async`, JSON-LD, sitemap, `robots.txt`, `llms.txt`

apg-react is a published npm package of React components. It has no server, no
deployed preview beyond GitHub Pages Storybook, no request handling, and no SEO
surface.

## Decision

Skip all Express-specific, SSR, and SEO/AIEO tooling proposed by issue #61. Only
accessibility, library-build, test, lint, and supply-chain tooling apply.

## Consequences

- Smaller dependency footprint.
- Issue #61 acceptance criteria related to backend hardening, Lighthouse SEO,
  `llms.txt`, and sitemap generation are marked not-applicable in the final PRs.

## Alternatives considered

- **Add the tooling anyway, unused** — rejected. Dead dependencies are a
  maintenance liability and a supply-chain surface.
