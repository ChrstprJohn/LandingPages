# Landing Pages

Landing page projects built with Vite and hosted on Vercel.

## Live sites

The original `vercel.app` URLs permanently redirect to the matching `chrbuilds.dev` links below.

| Site | Live URL | Source folder |
| --- | --- | --- |
| Arch — Architecture & Interiors | [archi-tau.chrbuilds.dev](https://archi-tau.chrbuilds.dev/) | [sites/archi website1](sites/archi%20website1/) |
| Brew Day Coffee | [brewday-delta.chrbuilds.dev](https://brewday-delta.chrbuilds.dev/) | [sites/cafe](sites/cafe/) |
| Decode — Interior Design | [dcd-arch-studio.chrbuilds.dev](https://dcd-arch-studio.chrbuilds.dev/) | [sites/archi website2](sites/archi%20website2/) |
| DcdHotel | [dcdhotel.chrbuilds.dev](https://dcdhotel.chrbuilds.dev/) | [sites/hotel1](sites/hotel1/) |
| dcdonut | [dcdonut.chrbuilds.dev](https://dcdonut.chrbuilds.dev/) | [sites/dcdonut](sites/dcdonut/) |
| dcdonut | [dcdonuts.chrbuilds.dev](https://dcdonuts.chrbuilds.dev/) | [sites/dcdonut](sites/dcdonut/) |
| Decode — AI Workspace | [dcode-rust.chrbuilds.dev](https://dcode-rust.chrbuilds.dev/) | [sites/saas1](sites/saas1/) |
| Dconstruct | [dconstruct.chrbuilds.dev](https://dconstruct.chrbuilds.dev/) | [sites/construction-2](sites/construction-2/) |
| DCRAFTS Furniture | [dcrafts.chrbuilds.dev](https://dcrafts.chrbuilds.dev/) | [sites/furnexa](sites/furnexa/) |
| Decõ — Specialty Coffee | [deco-weld.chrbuilds.dev](https://deco-weld.chrbuilds.dev/) | [sites/tamp-coffee](sites/tamp-coffee/) |
| DECODÉ — Fashion & Creative Direction | [decode-fashioown.chrbuilds.dev](https://decode-fashioown.chrbuilds.dev/) | [sites/le-reve](sites/le-reve/) |
| Decode Studio — Creative Agency | [decodeagency.chrbuilds.dev](https://decodeagency.chrbuilds.dev/) | [sites/agency1](sites/agency1/) |
| DECODÉ — Fashion & Creative Direction | [decodeee.chrbuilds.dev](https://decodeee.chrbuilds.dev/) | [sites/le-reve](sites/le-reve/) |
| decodestudio — Selected Works | [decodeeestudiooo.chrbuilds.dev](https://decodeeestudiooo.chrbuilds.dev/) | [sites/mirelle](sites/mirelle/) |
| Decode Studio — Product Design | [decooddee.chrbuilds.dev](https://decooddee.chrbuilds.dev/) | [sites/premuimlandingpage](sites/premuimlandingpage/) |
| FloraCo. | [floraco.chrbuilds.dev](https://floraco.chrbuilds.dev/) | [sites/flower-shop](sites/flower-shop/) |
| Decode Studio — Photography | [photostudio-live.chrbuilds.dev](https://photostudio-live.chrbuilds.dev/) | [sites/photography](sites/photography/) |
| Decode — Web Design & Development | [robotics-delta-three.chrbuilds.dev](https://robotics-delta-three.chrbuilds.dev/) | [sites/robotics](sites/robotics/) |

## Local development

The workspace also includes [Decode Construction](sites/decode/) and [Museum](sites/museum/).

Run `pnpm install` from the repository root. Start one site with
`pnpm --filter cafe dev`, replacing `cafe` with the site's package name (`archi-website1` for Architecture).

Run `pnpm -r build` to build all workspace sites. Each site outputs static files
to its own `dist/` folder. For individual hosting projects, use the site's
folder as the project root and `dist` as the output directory.
