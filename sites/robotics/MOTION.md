# Robotics motion and layout checks

Decode now uses the reference for layout and motion while presenting web development services, a studio process, and original guides. The displayed wordmark and 3D DCD geometry are Decode assets. See [photo credits](ASSET-CREDITS.md) for the web development imagery.

The homepage, blog index, and four essay routes were inspected in the Codex in-app browser. Desktop and mobile screenshots were paired at the same viewport sizes wherever the comparison required static geometry.

| Area | Reference behavior and local implementation | Verification |
| --- | --- | --- |
| Homepage loading | The 00–100 counter runs for 3.8 seconds. The large desktop wordmark plays its forward and reverse sequence, then shrinks into the header. Masked headline lines, navigation, model, and CTA appear in order. Mobile starts with the smaller wordmark. | Compared the running counters at 44 and 41, then checked the settled wordmark, visible title, and restored scrolling. |
| Desktop investments | Lenis animates anchor navigation and wheel inertia. GSAP follows the hero with a half rotation of the 3D mark, shrinking and moving it up the rail. The project index pins higher as the mark leaves, with progress under the active row. The project headings reveal line by line at viewport entry. | Compared the hero, first project, Aescape, third project, team, and contact. Checked anchor landing, active rail progress, and the settled top position of the rail. |
| Mobile investments | Each sequence of media tiles loops leftward. The detail sheet slides in, reveals its title and metrics in order, and supports Previous, Next, and Escape. | At 390px the reference tracks completed a loop in about 15 seconds. Updated the local GSAP tweens to 15 seconds and measured all three advancing at that rate. Checked all three detail states and wraparound. |
| Team, navigation, and contact | Mobile profiles open one at a time. Full-screen overlays animate separately from the page. The email form validates the required name and email fields and opens a local mail draft. | Checked pointer and keyboard expansion, menu-to-section navigation, scroll locking, contact fields, and Escape dismissal. |
| Blog and essays | A full-screen color wipe runs on route changes. Back and related links use real URLs. The mobile blog has a shorter heading block and a taller decorative video above the full-width wordmark. | Checked all four essay routes, route history, and the wipe. At 390 × 844, the reference and local blog heading and video started at the same positions. |
| Footer and hover | Desktop overscroll reveals the large footer mark before it retracts. Hoverable text rolls within its row and the mobile footer renders inline. | Compared the contact and blog footer layouts. Exact overscroll and hover timing were estimated from the reference behavior. |

Desktop geometry was checked at 1360 and 1440 pixels, with 1600, 1800, and 2150 pixels used as zoom-out equivalents. Mobile checks covered 360 and 390 pixels. Those desktop widths are viewport approximations of browser zoom. The local essays, bios, and project descriptions use paraphrased copy.

After the Decode content update, the guide index was checked at actual viewport widths of 1440, 1600, 1800, and 2150 CSS pixels. Across the outer widths, the local guide row height increased from about 32 to 47 pixels, the navigation and footer link text increased from 9.9 to 14.8 pixels, and the artwork rose from 232 to 347 pixels tall. At 2150 pixels both sites used a 347-pixel artwork height. The reference title grew more slowly at this width than the proportional local title. These checks used viewport overrides.

At 390 × 844, a pointer click on Tomorrow Recycling’s More control and a pointer click on Close preserved the local background scroll position at 771 CSS pixels. Locator-based activation repositioned the page before the dialog settled. The reference and local sheets both reached Aescape, and the local Previous control wrapped from Tomorrow Recycling to The non-fiction revolution.

The public reference is [Mecha Capital](https://mecha-xyz.webflow.io/).

At 1440 × 900 the desktop guide index ends at the decorative artwork and has no extra scroll or footer lift. Decode now matches that composition, with the artwork starting at 668 CSS pixels. The mobile index still displays its inline footer.
