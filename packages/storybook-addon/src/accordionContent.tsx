import React, { useEffect, useRef, useState } from 'react';
import { Finding } from '@contrast-lens/engine';
import { Accordion, Box, Button, Code, HStack, List, Span } from '@chakra-ui/react';
import { EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'storybook/theming';

import { createAccordionContentStyles } from './accordionContent.styles';

export type AccordionContentProps = {
    item: Finding;
    value: string;
};

const formatRuleTitle = (ruleId: string) =>
    ruleId.replace(/[-_]+/g, ' ').replace(/^\w/, (character) => character.toUpperCase());

const isElementLike = (value: unknown): value is Element =>
    typeof value === 'object' && value !== null && 'outerHTML' in value && 'tagName' in value;

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

export const AccordionContent = ({ item, value }: AccordionContentProps) => {
    const theme = useTheme();
    const styles = createAccordionContentStyles(theme);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const removeOverlayRef = useRef<(() => void) | null>(null);

    const rawElement: unknown = item.element;
    const domElement = isElementLike(rawElement) ? rawElement : undefined;

    const elementMarkup = domElement?.outerHTML ?? String(rawElement);

    const selector = domElement ? getSelector(domElement) : 'Selector unavailable';
    const [hintText, ...hintCodeLines] = item.hint?.split('\n') ?? [];
    const hintCode = hintCodeLines.join('\n').trim();

    const removeOverlay = () => {
        removeOverlayRef.current?.();
        removeOverlayRef.current = null;
    };

    const removeHighlight = () => {
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
        if (!domElement) {
            return;
        }

        removeOverlay();
        domElement.scrollIntoView({
            behavior: 'auto',
            block: 'center',
        });

        const previewDocument = domElement.ownerDocument;
        const previewWindow = previewDocument.defaultView;
        const overlay = previewDocument.createElement('div');
        const overlayGap = 4;
        const overlayBorderWidth = 4;
        const overlayOffset = overlayGap + overlayBorderWidth;

        overlay.setAttribute('data-contrast-lens-highlight', 'true');
        Object.assign(overlay.style, {
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: '2147483647',
            border: `${overlayBorderWidth}px solid red`,
            boxSizing: 'border-box',
            background: 'transparent',
        });

        const positionOverlay = () => {
            if (!domElement.isConnected) {
                removeOverlay();
                return;
            }

            const rect = domElement.getBoundingClientRect();
            overlay.style.top = `${rect.top - overlayOffset}px`;
            overlay.style.left = `${rect.left - overlayOffset}px`;
            overlay.style.width = `${rect.width + overlayOffset * 2}px`;
            overlay.style.height = `${rect.height + overlayOffset * 2}px`;
        };

        previewDocument.body.appendChild(overlay);
        positionOverlay();

        previewWindow?.addEventListener('resize', positionOverlay);
        previewWindow?.addEventListener('scroll', positionOverlay, true);

        const resizeObserver = previewWindow?.ResizeObserver ? new previewWindow.ResizeObserver(positionOverlay) : null;
        resizeObserver?.observe(domElement);

        removeOverlayRef.current = () => {
            previewWindow?.removeEventListener('resize', positionOverlay);
            previewWindow?.removeEventListener('scroll', positionOverlay, true);
            resizeObserver?.disconnect();
            overlay.remove();
        };

        previewWindow?.requestAnimationFrame(positionOverlay);
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
                                    disabled={!domElement}
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
