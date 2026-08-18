import React from 'react';
import { Finding } from '@contrast-lens/engine';
import { Accordion, Box, Button, Code, HStack, List, Span } from '@chakra-ui/react';
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

    const rawElement: unknown = item.element;
    const domElement = isElementLike(rawElement) ? rawElement : undefined;

    const elementMarkup = domElement?.outerHTML ?? String(rawElement);

    const selector = domElement ? getSelector(domElement) : 'Selector unavailable';

    const jumpToElement = () => {
        domElement?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
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
                            <Box {...styles.detailMessage}>{item.message}</Box>

                            <HStack {...styles.actions}>
                                <Button disabled={!domElement} onClick={jumpToElement} {...styles.actionButton}>
                                    Jump to element
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
