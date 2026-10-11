1. **Headline gap**:
   - In `index.html` and `courses.html`, remove `<br>` between `.h1-line-wrapper` elements.
   - In `style.css`, update `.h1` font size for `@media (min-width: 768px)` from `clamp(2.75rem, 6.2vw, 5.25rem)` to `clamp(2.75rem, 6.2vw, 4.5rem)`.
   - Update `.h1-line-wrapper` in `style.css` to keep headline on one line at >=1024px. Change `.h1-line-wrapper` to `display: inline-block;` (and handle `<br>` if necessary to still break lines below 1024px, or perhaps just remove `<br>` and add CSS to break at narrower widths, wait, the instruction says "remove the `<br>` that sits between the two `.h1-line-wrapper` elements ... Each of the two home headline lines must stay on ONE line at 1024px and wider." Let's check how they wrap. We can use flex or block/inline block). Actually if they are `display: block` they will break. If we change them to `display: block` they will be on two lines. But the instruction says "remove the `<br>`" and "Each of the two home headline lines must stay on ONE line at 1024px and wider." Wait, currently `.h1-line-wrapper` is `display: block;`. Removing `<br>` will keep them as two blocks (which means two lines). But the user says "Each of the two home headline lines must stay on ONE line at 1024px and wider." So maybe they wrap onto *more* than two lines? The clamp update from `5.25rem` to `4.5rem` is what fixes it at 1024px.
2. **Skip link**:
   - In `style.css`, change `.skip-link` `top` from `-40px` to `-100px`.
3. **Mobile header**:
   - In `style.css`, under `max-width: 767px`, add `margin-left: auto` to `.menu-toggle`.
4. **Hero alignment**:
   - In `style.css`, add `width: 100%` to `.hero > .container` and `.page-hero > .container`. We can add a rule: `.hero > .container, .page-hero > .container { width: 100%; }`.
5. **Orbit**:
   - In `index.html`, update the specific `<circle>` to `cx="380" cy="200" r="6" transform="rotate(60 200 200)"`. Wait, the original was `cx="380" cy="200" r="8" fill="var(--accent-bright)" />`. The instruction says "change it to cx="380" cy="200" r="6" with transform="rotate(60 200 200)"". So I'll replace it.
6. **Underline without JS**:
   - In `style.css`, change `.wavy-path` `stroke-dashoffset` to `400` *only* under `html.js`, so `.wavy-path` is visible (offset 0) by default without JS. So move the `stroke-dashoffset: 400` from `.wavy-path` to `html.js .wavy-path`.
7. **Courses page overlay SVGs**:
   - In `courses.html`, find and remove all `<rect x="0" y="0" width="320" height="240" fill="var(--accent)" fill-opacity="0.15" style="mix-blend-mode: overlay;"/>` elements. Also check featured illustration SVG for similar things.
8. **Compact the intro**:
   - In `style.css`, change `.page-hero` padding to `72px 0 32px;` on desktop and `56px 0 24px;` on mobile.
   - Remove `min-height` if it exists (maybe on `.hero` or `.page-hero`? Currently `.page-hero` doesn't have `min-height`, but maybe it inherits from `.hero`? I will check).
9. **Filter animation**:
   - In `script.js`, change the chip click filtering logic. When chip is clicked:
     - Non-matching cards fade out over 200ms (opacity 0) then get `hidden` attribute and `display: none`.
     - Matching cards are un-hidden (remove `hidden` attr, `display: flex`), then fade in over 300ms.
     - Respect `prefers-reduced-motion` (instant switch).
10. **Pre-commit**: Check the `pre_commit_instructions` tool.
