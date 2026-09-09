import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
    GoodButton,
    DefaultBrowserButton,
    GoodButtonWithShadow,
    BadButtonWithShadow,
    BadButtonDotted,
    BadButtonDashed,
    BadButtonDouble,
    BadButtonGroove,
    BadButtonRidge,
    BadButtonInset,
    BadButtonOutset,
    BadButtonHidden,
    BadButtonNoBorder,
    BadCustomButton,
    GoodInputButton,
    BadInputButtonNoBorder,
    GoodButtonInteractionStates,
    BadButtonHoverNoBorder,
    BadButtonActiveNoBorder,
    BadButtonFocusNoBorder,
    BadButtonFocusVisibleNoBorder,
    BadButtonDisabledNoBorder,
    BadButtonAriaDisabledNoBorder,
} from './index.js';

describe('button fixtures', () => {
    it.each([
        ['GoodButton', GoodButton, 'solid'],
        ['BadButtonWithShadow', BadButtonWithShadow, 'none'],
        ['BadButtonDotted', BadButtonDotted, 'dotted'],
        ['BadButtonDashed', BadButtonDashed, 'dashed'],
        ['BadButtonDouble', BadButtonDouble, 'double'],
        ['BadButtonGroove', BadButtonGroove, 'groove'],
        ['BadButtonRidge', BadButtonRidge, 'ridge'],
        ['BadButtonInset', BadButtonInset, 'inset'],
        ['BadButtonOutset', BadButtonOutset, 'outset'],
        ['BadButtonHidden', BadButtonHidden, 'hidden'],
        ['BadButtonNoBorder', BadButtonNoBorder, 'none'],
    ] as const)('renders %s with the expected border style', (name, Component, expectedBorderStyle) => {
        render(<Component>{name}</Component>);

        expect(screen.getByRole('button', { name }).style.borderStyle).toBe(expectedBorderStyle);
    });

    it('renders the default browser button with no inline border override', () => {
        render(<DefaultBrowserButton>Default</DefaultBrowserButton>);

        expect(screen.getByRole('button', { name: 'Default' }).style.borderStyle).toBe('');
    });

    it('renders the good shadow button using a box-shadow outline instead of a border', () => {
        render(<GoodButtonWithShadow>Shadow</GoodButtonWithShadow>);

        const button = screen.getByRole('button', { name: 'Shadow' });

        expect(button.style.borderStyle).toBe('');
        expect(button.style.boxShadow).toContain('2px');
    });

    it('renders the custom div-based button with role="button"', () => {
        render(<BadCustomButton>Custom</BadCustomButton>);

        expect(screen.getByRole('button', { name: 'Custom' }).tagName).toBe('DIV');
    });

    it('renders good and bad input buttons', () => {
        render(
            <>
                <GoodInputButton value="Good input" />
                <BadInputButtonNoBorder value="Bad input" />
            </>,
        );

        expect(screen.getByRole('button', { name: 'Good input' }).style.borderStyle).toBe('solid');
        expect(screen.getByRole('button', { name: 'Bad input' }).style.borderStyle).toBe('none');
    });

    it('renders every interaction-state fixture, covering both the disabled and aria-disabled branches', () => {
        render(
            <>
                <GoodButtonInteractionStates />
                <BadButtonHoverNoBorder />
                <BadButtonActiveNoBorder />
                <BadButtonFocusNoBorder />
                <BadButtonFocusVisibleNoBorder />
                <BadButtonDisabledNoBorder />
                <BadButtonAriaDisabledNoBorder />
            </>,
        );

        expect(screen.getByText('Safe interaction states')).toBeEnabled();
        expect(screen.getByText('Border removed when disabled')).toBeDisabled();
        expect(screen.getByText('Border removed when aria-disabled')).toHaveAttribute('aria-disabled', 'true');
    });
});
