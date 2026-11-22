import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { essays } from './src/content.js'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'robotics-static-routes',
      apply: 'build',
      async writeBundle({ dir }) {
        const html = await readFile(resolve(dir, 'index.html'))
        const paths = ['blog', ...essays.map(([, slug]) => `blog-posts/${slug}`)]
        for (const path of paths) {
          const directory = resolve(dir, path)
          await mkdir(directory, { recursive: true })
          await writeFile(resolve(directory, 'index.html'), html)
        }
      },
    },
  ],
})
