import type { Meta, StoryObj } from '@storybook/react';
import { GoodButton, BadButtonNoBorder, BadCustomButton } from '@contrast-lens/test-components';

const meta: Meta<typeof GoodButton> = {
  title: 'Contrast Lens/Buttons',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const GoodButtonStory: Story = {
  render: () => <GoodButton onClick={() => alert('Good button!')}>Good Button</GoodButton>,
};

export const BadButtonNoBorderStory: Story = {
  render: () => <BadButtonNoBorder onClick={() => alert('Bad button!')}>Bad Button (No Border)</BadButtonNoBorder>,
};

export const BadCustomButtonStory: Story = {
  render: () => <BadCustomButton onClick={() => alert('Bad custom button!')}>Bad Custom Button</BadCustomButton>,
};

export const ThinBorderWarningStory: Story = {
  name: 'Warning: Border under 2px',
  render: () => (
    <button
      style={{
        padding: '8px 16px',
        border: '1px solid pink',
        background: '#fff',
        color: '#000',
      }}
    >
      Button with a 1px border
    </button>
  ),
};
