// Background script for Contrast Lens extension
console.log('Contrast Lens background script loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Contrast Lens extension installed');
});
