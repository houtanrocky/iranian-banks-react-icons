# Contributing

Thanks for helping maintain Iranian Banks Icons. Open an issue for bugs, missing artwork, or improvements to React, Vue, core data, and documentation.

## Local setup

Use Node.js 22.12+ and pnpm 10.13.1 (the root `packageManager` field pins the version).

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm docs:dev
```

## Adding or correcting an icon

1. Put the source artwork in `raw/provider-name.svg` and `raw/provider-name-color.svg` when both variants exist. Use a valid viewBox and self-contained vector paths. Do not add scripts, event attributes, external references, embedded images, or third-party fonts.
2. Preserve existing filenames and exported names. Some historical filenames contain spaces or a trailing hyphen; renaming them can break imports. New files should use lowercase names separated by hyphens.
3. Add the provider and variants to `apps/docs/src/icons.ts`, and add a Persian search alias to `apps/docs/src/search.ts`.
4. Run `pnpm build`. The shared generator updates all three packages and declarations. Do not edit generated `index.d.ts` files directly.
5. Update `tests/fixtures/exports.json` only when intentionally adding a public export. The fixture protects existing import names.
6. Run `pnpm test:all`. Review the generated image audit and look at color and mono artwork at small and large sizes. New artwork must pass rendering checks at 96 and 256 pixels.
7. Add a changeset (`pnpm exec changeset`) for package behavior or artwork changes. Update all affected packages; docs-only changes do not need a package release.

After CI passes on `main`, the release workflow consumes changesets, commits version/changelog updates, and publishes to npm when trusted publishing is enabled. Do not manually bump package versions. Optional commit previews and the owner setup are documented in [the release guide](reports/releases.md).

## Verification

- `pnpm test:unit`: exports, generators, DOM events/refs, React/Vue SSR, catalog and search.
- `pnpm test:types`: consumer SVG props and refs, with library checks enabled.
- `pnpm test:images`: all SVGs rendered against their original source; writes `reports/image-optimization.md`.
- `pnpm test:packages`: packs and installs all packages in an isolated consumer, checks ESM/CJS, declarations, SSR, licenses, and bundle size.
- `pnpm docs:build && pnpm test:e2e`: prerendering, search/filter controls, copying, responsive layout, and axe accessibility checks. Install Chromium with `pnpm exec playwright install chromium` first.

For consumer compatibility, set `TEST_REACT_MAJOR` to `16`, `17`, `18`, or `19` before `pnpm test:packages`. Set `TEST_VUE_VERSION` to `3.0.0` to check the minimum supported Vue runtime. These are environment variables; use your shell's syntax.

React and Vue type consumers compile separately so older versions' global JSX declarations cannot conflict. Current Vue is checked with `skipLibCheck: false`; Vue 3.0's upstream declarations predate TypeScript 5, so the minimum-version fixture checks consumer usage with `skipLibCheck` enabled while still checking all exports and SSR behavior.

Keep fixes focused, explain any public behavior change, and include the checks you ran in the pull request. Never submit npm tokens, credentials, generated dependency folders, or local editor settings.

The code is MIT licensed. Contributors must have permission to redistribute submitted artwork. Brand marks remain the property of their owners.
