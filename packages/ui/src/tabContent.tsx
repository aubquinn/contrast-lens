import React, { useState } from 'react';
import { Accordion, Tabs } from '@chakra-ui/react';
import { Badge } from './badge.js';
import { useContrastLensTheme } from './theme.js';
import type { DisplayFinding } from './types.js';

import { AccordionContent } from './accordionContent.js';
import { createTabContentStyles } from './tabContent.styles.js';

export type TabContentProps = {
    violations: DisplayFinding[];
    warnings: DisplayFinding[];
    onJumpToElement?: (item: DisplayFinding) => void;
    onRemoveHighlight?: (item: DisplayFinding) => void;
};

export const TabContent = ({ violations, warnings, onJumpToElement, onRemoveHighlight }: TabContentProps) => {
    const theme = useContrastLensTheme();
    const styles = createTabContentStyles(theme);
    const [activeTab, setActiveTab] = useState('violations');

    return (
        <Tabs.Root
            value={activeTab}
            onValueChange={({ value }) => setActiveTab(value)}
            variant="plain"
            {...styles.root}
        >
            <Tabs.List {...styles.list}>
                <Tabs.Trigger value="violations" {...styles.trigger}>
                    Violations
                    <Badge compact status={activeTab === 'violations' ? 'active' : 'neutral'}>
                        {violations.length}
                    </Badge>
                </Tabs.Trigger>

                <Tabs.Trigger value="warnings" {...styles.trigger}>
                    Warnings
                    <Badge compact status={activeTab === 'warnings' ? 'active' : 'neutral'}>
                        {warnings.length}
                    </Badge>
                </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="violations" {...styles.content}>
                <Accordion.Root collapsible>
                    {violations.map((item, index) => {
                        const value = `${item.id}-violation-${index}`;
                        return (
                            <AccordionContent
                                key={value}
                                item={item}
                                value={value}
                                onJumpToElement={onJumpToElement}
                                onRemoveHighlight={onRemoveHighlight}
                            />
                        );
                    })}
                </Accordion.Root>
            </Tabs.Content>

            <Tabs.Content value="warnings" {...styles.content}>
                <Accordion.Root collapsible>
                    {warnings.map((item, index) => {
                        const value = `${item.id}-warning-${index}`;
                        return (
                            <AccordionContent
                                key={value}
                                item={item}
                                value={value}
                                onJumpToElement={onJumpToElement}
                                onRemoveHighlight={onRemoveHighlight}
                            />
                        );
                    })}
                </Accordion.Root>
            </Tabs.Content>
        </Tabs.Root>
    );
};
