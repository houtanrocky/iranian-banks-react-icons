# Repository Guidelines

## Project Structure & Module Organization

This pnpm monorepo contains three packages: `packages/core/` exports SVG data, while `packages/react/` and `packages/vue/` provide framework components. Original artwork lives in `raw/`; `scripts/lib/` contains shared validation and generation logic. The React/Vite showcase is in `apps/docs/`. Tests live in `tests/`, including `types/`, `fixtures/`, and `e2e/`. Optimization and publishing notes are in `reports/`.

Treat `optimized/`, package `dist/` directories, and package `index.d.ts` files as generated output. Update generators instead of editing these files directly.

## Build, Test, and Development Commands

Use Node.js 22.12+ and pnpm 10.13.1.

- `pnpm install --frozen-lockfile`: install workspace dependencies reproducibly.
- `pnpm build`: optimize SVGs, then build core, React, and Vue in order.
- `pnpm docs:dev`: run the showcase locally after building packages.
- `pnpm test`: build and run unit, type, image, and installed-package checks.
- `pnpm docs:build`: generate the prerendered showcase.
- `pnpm exec playwright install chromium`: install the browser required for E2E tests.
- `pnpm test:all`: run package checks, build the showcase, and execute browser tests.

## Coding Style & Naming Conventions

Use two-space indentation, semicolons, single-quoted JavaScript/TypeScript strings, and LF endings. Build scripts use CommonJS; showcase code uses TypeScript and ES modules. Match surrounding formatting; no dedicated formatter or lint script is configured.

Name new SVGs `provider-name.svg` and `provider-name-color.svg`. Preserve historical filenames and public exports such as `MellatIcon` and `MellatColorIcon`. Update the showcase catalog and Persian search aliases when adding providers.

## Testing Guidelines

Use Node's test runner with `*.test.js`, Playwright with `*.spec.ts`, jsdom for component behavior, Sharp for rendering comparisons, and axe for accessibility. Cover changed behavior and preserve all existing exports. Update `tests/fixtures/exports.json` only for intentional API additions. Review artwork at 96 and 256 pixels and inspect `reports/image-optimization.md`; no numeric coverage percentage is prescribed.

## Commit & Pull Request Guidelines

History uses concise imperative subjects and occasional prefixes such as `chore:`. Explain the user-visible change, link relevant issues, list validation commands, and include screenshots for showcase or artwork changes. Follow `.github/pull_request_template.md`. Add a changeset with `pnpm exec changeset` for package behavior or artwork changes; documentation-only edits need none.

## Security & Configuration

Never commit tokens or credentials. Submit self-contained SVGs without scripts, event handlers, external references, or embedded images. See `CONTRIBUTING.md` and `reports/releases.md` for detailed contribution and release setup.
