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

// Debug output for resolved stories glob
console.log('STORYBOOK: stories glob ->', stories);

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
export const addons = [
  "@chromatic-com/storybook",
  // Load local addon source so the manager executes the module during dev
  join(__dirname, '..', '..', 'storybook-addon', 'src', 'index.tsx'),
];
