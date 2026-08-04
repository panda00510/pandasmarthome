import { createContext, useContext } from 'react'
import type { Content } from '../content/types'
import { en } from '../content/en'
import { zh } from '../content/zh'

export type Lang = 'en' | 'zh'

export const dictionaries: Record<Lang, Content> = { en, zh }

export const STORAGE_KEY = 'panda-lang'

export type I18nValue = {
  lang: Lang
  /** Copy for the active language. */
  t: Content
  setLang: (lang: Lang) => void
}

export const I18nContext = createContext<I18nValue | null>(null)

export function useI18n(): I18nValue {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside <LanguageProvider>')
  return value
}

/** English lives at `/`, Chinese at `/?lang=zh` — real URLs for crawlers. */
export const LANG_PARAM = 'lang'

export function langPath(lang: Lang): string {
  return lang === 'zh' ? `/?${LANG_PARAM}=zh` : '/'
}

/** URL parameter first (shareable), then stored preference, then browser. */
export function detectLang(): Lang {
  if (typeof window === 'undefined') return 'en'

  const fromUrl = new URLSearchParams(window.location.search).get(LANG_PARAM)
  if (fromUrl === 'en' || fromUrl === 'zh') return fromUrl

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'zh') return stored

  return navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}
