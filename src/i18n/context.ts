import { createContext, useContext } from 'react'
import type { Content } from '../content/types'
import { en } from '../content/en'
import { zh } from '../content/zh'

export type Lang = 'en' | 'zh'

export const dictionaries: Record<Lang, Content> = { en, zh }

export type I18nValue = {
  lang: Lang
  /** Copy for the active language. */
  t: Content
  /** Page path below the language root: '' (home), 'guides/', 'guides/<slug>/'. */
  path: string
}

export const I18nContext = createContext<I18nValue | null>(null)

export function useI18n(): I18nValue {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside <LanguageProvider>')
  return value
}

/**
 * English lives at `/`, Chinese at `/zh/`. Each is a separate prerendered
 * file, so crawlers get the right language without running JavaScript.
 * Root-relative — prefix with `site.url` for canonical / hreflang.
 */
export function langPath(lang: Lang, path = ''): string {
  return (lang === 'zh' ? '/zh/' : '/') + path
}

/** Same page as a link in the browser, under the deploy's base path. */
export function pageHref(lang: Lang, path = ''): string {
  return import.meta.env.BASE_URL + langPath(lang, path).slice(1)
}

/** Inverse of pageHref: which language and page a pathname points at. */
export function parsePath(pathname: string): { lang: Lang; path: string } {
  const base = import.meta.env.BASE_URL
  let rest = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\//, '')
  const lang: Lang = rest === 'zh' || rest.startsWith('zh/') ? 'zh' : 'en'
  if (lang === 'zh') rest = rest.slice(3)
  if (rest && !rest.endsWith('/')) rest += '/'
  return { lang, path: rest }
}
