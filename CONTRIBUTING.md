# Contributing to Contrast Lens

Thanks for contributing to Contrast Lens. This repository is a pnpm workspace containing the rules engine, browser extension, Storybook addon, and the components and stories used to test them.

## Prerequisites

Install the following before you begin:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download) 24.20.0
- [pnpm](https://pnpm.io/installation) 11.20.0

The pnpm version is pinned in the root `package.json`. If Corepack is available with your Node.js installation, you can enable and install the correct version with:

```bash
corepack enable
corepack install
```

Alternatively, install the pinned version directly:

```bash
npm install --global pnpm@11.20.0
```

Verify your installation:

```bash
node --version
pnpm --version
```

> [!IMPORTANT]
> Use pnpm from the repository root. Do not use `npm install` or `npm ci`: this project uses pnpm workspace dependency protocols such as `workspace:*` and `catalog:`.

## Getting started

1. Fork the repository and clone your fork:

    ```bash
    git clone https://github.com/<your-username>/contrast-lens.git
    cd contrast-lens
    ```

2. Install all workspace dependencies:

    ```bash
    pnpm install
    ```

3. Build the packages:

    ```bash
    pnpm build
    ```

4. Run the automated checks:

    ```bash
    pnpm test
    pnpm typecheck
    pnpm lint
    ```

## Developing with Storybook

The test Storybook is the easiest way to develop and manually verify the addon and accessibility rules:

```bash
pnpm storybook
```

This command:

1. Builds the Storybook addon.
2. Watches the addon for changes.
3. Starts the test Storybook at [http://localhost:6006](http://localhost:6006).

Changes to the addon and stories should be reflected while the command is running. If Storybook displays an older addon build, stop the process, run `pnpm storybook` again, and refresh the browser.

Test and demonstration stories live in `packages/test-storybook`. Reusable fixtures live in `packages/test-components`.

## Repository structure

| Path                         | Purpose                                                        |
| ---------------------------- | -------------------------------------------------------------- |
| `packages/engine`            | Accessibility rules, shared types, rule runner, and unit tests |
| `packages/browser-extension` | Chrome extension that runs Contrast Lens against a page        |
| `packages/storybook-addon`   | Storybook panel and preview integration                        |
| `packages/test-components`   | Reusable React components for accessible and failing examples  |
| `packages/test-storybook`    | Stories used to demonstrate and manually test the addon        |
| `.storybook`                 | Shared configuration for the test Storybook                    |
| `scripts`                    | Repository development scripts                                 |

## Common commands

Run these commands from the repository root:

| Command                 | Purpose                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `pnpm install`          | Install dependencies for every workspace package           |
| `pnpm build`            | Build the engine, extension, addon, and test components    |
| `pnpm test`             | Run the engine unit tests with coverage                    |
| `pnpm typecheck`        | Type-check the main workspace packages                     |
| `pnpm lint`             | Check JavaScript and TypeScript files with ESLint          |
| `pnpm lint:fix`         | Apply safe ESLint fixes                                    |
| `pnpm format`           | Format supported files with Prettier                       |
| `pnpm storybook`        | Build and watch the addon while running the test Storybook |
| `pnpm build-storybook`  | Produce a static Storybook build                           |
| `pnpm storybook:doctor` | Diagnose Storybook configuration and dependency issues     |

You can run a script for one package with pnpm's filter option. For example:

```bash
pnpm --filter @contrast-lens/engine test
pnpm --filter @contrast-lens/storybook-addon build
```

## Working on accessibility rules

Rules and their supporting documentation live in `packages/engine/src/rules`. When adding or changing a rule:

1. Add or update the rule implementation and its helpers.
2. Add unit tests for passing, warning, and failing cases, including relevant interaction states.
3. Export a new rule from `packages/engine/src/rules/index.ts` and add it to the collection of rules that run by default.
4. Update the rule's Markdown documentation with the reason for the check and recommended fixes.
5. Add representative stories to `packages/test-storybook` so the result can be inspected in the addon.

Run the engine tests while iterating:

```bash
pnpm --filter @contrast-lens/engine test
```

## Testing the browser extension

Build the repository, then load the extension locally in Chrome:

```bash
pnpm build
```

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose `packages/browser-extension/dist`.

Rebuild and reload the unpacked extension after making changes.

## Submitting a change

Create a focused branch from `main`, make your changes, and include tests and documentation where appropriate. Before opening a pull request, run:

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

In the pull request, describe what changed, why it changed, and how you tested it. Include screenshots or a short recording for visible Storybook addon or browser-extension changes.

Please keep unrelated changes out of the same pull request and do not commit generated directories such as `node_modules`, `dist`, or `coverage`.
