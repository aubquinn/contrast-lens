# Releases

Run `pnpm changeset` when changing a published package. Select the affected packages, choose a version bump, and describe the user-facing change. Commit the generated Markdown file with the implementation.

The release workflow collects changesets into a release PR. Merging that PR publishes the new package versions after validation. Private workspace packages are excluded.

See [the release guide](../RELEASING.md) for setup and archive validation.
