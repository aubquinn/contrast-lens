# @contrast-lens/test-components

A collection of React components designed to test accessibility rules and demonstrate the Contrast Lens Storybook addon.

## Components

### Good Components (Should Pass Accessibility Checks)
- `GoodButton` - Button with proper visible border
- `DefaultBrowserButton` - Default browser button with native styling
- `GoodButtonWithShadow` - Button with visible border using box-shadow
- `GoodInputButton` - Input button with proper visible border

### Bad Components (Should Fail Accessibility Checks)
- `BadButtonNoBorder` - Button with `border: none` (triggers error)
- `BadButtonWithShadow` - Button with drop shadow but no border (triggers error)
- `BadButtonDotted` - Button with `border: dotted` (triggers error)
- `BadButtonDashed` - Button with `border: dashed` (triggers error)
- `BadButtonDouble` - Button with `border: double` (triggers error)
- `BadButtonGroove` - Button with `border: groove` (triggers error)
- `BadButtonRidge` - Button with `border: ridge` (triggers error)
- `BadButtonInset` - Button with `border: inset` (triggers error)
- `BadButtonOutset` - Button with `border: outset` (triggers error)
- `BadButtonHidden` - Button with `border: hidden` (triggers error)
- `BadCustomButton` - Div with `role="button"` (triggers warning)
- `BadInputButtonNoBorder` - Input button with no border (triggers error)

## Usage with Storybook Addon

1. Install the components and addon:
```bash
npm install @contrast-lens/test-components @contrast-lens/storybook-addon
```

2. Register the addon in `.storybook/main.ts`:
```typescript
import '@contrast-lens/storybook-addon';
```

3. Use the components in your stories:
```typescript
import { BadButtonNoBorder } from '@contrast-lens/test-components';

export const MyStory = () => <BadButtonNoBorder>Click me</BadButtonNoBorder>;
```

4. The Contrast Lens panel will automatically scan your stories and show accessibility violations.

## Testing

The included Storybook stories demonstrate both passing and failing accessibility checks. Use these to verify that the Contrast Lens addon correctly identifies accessibility issues.
