# button-no-border

Button controls need a boundary that remains distinguishable when Windows forced-colors mode replaces authored colors and removes box shadows.

The rule evaluates the button's current computed border and inspects accessible stylesheet rules for borders explicitly removed in `:hover`, `:active`, `:focus`, `:focus-visible`, `:disabled`, and `[aria-disabled='true']` states.

State inspection is static: it cannot activate pseudo-classes or fully reproduce the CSS cascade. Cross-origin stylesheets may also deny CSSOM access. When this happens, the rule produces a warning that its interaction-state results may be incomplete. Treat state findings as evidence of an explicit border reset, and still review the final rendered states manually.

## Reliable button boundaries

Windows forced-colors mode can render borders from the following combinations. Although a positive width can render, this rule warns when a border is less than 2px wide because thinner boundaries can be less distinguishable.

| Width                                 | Style                                   | Color               | Rule result | Forced-colors behavior                                                                     |
| ------------------------------------- | --------------------------------------- | ------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| `2px` or greater                      | `solid`                                 | `transparent`       | Pass        | The border geometry is retained and the browser can replace its color with a system color. |
| `2px` or greater                      | `solid`                                 | Authored color      | Pass        | The authored border color is replaced with an appropriate system color.                    |
| `2px` or greater                      | `solid`                                 | `ButtonBorder`      | Pass        | Explicitly uses the boundary color selected for buttons.                                   |
| `2px` or greater                      | `solid`                                 | `ButtonText`        | Pass        | Usually visible, although `ButtonBorder` expresses the purpose more accurately.            |
| Less than `2px`, but greater than `0` | Any rendered style                      | Any supported color | Warning     | The border can render, but may be difficult to distinguish.                                |
| `2px` or greater                      | `dashed` or `dotted`                    | Any supported color | Warning     | The pattern remains, but is less distinct than a solid boundary.                           |
| `2px` or greater                      | `double`                                | Any supported color | Warning     | Can remain visible when wide enough to render both lines.                                  |
| `2px` or greater                      | `groove`, `ridge`, `inset`, or `outset` | Any supported color | Warning     | Can render, but the result is less predictable across palettes and browsers.               |
| Any width                             | `none` or `hidden`                      | Any                 | Error       | No border is rendered.                                                                     |
| `0`                                   | Any                                     | Any                 | Error       | No border is rendered.                                                                     |
| Any                                   | No rendered border; `box-shadow` only   | Any                 | Error       | Forced-colors mode removes the box shadow, leaving no dependable boundary.                 |

## Passing

Native buttons with an intact browser-default border pass:

```html
<button>Submit</button>
```

A solid border at least 2px wide passes. A transparent border preserves the border geometry without changing the normal design, and forced-colors mode can replace its color with the user's system color:

```html
<button style="border: 2px solid transparent">Submit</button>
```

## Warnings

A rendered border less than 2px wide produces a warning:

```html
<button style="border: 1px solid transparent">Submit</button>
```

Dashed, dotted, double, groove, ridge, inset, and outset borders also produce warnings. They can remain visible in forced-colors mode, but a solid border is the clearest and most predictable treatment:

```html
<button style="border: 2px dashed transparent">Submit</button>
```

## Errors

Buttons with no rendered border produce an error. This includes `none`, `hidden`, zero-width borders, and controls whose only visual boundary is a box shadow. Forced-colors mode removes box shadows.

```html
<button style="border: none; box-shadow: 0 0 0 2px blue">Submit</button>
```

## Recommendations

Use these approaches in order of preference:

1. Keep the browser's native button appearance when a custom design is not required.
2. For a custom button, retain a `2px solid transparent` border in every mode. This preserves its dimensions and gives forced-colors mode a border to recolor.
3. If the normal design must use `border: none`, restore a solid border inside `@media (forced-colors: active)`.
4. Use CSS system colors so the component follows the palette selected by the user.
5. Review default, hover, active, keyboard-focus, and disabled states in both light and dark Windows contrast themes.

Recommended system colors:

| Purpose                                    | System color    |
| ------------------------------------------ | --------------- |
| Button boundary                            | `ButtonBorder`  |
| Button text                                | `ButtonText`    |
| Button background                          | `ButtonFace`    |
| Hover, active, or emphasized state         | `Highlight`     |
| Text displayed on a highlighted background | `HighlightText` |
| Disabled text and boundary                 | `GrayText`      |

Do not depend on the following as the only button boundary:

- `box-shadow` or `text-shadow`, because forced-colors mode removes them.
- A background color, gradient, or other non-URL background image, because forced-colors mode can replace or remove it.
- A focus outline, because it only identifies the button while it has keyboard focus.
- An ARIA `role="button"` to trigger native button colors. Forced-color behavior is based on native element semantics, so custom buttons need explicit styling.

Avoid `forced-color-adjust: none` unless the component fully manages every color and interaction state using accessible system colors. Opting out can override colors the user depends on.

### Recommended forced-colors states

Keeping a transparent border is the simplest option. Components that remove their normal border should restore the boundary and interaction states explicitly:

```css
.button {
    border: 2px solid transparent;
}

@media (forced-colors: active) {
    .button {
        border-color: ButtonBorder;
        color: ButtonText;
        background: ButtonFace;
    }

    .button:hover,
    .button:active {
        border-color: Highlight;
    }

    .button:focus-visible {
        outline: 2px solid Highlight;
        outline-offset: 2px;
    }

    .button:disabled,
    .button[aria-disabled='true'] {
        border-color: GrayText;
        color: GrayText;
    }
}
```

The rule detects common explicit border resets in accessible stylesheets. Confirm the following states manually as well:

- The boundary remains visible at rest.
- Hover and active states remain distinguishable without relying only on subtle color changes.
- `:focus-visible` has a clear indicator that is distinct from the normal boundary.
- Disabled buttons remain identifiable but visibly different from enabled buttons.
- The component works with customized palettes, not only the default Windows contrast themes.

## References

- [MDN: `forced-colors`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/forced-colors)
- [MDN: CSS system colors](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/system-color)
- [Microsoft: Windows High Contrast mode](https://learn.microsoft.com/en-us/fluent-ui/web-components/design-system/high-contrast)
- [W3C: CSS Color Adjustment Module](https://www.w3.org/TR/css-color-adjust-1/)
- [W3C: Understanding Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
