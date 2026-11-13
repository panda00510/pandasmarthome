import { findGuide, hubOf } from './content/guides'
import type { Glossary } from './content/types'
import type { Lang } from './i18n/context'

/**
 * Each kind of page is its own chunk. The site has no client-side routing
 * (every link is a page load), so main.tsx loads the one chunk a page needs
 * and only then renders: the prerendered HTML stays on screen until React
 * replaces it in one go, with no Suspense fallback in between. The prerender
 * (entry-server.tsx) fills all of them statically.
 */
const loaders = {
  home: () => import('./components/sections/Home'),
  guides: () => import('./components/sections/Guides'),
  hub: () => import('./components/sections/Hub'),
  products: () => import('./components/sections/Products'),
  software: () => import('./components/sections/Software'),
  hardware: () => import('./components/sections/Hardware'),
  signage: () => import('./components/sections/Signage'),
  checklist: () => import('./components/sections/Checklist'),
  // The terms come in this page's language only (content/glossary.<lang>.ts).
  glossary: async (lang: Lang) => {
    const [view, data] = await Promise.all([
      import('./components/sections/Glossary'),
      lang === 'zh' ? import('./content/glossary.zh') : import('./content/glossary.en'),
    ])
    return { ...view, glossaries: { [lang]: data.glossary } as Partial<Record<Lang, Glossary>> }
  },
}

export type View = keyof typeof loaders

/** Source of each chunk, for the per-page modulepreload links (scripts/prerender.mjs checks them against the manifest). */
export const viewFiles: Record<View, string> = {
  home: 'src/components/sections/Home.tsx',
  guides: 'src/components/sections/Guides.tsx',
  hub: 'src/components/sections/Hub.tsx',
  products: 'src/components/sections/Products.tsx',
  software: 'src/components/sections/Software.tsx',
  hardware: 'src/components/sections/Hardware.tsx',
  signage: 'src/components/sections/Signage.tsx',
  checklist: 'src/components/sections/Checklist.tsx',
  glossary: 'src/components/sections/Glossary.tsx',
}

export const views: { [K in View]?: Awaited<ReturnType<(typeof loaders)[K]>> } = {}

export async function loadView(view: View | null, lang: Lang) {
  if (view) Object.assign(views, { [view]: await loaders[view](lang) })
}

const PAGES: Record<string, View> = {
  '': 'home',
  'guides/': 'guides',
  'products/': 'products',
  'software/': 'software',
  'custom-hardware/': 'hardware',
  'signage/': 'signage',
  'renovation-checklist/': 'checklist',
  'glossary/': 'glossary',
}

/** Which chunk a page needs; null for an unknown address (the 404 view is in the main bundle). */
export function viewOf(lang: Lang, path: string): View | null {
  if (findGuide(lang, path)) return 'guides'
  if (hubOf(path)) return 'hub'
  return PAGES[path] ?? null
}
