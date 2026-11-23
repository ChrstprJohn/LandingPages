import { copyFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { defineConfig } from "vite";
import { articles, projects } from "./data.js";
import { articlePath, previousDetailPaths, projectPath } from "./routes.js";

export default defineConfig({
  plugins: [{
    name: "le-reve-static-routes",
    async writeBundle({ dir }) {
      const paths = [
        "/about", "/work", "/journal",
        ...previousDetailPaths.work, ...previousDetailPaths.journal,
        ...projects.map(([name]) => projectPath(name)),
        ...articles.map(([name, title]) => articlePath(name, title))
      ];
      for (const path of paths) {
        const target = join(dir, path.slice(1));
        await mkdir(target, { recursive: true });
        await copyFile(join(dir, "index.html"), join(target, "index.html"));
      }
    }
  }]
});
