import { renderToString } from 'react-dom/server'
import App from './App'
import { brand, brandAssets } from './config/brand'
import { ogImageFor } from './config/ogImages'
import { site } from './config/site'
import { en } from './content/en'
import { zh } from './content/zh'
import { fillGuideBodies, findGuide, guidePath, guidesIn, latestGuideUpdate, pageMeta, pagePaths, pagesIn } from './content/guides'
import { dictionaries, langPath, type Lang } from './i18n/context'
import { LanguageProvider } from './i18n/LanguageProvider'
import * as Checklist from './components/sections/Checklist'
import * as Glossary from './components/sections/Glossary'
import { glossary as glossaryEn } from './content/glossary.en'
import { glossary as glossaryZh } from './content/glossary.zh'
import * as Guides from './components/sections/Guides'
import * as Hardware from './components/sections/Hardware'
import * as Home from './components/sections/Home'
import * as Hub from './components/sections/Hub'
import * as Products from './components/sections/Products'
import * as Signage from './components/sections/Signage'
import * as Software from './components/sections/Software'
import { viewFiles, viewOf, views } from './views'

// The browser loads copy, page chunks and article bodies on demand (main.tsx);
// the prerender has everything up front, so render() stays synchronous.
Object.assign(dictionaries, { en, zh })
Object.assign(views, { checklist: Checklist, glossary: { ...Glossary, glossaries: { en: glossaryEn, zh: glossaryZh } }, guides: Guides, hardware: Hardware, home: Home, hub: Hub, products: Products, signage: Signage, software: Software })
fillGuideBodies(
  Object.fromEntries(
    Object.entries(
      import.meta.glob<string>(['./content/guides/*.md', './content/pages/*.md'], { query: '?raw', import: 'default', eager: true }),
    ).map(([file, raw]) => [file.replace('./content/', './'), raw]),
  ),
)

const LANGS: Lang[] = ['en', 'zh']

// Glossary: both languages list the same ids, and every link goes to a real page.
const termIds = (glossary: typeof glossaryEn) => glossary.groups.flatMap((group) => group.terms.map((term) => term.id)).join()
if (termIds(glossaryEn) !== termIds(glossaryZh)) throw new Error('glossary.en.ts and glossary.zh.ts list different terms')
for (const term of [glossaryEn, glossaryZh].flatMap((glossary) => glossary.groups.flatMap((group) => group.terms))) {
  for (const path of term.links) if (!pagePaths.includes(path)) throw new Error(`glossary #${term.id}: no page at ${path}`)
}

/** Every page to prerender: each path in each language. */
export const routes = LANGS.flatMap((lang) => pagePaths.map((path) => ({ lang, path })))

/**
 * Source files (Vite manifest keys) of the chunks a page loads before its
 * first render, beyond the main bundle: its language, its view, its article.
 * scripts/prerender.mjs turns them into <link rel="modulepreload">.
 */
export function pageModules(lang: Lang, path: string) {
  const view = viewOf(lang, path)
  const guide = findGuide(lang, path)
  return [
    `src/content/${lang}.ts`,
    ...(view ? [viewFiles[view]] : []),
    ...(view === 'glossary' ? [`src/content/glossary.${lang}.ts`] : []),
    ...(guide ? [`src/content/${guide.file.slice(2)}?raw`] : []),
  ]
}

/** The 404 page in each language, written to dist/[zh/]404.html. Not in the sitemap or llms.txt. */
export const notFoundRoutes = LANGS.map((lang) => ({ lang, path: '404/' }))

/**
 * Build-time render of one page (see scripts/prerender.mjs). Search and AI
 * crawlers that skip JavaScript then still get the full copy, the JSON-LD and
 * the canonical links, in the right language. The browser re-renders on load,
 * so nothing here needs to hydrate.
 */
export function render(lang: Lang, path: string, hasOgImage: (src: string) => boolean = () => true) {
  const html = renderToString(
    <LanguageProvider lang={lang} path={path}>
      <App />
    </LanguageProvider>,
  )
  const t = dictionaries[lang]
  const { title, description, guide } = pageMeta(lang, path)
  const url = (l: Lang) => `${site.url}${langPath(l, path)}`
  const notFound = !pagePaths.includes(path)
  // A guide's own card exists once `npm run og` has run on a Mac (cards are
  // committed, CI never draws them); until then it keeps the Guides card.
  const own = guide?.kind === 'guide' ? ogImageFor(lang, path, guide.heading) : null
  const card = own && hasOgImage(own.src) ? own : ogImageFor(lang, path)

  const head = site.url && !notFound
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
    notFound,
    ogImage: site.url ? site.url + (card?.src ?? brandAssets.ogImage) : null,
    meta: {
      htmlLang: t.htmlLang,
      title,
      description,
      keywords: t.meta.keywords,
      type: guide ? 'article' : 'website',
      locale: lang === 'zh' ? 'zh_SG' : 'en_SG',
      localeAlt: lang === 'zh' ? 'en_SG' : 'zh_SG',
      ogImageAlt: card?.alt ?? t.meta.ogImageAlt,
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
    '- Also: Panda Signage (self-hosted digital signage displays), custom ESP32 AI hardware (prototypes and one-off builds) and custom software — each has its own page, listed below.',
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
    `## ${en.signage.title} (Panda Signage; self-hosted; indicative starting prices, quoted in writing before work starts)`,
    en.signage.lead,
    ...en.signage.groups.map((group) => `- ${group.title}: ${group.body}`),
    ...en.signage.setup.map((card) => `- ${card.title}: ${card.body}`),
    ...en.signage.prices.map((item) => `- ${item.title}: ${item.body} Indicative price from S$${item.priceSgd}.`),
    ...en.signage.finePrint.map((line) => `- ${line}`),
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
    `## ${en.glossary.title} (${site.url ? page('en', 'glossary/') : 'glossary'})`,
    ...glossaryEn.groups.flatMap((group) =>
      group.terms.map((term) => `- ${term.term}: ${term.body.slice(0, term.body.search(/\.(\s|$)/) + 1)}`),
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
