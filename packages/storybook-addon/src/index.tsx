import React, { useEffect, useMemo, useState } from 'react';
import { addons, types } from '@storybook/addons';
import { runAllRules } from '@contrast-lens/engine';

const HIGHLIGHT_CLASS = 'contrast-lens-highlight';
const HIGHLIGHT_STYLE_ID = 'contrast-lens-highlight-style';

const injectHighlightStyles = () => {
  if (document.getElementById(HIGHLIGHT_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = HIGHLIGHT_STYLE_ID;
  style.textContent = `
    .${HIGHLIGHT_CLASS} {
      outline: 3px dashed #ff4d4f !important;
      box-shadow: 0 0 0 4px rgba(255, 77, 79, 0.35) !important;
      position: relative !important;
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

const iconButtonBaseStyle: React.CSSProperties = {
  border: '1px solid #d9d9d9',
  borderRadius: 8,
  background: '#fafafa',
  width: 36,
  height: 36,
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#262626',
};

const IconButton: React.FC<{
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ label, active = false, onClick, children }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    style={{
      ...iconButtonBaseStyle,
      borderColor: active ? '#096dd9' : '#d9d9d9',
      background: active ? '#e6f7ff' : '#fafafa',
    }}
  >
    {children}
  </button>
);

const IconEye = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 5C6.95 5 2.75 8.11 1 12c1.75 3.89 5.95 7 11 7s9.25-3.11 11-7C21.25 8.11 17.05 5 12 5Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
  </svg>
);

const IconEyeOff = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 6a10.96 10.96 0 0 1 9.43 5.5A11.05 11.05 0 0 1 17 16.64l1.45 1.45A12.99 12.99 0 0 0 24 12c-1.75-3.89-5.95-7-11-7a10.96 10.96 0 0 0-6.4 1.96L8.24 8.6A4.98 4.98 0 0 1 12 6Zm-6.36-2.36L3.28 4l3.61 3.61A4.98 4.98 0 0 0 6 12c0 1.38.56 2.63 1.46 3.54l-1.41 1.41A10.95 10.95 0 0 1 1 12c1.75-3.89 5.95-7 11-7 1.61 0 3.14.36 4.52 1L15.92 7.6A4.98 4.98 0 0 0 12 8c-1.1 0-2.1.36-2.92.96L5.64 3.64ZM12 18a6.99 6.99 0 0 0 5.22-2.19l-1.42-1.42A4.99 4.99 0 0 1 12 16a4.99 4.99 0 0 1-2.9-.96l-1.42 1.42A6.99 6.99 0 0 0 12 18Zm-4.24-2.76 10.4-10.4L18 4.76l-10.4 10.4L7.76 15.24Z" />
  </svg>
);

const IconChevronDown = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6z" />
  </svg>
);

const IconChevronUp = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
  </svg>
);

const ContrastLensPanel = () => {
  const [storyRoot, setStoryRoot] = useState<HTMLElement | null>(null);
  const [openIndexes, setOpenIndexes] = useState<Record<number, boolean>>({});
  const [highlightedIndexes, setHighlightedIndexes] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setStoryRoot(document.querySelector('#storybook-root'));
  }, []);

  const findings = useMemo(() => {
    if (!storyRoot) return [];
    return runAllRules(storyRoot);
  }, [storyRoot]);

  useEffect(() => {
    return () => {
      removeHighlights(findings);
      removeHighlightStyles();
    };
  }, [findings]);

  useEffect(() => {
    if (findings.length === 0) {
      removeHighlightStyles();
      return;
    }

    const hasHighlights = Object.values(highlightedIndexes).some(Boolean);

    if (hasHighlights) {
      injectHighlightStyles();
    }

    findings.forEach((finding, index) => {
      if (highlightedIndexes[index]) {
        finding.element.classList.add(HIGHLIGHT_CLASS);
      } else {
        finding.element.classList.remove(HIGHLIGHT_CLASS);
      }
    });

    if (!hasHighlights) {
      removeHighlightStyles();
    }
  }, [findings, highlightedIndexes]);

  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleHighlight = (index: number) => {
    setHighlightedIndexes((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (!storyRoot) {
    return <div>No story root found.</div>;
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#262626' }}>
      <h2 style={{ marginBottom: 16 }}>Contrast Issues</h2>
      {findings.length === 0 ? (
        <p>No issues found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {findings.map((finding, i) => (
            <li
              key={i}
              style={{
                border: '1px solid #e8e8e8',
                borderRadius: 12,
                padding: 14,
                marginBottom: 16,
                background: '#fff',
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 24,
                        height: 24,
                        borderRadius: 9999,
                        background: finding.severity === 'error' ? '#fff1f0' : '#fff7e6',
                        color: finding.severity === 'error' ? '#cf1322' : '#d48806',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {finding.severity[0].toUpperCase()}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <strong style={{ display: 'block', fontSize: 14 }}>{finding.message}</strong>
                      <span style={{ color: '#525252', fontSize: 12 }}>{finding.ruleId}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <IconButton
                    label={highlightedIndexes[i] ? 'Hide highlight' : 'Highlight'}
                    active={highlightedIndexes[i]}
                    onClick={() => toggleHighlight(i)}
                  >
                    {highlightedIndexes[i] ? <IconEyeOff /> : <IconEye />}
                  </IconButton>
                  <IconButton
                    label={openIndexes[i] ? 'Hide details' : 'Show details'}
                    active={openIndexes[i]}
                    onClick={() => toggleOpen(i)}
                  >
                    {openIndexes[i] ? <IconChevronUp /> : <IconChevronDown />}
                  </IconButton>
                </div>
              </div>
              {openIndexes[i] && (
                <div style={{ marginTop: 14, fontSize: 13, color: '#424242', lineHeight: 1.5 }}>
                  <div style={{ marginBottom: 6 }}>
                    <strong>Element:</strong>{' '}
                    <span style={{ color: '#111' }}>{finding.element.tagName.toLowerCase()}</span>
                    {finding.element.id ? <span style={{ color: '#595959' }}>#{finding.element.id}</span> : null}
                    {finding.element.className ? (
                      <span style={{ color: '#595959' }}>
                        .{String(finding.element.className).split(' ').join('.')}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <strong>Path:</strong>{' '}
                    <span style={{ color: '#111' }}>{finding.element.outerHTML.slice(0, 120)}...</span>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

addons.register('contrast-lens-addon', () => {
  addons.add('contrast-lens/panel', {
    type: types.PANEL,
    title: 'Contrast Lens',
    render: ContrastLensPanel,
  });
});
