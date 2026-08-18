import React from 'react';
import { Finding } from '@contrast-lens/engine';
import { Box, Span } from '@chakra-ui/react';
import { Accordion, Button, Code, HStack, List } from '@chakra-ui/react';

export const AccordionContent = ({ item, key }: { item: Finding; key: number }) => {
    return (
        <Accordion.Item key={key} value={item.ruleId}>
            <Accordion.ItemTrigger>
                <Span>{item.ruleId}</Span>
                <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
                <Accordion.ItemBody>
                    {item.message}
                    <HStack>
                        <Box>
                            <List.Root as="ol">
                                <List.Item>
                                    <Code>{item.element.toString()}</Code>
                                </List.Item>
                            </List.Root>
                        </Box>
                        <Box>
                            {item.message}
                            <Button>Jump to code block</Button>
                            <Code>
                                {`//* element *//
                                ${item.element.toString()}
                                //* selector *//
                                // ${item.element.toString()}`}
                            </Code>
                        </Box>
                    </HStack>
                </Accordion.ItemBody>
            </Accordion.ItemContent>
        </Accordion.Item>
    );
};
