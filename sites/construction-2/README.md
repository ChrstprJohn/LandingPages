# Dconstruct

Run `pnpm --filter construction-2 dev` from the workspace root. Build with `pnpm --filter construction-2 build`.

The React site includes the homepage, seven primary pages, six service details, twelve case studies, seventeen articles, and sixteen article-tag pages. All site navigation uses local routes. The application serves its licensed stock and illustrative photography from `public/media`.

The contact form validates locally and prepares an email draft. Newsletter signup validates locally in the preview.

## Deployment

Set the Vercel Root Directory to `sites/construction-2`. The included `vercel.json` builds to `dist`, redirects `/home` to `/`, and serves the React app for direct links and browser refreshes on nested routes.

On another static host, publish `dist` at the domain root and serve `index.html` for application routes. The app also accepts `/home` directly.

## Browser comparison before the rebrand

| Component | Observed behavior | Verification |
| --- | --- | --- |
| Hero | The image is visible first. Heading words reveal in sequence, followed by the blurred body copy and CTA. | Sampled the reference and local builds after reload. The first title word starts around 0.5 seconds and the CTA settles around 1.6 seconds. The desktop and phone heading bounds matched at 1280 × 720 and 390 × 844. |
| Navigation | The fixed desktop header contracts over the hero. The phone menu expands below the header bar. The switch changes the canvas theme. | Checked the compact header through the footer, phone menu open and close, Escape, focus, light and dark, and the consultation destination. |
| Sections | Headings and copy stay visible after their first entrance. Project, process, team, and article cards use the reference’s individual transforms. The About photo travels at 10% of the desktop scroll distance and stays still on phones. | Scrolled both homepages on desktop and phone and measured the photo position at multiple scroll stops. |
| Cards and links | Service and project photos grow 5% inside their clips. Article images stay still. The primary CTA arrow turns 45° on hover. | Confirmed pointer-in and pointer-out on the reference and checked the corresponding local states. |
| Carousels | Services has endpoints. The testimonial carousel loops and reveals the image, quote, and byline separately when a slide comes forward. | Checked advance, direct page selection, reset, endpoint, wraparound, keyboard and drag input, and testimonial reentry. |
| Navigation transition | The new page reveals from bottom to top over 400 ms. | Compared the applied mask stops and easing in both browsers and tested Back, direct reload, and phone menu navigation. |
| Local routes | Related projects, blog categories, article tags, consultation, and privacy stay on the local site. | Checked clicks from the menus and linked content, and verified route data and local asset paths. |
| Footer | The email field precedes the submit button. | Tested required-field validation and a valid test address locally. No email was sent. |

The 90%, 80%, and 67% zoom checks used viewport equivalents of the 1600 × 900 desktop view. The reference caps the content width on wider screens. The local layout scales the desktop typography, gutters, and controls together. Native browser zoom and exact Framer easing curves were unavailable to measure directly.

## Photo sources

Photos are illustrative. The portfolio and testimonials use sample project and client details, and team portraits depict illustrative roles. The contact address and mailbox are preview details.

All 121 existing photo slots use stock images from [Pexels](https://www.pexels.com/license/) or [Unsplash](https://unsplash.com/license). The local versions are cropped and sized for the original slots.

| Existing asset | Source |
| --- | --- |
| `about.jpg` | [Pexels photo](https://www.pexels.com/photo/35361402/) |
| `adam.png` | [Pexels photo](https://www.pexels.com/photo/7937752/) |
| `alvarez.jpg` | [Unsplash photo](https://unsplash.com/photos/7s8ab4twHcI) |
| `bennett.jpg` | [Pexels photo](https://www.pexels.com/photo/7031411/) |
| `blog-contract.jpg` | [Pexels photo](https://www.pexels.com/photo/4977439/) |
| `blog-cost.jpg` | [Pexels photo](https://www.pexels.com/photo/4977452/) |
| `blog-design.jpg` | [Pexels photo](https://www.pexels.com/photo/6568666/) |
| `blog-questions.jpg` | [Pexels photo](https://www.pexels.com/photo/8961130/) |
| `cole-bennett.png` | [Pexels photo](https://www.pexels.com/photo/6474475/) |
| `cole.jpg` | [Unsplash photo](https://unsplash.com/photos/jNuAVUmhmB0) |
| `consult.jpg` | [Pexels photo](https://www.pexels.com/photo/35361415/) |
| `craft.jpg` | [Unsplash photo](https://unsplash.com/photos/GfYA6q5ESLI) |
| `crew.jpg` | [Pexels photo](https://www.pexels.com/photo/8961297/) |
| `daniel.png` | [Pexels photo](https://www.pexels.com/photo/3760532/) |
| `henderson.jpg` | [Pexels photo](https://www.pexels.com/photo/8962873/) |
| `hero.jpg` | [Pexels photo](https://www.pexels.com/photo/35361403/) |
| `liam.png` | [Pexels photo](https://www.pexels.com/photo/6568669/) |
| `marcus.png` | [Pexels photo](https://www.pexels.com/photo/3831164/) |
| `mehta.jpg` | [Pexels photo](https://www.pexels.com/photo/7203720/) |
| `nathan.png` | [Pexels photo](https://www.pexels.com/photo/7937745/) |
| `nguyen.jpg` | [Pexels photo](https://www.pexels.com/photo/4569293/) |
| `okafor.jpg` | [Pexels photo](https://www.pexels.com/photo/7031604/) |
| `pages/about-cta.jpg` | [Pexels photo](https://www.pexels.com/photo/7031406/) |
| `pages/about-hero.jpg` | [Pexels photo](https://www.pexels.com/photo/26859067/) |
| `pages/about-journey.jpg` | [Pexels photo](https://www.pexels.com/photo/8829878/) |
| `pages/about-studio.jpg` | [Pexels photo](https://www.pexels.com/photo/17410515/) |
| `pages/blog-a-realistic-timeline-for-building-your-custom-home.jpg` | [Pexels photo](https://www.pexels.com/photo/8817846/) |
| `pages/blog-budgeting-beyond-the-build-the-costs-people-forget.jpg` | [Pexels photo](https://www.pexels.com/photo/4977402/) |
| `pages/blog-choosing-timber-stone-and-steel-a-materials-primer.jpg` | [Pexels photo](https://www.pexels.com/photo/4249687/) |
| `pages/blog-council-approvals-explained-permits-without-the-panic.jpg` | [Unsplash photo](https://unsplash.com/photos/Yn8D5B8C-eY) |
| `pages/blog-designing-for-natural-light-orientation-done-right.jpg` | [Unsplash photo](https://unsplash.com/photos/Kh4tedFdHz4) |
| `pages/blog-heritage-homes-renovating-with-respect.jpg` | [Pexels photo](https://www.pexels.com/photo/38209969/) |
| `pages/blog-indoor-outdoor-living-designing-seamless-transitions.jpg` | [Unsplash photo](https://unsplash.com/photos/59CUSKEd-hE) |
| `pages/blog-renovating-while-you-live-in-it-a-survival-guide.jpg` | [Pexels photo](https://www.pexels.com/photo/28885512/) |
| `pages/blog-second-storey-additions-what-s-possible-on-your-block.jpg` | [Pexels photo](https://www.pexels.com/photo/28885519/) |
| `pages/blog-site-preparation-why-groundwork-makes-or-breaks-a-build.jpg` | [Pexels photo](https://www.pexels.com/photo/31353873/) |
| `pages/blog-smart-homes-wiring-for-technology-that-lasts.jpg` | [Pexels photo](https://www.pexels.com/photo/3614757/) |
| `pages/blog-sustainable-homes-building-for-comfort-and-lower-bills.jpg` | [Pexels photo](https://www.pexels.com/photo/32387194/) |
| `pages/blog-the-custom-kitchen-where-craft-meets-everyday-life.jpg` | [Unsplash photo](https://unsplash.com/photos/t7fHm3-Xrjs) |
| `pages/blogs-cta.jpg` | [Unsplash photo](https://unsplash.com/photos/4vioYQ9Nn9Y) |
| `pages/contact-cta.jpg` | [Pexels photo](https://www.pexels.com/photo/35361410/) |
| `pages/project-bayside-extension-1.jpg` | [Pexels photo](https://www.pexels.com/photo/5563473/) |
| `pages/project-bayside-extension-2.jpg` | [Unsplash photo](https://unsplash.com/photos/vIbxvHj9m9g) |
| `pages/project-bayside-extension-3.jpg` | [Unsplash photo](https://unsplash.com/photos/Jl5BfxX089Q) |
| `pages/project-bayside-extension-4.jpg` | [Unsplash photo](https://unsplash.com/photos/PjjFLsAmWu8) |
| `pages/project-cedar-park-renovation-1.jpg` | [Unsplash photo](https://unsplash.com/photos/08uIUe2a9XY) |
| `pages/project-cedar-park-renovation-2.jpg` | [Pexels photo](https://www.pexels.com/photo/10560262/) |
| `pages/project-cedar-park-renovation-3.jpg` | [Pexels photo](https://www.pexels.com/photo/14509470/) |
| `pages/project-cedar-park-renovation-4.jpg` | [Unsplash photo](https://unsplash.com/photos/pkIJXMezi_E) |
| `pages/project-crestwood-courtyard-1.jpg` | [Unsplash photo](https://unsplash.com/photos/-atd5-2ciHc) |
| `pages/project-crestwood-courtyard-2.jpg` | [Unsplash photo](https://unsplash.com/photos/Aq8ljLz12gk) |
| `pages/project-crestwood-courtyard-3.jpg` | [Unsplash photo](https://unsplash.com/photos/l864GKi_dRM) |
| `pages/project-crestwood-courtyard-4.jpg` | [Unsplash photo](https://unsplash.com/photos/mledaZ8XtVM) |
| `pages/project-fernhill-farmhouse-1.jpg` | [Pexels photo](https://www.pexels.com/photo/29589452/) |
| `pages/project-fernhill-farmhouse-2.jpg` | [Pexels photo](https://www.pexels.com/photo/29589457/) |
| `pages/project-fernhill-farmhouse-3.jpg` | [Unsplash photo](https://unsplash.com/photos/dEm3YySZwSA) |
| `pages/project-fernhill-farmhouse-4.jpg` | [Pexels photo](https://www.pexels.com/photo/13281168/) |
| `pages/project-highgrove-house-1.jpg` | [Unsplash photo](https://unsplash.com/photos/hPu2n_SfV7Q) |
| `pages/project-highgrove-house-2.jpg` | [Pexels photo](https://www.pexels.com/photo/16747778/) |
| `pages/project-highgrove-house-3.jpg` | [Unsplash photo](https://unsplash.com/photos/m3Vq2LEAkfQ) |
| `pages/project-highgrove-house-4.jpg` | [Pexels photo](https://www.pexels.com/photo/31905360/) |
| `pages/project-marina-bay-home-1.jpg` | [Unsplash photo](https://unsplash.com/photos/b_79nOqf95I) |
| `pages/project-marina-bay-home-2.jpg` | [Unsplash photo](https://unsplash.com/photos/Pc2SvS4ujCA) |
| `pages/project-marina-bay-home-3.jpg` | [Unsplash photo](https://unsplash.com/photos/fzmMaeN44po) |
| `pages/project-marina-bay-home-4.jpg` | [Unsplash photo](https://unsplash.com/photos/IWU6ROePwJQ) |
| `pages/project-marsh-timber-house-1.jpg` | [Unsplash photo](https://unsplash.com/photos/6LSKem6Fkt4) |
| `pages/project-marsh-timber-house-2.jpg` | [Pexels photo](https://www.pexels.com/photo/16747776/) |
| `pages/project-marsh-timber-house-3.jpg` | [Unsplash photo](https://unsplash.com/photos/PYL_nO-0ZjE) |
| `pages/project-marsh-timber-house-4.jpg` | [Unsplash photo](https://unsplash.com/photos/DXTRyjAeA5E) |
| `pages/project-oakhill-residence-1.jpg` | [Unsplash photo](https://unsplash.com/photos/F-slnkFvcag) |
| `pages/project-oakhill-residence-2.jpg` | [Unsplash photo](https://unsplash.com/photos/emnfe1YR6io) |
| `pages/project-oakhill-residence-3.jpg` | [Unsplash photo](https://unsplash.com/photos/4_jQL4JCS98) |
| `pages/project-oakhill-residence-4.jpg` | [Unsplash photo](https://unsplash.com/photos/cUoXTLVFQ9M) |
| `pages/project-poolhouse-pavilion-1.jpg` | [Unsplash photo](https://unsplash.com/photos/_ELoYrhi3ao) |
| `pages/project-poolhouse-pavilion-2.jpg` | [Unsplash photo](https://unsplash.com/photos/6-674Uo9RBg) |
| `pages/project-poolhouse-pavilion-3.jpg` | [Unsplash photo](https://unsplash.com/photos/QLMR7CMAJlo) |
| `pages/project-poolhouse-pavilion-4.jpg` | [Unsplash photo](https://unsplash.com/photos/xtFFdRfyK4I) |
| `pages/project-ridgeline-house-1.jpg` | [Unsplash photo](https://unsplash.com/photos/mPGxXpo0X-s) |
| `pages/project-ridgeline-house-2.jpg` | [Pexels photo](https://www.pexels.com/photo/30231965/) |
| `pages/project-ridgeline-house-3.jpg` | [Pexels photo](https://www.pexels.com/photo/4389907/) |
| `pages/project-ridgeline-house-4.jpg` | [Unsplash photo](https://unsplash.com/photos/NEnYF8HK7FY) |
| `pages/project-the-stone-kitchen-1.jpg` | [Unsplash photo](https://unsplash.com/photos/cIKLvLXkN6Y) |
| `pages/project-the-stone-kitchen-2.jpg` | [Unsplash photo](https://unsplash.com/photos/a3YrBhQx8H0) |
| `pages/project-the-stone-kitchen-3.jpg` | [Unsplash photo](https://unsplash.com/photos/0WQxJ4V-Jjs) |
| `pages/project-the-stone-kitchen-4.jpg` | [Unsplash photo](https://unsplash.com/photos/Mj3JSq-_7OI) |
| `pages/project-willowmere-estate-1.jpg` | [Pexels photo](https://www.pexels.com/photo/7031412/) |
| `pages/project-willowmere-estate-2.jpg` | [Unsplash photo](https://unsplash.com/photos/RqO6kwm4tZY) |
| `pages/project-willowmere-estate-3.jpg` | [Unsplash photo](https://unsplash.com/photos/N33G22vlESk) |
| `pages/project-willowmere-estate-4.jpg` | [Pexels photo](https://www.pexels.com/photo/5785162/) |
| `pages/projects-bayside-extension.jpg` | [Pexels photo](https://www.pexels.com/photo/4626267/) |
| `pages/projects-cedar-park-renovation.jpg` | [Pexels photo](https://www.pexels.com/photo/39381590/) |
| `pages/projects-crestwood-courtyard.jpg` | [Unsplash photo](https://unsplash.com/photos/ylzGfY-xzBY) |
| `pages/projects-cta.jpg` | [Pexels photo](https://www.pexels.com/photo/7598368/) |
| `pages/projects-fernhill-farmhouse.jpg` | [Pexels photo](https://www.pexels.com/photo/27638224/) |
| `pages/projects-marsh-timber-house.jpg` | [Pexels photo](https://www.pexels.com/photo/11219301/) |
| `pages/projects-poolhouse-pavilion.jpg` | [Unsplash photo](https://unsplash.com/photos/xtfvGngzrO0) |
| `pages/projects-ridgeline-house.jpg` | [Pexels photo](https://www.pexels.com/photo/9459178/) |
| `pages/projects-the-stone-kitchen.jpg` | [Unsplash photo](https://unsplash.com/photos/rdhDExYShso) |
| `pages/projects-willowmere-estate.jpg` | [Pexels photo](https://www.pexels.com/photo/8134821/) |
| `pages/services-cta.jpg` | [Pexels photo](https://www.pexels.com/photo/8925427/) |
| `pages/team-caleb-morrison.png` | [Pexels photo](https://www.pexels.com/photo/8830256/) |
| `pages/team-cta.jpg` | [Pexels photo](https://www.pexels.com/photo/8961133/) |
| `pages/team-ethan-walsh.png` | [Pexels photo](https://www.pexels.com/photo/17410734/) |
| `pages/team-jack-sullivan.png` | [Pexels photo](https://www.pexels.com/photo/6474449/) |
| `pages/team-noah-whitfield.png` | [Pexels photo](https://www.pexels.com/photo/8482551/) |
| `pages/team-owen-carter.png` | [Pexels photo](https://www.pexels.com/photo/3831159/) |
| `pages/team-ryan-mercer.png` | [Pexels photo](https://www.pexels.com/photo/6474493/) |
| `process.jpg` | [Pexels photo](https://www.pexels.com/photo/8830259/) |
| `project-highgrove.jpg` | [Pexels photo](https://www.pexels.com/photo/7031600/) |
| `project-marina.jpg` | [Pexels photo](https://www.pexels.com/photo/36394726/) |
| `project-oakhill.jpg` | [Pexels photo](https://www.pexels.com/photo/35361412/) |
| `reid.jpg` | [Pexels photo](https://www.pexels.com/photo/9110879/) |
| `rossi.jpg` | [Pexels photo](https://www.pexels.com/photo/17174767/) |
| `service-architecture.jpg` | [Pexels photo](https://www.pexels.com/photo/6568679/) |
| `service-custom.jpg` | [Pexels photo](https://www.pexels.com/photo/8134845/) |
| `service-kitchen.jpg` | [Unsplash photo](https://unsplash.com/photos/qF-tXW24fPM) |
| `service-management.jpg` | [Pexels photo](https://www.pexels.com/photo/8961298/) |
| `service-outdoor.jpg` | [Unsplash photo](https://unsplash.com/photos/Ph3aYbb4wfE) |
| `service-renovation.jpg` | [Pexels photo](https://www.pexels.com/photo/38275943/) |
| `stats.jpg` | [Pexels photo](https://www.pexels.com/photo/18867516/) |
| `whitmore.jpg` | [Pexels photo](https://www.pexels.com/photo/39362352/) |
