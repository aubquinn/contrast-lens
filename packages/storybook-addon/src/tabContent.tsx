import React, { useState } from 'react';
import { Finding } from '@contrast-lens/engine';
import { Accordion, Tabs } from '@chakra-ui/react';
import { Badge } from 'storybook/internal/components';
import { useTheme } from 'storybook/theming';

import { AccordionContent } from './accordionContent';
import { createTabContentStyles } from './tabContent.styles';

export type TabContentProps = {
    violations: Finding[];
    warnings: Finding[];
};

export const TabContent = ({ violations, warnings }: TabContentProps) => {
    const theme = useTheme();
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
                        const value = `${item.ruleId}-violation-${index}`;
                        return <AccordionContent key={value} item={item} value={value} />;
                    })}
                </Accordion.Root>
            </Tabs.Content>

            <Tabs.Content value="warnings" {...styles.content}>
                <Accordion.Root collapsible>
                    {warnings.map((item, index) => {
                        const value = `${item.ruleId}-warning-${index}`;
                        return <AccordionContent key={value} item={item} value={value} />;
                    })}
                </Accordion.Root>
            </Tabs.Content>
        </Tabs.Root>
    );
};
