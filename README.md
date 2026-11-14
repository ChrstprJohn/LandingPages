# Landing Pages

Five static React sites built with Vite and Tailwind CSS.

| Site | Folder |
| --- | --- |
| Café | `sites/cafe` |
| Architecture | `sites/archi website1` |
| Photography | `sites/photography` |
| Museum | `sites/museum` |
| Flower Shop | `sites/flower-shop` |

Run `pnpm install` from the repository root. Start one site with
`pnpm --filter cafe dev`, replacing `cafe` with the site's package name (`archi-website1` for Architecture).

Run `pnpm -r build` to build all five sites. Each site outputs static files
to its own `dist/` folder. For individual hosting projects, use the site's
folder as the project root and `dist` as the output directory.
