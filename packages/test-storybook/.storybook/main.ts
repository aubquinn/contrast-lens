import { dirname, join } from "path";

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

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
export const addons = [
  "@chromatic-com/storybook",
  // Load manager entry from addon source for panel registration
  join(__dirname, '..', '..', 'storybook-addon', 'src', 'manager.ts'),
];
