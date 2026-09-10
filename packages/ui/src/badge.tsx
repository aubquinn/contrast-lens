import type { ReactNode } from 'react';
import { Span } from '@chakra-ui/react';
import { useContrastLensTheme } from './theme.js';

export type BadgeStatus = 'active' | 'neutral';

export type BadgeProps = {
    status?: BadgeStatus;
    compact?: boolean;
    children?: ReactNode;
};

export const Badge = ({ status = 'neutral', compact = false, children }: BadgeProps) => {
    const theme = useContrastLensTheme();
    const isActive = status === 'active';

    return (
        <Span
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            minWidth={compact ? '16px' : '20px'}
            height={compact ? '16px' : '20px'}
            paddingX={compact ? '4px' : '6px'}
            borderRadius="9999px"
            fontSize="11px"
            fontWeight="700"
            lineHeight="1"
            background={isActive ? theme.color.secondary : theme.background.hoverable}
            color={isActive ? theme.background.content : theme.textMutedColor}
        >
            {children}
        </Span>
    );
};
