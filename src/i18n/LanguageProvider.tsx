import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  I18nContext,
  LANG_PARAM,
  STORAGE_KEY,
  dictionaries,
  detectLang,
  type Lang,
} from './context'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Private browsing / storage disabled — the preference just won't persist.
    }
  }, [])

  // Keep <html lang> honest: it drives the CJK font stack and screen readers.
  useEffect(() => {
    document.documentElement.lang = dictionaries[lang].htmlLang
  }, [lang])

  // Mirror the language into the URL so the page can be linked and indexed
  // per language. replaceState keeps the back button meaningful.
  useEffect(() => {
    const url = new URL(window.location.href)
    if (lang === 'zh') url.searchParams.set(LANG_PARAM, 'zh')
    else url.searchParams.delete(LANG_PARAM)
    if (url.toString() !== window.location.href) {
      window.history.replaceState(null, '', url)
    }
  }, [lang])

  const value = useMemo(() => ({ lang, t: dictionaries[lang], setLang }), [lang, setLang])

  return <I18nContext value={value}>{children}</I18nContext>
}
