# link-no-forced-colours-opt-out

A native `<a href="…">` is recognized by the browser as a link and mapped to the system `LinkText` color (and `VisitedText`/`ActiveText` for its other states) in Windows Forced Colors mode. `forced-color-adjust: none` explicitly opts the element out of that treatment, so authored colors are rendered as-is instead of being replaced with the user's chosen system colors.

The rule inspects the link's inline style and accessible stylesheet rules for a matching `forced-color-adjust: none` declaration, and also checks the link's computed style to catch the value being inherited from an ancestor, since `forced-color-adjust` is an inherited property.

Rule inspection is static: it evaluates every `@media`/`@supports` block regardless of whether it currently matches, because the highest-risk pattern is scoping the opt-out inside `@media (forced-colors: active)` so it only takes effect once a user has actually turned Forced Colors on. Cross-origin stylesheets may deny CSSOM access; when this happens, the rule produces a warning that its result may be incomplete.

## Scope

This rule only evaluates `<a>` elements with an `href` attribute. An `<a>` without `href` is not exposed as a link and does not receive Forced Colors link treatment in the first place, so it is out of scope here. Link-like elements built from a non-anchor tag (for example `<span onclick="navigate()">`) are a semantic-HTML problem better caught by other accessibility linters, not this rule.

## Passing

A link with no `forced-color-adjust` override passes, including one that only customizes its normal-mode color:

```html
<a href="/settings">Settings</a>
```

```html
<a href="/settings" style="color: red">Settings</a>
```

Re-declaring a system color inside `@media (forced-colors: active)` is unnecessary but harmless, and still passes:

```css
@media (forced-colors: active) {
    a {
        color: LinkText;
    }
}
```

## Errors

Any `forced-color-adjust: none` that applies to the link is an error, whether it is authored inline, in an unconditional rule, or scoped inside a conditional block such as `@media (forced-colors: active)`:

```html
<a href="/settings" style="forced-color-adjust: none">Settings</a>
```

```css
@media (forced-colors: active) {
    a {
        forced-color-adjust: none;
    }
}
```

Because `forced-color-adjust` is inherited, an ancestor can opt a link out even when the link itself declares nothing:

```html
<nav style="forced-color-adjust: none">
    <a href="/settings">Settings</a>
</nav>
```

## Recommendations

1. Use a semantic `<a href>` element for links and let the user agent apply its native Forced Colors link treatment.
2. Avoid `forced-color-adjust: none` unless there is a specific, tested reason to opt out.
3. If an opt-out is unavoidable, re-implement every color and interaction state (default, visited, hover, focus, active) with CSS system colors inside `@media (forced-colors: active)`, and confirm the result in both light and dark Windows contrast themes.
4. Check parent containers as well as the link itself: an ancestor's `forced-color-adjust: none` silently disables Forced Colors treatment for every link nested inside it.

Recommended system colors:

| Purpose                          | System color    |
| -------------------------------- | --------------- |
| Link text                        | `LinkText`      |
| Visited link text                | `VisitedText`   |
| Active link text                 | `ActiveText`    |
| Text on a highlighted background | `HighlightText` |

## References

- [MDN: `forced-color-adjust`](https://developer.mozilla.org/en-US/docs/Web/CSS/forced-color-adjust)
- [MDN: `forced-colors`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/forced-colors)
- [MDN: CSS system colors](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/system-color)
- [Microsoft: Windows High Contrast mode](https://learn.microsoft.com/en-us/fluent-ui/web-components/design-system/high-contrast)
- [W3C: CSS Color Adjustment Module](https://www.w3.org/TR/css-color-adjust-1/)
