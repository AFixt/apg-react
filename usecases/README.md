# Use Cases

Executable accessibility use cases for every component in this library, written
in the DSL of
[`@afixt/usecase-runner`](https://www.npmjs.com/package/@afixt/usecase-runner).

Each `.uc.yaml` file documents a single discrete user interaction (e.g., "expand
a collapsed accordion panel by activating its header") in a human-readable form
that can be exercised by automation. Element targeting is accessibility-first:
cases use `getByRole`/`getByLabel`-style locators, so a case that fails because
an element is missing from the accessibility tree is — by design — an
accessibility finding.

## Layout

```text
usecases/
├── README.md                         (this file)
└── <component>/                      (one directory per component)
    ├── <component>-<scenario>.uc.yaml
    └── ...
```

One file per discrete scenario, grouped by component directory. Filenames are
kebab-case and start with the component name so they sort and grep cleanly.

## start_location

Every case targets the component's Storybook story directly:

```text
http://localhost:6006/iframe.html?id=components-<component>--<story>&viewMode=story
```

Start Storybook with `npm run storybook` (or build with
`npm run build-storybook` and serve `storybook-static/` on port 6006) before
running cases.

## Running

Install the runner and Playwright as dev dependencies (peer requirements of the
runner):

```bash
npm install --save-dev @afixt/usecase-runner @playwright/test
npx playwright install chromium
```

Validate the DSL without executing:

```bash
npx usecase-runner validate usecases/
```

Generate Playwright `.spec.ts` files (e.g., for CI):

```bash
npx usecase-runner generate usecases/ --outdir tests/generated/
npx playwright test tests/generated/
```

Or run a single case directly:

```bash
npx usecase-runner run usecases/accordion/accordion-expand.uc.yaml --headed
```

## Conventions

- **One scenario per file.** Each file covers exactly one discrete user
  interaction so failures are precise.
- **`locate` → `focus` → act.** Every interactive step is preceded by a `locate`
  and `focus` for the same element to verify the element is in the accessibility
  tree and can receive keyboard focus.
- **Prefer role tokens.** Use `button "Save"`, `field "Email"`, `tab "Settings"`
  etc., not CSS selectors. Fall back to `id`/`data-*` only when the element
  legitimately lacks an accessible role or name.
- **Reuse story state.** Pick the Storybook story that already renders the
  starting state for each scenario (e.g., `FirstOpen` for the accordion-collapse
  case) instead of building up state through preliminary steps.
