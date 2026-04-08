// Content script that runs on web pages
// This will be replaced with the actual engine code during build
console.log('Contrast Lens content script loaded');

// Function that can be called from popup
window.contrastLensScan = function() {
  // This will be replaced with actual engine code
  return [
    { severity: 'error', message: 'Button without border detected', element: 'button' },
    { severity: 'warning', message: 'Custom role="button" used', element: 'div' }
  ];
};
