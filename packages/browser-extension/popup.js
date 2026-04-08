// Popup script for the extension UI
document.getElementById('scan').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    // Execute content script to scan the page
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scanPage
    });

    displayResults(results[0].result);
  } catch (error) {
    console.error('Scan failed:', error);
    displayResults([{ severity: 'error', message: 'Failed to scan page: ' + error.message }]);
  }
});

function scanPage() {
  // This function runs in the page context
  // For now, return mock accessibility issues
  // TODO: Replace with actual contrast lens engine
  const issues = [];

  // Check for buttons without borders
  const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"], input[type="reset"]');
  buttons.forEach(button => {
    const style = window.getComputedStyle(button);
    const hasBorder = style.borderWidth !== '0px' && style.borderWidth !== '' &&
                     style.borderStyle !== 'none';

    if (!hasBorder) {
      issues.push({
        severity: 'error',
        message: 'Button without visible border',
        element: button.tagName.toLowerCase()
      });
    }
  });

  // Check for custom role="button"
  const customButtons = document.querySelectorAll('[role="button"]');
  customButtons.forEach(element => {
    if (!element.matches('button, input[type="button"], input[type="submit"], input[type="reset"]')) {
      issues.push({
        severity: 'warning',
        message: 'Custom element with role="button"',
        element: element.tagName.toLowerCase()
      });
    }
  });

  return issues;
}

function displayResults(findings) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (findings.length === 0) {
    resultsDiv.innerHTML = '<p style="color: green;">✓ No accessibility issues found!</p>';
    return;
  }

  findings.forEach(finding => {
    const div = document.createElement('div');
    div.className = `finding ${finding.severity}`;
    div.innerHTML = `<strong>${finding.severity.toUpperCase()}:</strong> ${finding.message}`;
    resultsDiv.appendChild(div);
  });
}
