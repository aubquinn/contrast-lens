# Contrast Lens

Contrast Lens is a comprehensive accessibility toolkit that fills a critical gap in web accessibility testing. While traditional tools like Axe Core focus on WCAG guidelines, high contrast mode—a feature used by millions of users—is not covered by WCAG standards. This project provides automated rule checking, browser extensions, and Storybook integration specifically for high contrast mode compliance.

## Packages

### Core Engine (`packages/engine`)
The heart of Contrast Lens - contains accessibility rules and evaluation logic.

**Key Features:**
- `runAllRules()` - Check all accessibility rules against a DOM element
- `runRules(rules, root)` - Run specific rules against a DOM root
- Custom rules for high contrast mode compliance

**Rules Included:**
- `buttonNoBorderRule` - Buttons must have visible borders (error)
- `roleButtonUsedRule` - Warns about custom `role="button"` elements

### Browser Extension (`packages/browser-extension`)
A Chrome extension that scans web pages for accessibility issues.

**Features:**
- Popup UI for scanning current page
- Real-time accessibility violation reporting
- Built using Chrome Extension Manifest V3

**Installation:**
Load `packages/browser-extension/dist/` as an unpacked extension in Chrome.

### Storybook Addon (`packages/storybook-addon`)
Integrates Contrast Lens into Storybook for component development.

**Features:**
- Automatic scanning of story components
- Contrast Lens panel showing accessibility violations
- Real-time feedback during component development

**Usage:**
```typescript
// .storybook/main.ts
import '@contrast-lens/storybook-addon';
```

### Test Components (`packages/test-components`)
React components designed to test accessibility rules and demonstrate violations.

**Components:**
- ✅ `GoodButton` - Properly accessible button
- ❌ `BadButtonNoBorder` - Button without border (fails)
- ❌ `BadCustomButton` - Custom role="button" (warns)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build all packages:**
   ```bash
   npm run build
   ```

3. **Run tests:**
   ```bash
   npm run test
   ```

## Usage Examples

### Using the Engine Directly
```typescript
import { runAllRules } from '@contrast-lens/engine';

const issues = runAllRules(document.body);
console.log('Accessibility issues:', issues);
```

### Browser Extension
1. Build the extension: `npm run build`
2. Load `packages/browser-extension/dist/` in Chrome
3. Click the extension icon and scan pages

### Storybook Integration
1. Install in your Storybook project:
   ```bash
   npm install @contrast-lens/storybook-addon @contrast-lens/test-components
   ```

2. Register the addon in `.storybook/main.ts`

3. Use test components to verify the addon works:
   ```typescript
   import { BadButtonNoBorder } from '@contrast-lens/test-components';

   export const FailingStory = () => <BadButtonNoBorder>Bad Button</BadButtonNoBorder>;
   ```

The Contrast Lens panel will show accessibility violations automatically.

## Development

- `npm run build` - Build all packages
- `npm run test` - Run engine tests
- `npm run typecheck` - Type check all packages
- `npm run clean` - Clean build artifacts

## Contributing

Add new accessibility rules to `packages/engine/src/rules/`, then export them from `packages/engine/src/rules/index.ts` and update `allRules` array.

