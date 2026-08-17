import { addons, types } from 'storybook/manager-api';
import { ContrastLensPanel } from './index';

const ADDON_ID = 'contrast-lens-addon';
const PANEL_ID = 'contrast-lens/panel';

console.log('[ADDON MANAGER] Manager file loading...');

addons.register(ADDON_ID, () => {
    console.log('[ADDON MANAGER] Register callback called');

    addons.add(PANEL_ID, {
        type: types.PANEL,
        title: 'Contrast Lens',
        render: ContrastLensPanel,
    });

    console.log('[ADDON MANAGER] Panel registered successfully');
});

console.log('[ADDON MANAGER] Manager file fully loaded');
