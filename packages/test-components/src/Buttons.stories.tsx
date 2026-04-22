import type { Meta, StoryObj } from '@storybook/react';
import { GoodButton, BadButtonNoBorder, BadCustomButton, GoodInputButton, BadInputButtonNoBorder, DefaultBrowserButton, GoodButtonWithShadow, BadButtonWithShadow, BadButtonDotted, BadButtonDashed, BadButtonDouble, BadButtonGroove, BadButtonRidge, BadButtonInset, BadButtonOutset, BadButtonHidden } from './index';

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

export const DefaultBrowserButtonStory: Story = {
  render: () => <DefaultBrowserButton onClick={() => alert('Default browser button!')}>Default Browser Button</DefaultBrowserButton>,
};

export const GoodButtonWithShadowStory: Story = {
  render: () => <GoodButtonWithShadow onClick={() => alert('Good button with shadow!')}>Good Button with Shadow</GoodButtonWithShadow>,
};

export const BadButtonNoBorderStory: Story = {
  render: () => <BadButtonNoBorder onClick={() => alert('Bad button!')}>Bad Button (No Border)</BadButtonNoBorder>,
};

export const BadButtonWithShadowStory: Story = {
  render: () => <BadButtonWithShadow onClick={() => alert('Bad button with shadow!')}>Bad Button with Shadow</BadButtonWithShadow>,
};

export const BadButtonDottedStory: Story = {
  render: () => <BadButtonDotted onClick={() => alert('Bad button dotted!')}>Bad Button Dotted</BadButtonDotted>,
};

export const BadButtonDashedStory: Story = {
  render: () => <BadButtonDashed onClick={() => alert('Bad button dashed!')}>Bad Button Dashed</BadButtonDashed>,
};

export const BadButtonDoubleStory: Story = {
  render: () => <BadButtonDouble onClick={() => alert('Bad button double!')}>Bad Button Double</BadButtonDouble>,
};

export const BadButtonGrooveStory: Story = {
  render: () => <BadButtonGroove onClick={() => alert('Bad button groove!')}>Bad Button Groove</BadButtonGroove>,
};

export const BadButtonRidgeStory: Story = {
  render: () => <BadButtonRidge onClick={() => alert('Bad button ridge!')}>Bad Button Ridge</BadButtonRidge>,
};

export const BadButtonInsetStory: Story = {
  render: () => <BadButtonInset onClick={() => alert('Bad button inset!')}>Bad Button Inset</BadButtonInset>,
};

export const BadButtonOutsetStory: Story = {
  render: () => <BadButtonOutset onClick={() => alert('Bad button outset!')}>Bad Button Outset</BadButtonOutset>,
};

export const BadButtonHiddenStory: Story = {
  render: () => <BadButtonHidden onClick={() => alert('Bad button hidden!')}>Bad Button Hidden</BadButtonHidden>,
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
