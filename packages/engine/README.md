# @contrast-lens/engine

DOM rules for detecting high-contrast accessibility issues, used by the Contrast Lens Storybook addon and Jest integration.

```bash
pnpm add @contrast-lens/engine
```

The package uses ES modules and needs a browser DOM, or a DOM environment such as jsdom. It checks rendered elements and their styles; it does not launch a browser.

```ts
import { runAllRules, runRules, buttonNoBorderRule } from '@contrast-lens/engine';

const findings = runAllRules(document.body);
const buttonFindings = runRules(document.body, [buttonNoBorderRule]);
```

Each finding includes `ruleId`, `severity` (`error` or `warning`), `message`, `element`, and an optional `hint`. The `button-no-border` rule checks native and custom buttons for visible borders and border-removing interaction styles.

Rules scan descendants of the supplied root. Run checks after rendering and applying styles. Stylesheets blocked by browser access restrictions require manual review and can produce warnings.

See the [rule documentation](https://github.com/aubquinn/contrast-lens/blob/main/packages/engine/src/rules/buttonNoBorderRule.md) for details, or use [the Storybook addon](https://github.com/aubquinn/contrast-lens/tree/main/packages/storybook-addon) and [Jest integration](https://github.com/aubquinn/contrast-lens/tree/main/packages/jest).

Licensed under the MIT license; see [LICENSE](./LICENSE).
