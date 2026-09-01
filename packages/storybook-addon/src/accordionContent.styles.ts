import type { useTheme } from 'storybook/theming';

type StorybookTheme = ReturnType<typeof useTheme>;

export const createAccordionContentStyles = (theme: StorybookTheme) => {
    const activeColor = theme.color.secondary;

    return {
        item: {
            borderBottom: '1px solid',
            borderColor: theme.appBorderColor,
        },

        trigger: {
            width: '100%',
            minHeight: '42px',
            paddingX: '14px',
            paddingY: '0',
            justifyContent: 'flex-start',
            textAlign: 'left',
            color: theme.color.defaultText,
            fontSize: '13px',

            _hover: {
                background: theme.background.hoverable,
            },

            _focusVisible: {
                outline: `2px solid ${activeColor}`,
                outlineOffset: '-2px',
            },
        },

        triggerLabel: {
            flex: '1',
            width: '100%',
            minWidth: '0',
            gap: '8px',
            justifyContent: 'flex-start',
            alignItems: 'center',
            textAlign: 'left',
        },

        ruleTitle: {
            display: 'inline-flex',
            alignItems: 'center',
            flexShrink: 0,
            fontWeight: '700',
            lineHeight: '1',
        },

        ruleId: {
            display: 'inline-flex',
            alignItems: 'center',
            overflow: 'hidden',
            padding: '0',
            background: 'transparent',
            color: theme.textMutedColor,
            fontFamily: theme.typography.fonts.mono,
            fontSize: '12px',
            fontWeight: '400',
            lineHeight: '1',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },

        indicator: {
            marginLeft: 'auto',
            flexShrink: 0,
            color: theme.textMutedColor,
        },

        body: {
            padding: '0',
            color: theme.color.defaultText,
        },

        description: {
            paddingX: '14px',
            paddingY: '12px',
            borderTop: '1px solid',
            borderColor: theme.appBorderColor,
            color: theme.color.defaultText,
            fontSize: '13px',
            lineHeight: '1.5',
        },

        resultGrid: {
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            borderTop: '1px solid',
            borderColor: theme.appBorderColor,
        },

        elementColumn: {
            minWidth: '0',
            padding: '10px 14px',
            borderRight: '1px solid',
            borderColor: theme.appBorderColor,
        },

        elementList: {
            margin: '0',
            padding: '0',
            listStyle: 'none',
        },

        elementListItem: {
            display: 'grid',
            gridTemplateColumns: '20px minmax(0, 1fr)',
            alignItems: 'center',
            minWidth: '0',
            padding: '9px 10px',
            borderRadius: '4px',
            background: 'rgba(2, 156, 253, 0.18)',
        },

        elementNumber: {
            color: theme.textMutedColor,
            fontFamily: theme.typography.fonts.mono,
            fontSize: '11px',
        },

        elementPreview: {
            display: 'block',
            minWidth: '0',
            overflow: 'hidden',
            padding: '0',
            background: 'transparent',
            color: activeColor,
            fontFamily: theme.typography.fonts.mono,
            fontSize: '12px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },

        detailColumn: {
            minWidth: '0',
            padding: '12px 14px',
        },

        detailMessage: {
            marginBottom: '12px',
            color: theme.color.defaultText,
            fontSize: '13px',
            lineHeight: '1.5',
        },

        hintCode: {
            display: 'block',
            width: '100%',
            marginTop: '8px',
            overflowX: 'auto',
            padding: '10px 12px',
            border: '1px solid',
            borderColor: theme.appBorderColor,
            borderRadius: '4px',
            background: theme.background.app,
            color: theme.color.defaultText,
            fontFamily: theme.typography.fonts.mono,
            fontSize: '12px',
            lineHeight: '1.5',
            whiteSpace: 'pre',
        },

        actions: {
            marginBottom: '12px',
            gap: '8px',
            flexWrap: 'wrap',
        },

        actionButton: {
            height: '28px',
            minWidth: 'auto',
            paddingX: '10px',
            gap: '5px',
            border: '1px solid',
            borderColor: theme.appBorderColor,
            borderRadius: '4px',
            background: 'transparent',
            color: theme.color.defaultText,
            fontSize: '12px',
            fontWeight: '600',

            _hover: {
                background: theme.background.hoverable,
            },
        },

        actionIcon: {
            width: '14px',
            height: '14px',
            flexShrink: 0,
        },

        detailCode: {
            display: 'block',
            width: '100%',
            maxHeight: '220px',
            overflow: 'auto',
            padding: '12px',
            border: '1px solid',
            borderColor: theme.appBorderColor,
            borderRadius: '4px',
            background: theme.background.app,
            color: theme.color.defaultText,
            fontFamily: theme.typography.fonts.mono,
            fontSize: '12px',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
        },
    } as const;
};
