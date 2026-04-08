import type { Meta, StoryObj } from '@storybook/react';
import { TestComponents } from './TestComponents';

const meta: Meta<typeof TestComponents> = {
  title: 'Contrast Lens/Test Components',
  component: TestComponents,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <TestComponents />,
};
