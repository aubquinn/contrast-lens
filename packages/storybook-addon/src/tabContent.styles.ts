import type { useTheme } from 'storybook/theming';

type StorybookTheme = ReturnType<typeof useTheme>;

export const createTabContentStyles = (theme: StorybookTheme) => {
    const activeColor = theme.color.secondary;
    const inactiveColor = theme.textMutedColor;

    return {
        root: {
            width: '100%',
            height: '100%',
            background: theme.background.content,
            color: theme.color.defaultText,
            fontFamily: theme.typography.fonts.base,
        },

        list: {
            width: '100%',
            minHeight: '40px',
            paddingX: '2px',
            gap: '0',
            alignItems: 'stretch',
            borderBottom: '1px solid',
            borderColor: theme.appBorderColor,
        },

        trigger: {
            position: 'relative',
            minHeight: '40px',
            paddingX: '16px',
            gap: '6px',
            border: '0',
            borderRadius: '0',
            background: 'transparent',
            color: inactiveColor,
            fontFamily: 'inherit',
            fontSize: '13px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            cursor: 'pointer',

            _hover: {
                color: theme.color.defaultText,
                background: 'transparent',
            },

            _selected: {
                color: activeColor,

                _after: {
                    content: '""',
                    position: 'absolute',
                    right: '0',
                    bottom: '-1px',
                    left: '0',
                    height: '2px',
                    background: activeColor,
                },
            },

            _focusVisible: {
                outline: `2px solid ${activeColor}`,
                outlineOffset: '-2px',
            },
        },

        content: {
            padding: '0',
        },
    } as const;
};
