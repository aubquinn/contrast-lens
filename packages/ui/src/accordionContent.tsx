import React, { useEffect, useRef, useState } from 'react';
import { Accordion, Box, Button, Code, HStack, List, Span } from '@chakra-ui/react';
import { EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useContrastLensTheme } from './theme.js';
import { createElementOverlay } from './domHighlight.js';
import type { DisplayFinding } from './types.js';

import { createAccordionContentStyles } from './accordionContent.styles.js';

export type AccordionContentProps = {
    item: DisplayFinding;
    value: string;
    onJumpToElement?: (item: DisplayFinding) => void;
    onRemoveHighlight?: (item: DisplayFinding) => void;
};

const formatRuleTitle = (ruleId: string) =>
    ruleId.replace(/[-_]+/g, ' ').replace(/^\w/, (character) => character.toUpperCase());

const getSelector = (element: Element) => {
    const tagName = element.tagName.toLowerCase();

    if (element.id) {
        return `#${element.id}`;
    }

    const classNames = Array.from(element.classList).filter(Boolean).slice(0, 2);

    if (classNames.length > 0) {
        return `${tagName}.${classNames.join('.')}`;
    }

    const parent = element.parentElement;

    if (parent) {
        const index = Array.from(parent.children).indexOf(element) + 1;

        if (index > 0) {
            return `${tagName}:nth-child(${index})`;
        }
    }

    return tagName;
};

export const AccordionContent = ({ item, value, onJumpToElement, onRemoveHighlight }: AccordionContentProps) => {
    const theme = useContrastLensTheme();
    const styles = createAccordionContentStyles(theme);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const removeOverlayRef = useRef<(() => void) | null>(null);

    const domElement = item.element;
    const elementMarkup = item.elementMarkup;
    const canHighlight = Boolean(domElement) || Boolean(onJumpToElement);

    const selector = domElement ? getSelector(domElement) : 'Selector unavailable';
    const [hintText, ...hintCodeLines] = item.hint?.split('\n') ?? [];
    const hintCode = hintCodeLines.join('\n').trim();

    const removeOverlay = () => {
        removeOverlayRef.current?.();
        removeOverlayRef.current = null;
    };

    const removeHighlight = () => {
        if (onRemoveHighlight) {
            onRemoveHighlight(item);
            setIsHighlighted(false);
            return;
        }

        removeOverlay();
        setIsHighlighted(false);
    };

    useEffect(
        () => () => {
            removeOverlay();
        },
        [domElement],
    );

    const jumpToElement = () => {
        if (onJumpToElement) {
            onJumpToElement(item);
            setIsHighlighted(true);
            return;
        }

        if (!domElement) {
            return;
        }

        removeOverlay();
        domElement.scrollIntoView({
            behavior: 'auto',
            block: 'center',
        });

        removeOverlayRef.current = createElementOverlay(domElement);
        setIsHighlighted(true);
    };

    return (
        <Accordion.Item value={value} {...styles.item}>
            <Accordion.ItemTrigger {...styles.trigger}>
                <HStack {...styles.triggerLabel}>
                    <Span {...styles.ruleTitle}>{formatRuleTitle(item.ruleId)}</Span>

                    <Code {...styles.ruleId}>{item.ruleId}</Code>
                </HStack>

                <Accordion.ItemIndicator {...styles.indicator} />
            </Accordion.ItemTrigger>

            <Accordion.ItemContent>
                <Accordion.ItemBody {...styles.body}>
                    <Box {...styles.description}>{item.message}</Box>

                    <Box {...styles.resultGrid}>
                        <Box {...styles.elementColumn}>
                            <List.Root as="ol" {...styles.elementList}>
                                <List.Item {...styles.elementListItem}>
                                    <Span {...styles.elementNumber}>1.</Span>

                                    <Code title={elementMarkup} {...styles.elementPreview}>
                                        {elementMarkup}
                                    </Code>
                                </List.Item>
                            </List.Root>
                        </Box>

                        <Box {...styles.detailColumn}>
                            {item.hint && (
                                <Box {...styles.detailMessage}>
                                    <Box>{hintText}</Box>

                                    {hintCode && (
                                        <Code as="pre" {...styles.hintCode}>
                                            {hintCode}
                                        </Code>
                                    )}
                                </Box>
                            )}

                            <HStack {...styles.actions}>
                                <Button
                                    disabled={!canHighlight}
                                    aria-pressed={isHighlighted}
                                    onClick={isHighlighted ? removeHighlight : jumpToElement}
                                    {...styles.actionButton}
                                >
                                    {isHighlighted ? (
                                        <XMarkIcon aria-hidden="true" {...styles.actionIcon} />
                                    ) : (
                                        <EyeIcon aria-hidden="true" {...styles.actionIcon} />
                                    )}
                                    {isHighlighted ? 'Remove highlight' : 'Jump to element'}
                                </Button>
                            </HStack>

                            <Code as="pre" {...styles.detailCode}>
                                {['/* element */', elementMarkup, '', '/* selector */', selector].join('\n')}
                            </Code>
                        </Box>
                    </Box>
                </Accordion.ItemBody>
            </Accordion.ItemContent>
        </Accordion.Item>
    );
};
