/**
 * Write one prerendered HTML file per page and language into dist/
 * (dist/index.html, dist/zh/index.html, dist/guides/<slug>/index.html, …).
 * Runs after `vite build --ssr src/entry-server.tsx` (see the build script).
 */
import { execFileSync } from 'node:child_process'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const at = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url))
const { render, routes, crawlerFiles } = await import(new URL('../dist-ssr/entry-server.js', import.meta.url))

const template = await readFile(at('dist/index.html'), 'utf8')
if (!template.includes('<div id="root"></div>')) throw new Error('dist/index.html has no empty #root')

const attr = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Replace the content of an existing <meta name|property="key"> in the template. */
function setMeta(page, key, value) {
  const tag = new RegExp(`(<meta\\s+(?:name|property)="${key}"\\s+content=")[^"]*(")`)
  if (!tag.test(page)) throw new Error(`index.html has no <meta> for ${key}`)
  return page.replace(tag, (_, open, close) => open + attr(value) + close)
}

for (const { lang, path } of routes) {
  const { html, head, ogImage, meta } = render(lang, path)
  let page = template
    .replace('<html lang="en">', `<html lang="${meta.htmlLang}">`)
    .replace(/<title>[^<]*<\/title>/, () => `<title>${attr(meta.title)}</title>`)
    .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`)
  for (const [key, value] of [
    ['description', meta.description],
    ['keywords', meta.keywords],
    ['og:type', meta.type],
    ['og:title', meta.title],
    ['og:description', meta.description],
    ['og:locale', meta.locale],
    ['og:locale:alternate', meta.localeAlt],
    ['twitter:title', meta.title],
    ['twitter:description', meta.description],
  ]) {
    page = setMeta(page, key, value)
  }
  if (head) page = page.replace('</head>', () => `    ${head}\n  </head>`)
  // Social scrapers need an absolute og:image; the template only has a relative one.
  if (ogImage) page = page.replaceAll('content="/og-image.png"', `content="${ogImage}"`)

  const dir = `dist/${lang === 'zh' ? 'zh/' : ''}${path}`
  await mkdir(at(dir), { recursive: true })
  await writeFile(at(`${dir}index.html`), page)
}

// Last commit touching each part of the site. Needs full history in CI
// (fetch-depth: 0); falls back to today outside a git checkout.
const today = new Date().toISOString().slice(0, 10)
const gitDate = (...paths) => {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', ...paths], { encoding: 'utf8' }).trim() || today
  } catch {
    return today
  }
}
const { robots, sitemap, llms } = crawlerFiles({
  site: gitDate('src', 'index.html', ':(exclude)src/content/guides'),
  showroom: gitDate('showroom'),
})
await writeFile(at('dist/robots.txt'), robots)
await writeFile(at('dist/llms.txt'), llms)
if (sitemap) await writeFile(at('dist/sitemap.xml'), sitemap)
await rm(at('dist-ssr'), { recursive: true, force: true })
console.log(`prerendered ${routes.length} pages`)
