import React from 'react';
import { Finding } from '@contrast-lens/engine';
import { Accordion, Tabs } from '@chakra-ui/react';
import { AccordionContent } from './accordionContent';

export type TabContentProps = {
    violations: Finding[];
    warnings: Finding[];
};

export const TabContent = ({ violations, warnings }: TabContentProps) => {
    return (
        <Tabs.Root defaultValue="violations" variant="line">
            <Tabs.List>
                <Tabs.Trigger
                    value="violations"
                    _selected={{
                        bg: 'blue.500',
                        color: 'white',
                    }}
                >
                    Violations ({violations.length})
                </Tabs.Trigger>
                <Tabs.Trigger
                    value="warnings"
                    _selected={{
                        bg: 'blue.500',
                        color: 'white',
                    }}
                >
                    Warnings ({warnings.length})
                </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="violations">
                <Accordion.Root collapsible>
                    {violations.map((item, index) => (
                        <AccordionContent key={index} item={item} />
                    ))}
                </Accordion.Root>
            </Tabs.Content>
            <Tabs.Content value="warnings">
                <Accordion.Root collapsible>
                    {warnings.map((item, index) => (
                        <AccordionContent key={index} item={item} />
                    ))}
                </Accordion.Root>
            </Tabs.Content>
        </Tabs.Root>
    );
};
