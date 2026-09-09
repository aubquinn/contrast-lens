import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { themeFixture } from './theme.fixture.js';

const { register, add } = vi.hoisted(() => ({
    register: vi.fn((_id: string, callback: () => void) => callback()),
    add: vi.fn(),
}));

vi.mock('storybook/manager-api', () => ({
    addons: { register, add },
    types: { PANEL: 'panel' },
}));

vi.mock('storybook/theming', () => ({
    useTheme: () => themeFixture,
}));

vi.mock('storybook/internal/components', () => ({
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

describe('manager', () => {
    it('registers the Contrast Lens panel with the storybook manager', async () => {
        // The dynamic import below cold-loads the whole component tree (Chakra, engine, etc.),
        // which comfortably exceeds vitest's 5s default test timeout on a cold cache.
        await import('./manager.js');

        expect(register).toHaveBeenCalledWith('contrast-lens-addon', expect.any(Function));
        expect(add).toHaveBeenCalledWith(
            'contrast-lens/panel',
            expect.objectContaining({
                type: 'panel',
                title: 'Contrast Lens',
            }),
        );
    }, 15000);
});
