# Local testing for @contrast-lens/storybook-addon

This package is tested locally through the `packages/test-storybook` app.

## Local test flow

1. From the repository root, install dependencies:
   ```bash
   npm install
   ```

2. Build the Storybook addon package:
   ```bash
   npm --prefix packages/storybook-addon run build
   ```

3. Start the local Storybook app:
   ```bash
   npm --prefix packages/test-storybook run storybook
   ```

4. Open the app in your browser:
   ```text
   http://localhost:6006
   ```

## Notes

- `packages/test-storybook` depends on `@contrast-lens/storybook-addon` using a local file reference, so the addon must be built before Storybook loads it.
- After editing `packages/storybook-addon/src/index.tsx`, rebuild the addon and refresh Storybook.
- For faster iteration, you can add a watch script to `packages/storybook-addon/package.json` and run `tsc -b --watch` while working.
