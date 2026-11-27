# Decõ Coffee

A React, Vite, Tailwind CSS, and GSAP site for Decõ Coffee. The menu, all 24 item details, beans, locations, about, contact, terms, and privacy pages render locally. Images and fonts are served from this project. The contact form prepares a draft in the visitor’s email app, using an example address for this fictional café. A production host must serve `index.html` for direct requests to local page routes. [Tamp Coffee layout reference](https://tamp-coffee.framer.website/)

[Photo credits and licenses](PHOTO-CREDITS.md)

From the workspace root, with dependencies installed:

```powershell
pnpm --config.verify-deps-before-run=false --filter tamp-coffee dev
pnpm --config.verify-deps-before-run=false --filter tamp-coffee build
```

## Reference behavior

| Component | Trigger and resting state | Movement and reset |
| --- | --- | --- |
| Hero | Espresso starts in the center. The adjacent drinks are half-sized and clickable. | Autoplay advances about every five seconds. The slides translate and scale over 700 ms, with a 500 ms opacity transition. Captions fade in and out over 400 ms. |
| Header | Desktop navigation stays at the top. Below 810 px a menu button opens the overlay. | The drawer slides open and closes from the toggle, a link, or Escape. The theme selection persists across reloads. |
| Partners | The names move horizontally on a loop. | The strip fades as it enters view, moves at about 30 px per second, and pauses off-screen. |
| Menu | Popular is selected on the homepage. All is selected on the full menu. | Filters update the results and URL together. Card hover scales the photo to 104% inside its clipping frame and resets when the pointer leaves. |
| Statistics | Counters, bars, and rings animate as each tile enters view. | Values settle to 1,400, 28, 8, 60, and 46. The rings settle at 28 of 30 seconds and 46%. |
| Reviews and rewards | Cups enter their visible area, and the stamps enter when the card scrolls into view. | Cups rise 48 px before their quotes reveal left to right over 1.6 seconds. Stamps rise 12 px and enter in sequence. The phone review rail scrolls horizontally. |
| About timeline | Cards pin and stack with separate desktop, tablet, and phone offsets. | Photos settle from 118% scale. The place, year, heading, and body enter at staggered positions as they scroll into view. |
| Beans and contact | Tips and form panels enter the viewport in their section. | Bean tips rise 60 px and scale from 96%. Contact panels rise 32 px while fading in. |
| Footer | Copy starts in its idle state. | A successful copy shows “Copied” briefly before resetting. |

The Codex comparison used matching 1296 × 810 desktop and 390 × 780 phone viewports. Wider viewport checks approximated desktop zoom-out. Scroll entrance durations and triggers were tuned from visible samples.
