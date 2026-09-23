import { useEffect, useMemo, type ReactNode } from 'react'
import { I18nContext, dictionaries, type Lang } from './context'

/** Language and page come from the URL (see parsePath); switching languages is a link. */
export function LanguageProvider({
  lang,
  path,
  children,
}: {
  lang: Lang
  path: string
  children: ReactNode
}) {
  // Keep <html lang> honest: it drives the CJK font stack and screen readers.
  useEffect(() => {
    document.documentElement.lang = dictionaries[lang].htmlLang
  }, [lang])

  const value = useMemo(() => ({ lang, path, t: dictionaries[lang] }), [lang, path])

  return <I18nContext value={value}>{children}</I18nContext>
}
