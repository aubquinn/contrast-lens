import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TestComponents } from './TestComponents.js';

const meta: Meta<typeof TestComponents> = {
    title: 'Test Components',
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
