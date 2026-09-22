/**
 * Inject the server-rendered English page into dist/index.html.
 * Runs after `vite build --ssr src/entry-server.tsx` (see the build script).
 */
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const at = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url))
const { render, crawlerFiles } = await import(new URL('../dist-ssr/entry-server.js', import.meta.url))
const { html, head, ogImage } = render()

let page = await readFile(at('dist/index.html'), 'utf8')
if (!page.includes('<div id="root"></div>')) throw new Error('dist/index.html has no empty #root')
page = page.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
if (head) page = page.replace('</head>', `    ${head}\n  </head>`)
// Social scrapers need an absolute og:image; the template only has a relative one.
if (ogImage) page = page.replaceAll('content="/og-image.png"', `content="${ogImage}"`)

await writeFile(at('dist/index.html'), page)

const { robots, sitemap, llms } = crawlerFiles()
await writeFile(at('dist/robots.txt'), robots)
await writeFile(at('dist/llms.txt'), llms)
if (sitemap) await writeFile(at('dist/sitemap.xml'), sitemap)
await rm(at('dist-ssr'), { recursive: true, force: true })
console.log(`dist/index.html prerendered (${(html.length / 1024).toFixed(0)} KB of markup)`)
