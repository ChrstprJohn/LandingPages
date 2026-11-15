# Decode Studio

A React/Vite photography portfolio inspired by the supplied Lundani Studio reference. Desktop composition and GSAP interactions follow that reference; mobile navigation, typography, image sizing, and footer were adapted to the user's preferences.

Run from the workspace root:

```powershell
pnpm --filter photography dev
pnpm --filter photography build
```

Includes the homepage, About, Services, Contact, and six project galleries. The shared shutter appears in the wordmark, footer, and favicon. The About hero alone has a darkening filter and a top-aligned crop.

GSAP powers staggered blur entrances on scroll, card shrink-on-hover, the continuous photo reel, footer text/shutter hover, and page crossfades. Next/Previous and browser history update routes without document reloads, resetting gallery and page scroll. The mobile menu is full-screen with centered navigation and social links; the wordmark and close toggle retain their header positions. Reduced-motion preferences disable continuous and entrance motion.

## Photography

All portfolio photographs are replacement stock images from Unsplash, not photographs taken by Decode Studio or exclusively owned by this project. File-level source URLs and the Unsplash license link are recorded in `public/image-credits.json`; `replace-assets.py` reproduces the selection. The shutter is the reference's public Framer asset. Fonts are Instrument Serif and Manrope from Google Fonts.

The portfolio, project facts, prices, and team profiles are illustrative. Contact uses native validation and clearly states that messages are not sent. Real booking/contact details and an inbox integration still need to be supplied before launch.

## Verification

Production build and repository whitespace checks. All ten routes inspected in Codex's browser; desktop and mobile menu, form validation, Next/Previous/history transitions, image loading, and shared hover states exercised. Layout checks cover 320, 390, 768, 1024, 1440, 2149, 3840, and 4096 CSS pixels. Larger viewports approximate zoom-out; the browser clamps the requested 7680px width to 4096px. Native Safari, physical-device touch, and actual browser zoom were not tested.

The local `recreate-reference` skill was updated separately with interaction evidence and route-wide zoom checks, and passed its validator.
