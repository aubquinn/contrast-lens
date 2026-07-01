import { dirname, join } from "path";
import path from "path";

export const framework = {
  name: getAbsolutePath("@storybook/react-vite"),
  options: {}
};

export const docs = {
  autodocs: true
};

export const stories = [
  join(__dirname, '..', '..', 'test-components', 'src', '**', '*.stories.@(js|jsx|ts|tsx|mdx)')
];

export const viteFinal = async (config: any) => {
  return {
    ...config,
    resolve: {
      ...(config?.resolve || {}),
      alias: {
        ...(config?.resolve?.alias || {}),
        "@contrast-lens/engine": path.resolve(__dirname, '..', '..', 'engine', 'src'),
        "@contrast-lens/storybook-addon": path.resolve(__dirname, '..', '..', 'storybook-addon', 'src'),
        "@contrast-lens/test-components": path.resolve(__dirname, '..', '..', 'test-components', 'src'),
      },
    },
  };
};

export const managerViteFinal = async (config: any) => {
  return {
    ...config,
    resolve: {
      ...(config?.resolve || {}),
      alias: {
        ...(config?.resolve?.alias || {}),
        "@contrast-lens/engine": path.resolve(__dirname, '..', '..', 'engine', 'src'),
        "@contrast-lens/storybook-addon": path.resolve(__dirname, '..', '..', 'storybook-addon', 'src'),
        "@contrast-lens/test-components": path.resolve(__dirname, '..', '..', 'test-components', 'src'),
      },
    },
  };
};

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
export const addons = [
  "@chromatic-com/storybook",
  // Load manager entry from addon source for panel registration
  join(__dirname, '..', '..', 'storybook-addon', 'src', 'manager.ts'),
];
