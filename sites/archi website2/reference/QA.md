# Reference comparison and validation

## Browser passes

Pass one inventoried all 19 routes and shared templates. Pass two compared desktop and mobile layouts, default/reload states, scroll behavior, hover and pointer-out, accordions, menus, listings, and related navigation, followed by corrections. Additional passes addressed user screenshots and the connected project rail.

Observed and implemented: hero entrance and desktop sticky fade/scale; mobile natural hero flow; expanding menu; 0.4-second upward native route transition; independent Services and award accordions; homepage third project selected by default; coupled resizing project rail with retained selection; journal image zoom to 1.3 with grayscale retained; opposing gallery loops; sticky project metadata and article sidebar; animated final statistics; filter/search/load-more behavior; footer theme differences.

At 1905×936, the reference and Decode both settle at approximately 211 px inactive and 423 px active. A pointer crossing changes the layout immediately while the painted cards animate from their old positions and sizes. The last hovered project stays selected after the pointer leaves. Decode uses an estimated easing curve and starts interrupted transitions from the current painted rectangles.

The Korda menu keeps its brand and toggle in place while links rise from 20 px below their final position. Decode shares the header geometry between both states and clips the link entrance. Checked Escape, focus restoration, and navigation to About. The home Journal uses white 10 px marks inset 8 px at the 1905 px comparison width.

## Requested differences

Decode branding; freely sourced replacement photos/video and locally created typographic partner marks; full-width Services; visible CSS-drawn plus icons; larger desktop hero composition based on the preferred 110% screenshot. Credits are available in the footer.

## Validation

All 19 routes were checked in the browser for a single header, no horizontal overflow, complete detail content, and loaded images. Desktop and 390px mobile layouts were reviewed. All nine project and six article pages are populated. Contact and newsletter demo feedback was exercised locally. Automated verification checks route data, related slugs, complete body sections, all 191 media references and local asset existence. Production build passes.

Zoom-out layout proportions were checked with CSS viewport approximations at 1920, 2133, 2400, 2866 and 3840 widths. The browser tool did not expose effective native browser zoom; these are not a claim of native zoom verification. Browser zoom-in is not canceled. Exact spring physics and timing are visually approximated.

## Reusable skill

The installed recreate-reference skill now requires per-route interaction discovery, reload defaults, layered hover inspection, scroll reversal, continuous loops, independent accordion states, native transition inspection, responsive/zoom comparisons, asset substitution checks, and sampled coupled-layout motion. Updated source copies are in reference/skill-update.
