import type { Meta, StoryObj } from '@storybook/react';
import { GoodButton, BadButtonNoBorder, BadCustomButton, GoodInputButton, BadInputButtonNoBorder } from './index';

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

export const GoodInputButtonStory: Story = {
  render: () => <GoodInputButton value="Good Input Button" onClick={() => alert('Good input button!')} />,
};

export const BadInputButtonNoBorderStory: Story = {
  render: () => <BadInputButtonNoBorder value="Bad Input Button (No Border)" onClick={() => alert('Bad input button!')} />,
};
