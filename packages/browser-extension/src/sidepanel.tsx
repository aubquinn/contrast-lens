import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Box, ChakraProvider, Heading, Text, Button, defaultSystem } from '@chakra-ui/react';
import { TabContent, type DisplayFinding } from '@contrast-lens/ui';
import type { ContentScriptRequest, ContentScriptResponse, HighlightResponse, ScanResponse } from './messages.js';

export const getActiveTabId = async (): Promise<number | undefined> => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab?.id;
};

const sendToActiveTab = async <TResponse extends ContentScriptResponse>(
    message: ContentScriptRequest,
): Promise<TResponse | undefined> => {
    const tabId = await getActiveTabId();

    if (tabId === undefined) {
        return undefined;
    }

    return (await chrome.tabs.sendMessage(tabId, message)) as TResponse;
};

export const scanActiveTab = () => sendToActiveTab<ScanResponse>({ type: 'CONTRAST_LENS_SCAN' });

export const highlightFinding = (id: string) =>
    sendToActiveTab<HighlightResponse>({ type: 'CONTRAST_LENS_HIGHLIGHT', id });

export const clearHighlight = () => sendToActiveTab<HighlightResponse>({ type: 'CONTRAST_LENS_UNHIGHLIGHT' });

export const SidePanelApp = () => {
    const [findings, setFindings] = useState<DisplayFinding[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const scan = useCallback(async () => {
        setIsScanning(true);
        setError(null);

        try {
            const response = await scanActiveTab();

            if (!response) {
                throw new Error('No active tab to scan.');
            }

            setFindings(response.findings);
        } catch (scanError) {
            setError(scanError instanceof Error ? scanError.message : 'Failed to scan page.');
        } finally {
            setIsScanning(false);
        }
    }, []);

    const onJumpToElement = useCallback((item: DisplayFinding) => {
        void highlightFinding(item.id);
    }, []);

    const onRemoveHighlight = useCallback(() => {
        void clearHighlight();
    }, []);

    const violations = findings?.filter((finding) => finding.severity === 'error') ?? [];
    const warnings = findings?.filter((finding) => finding.severity === 'warning') ?? [];

    return (
        <ChakraProvider value={defaultSystem}>
            <Box padding="12px">
                <Heading size="sm" marginBottom="8px">
                    Contrast Lens
                </Heading>

                <Button onClick={scan} disabled={isScanning} width="100%" marginBottom="8px">
                    {isScanning ? 'Scanning…' : 'Scan current page'}
                </Button>

                {error && <Text color="red.500">{error}</Text>}
            </Box>

            {findings && (
                <TabContent
                    violations={violations}
                    warnings={warnings}
                    onJumpToElement={onJumpToElement}
                    onRemoveHighlight={onRemoveHighlight}
                />
            )}
        </ChakraProvider>
    );
};

const container = document.getElementById('root');

if (container) {
    createRoot(container).render(<SidePanelApp />);
}
