# Decode

Decode is a React, Vite, Tailwind CSS, and GSAP landing-page preview for an AI writing workspace. The implementation started from [Kadir Calik’s Framer template](https://www.framer.com/marketplace/templates/nouva/).

Run these commands from the LandingPages workspace root after installing dependencies.

```sh
pnpm --filter saas1 dev
pnpm --filter saas1 build
```

The contact and account forms validate locally and show preview feedback. Both billing views display sample prices. The homepage links to the contact, sign-in, account creation, privacy, terms, and 404 pages.

## Vercel deployment

Set the project’s Root Directory to `sites/saas1` and keep access to files outside it enabled for the workspace lockfile. The project configuration uses Vite and publishes `dist`. It redirects `/home` to `/` and serves the app for direct visits to routes such as `/contact`, `/sign-in`, and `/legal/privacy-policy`.

## Imagery

The team landscape is from Unsplash and the illustrative workflow portraits are from Pexels. Individual sources are listed on the [photography credits page](public/media/photography.html). The images are stored locally as AVIF files.

The nine landscape and product illustrations were made with the built-in ImageGen tool. The product panels use dark green mountain gradients and restrained, translucent interfaces.

| Image | Prompt direction |
| --- | --- |
| `hero.avif` | Blue-hour estuary with a winding channel, distant lighthouse, petrol teal mist, and an apricot horizon |
| `cta.avif` | Dim jade haze over a river basin framed by layered conifer hills |
| `comparison.avif` | Low-contrast spruce and jade layers of a forested valley |
| `intro-output.avif` | Eucalyptus valley behind a compact activity card with review and word counts |
| `intro-goal.avif` | Dark green hills behind a horizontal progress card showing 9 of 12 drafts reviewed |
| `intro-formats.avif` | Shadowy green canyon behind a compact newsletter, social, and web breakdown |
| `feature-drafts.avif` | Green mountain layers behind a seven-day chart of 84 reviewed drafts |
| `feature-formats.avif` | Twilight valley behind three content-format bars and a monthly draft count |
| `feature-time.avif` | Dark pine ridges behind a 42-minute metric and two review columns |

## Motion checks

| Interaction | Observed behavior and verification |
| --- | --- |
| Hero load and scroll | The image scales down and fades in over about 1.75 seconds. The words rise 5 px with a short blur and stagger. The fixed header follows. The backdrop moves at roughly 40% of scroll travel and fades as the hero leaves. |
| CTA hover | The button keeps its size. The clipped label and fill move together over about 340 ms, including a slight overshoot and reversal on pointer-out. |
| Content entrances | The observed headings and cards rise 32 px, with 40 px in the FAQ. The comparison panel enters from 128 px to the right. The counters and panel stay settled on scroll-back. |
| Feature panels | At 1200 px and wider, each panel pins for one viewport and scales from 100% to 90% as the following panel moves in. Tablet and phone use a regular stack. |
| Phone menu | The panel expands and retracts with the reference's measured timing. Links enter 100 ms apart, and Sign In and Try Decode are centered. Escape closes the menu and returns focus. |
| FAQ and billing | Each FAQ answer fades while its row expands or contracts. With the CTA in view, both columns were toggled while checking that scroll position and the opposite column stayed steady. Both billing options were exercised. |
| Format ticker | The track loops left at about 25 px per second and slows on hover. The local pause button also works from the keyboard and preserves the current position. |

Compared in Codex browser tabs at 1440, 1024, and 390 px. The wider viewport checks used 1600, 1800, and 2150 px to approximate 90%, 80%, and 67% zoom. Easing was tuned from sampled frames. An isolated browser check verified that reduced motion leaves all content visible and the ticker stationary.
