# Automatic releases and package previews

## Stable npm releases

Add a changeset for package changes:

```sh
pnpm exec changeset
```

Select the affected packages and patch, minor, or major. Commit the generated `.changeset/*.md` with the implementation. When the change reaches `main`, CI runs first. After CI succeeds, `release.yml`:

1. Confirms that the tested commit is still the latest `main` commit.
2. Reads Changesets' release plan. Documentation-only changes and empty changesets do not publish.
3. Applies version bumps and changelogs, consumes changesets, and updates the lockfile.
4. Builds and tests the versioned packages, including real tarball consumers.
5. Commits version updates to `main` before publishing, using a normal push. Concurrent edits cause that push to fail rather than overwrite newer work.
6. Publishes through npm trusted publishing, then pushes package tags and creates GitHub releases with `changesets/action/publish@v2`.

The version commit uses `[skip ci]`, and the Actions token does not trigger another push workflow. Releases are serialized and an active publish is never cancelled by a newer push.

The workflow needs permission to commit version metadata to `main`. If branch protection later forbids that, adapt the policy or return to release PRs instead of granting broad bypass permissions.

## One-time npm owner setup

No npm token is configured in this repository. Configure a trusted publisher for **each** package on npm:

- [@iran-utils/iranian-banks-icons-core](https://www.npmjs.com/package/@iran-utils/iranian-banks-icons-core)
- [@iran-utils/iranian-banks-react-icons](https://www.npmjs.com/package/@iran-utils/iranian-banks-react-icons)
- [@iran-utils/iranian-banks-vue-icons](https://www.npmjs.com/package/@iran-utils/iranian-banks-vue-icons)

Open package Settings → Trusted Publisher, select GitHub Actions, and use:

| Field | Value |
| --- | --- |
| Organization/user | `houtanrocky` |
| Repository | `iranian-banks-react-icons` |
| Workflow filename | `release.yml` |
| Environment | `npm` |
| Allowed operation | Enable direct `npm publish` |

The workflow uses a GitHub-hosted runner, Node 24, npm 12.2.1, and `id-token: write`. pnpm packs workspace dependencies before invoking npm to publish. No `NPM_TOKEN` or `NODE_AUTH_TOKEN` secret is needed. Trusted publishing supplies provenance for these public packages.

After configuring all three packages, enable the repository variable:

```sh
gh variable set NPM_PUBLISH_ENABLED --repo houtanrocky/iranian-banks-react-icons --body true
```

Until that variable equals `true`, stable publication is skipped. The `npm` environment is restricted to `main` and does not require manual approval.

The previous release PR, #5 (`changeset-release/main`), belongs to the old release-PR policy. Merge the workflow migration first, then close that obsolete PR. The new workflow will consume the original changeset and version the packages itself; do not merge both versioning paths.

## Recovering a failed publish

If version updates reached `main` but npm publication failed, fix the npm publisher configuration, then run **Release** manually from `main` with **resume_publish** enabled. This republishes only committed versions missing from npm and avoids a second bump. Normal pushes with no changesets continue to skip publication. If the previous run succeeded for only some packages, Changesets detects those versions on npm and resumes the remaining packages.

If there are still unconsumed changesets, use a normal run instead; recovery mode rejects that combination. For an older CI run skipped because a newer `main` commit exists, let the latest commit finish CI.

## Commit previews with pkg.pr.new

1. [Install the pkg.pr.new GitHub App](https://github.com/apps/pkg-pr-new/installations/new) and select only this repository. Installing a GitHub App requires the repository owner's interactive authorization; the current CLI credentials cannot perform that installation.
2. Enable the optional preview job:

```sh
gh variable set PKG_PR_NEW_ENABLED --repo houtanrocky/iranian-banks-react-icons --body true
```

After every successful CI run on a PR or `main`, the **Package previews** job publishes all three packages together. It uses the exact locked CLI version, pnpm packing, repository-qualified commit URLs, and distinct `0.0.0-preview-<sha>` versions. React and Vue dependencies point at the same core preview. React/Vue framework peers keep their normal version ranges.

Find install commands in the Actions job summary or download the `package-preview-links` artifact. PR comments and generated StackBlitz templates are disabled. To return to stable, install the package by its npm name and update the consumer lockfile.

The preview service distributes publicly accessible packages under its URLs; it does not publish new npm versions or replace the stable release workflow. Long URLs avoid dependence on the old repository username still present in previously published npm metadata.

## Verification

`pnpm test:unit` includes release policy guards, an actual Changesets versioning fixture, and a local HTTP fixture that runs the pinned preview CLI and inspects all three uploaded tarballs. It checks preview dependency linking, separate versions, one upload, and manifest restoration. Those checks do not publish to npm or pkg.pr.new.

Live publication still requires the owner's npm trusted-publisher setup and GitHub App installation. Public metadata and an unauthenticated `npm whoami` cannot verify an OIDC publisher. Confirm authorization through the first real publish after enabling the appropriate variable.

References: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), [Changesets publish action](https://github.com/changesets/action/tree/main/publish), [pkg.pr.new setup and flags](https://github.com/stackblitz-labs/pkg.pr.new#setup).
