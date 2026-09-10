# @contrast-lens/storybook-addon

Inspect Contrast Lens high-contrast accessibility findings in Storybook's **Contrast Lens** panel.

Requires Storybook 10.5.8 or a compatible later 10.x release.

```bash
pnpm add --save-dev @contrast-lens/storybook-addon
```

Register the preset in your Storybook configuration:

```ts
export default {
    addons: ['@contrast-lens/storybook-addon/preset.js'],
};
```

Open a rendered story and select the Contrast Lens panel. It inspects the story DOM for button border issues and shows errors and warnings with guidance for fixing them.

Storybook supplies the manager's React and React DOM runtimes. Your story components can use their own React version. This addon complements other accessibility checks; it does not replace manual testing in forced-colors mode.

See the [engine rule documentation](https://github.com/aubquinn/contrast-lens/blob/main/packages/engine/src/rules/buttonNoBorderRule.md) and [contributing guide](https://github.com/aubquinn/contrast-lens/blob/main/CONTRIBUTING.md).

Licensed under the MIT license; see [LICENSE](./LICENSE).
