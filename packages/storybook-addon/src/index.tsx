import React, { useEffect, useMemo, useState } from 'react';
import { runAllRules } from '@contrast-lens/engine';
import { EyeIcon, EyeSlashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { Accordion, IconButton as ChakraIconButton, ChakraProvider, defaultSystem, Span, Tabs } from '@chakra-ui/react';

const HIGHLIGHT_CLASS = 'contrast-lens-highlight';
const HIGHLIGHT_STYLE_ID = 'contrast-lens-highlight-style';

const injectHighlightStyles = () => {
    if (document.getElementById(HIGHLIGHT_STYLE_ID)) {
        return;
    }

    const style = document.createElement('style');
    style.id = HIGHLIGHT_STYLE_ID;
    style.textContent = `
    .${HIGHLIGHT_CLASS} {
      outline: 3px dashed #ff4d4f !important;
      box-shadow: 0 0 0 4px rgba(255, 77, 79, 0.35) !important;
      position: relative !important;
      transition: box-shadow .18s ease, outline .18s ease;
    }
  `;

    document.head.appendChild(style);
};

const removeHighlightStyles = () => {
    const existing = document.getElementById(HIGHLIGHT_STYLE_ID);
    if (existing) {
        existing.remove();
    }
};

const removeHighlights = (findings: Array<{ element: Element }>) => {
    findings.forEach((finding) => {
        finding.element.classList.remove(HIGHLIGHT_CLASS);
    });
};

const IconButton: React.FC<{
    label: string;
    active?: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ label, active = false, onClick, children }) => (
    <ChakraIconButton
        type="button"
        aria-label={label}
        title={label}
        onClick={onClick}
        style={{
            borderColor: active ? '#096dd9' : '#d9d9d9',
            background: active ? '#e6f7ff' : '#fafafa',
        }}
    >
        {children}
    </ChakraIconButton>
);

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
    const [openIndexes, setOpenIndexes] = useState<Record<number, boolean>>({});
    const [highlightedIndexes, setHighlightedIndexes] = useState<Record<number, boolean>>({});
    const [filterSeverity, setFilterSeverity] = useState<'all' | 'error' | 'warning'>('all');
    const [showOnlyRuleIds, setShowOnlyRuleIds] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const updateStoryRoot = () => {
            const newRoot = getStoryRootFromPreview();

            if (!newRoot) return;
            setStoryRoot((current) => (current !== newRoot ? newRoot : current));
        };

        updateStoryRoot();

        const iframe = document.getElementById('storybook-preview-iframe') as HTMLIFrameElement | null;
        if (!iframe) return undefined;

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

    const findings = useMemo(() => {
        if (!storyRoot) {
            return [];
        }
        return runAllRules(storyRoot);
    }, [storyRoot, previewChangeKey]);

    const violations = useMemo(() => findings.filter((f) => f.severity === 'error'), [findings]);
    const warnings = useMemo(() => findings.filter((f) => f.severity === 'warning'), [findings]);

    // const filteredFindings = useMemo(() => {
    //     return findings
    //         .filter((f) => {
    //             if (filterSeverity === 'all') {
    //                 return true;
    //             }
    //             return f.severity === (filterSeverity === 'error' ? 'error' : 'warning');
    //         })
    //         .filter((f) => (showOnlyRuleIds ? f.ruleId === showOnlyRuleIds : true));
    // }, [findings, filterSeverity, showOnlyRuleIds]);

    // const counts = useMemo(() => {
    //     const totals = { all: findings.length, error: 0, warning: 0 } as Record<string, number>;
    //     findings.forEach((f) => {
    //         if (f.severity === 'error') {
    //             totals.error++;
    //         } else {
    //             totals.warning++;
    //         }
    //     });
    //     return totals;
    // }, [findings]);

    // useEffect(() => {
    //     return () => {
    //         removeHighlights(findings);
    //         removeHighlightStyles();
    //     };
    // }, [findings]);

    // useEffect(() => {
    //     if (findings.length === 0) {
    //         removeHighlightStyles();
    //         return;
    //     }

    //     const hasHighlights = Object.values(highlightedIndexes).some(Boolean);

    //     if (hasHighlights) {
    //         injectHighlightStyles();
    //     }

    //     findings.forEach((finding, index) => {
    //         if (highlightedIndexes[index]) {
    //             finding.element.classList.add(HIGHLIGHT_CLASS);
    //         } else {
    //             finding.element.classList.remove(HIGHLIGHT_CLASS);
    //         }
    //     });

    //     if (!hasHighlights) {
    //         removeHighlightStyles();
    //     }
    // }, [findings, highlightedIndexes]);

    // const toggleOpen = (index: number) => {
    //     setOpenIndexes((prev) => ({ ...prev, [index]: !prev[index] }));
    // };

    // const toggleHighlight = (index: number) => {
    //     setHighlightedIndexes((prev) => ({ ...prev, [index]: !prev[index] }));
    // };

    if (!storyRoot) {
        return <div>No story root found.</div>;
    }

    // const copyResults = async () => {
    //     try {
    //         await navigator.clipboard.writeText(JSON.stringify(findings, null, 2));
    //         setShowToast(true);
    //         setTimeout(() => setShowToast(false), 1800);
    //     } catch (e) {
    //         // ignore
    //     }
    // };

    return (
        <>
            <ChakraProvider value={defaultSystem}>
                <Tabs.Root defaultValue="violations">
                    <Tabs.List>
                        <Tabs.Trigger value="violations">Violations ({violations.length})</Tabs.Trigger>
                        <Tabs.Trigger value="warnings">Warnings ({warnings.length})</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="violations">
                        <Accordion.Root collapsible>
                            {violations.map((item, index) => (
                                <Accordion.Item key={index} value={item.ruleId}>
                                    <Accordion.ItemTrigger>
                                        <Span flex="1">{item.message}</Span>
                                        <Accordion.ItemIndicator />
                                    </Accordion.ItemTrigger>
                                    <Accordion.ItemContent>
                                        <Accordion.ItemBody>{item.message}</Accordion.ItemBody>
                                    </Accordion.ItemContent>
                                </Accordion.Item>
                            ))}
                        </Accordion.Root>
                    </Tabs.Content>
                    <Tabs.Content value="warnings">
                        <Accordion.Root collapsible>
                            {warnings.map((item, index) => (
                                <Accordion.Item key={index} value={item.ruleId}>
                                    <Accordion.ItemTrigger>
                                        <Span flex="1">{item.message}</Span>
                                        <Accordion.ItemIndicator />
                                    </Accordion.ItemTrigger>
                                    <Accordion.ItemContent>
                                        <Accordion.ItemBody>{item.message}</Accordion.ItemBody>
                                    </Accordion.ItemContent>
                                </Accordion.Item>
                            ))}
                        </Accordion.Root>
                    </Tabs.Content>
                </Tabs.Root>
            </ChakraProvider>
        </>
        // <div
        //     style={{
        //         fontFamily: 'Inter, system-ui, sans-serif',
        //         color: '#262626',
        //         padding: 12,
        //         background: '#ffffff',
        //         position: 'relative',
        //     }}
        // >
        //     <div style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none' }}>
        //         <div
        //             style={{
        //                 background: '#111',
        //                 color: '#fff',
        //                 padding: '8px 12px',
        //                 borderRadius: 6,
        //                 opacity: showToast ? 1 : 0,
        //                 transform: showToast ? 'translateY(0)' : 'translateY(-8px)',
        //                 transition: 'all 180ms ease',
        //                 fontSize: 13,
        //             }}
        //         >
        //             {showToast ? 'Copied JSON' : ''}
        //         </div>
        //     </div>
        //     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        //         <div>
        //             <h2 style={{ margin: 0, fontSize: 18 }}>Contrast Lens</h2>
        //             <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
        //                 <span style={{ fontSize: 12, color: '#6b6b6b' }}>{counts.all} results</span>
        //                 <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        //                     <span
        //                         style={{
        //                             background: '#fff1f0',
        //                             color: '#c92a2a',
        //                             padding: '4px 8px',
        //                             borderRadius: 9999,
        //                             fontSize: 12,
        //                             border: '1px solid rgba(201,42,42,0.12)',
        //                         }}
        //                     >
        //                         Violations {counts.error}
        //                     </span>
        //                     <span
        //                         style={{
        //                             background: '#fff7e6',
        //                             color: '#d48806',
        //                             padding: '4px 8px',
        //                             borderRadius: 9999,
        //                             fontSize: 12,
        //                             border: '1px solid rgba(212,136,6,0.12)',
        //                         }}
        //                     >
        //                         Warnings {counts.warning}
        //                     </span>
        //                 </span>
        //             </div>
        //         </div>

        //         <div style={{ display: 'flex', gap: 8 }}>
        //             <button
        //                 type="button"
        //                 onClick={() => setFilterSeverity('all')}
        //                 aria-pressed={filterSeverity === 'all'}
        //                 style={{
        //                     padding: '6px 10px',
        //                     borderRadius: 6,
        //                     border: filterSeverity === 'all' ? '1px solid #096dd9' : '1px solid #e8e8e8',
        //                     background: filterSeverity === 'all' ? '#e6f7ff' : '#fff',
        //                     fontSize: 13,
        //                 }}
        //             >
        //                 All
        //             </button>
        //             <button
        //                 type="button"
        //                 onClick={() => setFilterSeverity('error')}
        //                 aria-pressed={filterSeverity === 'error'}
        //                 style={{
        //                     padding: '6px 10px',
        //                     borderRadius: 6,
        //                     border: filterSeverity === 'error' ? '1px solid #c92a2a' : '1px solid #e8e8e8',
        //                     background: filterSeverity === 'error' ? '#fff1f0' : '#fff',
        //                     fontSize: 13,
        //                 }}
        //             >
        //                 Violations
        //             </button>
        //             <button
        //                 type="button"
        //                 onClick={() => setFilterSeverity('warning')}
        //                 aria-pressed={filterSeverity === 'warning'}
        //                 style={{
        //                     padding: '6px 10px',
        //                     borderRadius: 6,
        //                     border: filterSeverity === 'warning' ? '1px solid #d48806' : '1px solid #e8e8e8',
        //                     background: filterSeverity === 'warning' ? '#fff7e6' : '#fff',
        //                     fontSize: 13,
        //                 }}
        //             >
        //                 Warnings
        //             </button>
        //             <button
        //                 type="button"
        //                 onClick={() => {
        //                     setShowOnlyRuleIds(null);
        //                     setFilterSeverity('all');
        //                 }}
        //                 style={{
        //                     padding: '6px 10px',
        //                     borderRadius: 6,
        //                     border: '1px solid #e8e8e8',
        //                     background: '#fff',
        //                     fontSize: 13,
        //                 }}
        //             >
        //                 Reset
        //             </button>
        //             <button
        //                 type="button"
        //                 onClick={copyResults}
        //                 style={{
        //                     padding: '6px 10px',
        //                     borderRadius: 6,
        //                     border: '1px solid #e8e8e8',
        //                     background: '#fff',
        //                     fontSize: 13,
        //                 }}
        //             >
        //                 Copy JSON
        //             </button>
        //         </div>
        //     </div>

        //     <div style={{ marginTop: 12 }}>
        //         {findings.length === 0 ? (
        //             <p style={{ color: '#6b6b6b' }}>No issues found.</p>
        //         ) : (
        //             <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        //                 {filteredFindings.map((finding, i) => (
        //                     <li
        //                         key={i}
        //                         style={{
        //                             padding: '12px 0',
        //                             display: 'flex',
        //                             gap: 12,
        //                             alignItems: 'flex-start',
        //                         }}
        //                     >
        //                         <div style={{ width: 56, flexShrink: 0 }}>
        //                             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        //                                 <span
        //                                     style={{
        //                                         display: 'inline-flex',
        //                                         alignItems: 'center',
        //                                         justifyContent: 'center',
        //                                         width: 36,
        //                                         height: 36,
        //                                         borderRadius: 6,
        //                                         background: finding.severity === 'error' ? '#fff1f0' : '#fff7e6',
        //                                         color: finding.severity === 'error' ? '#c92a2a' : '#d48806',
        //                                         fontSize: 13,
        //                                         fontWeight: 700,
        //                                         border: '1px solid rgba(0,0,0,0.04)',
        //                                     }}
        //                                 >
        //                                     {finding.severity === 'error' ? 'V' : 'W'}
        //                                 </span>
        //                             </div>
        //                         </div>

        //                         <div style={{ flex: 1, minWidth: 0 }}>
        //                             <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        //                                 <div style={{ minWidth: 0 }}>
        //                                     <div
        //                                         style={{
        //                                             display: 'flex',
        //                                             gap: 8,
        //                                             alignItems: 'center',
        //                                             flexWrap: 'wrap',
        //                                         }}
        //                                     >
        //                                         <strong
        //                                             style={{
        //                                                 fontSize: 14,
        //                                                 overflow: 'hidden',
        //                                                 textOverflow: 'ellipsis',
        //                                                 whiteSpace: 'nowrap',
        //                                             }}
        //                                         >
        //                                             {finding.message}
        //                                         </strong>
        //                                         <span
        //                                             style={{
        //                                                 color: '#595959',
        //                                                 fontSize: 12,
        //                                                 background: '#f5f5f5',
        //                                                 padding: '2px 6px',
        //                                                 borderRadius: 4,
        //                                             }}
        //                                         >
        //                                             {finding.ruleId}
        //                                         </span>
        //                                         <button
        //                                             type="button"
        //                                             onClick={() => setShowOnlyRuleIds(finding.ruleId)}
        //                                             style={{
        //                                                 border: 'none',
        //                                                 background: 'transparent',
        //                                                 color: '#096dd9',
        //                                                 cursor: 'pointer',
        //                                                 fontSize: 12,
        //                                             }}
        //                                         >
        //                                             Show rules
        //                                         </button>
        //                                     </div>
        //                                     <div style={{ color: '#666', fontSize: 12, marginTop: 8 }}>
        //                                         <div
        //                                             style={{
        //                                                 background: '#fafafa',
        //                                                 padding: 8,
        //                                                 borderRadius: 6,
        //                                                 border: '1px solid #f0f0f0',
        //                                                 fontFamily: 'SFMono-Regular, Menlo, Monaco, monospace',
        //                                                 fontSize: 12,
        //                                                 color: '#222',
        //                                             }}
        //                                         >
        //                                             {String(finding.element.outerHTML).slice(0, 300)}
        //                                             {String(finding.element.outerHTML).length > 300 ? '...' : ''}
        //                                         </div>
        //                                     </div>
        //                                 </div>

        //                                 <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        //                                     <IconButton
        //                                         label={highlightedIndexes[i] ? 'Hide highlight' : 'Highlight'}
        //                                         active={highlightedIndexes[i]}
        //                                         onClick={() => toggleHighlight(i)}
        //                                     >
        //                                         {highlightedIndexes[i] ? <EyeSlashIcon /> : <EyeIcon />}
        //                                     </IconButton>
        //                                     <IconButton
        //                                         label={openIndexes[i] ? 'Hide details' : 'Show details'}
        //                                         active={openIndexes[i]}
        //                                         onClick={() => toggleOpen(i)}
        //                                     >
        //                                         {openIndexes[i] ? <ChevronUpIcon /> : <ChevronDownIcon />}
        //                                     </IconButton>
        //                                 </div>
        //                             </div>

        //                             <div
        //                                 style={{
        //                                     marginTop: 12,
        //                                     fontSize: 13,
        //                                     color: '#424242',
        //                                     lineHeight: 1.5,
        //                                     maxHeight: openIndexes[i] ? 1000 : 0,
        //                                     opacity: openIndexes[i] ? 1 : 0,
        //                                     overflow: 'hidden',
        //                                     transition: 'all 180ms ease',
        //                                 }}
        //                                 aria-hidden={!openIndexes[i]}
        //                             >
        //                                 <div style={{ marginBottom: 6 }}>
        //                                     <strong>Element:</strong>{' '}
        //                                     <span style={{ color: '#111' }}>
        //                                         {finding.element.tagName.toLowerCase()}
        //                                     </span>
        //                                     {finding.element.id ? (
        //                                         <span style={{ color: '#595959' }}>#{finding.element.id}</span>
        //                                     ) : null}
        //                                     {finding.element.className ? (
        //                                         <span style={{ color: '#595959' }}>
        //                                             .{String(finding.element.className).split(' ').join('.')}
        //                                         </span>
        //                                     ) : null}
        //                                 </div>
        //                                 <div>
        //                                     <strong>Path:</strong>{' '}
        //                                     <pre
        //                                         style={{
        //                                             whiteSpace: 'pre-wrap',
        //                                             fontFamily: 'SFMono-Regular, Menlo, Monaco, monospace',
        //                                             fontSize: 12,
        //                                             color: '#111',
        //                                             background: '#fafafa',
        //                                             padding: 8,
        //                                             borderRadius: 6,
        //                                             border: '1px solid #f0f0f0',
        //                                         }}
        //                                     >
        //                                         {finding.element.outerHTML}
        //                                     </pre>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </li>
        //                 ))}
        //             </ul>
        //         )}
        //     </div>
        // </div>
    );
};

export default ContrastLensPanel;
