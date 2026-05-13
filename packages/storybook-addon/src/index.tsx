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
      outline: 3px dashed red !important;
      box-shadow: 0 0 0 4px rgba(255, 0, 0, 0.5) !important;
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

const applyHighlights = (findings: Array<{ element: Element }>) => {
  findings.forEach((finding) => {
    finding.element.classList.add(HIGHLIGHT_CLASS);
  });
};

const removeHighlights = (findings: Array<{ element: Element }>) => {
  findings.forEach((finding) => {
    finding.element.classList.remove(HIGHLIGHT_CLASS);
  });
};

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
    <div>
      <h2>Contrast Issues</h2>
      {findings.length === 0 ? (
        <p>No issues found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {findings.map((finding, i) => (
            <li
              key={i}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
                background: '#fff',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div>
                  <strong>{finding.severity.toUpperCase()}</strong>
                  <div style={{ marginTop: 4 }}>{finding.message}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={() => toggleHighlight(i)}>
                    {highlightedIndexes[i] ? 'Hide highlight' : 'Highlight'}
                  </button>
                  <button type="button" onClick={() => toggleOpen(i)}>
                    {openIndexes[i] ? 'Hide details' : 'Show details'}
                  </button>
                </div>
              </div>
              {openIndexes[i] && (
                <div style={{ marginTop: 12, fontSize: '0.95rem', color: '#333' }}>
                  <div>
                    <strong>Rule:</strong> {finding.ruleId}
                  </div>
                  <div>
                    <strong>Element:</strong> {finding.element.tagName.toLowerCase()}
                    {finding.element.id ? `#${finding.element.id}` : ''}
                    {finding.element.className ? `.${String(finding.element.className).split(' ').join('.')}` : ''}
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
