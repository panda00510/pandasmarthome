import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { pageHref, parsePath } from './i18n/context'
import { LanguageProvider } from './i18n/LanguageProvider.tsx'

const { lang, path } = parsePath(window.location.pathname)

// Older links used /?lang=zh — send them to the real Chinese URL.
if (lang === 'en' && new URLSearchParams(window.location.search).get('lang') === 'zh') {
  window.location.replace(pageHref('zh', path) + window.location.hash)
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <LanguageProvider lang={lang} path={path}>
        <App />
      </LanguageProvider>
    </StrictMode>,
  )
}
