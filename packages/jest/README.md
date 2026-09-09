# @contrast-lens/jest

Jest integration for Contrast Lens high-contrast rules.

## Usage

Install the package with Jest and a jsdom environment:

```bash
pnpm add --save-dev @contrast-lens/jest jest jest-environment-jsdom
```

Register the matcher in a Jest setup file:

```ts
// jest.setup.ts
import "@contrast-lens/jest/extend-expect";
```

```ts
// jest.config.ts
export default {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
```

Scan a rendered DOM root and assert that it has no findings:

```ts
import { contrastLens } from "@contrast-lens/jest";

const { container } = render(<Button />);
expect(contrastLens(container)).toHaveNoViolations();
```

Warnings and errors are included by default. To only fail on errors:

```ts
expect(contrastLens(container, { includeWarnings: false })).toHaveNoViolations();
```

The matcher reports the rule ID, severity, message, hint, and element markup for each finding.
