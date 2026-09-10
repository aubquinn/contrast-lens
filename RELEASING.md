# Releasing packages

Changesets manages independent versions and changelogs for `@contrast-lens/engine`, `@contrast-lens/jest`, and `@contrast-lens/storybook-addon`. The unfinished browser extension and test applications are private and cannot be published by this workflow.

## Adding a release note

Run `pnpm changeset`, select the affected public packages and version bump, and describe the change for consumers. Commit the generated `.changeset/*.md` file alongside the implementation. Changesets updates dependent packages when their internal dependency ranges need to change.

On pushes to `main`, `.github/workflows/release.yml` creates or updates a release PR containing versions, changelogs, and the pnpm lockfile. Review and merge that PR to publish. The publish job reruns the repository checks and installs packed archives in a separate consumer before publishing the unpublished versions and creating package tags and GitHub releases. A failed release can be retried through **Actions → Release → Run workflow** on `main`; already published versions are skipped.

The initial changeset proposes `0.1.0` for the three public packages. Versions remain `0.0.0` until the release PR is created and merged.

## One-time registry and repository setup

1. Enable **Settings → Actions → General → Allow GitHub Actions to create and approve pull requests** in `aubquinn/contrast-lens`.
2. Ensure the npm account has permission to publish public packages under `@contrast-lens`. For new package names, create their first release with an authorized npm account before configuring their trusted publishers. Bootstrap from the merged release commit with reviewed versions (initially `0.1.0`). Use `pnpm test:packages` first, then publish the reviewed archives it produces with `npm publish <archive.tgz> --access public`, starting with the engine. This is a manual bootstrap step, not part of local validation.
3. In each npm package's settings, configure a GitHub Actions trusted publisher with owner `aubquinn`, repository `contrast-lens`, and workflow filename `release.yml`. Leave the environment unset, and enable the allowed action for direct `npm publish`.

The workflow uses OIDC with `id-token: write` and does not require an `NPM_TOKEN`. See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) for registry setup. Release PR creation uses the workflow's GitHub token. Depending on repository policy, PRs created by that token may need a maintainer push or close/reopen to trigger required PR checks; the publish job runs its own checks again after merge.

## Validating package contents

```bash
pnpm install
pnpm --filter test-storybook exec playwright install chromium
pnpm test:packages
```

This command packs each public package through pnpm, checks metadata, license and README inclusion, all exported paths, source maps, and the absence of build caches, tests, and obsolete build output. It then installs the archives into a temporary project outside the workspace and checks TypeScript declarations, the engine and Jest matcher APIs, and the addon in a built Storybook using Chromium. CI runs this same command. The temporary directory is printed and retained for inspection.

Every public package's `prepack` hook clears its own `dist`, copies the root MIT license, and rebuilds. The `files` allowlist includes JavaScript, declarations, self-contained JavaScript source maps, README, license, changelog, and the addon's preset. Incremental caches and declaration maps are omitted. Use **pnpm** to pack the workspace so `workspace:` and `catalog:` references become registry versions:

```bash
pnpm --dir packages/engine pack --out ../../engine.tgz
```

`pnpm release:version` previews the release PR's versioning operation locally and changes manifests, changelogs, changesets, and the lockfile. `pnpm release` validates archives and publishes; run it only when intentionally releasing reviewed versions.
