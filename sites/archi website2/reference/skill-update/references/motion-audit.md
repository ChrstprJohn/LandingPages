# Motion audit for website recreations

Use this when inspecting a reference with hover effects, scroll effects, entrance animations, interactive galleries, or route transitions. Maintain one compact inventory in the project so implementation and verification use the same observed behavior.

## Discover before choosing an effect

Visit every in-scope route when all pages are requested. Record each route's template and any distinct interaction. Group identical behavior for implementation, but check shared components again where their layout or placement changes. Follow navigation, related links, filters, pagination, and menus to discover less-visible pages.

At each actual breakpoint, inspect the full composition before reusing a component: a laptop grid may become an expanding desktop rail; horizontal strips may become vertical columns; desktop filter buttons may become a mobile select; visible descriptions may actually belong to collapsed accordions. An accessibility tree can include hidden or collapsed content. Confirm rendered visibility, bounding rectangles, and expanded state.

Record a fresh-load default with the pointer outside the component. Then hover/focus another item and leave the component. Distinguish initial selection, hovered selection, retained last selection, and automatic advancement. Reload once more to confirm the default. Do not infer a default from a screenshot taken after moving the pointer.

## Evidence table

For each distinct behavior, record:

| Route/component | Trigger and default | Moving layer | Start/intermediate/end | Reverse/reset | Evidence and confidence |
| --- | --- | --- | --- | --- | --- |
| Actual observed component | Pointer, click, scroll range, load, or timer | Card, media wrapper, image, text, icon, or whole section | Transform, opacity, clipping, dimensions, duration/easing/stagger | Pointer-out, scroll-back, reload, history, repeated input | Screenshot and/or measured styles; mark estimates |

Do not fill unknown measurements with familiar animation defaults. Observe the reference first. If the available browser API cannot capture an exact duration or intermediate frame, label it estimated. Use only documented browser APIs; DOM evaluation is read-only. Confirm the target really matches `:hover` or contains keyboard focus before claiming a hover was exercised.

## Observe motion, not only settled layouts

- **Load:** reload from the top and capture the beginning before waiting for the settled screen. Check image scale/opacity separately from text, header, and page entrance. Ordinary reload and internal navigation may have different sequences.
- **Hover:** inspect the card, its media wrapper, and image independently. Compare the layout rectangle with the painted rectangle. Determine whether the image zooms inside a fixed clip, the whole card shrinks, neighboring cards resize, grayscale changes, corner marks move, or only text appears. Capture pointer-out as well. Keep titles, captions, and focus marks still when the reference does.
- **Scroll:** approach from before the trigger in small increments. Record actual scroll positions and viewport dimensions. Distinguish a one-time timed entrance from continuously scrubbed progress, sticky/pinned content, overlapping sections, and viewport-relative parallax. Scroll backward and re-enter to determine replay/reversal behavior. Do not hide everything at page load and complete all reveals before their sections enter view. Record sticky sidebars and summaries separately from pinned covers; measure their viewport height, top offset, and release at the section boundary. For counters, distinguish server-rendered starting numbers from the settled target values.
- **Expand/filter:** test the initial open state, more than one simultaneous expansion, toggle-off, reset, no-results, and repeated input where relevant. Recalculate downstream scroll triggers after animated layout changes finish. Mobile controls may use a different interaction. Check icon size and hit area at rest and after expanding; a clickable row with an almost invisible plus is still a defect.
- **Continuous media:** measure direction and position across two observations; inspect hover, focus, pause, and loop seams. Do not assume hover pauses motion. Preserve reference controls and provide an accessible equivalent where needed.
- **Routes:** test a real internal click and browser back/forward. Capture applied View Transition pseudo-element styles and current keyframes while active if ordinary DOM transforms do not explain the motion. Check new-page scroll position, rapid navigation, and duplicate/stale interactive nodes after transitions.

## Measure the first hero frames

Reload both sites and sample the first rendered frames. Compare the initial background, image opacity and scale, and when the navigation and text become visible. Time each layer from its first change because load latency varies. If the image appears halfway through a fade on a slower load, start the entrance when the image is ready and allow the text to reveal if the image fails. Compare the settled cover separately and respect reduced motion.

## Measure coupled card motion

- On a fresh load, move the pointer outside the rail and scroll across its entry threshold in small increments. Measure every card width before and after the trigger. Then hover the leftmost card, move to its neighbor, move outside, and scroll out and back. This distinguishes an equal-width first paint, automatic default selection, user selection, retained selection, and reset.
- Sample several frames with timestamps during the same pointer movement on both sites. For each moving card, record layout width (such as offsetWidth), painted bounds (getBoundingClientRect), and opacity on the wrapper, media, and caption. Immediate layout changes with continuously moving painted boxes point to a transform-based transition. Measure the outgoing and incoming cards together before tuning the curve.
- Measure caption title line height and its left and bottom-edge offsets relative to the painted image, including while the previous card is shrinking. A parent scale can change painted text size even with the same computed font-size. If the reference title stays constant, scale the media and keep the caption text at its native size. Follow the moving image edge and measure its wrapping width separately. Test a second hover before the first transition ends.
- If a card and caption both look too dark, inspect ancestor opacity before changing the photos. A staggered wrapper fade can multiply an otherwise correct inactive-media opacity. Sample after the scroll entrance and again during selection. Remove extra opacity only where the reference evidence supports it.

## Measure mobile sections

- Match the actual viewport and content widths, not the width of a screenshot including the browser chrome or phone frame. Record device width, scrollbar or gutter, and section bounds. Align each comparison by a shared heading, image edge, or section boundary. Wait for font loading and entrance motion, and compare identical accordion and menu states.
- Measure text by its available width, line height, rendered line count, and local inset. For example, a Services label wrapping on a phone can come from the heading size, accordion icon width, row gap, or container padding. Inspect each before editing. In a journal card, measure the image ratio, card height, caption inset, and gap between cards. With replacement photos, check the painted crop against the frame and keep a recognizable subject in view.
- Inspect visual order as well as dimensions. A mobile contact form may precede its info cards, and a newsletter button may stack below its input. Verify focus follows the intended reading order. For a menu, measure the header and the bottom of the panel, then compare the free space above and below the links and socials as a group. Check a shorter viewport so the content remains scrollable.
- When the request is mobile-only, scope changes to the affected breakpoint and section. Test a narrow phone and the supplied phone width, then open the same section above the mobile breakpoint and confirm the accepted desktop behavior. When an image changes by breakpoint, inspect the selected image source and the rendered crop at both widths.

## Apply and verify

Implement the observed effects in shared components, including the confirmed initial states and breakpoint variants. Preserve explicit user changes even when they differ from the reference. Verify accessible focus/touch and reduced-motion states without inventing conspicuous additional effects.

Keep static comparison and motion comparison as separate gates. After a fix, reload the local page and repeat the same trigger at the same actual viewport and scroll position. A build, correct route, no-overflow result, or settled screenshot does not verify animation fidelity. Mark each inventory item observed, implemented, verified, or limited; report material unresolved differences honestly. Recheck page-specific footer themes and shared controls instead of assuming every route uses the homepage variant. When a user requests replacement stock media, preserve the measured geometry and motion while checking every image/video source, crop, poster, and credit.
