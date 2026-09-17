import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    GoodLink,
    GoodLinkCustomColor,
    GoodLinkForcedColorsSystemColor,
    LinkWithoutHref,
    BadLinkForcedColorAdjustNone,
    BadLinkForcedColorAdjustNoneScoped,
    BadLinkInheritsForcedColorAdjustNone,
} from './index.js';

const meta: Meta<typeof GoodLink> = {
    title: 'Test Components/Links',
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const GoodLinkStory: Story = {
    name: 'Pass: Plain link',
    render: () => <GoodLink />,
};

export const GoodLinkCustomColorStory: Story = {
    name: 'Pass: Custom normal-mode color',
    render: () => <GoodLinkCustomColor />,
};

export const GoodLinkForcedColorsSystemColorStory: Story = {
    name: 'Pass: System color in forced-colors media query',
    render: () => <GoodLinkForcedColorsSystemColor />,
};

export const LinkWithoutHrefStory: Story = {
    name: 'Out of scope: Anchor without href',
    render: () => <LinkWithoutHref />,
};

export const BadLinkForcedColorAdjustNoneStory: Story = {
    name: 'Error: forced-color-adjust: none',
    render: () => <BadLinkForcedColorAdjustNone />,
};

export const BadLinkForcedColorAdjustNoneScopedStory: Story = {
    name: 'Error: forced-color-adjust: none in forced-colors media query',
    render: () => <BadLinkForcedColorAdjustNoneScoped />,
};

export const BadLinkInheritsForcedColorAdjustNoneStory: Story = {
    name: 'Error: Inherits forced-color-adjust: none from an ancestor',
    render: () => <BadLinkInheritsForcedColorAdjustNone />,
};
