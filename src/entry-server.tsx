import { renderToString } from 'react-dom/server'
import App from './App'
import { brand, brandAssets } from './config/brand'
import { site } from './config/site'
import { en } from './content/en'
import { zh } from './content/zh'
import { findGuide, guidePath, guidesIn, latestGuideUpdate, pageMeta, pagePaths, pagesIn } from './content/guides'
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
        // Freshness signals for guides (the visible date is on the page too).
        ...(guide?.kind === 'guide'
          ? [
              `<meta property="article:published_time" content="${guide.published}" />`,
              `<meta property="article:modified_time" content="${guide.updated}" />`,
            ]
          : []),
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
      ogImageAlt: t.meta.ogImageAlt,
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
    [...guidesIn('en'), ...pagesIn('en')].find((item) => item.path === path)?.updated ?? listDate

  // Named AI crawlers are allowed explicitly — `*` already covers them, but some
  // hosting defaults block them unless a site says otherwise.
  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    ...['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'Bingbot', 'DuckAssistBot']
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
    <xhtml:link rel="alternate" hreflang="x-default" href="${page('en', path)}"/>
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
    '## About',
    `- Who: ${brand.name} (${brand.nameZh}), a smart home design and installation business.`,
    '- Where: across Singapore (all five regions, listed below) — HDB (BTO and resale), condominium and landed homes.',
    '- Languages: English and Simplified Chinese; every page exists in both.',
    '- Approach: lighting, aircon, curtains, locks and cameras on one local system, on open platforms, with no vendor lock-in.',
    '- Prices on this site are indicative starting prices in SGD, not checkout prices; the amount is agreed before anything is ordered.',
    site.email ? `- Email: ${site.email}` : '',
    site.url ? `- Contact form: ${page('en')}#contact` : '',
    '',
    '## Core pages',
    ...pagePaths
      .filter((path) => !findGuide('en', path))
      .map((path) => {
        const { title, description } = pageMeta('en', path)
        return `- [${title}](${page('en', path)}) (中文: ${page('zh', path)}): ${description}`
      }),
    site.url
      ? `- [Interactive 3D HDB show flat](${site.url}/showroom/) (中文: ${site.url}/showroom/?lang=zh): a browser demo of a smart HDB flat — tap lights, curtains and aircon to see what each control does.`
      : '',
    site.url ? `- Full text of every guide: ${site.url}/llms-full.txt` : '',
    '',
    '## Services',
    ...en.solutions.items.map((item) => `- ${item.title}: ${item.body}`),
    '',
    `## Products (${en.products.status}; not in stock; indicative prices, no checkout)`,
    en.products.lead,
    `${en.products.custom.title}: ${en.products.custom.body}`,
    ...en.products.items.map(
      (item) => `- ${item.title}: ${item.body} Indicative price from S$${item.priceSgd}.`,
    ),
    ...en.products.finePrint.map((line) => `- ${line}`),
    '',
    `### ${en.products.install.title} (no list prices; quoted as part of a plan)`,
    en.products.install.lead,
    ...en.products.install.groups.map((group) => `- ${group.title}: ${group.items.join('; ')}.`),
    '',
    `## ${en.software.title} (indicative starting prices, quoted before work starts)`,
    en.software.lead,
    ...en.software.packages.map(
      (item) => `- ${item.title}: ${item.body} Indicative price from S$${item.priceSgd}. ${en.software.support}`,
    ),
    '',
    `## ${en.hardware.title} (prototypes and one-off builds; indicative starting prices, quoted in writing before work starts)`,
    en.hardware.lead,
    ...en.hardware.groups.map((group) => `- ${group.title}: ${group.body}`),
    ...en.hardware.tiers.map((tier) => `- ${tier.title}: ${tier.body} Indicative price from S$${tier.priceSgd}.`),
    ...en.hardware.finePrint.map((line) => `- ${line}`),
    '',
    `## ${en.upcoming.eyebrow} (${en.upcoming.status}, not on sale yet)`,
    ...en.upcoming.items.map((item) => `- ${item.title}: ${item.body}`),
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
    `## ${en.guides.pagesTitle}`,
    ...LANGS.flatMap((lang) =>
      pagesIn(lang).map((item) => `- [${item.title}](${page(lang, item.path)}): ${item.description}`),
    ),
    '',
    '## FAQ',
    ...en.faq.items.flatMap((item) => [`### ${item.q}`, item.a, '']),
    `Contact: ${site.url ? page('en') + '#contact' : 'see website'}`,
    '',
  ].join('\n')

  // RSS feeds, one per language — a plain way for readers, aggregators and
  // crawlers to pick up new guides without waiting for a recrawl.
  const xml = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const feed = (lang: Lang) => {
    const self = `${site.url}${langPath(lang, 'feed.xml')}`
    const items = guidesIn(lang)
      .map(
        (guide) => `    <item>
      <title>${xml(guide.title)}</title>
      <link>${page(lang, guidePath(guide.slug))}</link>
      <guid isPermaLink="true">${page(lang, guidePath(guide.slug))}</guid>
      <pubDate>${new Date(guide.published).toUTCString()}</pubDate>
      <description>${xml(guide.description)}</description>
    </item>`,
      )
      .join('\n')
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(lang === 'zh' ? zh.guides.metaTitle : en.guides.metaTitle)}</title>
    <link>${page(lang, 'guides/')}</link>
    <description>${xml(lang === 'zh' ? zh.guides.metaDescription : en.guides.metaDescription)}</description>
    <language>${lang === 'zh' ? 'zh-Hans' : 'en-SG'}</language>
    <atom:link href="${self}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`
  }
  const feeds = site.url ? { en: feed('en'), zh: feed('zh') } : null

  // llms-full.txt — the full text of every guide and topic page, so an
  // assistant can quote the source rather than a summary of it.
  const absolute = (body: string) => (site.url ? body.replace(/\]\(\//g, `](${site.url}/`) : body)
  const llmsFull = [
    `# ${en.meta.title} — full guide text`,
    '',
    `> ${en.meta.description}`,
    '',
    ...LANGS.flatMap((lang) =>
      [...guidesIn(lang), ...pagesIn(lang)].flatMap((item) => [
        `## ${item.title}`,
        '',
        `URL: ${page(lang, item.path)}`,
        `Language: ${lang === 'zh' ? 'zh-Hans' : 'en'} · Published ${item.published} · Updated ${item.updated}`,
        '',
        `> ${item.description}`,
        '',
        ...(item.points.length ? [...item.points.map((point) => `- ${point}`), ''] : []),
        absolute(item.body).replace(/^(#{2,3}) /gm, '#$1 '),
        '',
        '---',
        '',
      ]),
    ),
  ].join('\n')

  return { robots, sitemap, llms, llmsFull, feeds }
}
