# Architecture Decision Records

This directory holds ADRs (Architecture Decision Records) for apg-react.

Each ADR captures a single decision, its context, and its consequences.
Number files sequentially: `NNNN-short-slug.md`.

## Process

1. Copy `0000-template.md` to `NNNN-your-decision.md`.
2. Fill it in. Keep it short — one screen is often enough.
3. Open a PR. Reviewers can agree or push back on the decision before it
   is accepted.
4. Once merged, treat the ADR as immutable. To change a decision,
   write a new ADR that supersedes the previous one.

## Index

- [0001 — Keep Jest over Vitest](0001-keep-jest-over-vitest.md)
- [0002 — Keep Puppeteer over Playwright](0002-keep-puppeteer-over-playwright.md)
- [0003 — Keep Rollup for the library build](0003-keep-rollup-for-library-build.md)
- [0004 — Skip Express backend tooling](0004-skip-express-backend-tooling.md)
- [0005 — Accessibility assertion strategy](0005-a11y-assertion-strategy.md)
