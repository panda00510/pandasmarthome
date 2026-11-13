import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { findGuide, loadGuideBody } from './content/guides'
import { loadDictionary, pageHref, parsePath } from './i18n/context'
import { LanguageProvider } from './i18n/LanguageProvider.tsx'
import { startTracking } from './lib/track'
import { loadView, viewOf } from './views'

const { lang, path } = parsePath(window.location.pathname)

// Older links used /?lang=zh — send them to the real Chinese URL.
if (lang === 'en' && new URLSearchParams(window.location.search).get('lang') === 'zh') {
  window.location.replace(pageHref('zh', path) + window.location.hash)
} else {
  // Inlined at build time: with neither set, the listener and loader are dropped from the bundle.
  if (import.meta.env.VITE_PLAUSIBLE_DOMAIN || import.meta.env.VITE_GA_MEASUREMENT_ID) startTracking()
  // This page's copy, page chunk and article body first (the prerender adds
  // <link rel="modulepreload"> for them). Until they arrive the prerendered
  // HTML stays as it is, so nothing blanks or flashes; then React replaces it.
  const guide = findGuide(lang, path)
  await Promise.all([loadDictionary(lang), loadView(viewOf(lang, path)), guide && loadGuideBody(guide)])
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <LanguageProvider lang={lang} path={path}>
        <App />
      </LanguageProvider>
    </StrictMode>,
  )
}
