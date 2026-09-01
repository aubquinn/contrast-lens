import React, { useEffect, useMemo, useState } from 'react';
import { runAllRules } from '@contrast-lens/engine';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { TabContent } from './tabContent';

const getStoryRootFromPreview = (): HTMLElement | null => {
    const iframe = document.getElementById('storybook-preview-iframe') as HTMLIFrameElement | null;
    const doc = iframe?.contentDocument || iframe?.contentWindow?.document;
    if (!doc) {
        return null;
    }
    return doc.getElementById('storybook-root') || doc.getElementById('storybook-docs');
};

export const ContrastLensPanel = () => {
    const [storyRoot, setStoryRoot] = useState<HTMLElement | null>(null);
    const [previewChangeKey, setPreviewChangeKey] = useState(0);

    useEffect(() => {
        const updateStoryRoot = () => {
            const newRoot = getStoryRootFromPreview();

            if (!newRoot) {
                return;
            }

            setStoryRoot((current) => (current !== newRoot ? newRoot : current));
        };

        updateStoryRoot();

        const iframe = document.getElementById('storybook-preview-iframe') as HTMLIFrameElement | null;

        if (!iframe) {
            return undefined;
        }

        const handleLoad = () => {
            setTimeout(() => {
                updateStoryRoot();
                setPreviewChangeKey((prev) => prev + 1);
            }, 50);
        };
        iframe.addEventListener('load', handleLoad);

        const interval = window.setInterval(() => {
            updateStoryRoot();
            setPreviewChangeKey((prev) => prev + 1);
        }, 500);

        return () => {
            iframe.removeEventListener('load', handleLoad);
            window.clearInterval(interval);
        };
    }, []);

    // once storybook root is available, run the rules engine
    const findings = useMemo(() => {
        if (!storyRoot) {
            return [];
        }
        return runAllRules(storyRoot);
    }, [storyRoot, previewChangeKey]);

    // filter findings into violations and warnings categories
    const violations = useMemo(() => findings.filter((f) => f.severity === 'error'), [findings]);
    const warnings = useMemo(() => findings.filter((f) => f.severity === 'warning'), [findings]);

    if (!storyRoot) {
        return <div>No story root found.</div>;
    }

    return (
        <ChakraProvider value={defaultSystem}>
            <TabContent violations={violations} warnings={warnings} />
        </ChakraProvider>
    );
};

export default ContrastLensPanel;
