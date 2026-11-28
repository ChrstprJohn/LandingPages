# Aldena browser verification

The Vite app was compared with the published Aldena homepage in two Codex browser tabs. [Reference](https://aldena.framer.media/)

## Layout

- Compared the homepage at actual viewport widths of 1280, 1024, and 390 CSS pixels.
- Rechecked the homepage, About, Works, Contact, and Journal at desktop widths of 1518 and 1914 CSS pixels and at 390 CSS pixels. Wide desktop content caps at 1600 CSS pixels including its gutters.

## Motion and controls

| Component | Observed behavior | Verification |
| --- | --- | --- |
| Homepage reload | Desktop starts on black with the masthead centered. The portrait, grain, and lower content appear as the masthead moves to the top. At the user’s request, the local phone layout also plays this centered intro with a shorter hold and 80 px of lower-content travel. | Reloaded both versions and sampled the layers through the reveal. Verified the local black title frame and subsequent hero on a 390 × 844 CSS pixel viewport. |
| Hero services | The card advances on a timer. Previous and next advance in either direction, with the old text fading before the new text appears. | Exercised autoplay and both arrows. The visible counter can also pause or restart rotation. |
| Studio introduction | The video plays in view and the founder text brightens progressively as it enters. | Confirmed a loaded film and partially revealed words during scroll. |
| Featured work | The square foreground, backdrop, and large title move at different rates. Hover opens the image and widens the caption from one to two thumbnail widths. The pointer shows “View More.” | Compared Marrow Coffee on the homepage and Aster Bloom in Works. At 1914 CSS pixels the opened Aster preview measured about 1125 px wide on both sites. |
| Services | The desktop carousel previews adjacent cards. Hover dims the active background and reveals a smaller image. Compact screens stack the cards. | Tested arrows and keyboard input. Confirmed the background returns to full opacity after pointer-out. |
| Process and FAQ | Process selects one stage. FAQ answers can be opened and closed independently. | Exercised both behaviors in the browser. |
| Testimonials | The stage stays pinned while scrolling advances and reverses the cards. | Scrolled through the stack with native keyboard input. |
| Site navigation | The floating menu opens over the page and links to the corresponding routes. | Tested desktop and mobile menu states, Escape, search, filters, and linked pages. |
| CTA | Its text moves horizontally in proportion to the section’s distance from the top of the viewport. The portrait mask stays 400 px wide at desktop sizes. | With the section 213 px below the top, both sites measured a headline offset of 113.69 px. Repeated the measurement while scrolling back. |
| About | Studio words brighten progressively from 40% white. The awards tiles are 180 px squares. Metrics reserve the number line and use the reference’s white digits on white. | Sampled the intro and awards at the screenshot’s viewport width. |
| Page headings and detail entry | About, Works, Contact, and Journal titles move 20 px per letter with a stagger. The case-study cover is already visible when the link opens, while the copy and cover settle into place. | Sampled reference and local headings and independently checked all six project covers at scroll position zero. Opened all six articles. |
| Journal hover and cursor | The image stays at its resting crop and dims to 25% opacity while the description appears. Journal cards and navigation links enlarge the cursor from 14 to 40 px. | Checked journal filtering, hover, and pointer styling, then opened an article through its card. |

## Screenshot follow-up

Replayed the supplied scenes at 1518 × 747 CSS pixels and checked the case-study layout and Process controls at 390 × 844.

| Screenshot | Reference measurements and comparison |
| --- | --- |
| 1. Masthead | Compared a stationary hover and a sweep across “Aldena.” Earlier letters retain fine particles as the pointer moves on, then recover. The pointer effect uses a Canvas recreation with a 540 ms recovery window. |
| 2. Case-study click | Captured two opaque View Transition snapshots moving upward by one viewport height over 400 ms with `cubic-bezier(.27, 0, .51, 1)`. The link opens Aster Bloom at scroll zero and Back restores the listing position. The title is 92 px Baskervville at desktop and 48 px on the phone view. |
| 3. Project hover | Nova Grid measures about 527 px at rest and 1,053 px expanded at the tested desktop width. The image, caption, and “View More” cursor now respond to the same hit area. Moving to Process cleared the preview state. |
| 4. Services | The carousel begins hidden, 40 px below its layout position, and enters when about half the shifted layer is visible. Its opacity and translation settle together. The heading, description, and price use independent visibility crossings. Sampled intermediate frames at 1280 × 720. |
| 5. Process | Discovery opens by default. Pointer entry promotes a new row and the selection remains after pointer-out. Enter and click select the same row through its button. |
| 6. Testimonials | Each outgoing card travels 900 px upward over 250 px of scroll, moving 45 px sideways and rotating 8° in alternating directions. Fade follows the lift. Compared forward, backward, and intermediate stages. |
| 7. Dividers | Process and FAQ dividers grow from the left as a group and settle at full row width and 10% opacity. The FAQ lines measured 939 px across at the desktop width. |
| 8. Journal | The title words and description reveal before the card grid. The grid begins 40 px down, triggers when about half that shifted layer is visible, and eases in more gradually than Services. It stays visible on scroll-back. |

At 1280 CSS pixels, the About studio image frame measures 1185 × 635 px on both sites. The values cards use transparent fills, 20% white outlines, and four markers that light progressively across the sequence.

The contact form prepares an email draft. The newsletter displays a local-preview status. Particle motion and easing were tuned from browser observations and use a native React and GSAP implementation.
