import React from 'react';
import { addons, types } from '@storybook/addons';
import { runRules } from '@contrast-lens/engine';

const ContrastLensPanel = () => {
  // Get the current story's DOM
  const storyRoot = document.querySelector('#storybook-root');
  if (!storyRoot) return <div>No story root found.</div>;

  // Run rules on the story
  const findings = runRules(storyRoot, []); // TODO: pass rules

  return (
    <div>
      <h2>Contrast Issues</h2>
      {findings.length === 0 ? (
        <p>No issues found.</p>
      ) : (
        <ul>
          {findings.map((finding, i) => (
            <li key={i}>
              {finding.severity}: {finding.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

addons.register('contrast-lens-addon', (api) => {
  // Add a panel to show contrast issues
  addons.add('contrast-lens/panel', {
    type: types.PANEL,
    title: 'Contrast Lens',
    render: ContrastLensPanel,
  });
});
