import { renderToString } from 'react-dom/server'
import App from './App'
import { brandAssets } from './config/brand'
import { site } from './config/site'
import { en } from './content/en'
import { zh } from './content/zh'
import { langPath } from './i18n/context'
import { LanguageProvider } from './i18n/LanguageProvider'

/**
 * Build-time render of the English page into dist/index.html (see
 * scripts/prerender.mjs). Search and AI crawlers that skip JavaScript then
 * still get the full copy, the JSON-LD and the canonical links. The browser
 * re-renders on load, so nothing here needs to hydrate.
 */
export function render() {
  const html = renderToString(
    <LanguageProvider>
      <App />
    </LanguageProvider>,
  )

  const head = site.url
    ? [
        `<link rel="canonical" href="${site.url}${langPath('en')}" />`,
        `<link rel="alternate" hreflang="en" href="${site.url}${langPath('en')}" />`,
        `<link rel="alternate" hreflang="zh-Hans" href="${site.url}${langPath('zh')}" />`,
        `<link rel="alternate" hreflang="x-default" href="${site.url}${langPath('en')}" />`,
        `<meta property="og:url" content="${site.url}/" />`,
      ].join('\n    ')
    : ''

  return { html, head, ogImage: site.url ? site.url + brandAssets.ogImage : null }
}

/** Crawler files. Generated here so they always match the copy and the configured origin. */
export function crawlerFiles() {
  const today = new Date().toISOString().slice(0, 10)
  const page = (lang: 'en' | 'zh') => `${site.url}${langPath(lang)}`

  // Named AI crawlers are allowed explicitly — `*` already covers them, but some
  // hosting defaults block them unless a site says otherwise.
  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    ...['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'Bingbot']
      .flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', '']),
    site.url ? `Sitemap: ${site.url}/sitemap.xml` : '',
  ].join('\n')

  const sitemap = site.url
    ? `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${(['en', 'zh'] as const)
  .map(
    (lang) => `  <url>
    <loc>${page(lang).replace('&', '&amp;')}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${page('en')}"/>
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${page('zh')}"/>
  </url>`,
  )
  .join('\n')}
  <url>
    <loc>${site.url}/showroom/</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`
    : null

  // llms.txt — a plain-text brief for AI assistants (llmstxt.org).
  const llms = [
    `# ${en.meta.title}`,
    '',
    `> ${en.meta.description}`,
    '',
    `${zh.meta.title}：${zh.meta.description}`,
    '',
    site.url ? `Website: ${page('en')} (中文: ${page('zh')})` : '',
    '',
    '## Services',
    ...en.solutions.items.map((item) => `- ${item.title}: ${item.body}`),
    '',
    '## Home types',
    ...en.homes.items.map((item) => `- ${item.title}: ${item.body}`),
    '',
    `## ${en.homes.areas.title}`,
    ...en.homes.areas.regions.map((region) => `- ${region.name}: ${region.towns}`),
    '',
    '## FAQ',
    ...en.faq.items.flatMap((item) => [`### ${item.q}`, item.a, '']),
    `Contact: ${site.url ? page('en') + '#contact' : 'see website'}`,
    '',
  ].join('\n')

  return { robots, sitemap, llms }
}
