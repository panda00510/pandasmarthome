import { readFile } from 'node:fs/promises'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * `./guides/x.en.md?front` → the file's front matter plus `minutes:`, without
 * the body, `points:` or `description:`. `?desc` → just the description. Lists, cards and the router need only this; the body is a
 * separate `?raw` chunk loaded on the article's own page (content/guides.ts).
 */
function guideFrontMatter(): Plugin {
  return {
    name: 'guide-front-matter',
    enforce: 'pre',
    async load(id) {
      const query = /\.md\?(front|desc)$/.exec(id)?.[1]
      if (!query) return
      const file = id.slice(0, -query.length - 1)
      this.addWatchFile(file)
      const raw = (await readFile(file, 'utf8')).replace(/\r\n/g, '\n')
      const parts = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw)
      // No front matter: hand the file through so content/guides.ts reports it.
      if (!parts) return `export default ${JSON.stringify(raw)}`
      const description = /^description:(.*)$/m.exec(parts[1])?.[1].trim()
      if (!description) this.error(`${file}: missing "description"`)
      if (query === 'desc') return `export default ${JSON.stringify(description)}`
      // ~200 English words or ~450 Chinese characters a minute.
      const text = parts[2].trim().replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      const units = file.endsWith('.zh.md') ? text.replace(/\s/g, '').length / 450 : text.split(/\s+/).length / 200
      // `points:` is shown on the article only, so it stays with the body;
      // `description` is listed by two views only (`?desc`, content/guideDescriptions.ts).
      const front = parts[1].replace(/^(points|description):.*$/gm, '')
      return `export default ${JSON.stringify(`---\n${front}\nminutes: ${Math.max(1, Math.round(units))}\n---\n`)}`
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves a project repo from /<repo>/, so the build needs a
  // matching base. Set BASE_PATH in CI; local dev and `npm run preview` stay
  // at the root.
  base: process.env.BASE_PATH ?? '/',
  plugins: [guideFrontMatter(), react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    // Inline nothing: keeps licensed photos as separate cacheable files.
    assetsInlineLimit: 2048,
    // scripts/prerender.mjs reads it to add per-page <link rel="modulepreload">, then deletes it.
    manifest: true,
  },
})
