import { addons, types } from '@storybook/addons';
import { ContrastLensPanel } from './index';

console.log('[ADDON MANAGER] Manager file loading...');

addons.register('contrast-lens-addon', () => {
  console.log('[ADDON MANAGER] Register callback called');
  addons.add('contrast-lens/panel', {
    type: types.PANEL,
    title: 'Contrast Lens',
    render: ContrastLensPanel,
  });
  console.log('[ADDON MANAGER] Panel registered successfully');
});

console.log('[ADDON MANAGER] Manager file fully loaded');

