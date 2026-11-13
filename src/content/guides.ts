import { brand } from '../config/brand'
import { dictionaries, type Lang } from '../i18n/context'

/**
 * Articles live as Markdown in ./guides/<slug>.<en|zh>.md, one file per
 * language, each starting with a front-matter block:
 *
 *   ---
 *   title: …
 *   description: …          (meta description, ~150 characters)
 *   published: 2026-09-23
 *   updated: 2026-09-23     (drives the sitemap lastmod — bump it on real edits)
 *   heading: Shorter title      (optional; shown on the page and cards while <title> stays long for search)
 *   points: a | b | c       (optional; three short takeaways shown above the article)
 *   draft: true             (optional; drafts show in `npm run dev` only)
 *   ---
 *
 * Every slug needs both languages, or the build fails.
 */
export type Guide = {
  /** "guide" lives under /guides/; "page" is a topic page at the path in its front matter. */
  kind: 'guide' | 'page'
  path: string
  /** Guide slugs shown under a topic page. */
  related: string[]
  slug: string
  lang: Lang
  title: string
  /** Visible heading: the front-matter `heading`, or the title. */
  heading: string
  published: string
  updated: string
  /** Source file, e.g. "./guides/what-is-matter.en.md". */
  file: string
  /** Reading time in minutes, counted at build time from the full text. */
  minutes: number
  /** Empty until guideDescriptions.ts or the body is loaded (see fillDescriptions). */
  description: string
  /** Markdown body. Empty until loadGuideBody() (browser) or fillGuideBodies() (prerender). */
  body: string
  /** Optional "short version" bullets from the `points:` front-matter line. Loaded with the body. */
  points: string[]
  /** One of TOPIC_IDS; drives the filter on /guides/. */
  topic: string
  /** Q&A from the "Common questions" / "常见问题" section, for FAQ structured data. */
  faq: { q: string; a: string }[]
}

// Front matter only (plus `minutes`), via the guide-front-matter plugin in
// vite.config.ts: every list needs it. Bodies are ~110 KB gzipped together,
// so each loads as its own chunk, and only on its own page.
const files = import.meta.glob<string>(['./guides/*.md', './pages/*.md'], {
  query: '?front',
  import: 'default',
  eager: true,
})
const bodies = import.meta.glob<string>(['./guides/*.md', './pages/*.md'], { query: '?raw', import: 'default' })

/** Filter groups on /guides/. A guide without an entry falls under "start". */
export const TOPIC_IDS = ['start', 'renovation', 'energy', 'care', 'security', 'business'] as const
const TOPICS: Record<string, (typeof TOPIC_IDS)[number]> = {
  'upgrade-existing-home-smart': 'start',
  'smart-home-for-renters': 'start',
  'what-is-matter': 'start',
  'wifi-for-smart-home': 'start',
  'smart-home-without-internet': 'start',
  'smart-switch-or-smart-bulb': 'start',
  'local-smart-home-vs-google-apple-smartthings': 'start',
  'renovation-smart-home-prep': 'renovation',
  'check-older-home-before-smart': 'renovation',
  'no-neutral-smart-switches': 'renovation',
  'motorised-curtains-guide': 'energy',
  'smart-aircon-control': 'energy',
  'reduce-aircon-electricity-smart-home': 'energy',
  'smart-home-for-elderly-parents': 'care',
  'radar-fall-detection': 'care',
  'smart-home-helpers-kids-guests-access': 'care',
  'ai-upgrade-existing-cctv': 'security',
  'smart-door-lock-guide': 'security',
  'water-smoke-humidity-sensors-singapore': 'security',
  'smart-home-privacy-local-vs-cloud': 'security',
  'bto-key-collection-smart-home-timeline': 'renovation',
  'smart-home-during-hdb-renovation': 'renovation',
  'condo-smart-home-upgrade-cost-factors': 'renovation',
  'singapore-humidity-mould-aircon-dry-mode-automation': 'security',
  'esp32-ai-voice-assistant-what-it-can-do': 'start',
  'digital-signage-small-office-shop-singapore': 'business',
  'custom-esp32-device-or-off-the-shelf': 'business',
}

/** Shown first on /guides/: one main pick, then two. */
export const FEATURED = [
  'upgrade-existing-home-smart',
  'renovation-smart-home-prep',
  'local-smart-home-vs-google-apple-smartthings',
]

/** Rough reading time (counted in vite.config.ts). */
export const readMinutes = (guide: Guide) => guide.minutes

const DATE = /^\d{4}-\d{2}-\d{2}$/

const plain = (text: string) =>
  text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1')

/** "## Common questions" / "## 常见问题", then "### question" each followed by one answer paragraph. */
function parseFaq(body: string) {
  const section = /^## (?:Common questions|常见问题)\s*\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(body)
  if (!section) return []
  return section[1]
    .split(/^### /m)
    .slice(1)
    .map((entry) => {
      const [q, ...answer] = entry.trim().split(/\n+/)
      return { q: plain(q), a: plain(answer.join(' ')) }
    })
    .filter((item) => item.q && item.a)
}

function parse(file: string, raw: string): Guide & { draft: boolean } {
  const name = /\/([a-z0-9-]+)\.(en|zh)\.md$/.exec(file)
  const parts = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw.replace(/\r\n/g, '\n'))
  if (!name || !parts) throw new Error(`${file}: expected <slug>.<en|zh>.md with front matter`)

  const meta = Object.fromEntries(
    parts[1].split('\n').map((line) => {
      const i = line.indexOf(':')
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()]
    }),
  )
  // `description` is checked by the guide-front-matter plugin (vite.config.ts), which keeps it out of `?front`.
  for (const key of ['title', 'published', 'updated']) {
    if (!meta[key]) throw new Error(`${file}: missing "${key}"`)
  }
  if (!DATE.test(meta.published) || !DATE.test(meta.updated)) {
    throw new Error(`${file}: dates must be YYYY-MM-DD`)
  }

  const kind = file.includes('/pages/') ? 'page' : 'guide'
  if (kind === 'page' && !/^[a-z0-9-]+(\/[a-z0-9-]+)?\/$/.test(meta.path ?? '')) {
    throw new Error(`${file}: a page needs "path: section/name/" or "path: name/"`)
  }

  return {
    kind,
    path: kind === 'page' ? meta.path : `guides/${name[1]}/`,
    related: (meta.related ?? '').split(',').map((slug) => slug.trim()).filter(Boolean),
    slug: name[1],
    lang: name[2] as Lang,
    title: meta.title,
    heading: meta.heading || meta.title,
    description: meta.description ?? '',
    published: meta.published,
    updated: meta.updated,
    file,
    minutes: Number(meta.minutes),
    body: parts[2].trim(),
    points: (meta.points ?? '').split('|').map((point) => point.trim()).filter(Boolean),
    topic: TOPICS[name[1]] ?? 'start',
    faq: parseFaq(parts[2]),
    draft: meta.draft === 'true',
  }
}

/** Newest first. */
const everything: Guide[] = Object.entries(files)
  .map(([file, raw]) => parse(file, raw))
  .filter((guide) => import.meta.env.DEV || !guide.draft)
  .sort((a, b) => b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug))

/**
 * Descriptions are kept out of `?front` (half its size) because only the
 * guide and hub views list them; those import guideDescriptions.ts, which
 * fills them in. The current page's own description comes with its body.
 */
export function fillDescriptions(descriptions: Record<string, string>) {
  for (const guide of everything) guide.description ||= descriptions[guide.file]
}

export const guides = everything.filter((item) => item.kind === 'guide')
export const topicPages = everything.filter((item) => item.kind === 'page')

for (const guide of everything) {
  if (!everything.some((other) => other.slug === guide.slug && other.lang !== guide.lang)) {
    throw new Error(`guides/${guide.slug}: needs both .en.md and .zh.md`)
  }
}

/** Give a guide its body, FAQ, points and description from the full Markdown file. */
function setBody(guide: Guide, raw: string) {
  const full = parse(guide.file, raw)
  guide.description = full.description
  guide.body = full.body
  guide.faq = full.faq
  guide.points = full.points
}

/** Browser: fetch the current article's body before the first render. */
export async function loadGuideBody(guide: Guide) {
  if (!guide.body) setBody(guide, await bodies[guide.file]())
}

/** Prerender: every body at once, keyed like the glob above (e.g. "./guides/x.en.md"). */
export function fillGuideBodies(raw: Record<string, string>) {
  for (const guide of everything) setBody(guide, raw[guide.file])
}

export const guidePath = (slug: string) => `guides/${slug}/`

export const guidesIn = (lang: Lang) => guides.filter((guide) => guide.lang === lang)

export const pagesIn = (lang: Lang) => topicPages.filter((page) => page.lang === lang)

/** A guide or a topic page, by its path. */
export const findGuide = (lang: Lang, path: string) =>
  everything.find((item) => item.lang === lang && item.path === path)

export const HUBS = ['solutions', 'homes'] as const
export type Hub = (typeof HUBS)[number]

/** "solutions/" or "homes/" for an index page; otherwise null. */
export const hubOf = (path: string): Hub | null => HUBS.find((hub) => path === `${hub}/`) ?? null

/** Every page path below a language root, for the prerender and the sitemap. */
export const pagePaths = [
  '',
  'guides/',
  'products/',
  'software/',
  'custom-hardware/',
  'signage/',
  'renovation-checklist/',
  'glossary/',
  ...guidesIn('en').map((guide) => guide.path),
  ...pagesIn('en').map((page) => page.path),
  ...HUBS.map((hub) => `${hub}/`),
]

/** Newest `updated` date across all guides, or null when there are none. */
export const latestGuideUpdate = guides.reduce<string | null>(
  (latest, guide) => (latest && latest > guide.updated ? latest : guide.updated),
  null,
)

/** Title and description for any page — shared by the prerender and <Seo>. */
export function pageMeta(lang: Lang, path: string) {
  const t = dictionaries[lang]
  const guide = findGuide(lang, path)
  if (guide) {
    const suffix = lang === 'zh' ? `｜${brand.nameZh}` : ` | ${brand.name}`
    // Search results cut titles at roughly 60 Latin / 30 CJK characters; a long
    // title keeps its words and drops the brand suffix (the brand is still in
    // og:site_name and the JSON-LD). CJK counts double.
    const width = (text: string) => [...text].reduce((n, ch) => n + (ch > '\u2e80' ? 2 : 1), 0)
    const title = width(guide.title + suffix) <= 65 ? guide.title + suffix : guide.title
    return { title, description: guide.description, guide }
  }
  const hub = hubOf(path)
  if (hub) {
    return { title: t.hubs[hub].metaTitle, description: t.hubs[hub].metaDescription, guide: null }
  }
  if (path === 'guides/') {
    return { title: t.guides.metaTitle, description: t.guides.metaDescription, guide: null }
  }
  if (path === 'products/') {
    return { title: t.products.metaTitle, description: t.products.metaDescription, guide: null }
  }
  if (path === 'software/') {
    return { title: t.software.metaTitle, description: t.software.metaDescription, guide: null }
  }
  if (path === 'custom-hardware/') {
    return { title: t.hardware.metaTitle, description: t.hardware.metaDescription, guide: null }
  }
  if (path === 'signage/') {
    return { title: t.signage.metaTitle, description: t.signage.metaDescription, guide: null }
  }
  if (path === 'renovation-checklist/') {
    return { title: t.checklist.metaTitle, description: t.checklist.metaDescription, guide: null }
  }
  if (path === 'glossary/') {
    return { title: t.glossary.metaTitle, description: t.glossary.metaDescription, guide: null }
  }
  if (path && !pagePaths.includes(path)) {
    return { title: t.notFound.metaTitle, description: t.notFound.metaDescription, guide: null }
  }
  return { title: t.meta.title, description: t.meta.description, guide: null }
}
