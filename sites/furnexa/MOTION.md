# DCRAFTS motion

Run the storefront from the workspace root with `pnpm --filter furnexa dev`. The Vite app serves the homepage and its linked pages. Cart selections stay in the browser. Checkout shows an order summary, and the contact form prepares an email draft.

| Area | Reference behavior | Local behavior |
| --- | --- | --- |
| Hero | The homepage showcases a different furniture piece with each room photo. | The room and piece crossfade together every six seconds. The wordmark, heading, and Shop link stay fixed. The black announcement strip scrolls along the bottom of the first viewport and pauses on hover or focus. |
| Category rail | Cards loop horizontally. Hover grows the furniture image about 5% and moves it upward. | The rail loops with arrows, pointer drag, and native touch scrolling. The image grows and returns inside its card. |
| Story and benefits | The story title block, paragraph, and photo captions rise separately. Their reveals start around the point where half of each translated block is in view. | ScrollTrigger uses the measured midpoint. The photos keep their positions while their captions reveal. The digits roll to 800+, 16k+, and 100%. |
| Sale and membership | The offer background rotates in and the side panels follow. The offer remains revealed on scroll-back. The membership panel fades in before its copy rises. | GSAP stages the sale artwork and copy. Both offers use one-time entrances and retain their settled states. |
| Best sellers | Cards rise and fade in. Hover draws the border and grows the image about 10% inside the frame. | The rise and fade are staggered per card. Hover and keyboard focus use the same image and border transition. |
| Blog | Cards rise and fade in. Hover moves the cropped image down about 50 px while its caption stays in place. | The image and scrim move together. The caption stays in place as the image moves back on pointer-out. |
| Buttons and overlays | Filled CTAs flip to an outlined face on hover. Search and the cart open above the current page. | The two button faces rotate around their top and bottom edges on hover and focus. Search, menu, and cart support keyboard input and Escape. |
| Shop | The category controls live beside the catalogue on desktop and open from Filter on phone. Load More adds the next nine products. The collection callout and benefit cards enter on scroll. | The mobile popover supports Escape and outside-click dismissal. Catalogue filters and pagination update the results in place and refresh downstream scroll triggers. |
| Blog listing | Topics change the article set and update the category query. The unfiltered layout alternates groups of three and two cards. | Topic selection retains the scroll position and participates in browser history. The cards stack in reading order on phone. |
| About | The title moves behind the arched chair image. The makers rail has previous and next controls, and the process poster becomes an inline player when clicked. | The marquee respects reduced motion. Maker controls scroll the portraits and wrap at the ends. Video loads when requested. |
| Contact | The support details, map, social links, and form enter as the reader approaches each section. | ScrollTrigger reveals the blocks, and a valid form prepares a local email draft. |

The reference-based animation durations and curves were estimated from the rendered pages. Reduced-motion mode removes automatic advances and spatial effects.
