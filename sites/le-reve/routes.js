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
