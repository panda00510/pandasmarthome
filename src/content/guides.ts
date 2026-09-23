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
 *   draft: true             (optional; drafts show in `npm run dev` only)
 *   ---
 *
 * Every slug needs both languages, or the build fails.
 */
export type Guide = {
  slug: string
  lang: Lang
  title: string
  description: string
  published: string
  updated: string
  body: string
}

const files = import.meta.glob<string>('./guides/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const DATE = /^\d{4}-\d{2}-\d{2}$/

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
  for (const key of ['title', 'description', 'published', 'updated']) {
    if (!meta[key]) throw new Error(`${file}: missing "${key}"`)
  }
  if (!DATE.test(meta.published) || !DATE.test(meta.updated)) {
    throw new Error(`${file}: dates must be YYYY-MM-DD`)
  }

  return {
    slug: name[1],
    lang: name[2] as Lang,
    title: meta.title,
    description: meta.description,
    published: meta.published,
    updated: meta.updated,
    body: parts[2].trim(),
    draft: meta.draft === 'true',
  }
}

/** Newest first. */
export const guides: Guide[] = Object.entries(files)
  .map(([file, raw]) => parse(file, raw))
  .filter((guide) => import.meta.env.DEV || !guide.draft)
  .sort((a, b) => b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug))

for (const guide of guides) {
  if (!guides.some((other) => other.slug === guide.slug && other.lang !== guide.lang)) {
    throw new Error(`guides/${guide.slug}: needs both .en.md and .zh.md`)
  }
}

export const guidePath = (slug: string) => `guides/${slug}/`

export const guidesIn = (lang: Lang) => guides.filter((guide) => guide.lang === lang)

export const findGuide = (lang: Lang, path: string) =>
  guidesIn(lang).find((guide) => guidePath(guide.slug) === path)

/** Every page path below a language root, for the prerender and the sitemap. */
export const pagePaths = ['', 'guides/', ...guidesIn('en').map((guide) => guidePath(guide.slug))]

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
    return { title: guide.title + suffix, description: guide.description, guide }
  }
  if (path === 'guides/') {
    return { title: t.guides.metaTitle, description: t.guides.metaDescription, guide: null }
  }
  return { title: t.meta.title, description: t.meta.description, guide: null }
}
