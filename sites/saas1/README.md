# Nouva

React, Vite, Tailwind CSS, and GSAP workspace app based on Kadir Calik’s Nouva template. [Framer template](https://www.framer.com/marketplace/templates/nouva/)

Run from the LandingPages workspace root after installing dependencies.

```sh
pnpm --filter saas1 dev
pnpm --filter saas1 build
```

The homepage contains the hero, statistics, dashboard introduction, feature stack, team benefits, comparison, testimonials, pricing and customer logos, FAQ, and final CTA. Linked pages include `/contact`, `/sign-in`, `/sign-up`, both `/legal/` pages, and `/404`.

The contact and email-code forms demonstrate local validation and display preview status. The billing switch preserves the reference’s visible $0 values in both modes.

## Motion checks

| Interaction | Observed behavior and verification |
| --- | --- |
| Hero load and scroll | The image scales down and fades in over about 1.75 seconds. The words rise 5 px with a short blur and stagger. The fixed header follows. The backdrop moves at roughly 40% of scroll travel and fades as the hero leaves. |
| CTA hover | The button keeps its size. The clipped label and fill move together over about 340 ms, including a slight overshoot and reversal on pointer-out. |
| Content entrances | The observed headings and cards rise 32 px, with 40 px in the FAQ. The comparison panel enters from 128 px to the right. The counters and panel stay settled on scroll-back. |
| Feature panels | At 1200 px and wider, each panel pins for one viewport and scales from 100% to 90% as the following panel moves in. Tablet and phone use a regular stack. |
| Phone menu | The panel expands and retracts with the reference's measured timing. Links enter 100 ms apart, and Sign In and Try Nouva are centered. Escape closes the menu and returns focus. |
| FAQ and billing | Each FAQ answer fades while its row expands or contracts. With the CTA in view, both columns were toggled while checking that scroll position and the opposite column stayed steady. Both billing options were exercised. |
| Customer logos | The track loops left at about 25 px per second and slows on hover. The local pause button also works from the keyboard and preserves the current position. |

Compared in Codex browser tabs at 1440, 1024, and 390 px. The wider viewport checks used 1600, 1800, and 2150 px to approximate 90%, 80%, and 67% zoom. Easing was tuned from sampled frames. An isolated browser check verified that reduced motion leaves all content visible and the ticker stationary.
