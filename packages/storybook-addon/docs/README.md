# Local testing for @contrast-lens/storybook-addon

This package is tested locally through the `packages/test-storybook` app.

## Local test flow

1. From the repository root, install dependencies:

    ```bash
    pnpm install
    ```

2. Build the Storybook addon package:

    ```bash
    pnpm --filter @contrast-lens/storybook-addon build
    ```

3. Start the local Storybook app:

    ```bash
    pnpm --filter test-storybook storybook
    ```

4. Open the app in your browser:
    ```text
    http://localhost:6006
    ```

## Notes

- React and React DOM are development dependencies only. Storybook supplies the manager's React runtime; the addon keeps React itself and React DOM external, following the [Storybook addon guidance](https://storybook.js.org/docs/addons/addon-migration-guide).
- The manager bundle includes its UI dependencies and React 18 JSX helpers. Storybook 10 does not supply `react/jsx-runtime` as a manager global, so leaving that import external would let a React 19 consumer substitute incompatible JSX helpers. The consumer's story components can still use their own React version.
- `packages/test-storybook` depends on `@contrast-lens/storybook-addon` using a local file reference, so the addon must be built before Storybook loads it.
- After editing `packages/storybook-addon/src/index.tsx`, rebuild the addon and refresh Storybook.
- For faster iteration, you can add a watch script to `packages/storybook-addon/package.json` and run `tsc -b --watch` while working.
