import { copyFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { defineConfig } from "vite";
import { articles, projects } from "./data.js";
import { articlePath, projectPath } from "./routes.js";

export default defineConfig({
  plugins: [{
    name: "le-reve-static-routes",
    async writeBundle({ dir }) {
      const paths = [
        "/about", "/work", "/journal",
        ...projects.map(([name]) => projectPath(name)),
        ...articles.map(([name, title]) => articlePath(name, title))
      ];
      await Promise.all(paths.map(async path => {
        const target = join(dir, path.slice(1));
        await mkdir(target, { recursive: true });
        await copyFile(join(dir, "index.html"), join(target, "index.html"));
      }));
    }
  }]
});
