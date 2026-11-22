import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { essayBody, essays } from './src/content.js'

const escapeHtml = (value) => value.replace(/[&<>\"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char])

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'robotics-static-routes',
      apply: 'build',
      async writeBundle({ dir }) {
        const html = await readFile(resolve(dir, 'index.html'), 'utf8')
        const pages = [
          ['blog', 'Web Development Guides', 'Practical guides to site speed, responsive testing, redesign SEO, and content management.'],
          ...essays.map(([title, slug, description]) => [`blog-posts/${slug}`, title, description, slug]),
        ]
        for (const [path, title, description, slug] of pages) {
          const directory = resolve(dir, path)
          await mkdir(directory, { recursive: true })
          const sections = slug
            ? essayBody[slug].map(([heading, paragraph]) => `<section><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(paragraph)}</p></section>`).join('')
            : `<ul>${essays.map(([heading, articleSlug]) => `<li><a href="/blog-posts/${articleSlug}">${escapeHtml(heading)}</a></li>`).join('')}</ul>`
          const content = `<main class="blog-main ${slug ? 'essay' : 'essay-index'}"><header class="editorial-head"><h1>${escapeHtml(title)}</h1></header><article class="essay-copy"><p>${escapeHtml(description)}</p>${sections}</article></main>`
          const page = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)} | Decode</title>`)
            .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapeHtml(description)}">`)
            .replace('<div id="root"></div>', `<div id="root">${content}</div>`)
          await writeFile(resolve(directory, 'index.html'), page)
        }
      },
    },
  ],
})
