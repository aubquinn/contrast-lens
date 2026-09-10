// Background script for Contrast Lens extension
console.log('Contrast Lens background script loaded');

// Open the side panel when the toolbar icon is clicked.
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('Contrast Lens extension installed');
});
