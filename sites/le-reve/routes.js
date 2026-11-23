const slug = text => text.toLowerCase().replaceAll(" ", "-");

export const projectPath = name => `/work/${slug(name)}`;
export const articlePath = (name, title) => `/journal/${slug(name)}-${slug(title)}`;

export function matchRoute(pathname, search) {
  if (pathname === "/" || pathname === "/index.html") {
    const query = new URLSearchParams(search);
    return { page: query.get("page") || "home", item: query.get("item"), legacy: true };
  }
  const [, page, item, ...rest] = pathname.replace(/\/$/, "").split("/");
  return rest.length ? { page: "missing" } : { page, item };
}

export const previousDetailPaths = {
  work: [
    "/work/brand-pulse",
    "/work/pixel-forge",
    "/work/frame-lab",
    "/work/mood-craft",
    "/work/design-core",
    "/work/color-tribe",
    "/work/photo-grid",
    "/work/idea-mint",
    "/work/light-code",
    "/work/story-box",
  ],
  journal: [
    "/journal/dune-sonic-soundscapes-in-the-desert",
    "/journal/silver-frame-when-a-concert-becomes-cinema",
    "/journal/terminal-echo-reclaiming-noise-from-the-past",
    "/journal/sonar-id-the-sound-of-identity",
    "/journal/neon-haze-building-chaos-with-color",
    "/journal/mirror-bloom-the-architecture-of-reflection",
  ],
};
