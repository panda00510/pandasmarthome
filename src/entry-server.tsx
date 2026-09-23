import { renderToString } from 'react-dom/server'
import App from './App'
import { brandAssets } from './config/brand'
import { site } from './config/site'
import { en } from './content/en'
import { zh } from './content/zh'
import { guidePath, guidesIn, latestGuideUpdate, pageMeta, pagePaths } from './content/guides'
import { dictionaries, langPath, type Lang } from './i18n/context'
import { LanguageProvider } from './i18n/LanguageProvider'

const LANGS: Lang[] = ['en', 'zh']

/** Every page to prerender: each path in each language. */
export const routes = LANGS.flatMap((lang) => pagePaths.map((path) => ({ lang, path })))

/**
 * Build-time render of one page (see scripts/prerender.mjs). Search and AI
 * crawlers that skip JavaScript then still get the full copy, the JSON-LD and
 * the canonical links, in the right language. The browser re-renders on load,
 * so nothing here needs to hydrate.
 */
export function render(lang: Lang, path: string) {
  const html = renderToString(
    <LanguageProvider lang={lang} path={path}>
      <App />
    </LanguageProvider>,
  )
  const t = dictionaries[lang]
  const { title, description, guide } = pageMeta(lang, path)
  const url = (l: Lang) => `${site.url}${langPath(l, path)}`

  const head = site.url
    ? [
        `<link rel="canonical" href="${url(lang)}" />`,
        `<link rel="alternate" hreflang="en" href="${url('en')}" />`,
        `<link rel="alternate" hreflang="zh-Hans" href="${url('zh')}" />`,
        `<link rel="alternate" hreflang="x-default" href="${url('en')}" />`,
        `<meta property="og:url" content="${url(lang)}" />`,
      ].join('\n    ')
    : ''

  return {
    html,
    head,
    ogImage: site.url ? site.url + brandAssets.ogImage : null,
    meta: {
      htmlLang: t.htmlLang,
      title,
      description,
      keywords: t.meta.keywords,
      type: guide ? 'article' : 'website',
      locale: lang === 'zh' ? 'zh_SG' : 'en_SG',
      localeAlt: lang === 'zh' ? 'en_SG' : 'zh_SG',
    },
  }
}

/**
 * Crawler files. Generated here so they always match the copy and the
 * configured origin. `dates` are git commit dates (see prerender.mjs), so a
 * page's lastmod only moves when that page actually changed.
 */
export function crawlerFiles(dates: { site: string; showroom: string }) {
  const page = (lang: Lang, path = '') => `${site.url}${langPath(lang, path)}`
  // Home and the guides index list the newest guides, so a new guide updates them too.
  const listDate = latestGuideUpdate && latestGuideUpdate > dates.site ? latestGuideUpdate : dates.site
  const lastmod = (path: string) =>
    guidesIn('en').find((guide) => guidePath(guide.slug) === path)?.updated ?? listDate

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
${routes
  .map(
    ({ lang, path }) => `  <url>
    <loc>${page(lang, path)}</loc>
    <lastmod>${lastmod(path)}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${page('en', path)}"/>
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${page('zh', path)}"/>
  </url>`,
  )
  .join('\n')}
  <url>
    <loc>${site.url}/showroom/</loc>
    <lastmod>${dates.showroom}</lastmod>
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
    '## Guides',
    ...LANGS.flatMap((lang) =>
      guidesIn(lang).map(
        (guide) => `- [${guide.title}](${page(lang, guidePath(guide.slug))}): ${guide.description}`,
      ),
    ),
    '',
    '## FAQ',
    ...en.faq.items.flatMap((item) => [`### ${item.q}`, item.a, '']),
    `Contact: ${site.url ? page('en') + '#contact' : 'see website'}`,
    '',
  ].join('\n')

  return { robots, sitemap, llms }
}
