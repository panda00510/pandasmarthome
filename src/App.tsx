import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { Seo } from './components/Seo'
import { NotFound } from './components/sections/NotFound'
import { findGuide, hubOf, pagePaths, type Guide } from './content/guides'
import { useReveal } from './hooks/motion'
import { useI18n } from './i18n/context'
import { pageWhatsappMessage, whatsappHref } from './lib/whatsapp'
import { viewOf, views } from './views'

export default function App() {
  const { t, lang, path } = useI18n()
  const guide = findGuide(lang, path)
  const notFound = !pagePaths.includes(path)
  useReveal()
  const whatsapp = whatsappHref(pageWhatsappMessage(t, lang, path))

  // The floating WhatsApp button would sit on top of the form fields, so it steps aside there.
  const [atContact, setAtContact] = useState(false)
  useEffect(() => {
    const target = document.getElementById('contact')
    if (!target) return
    const watcher = new IntersectionObserver(([entry]) => setAtContact(entry.isIntersecting), {
      threshold: 0.05,
    })
    watcher.observe(target)
    return () => watcher.disconnect()
  }, [path])

  return (
    <>
      {/* A 404 has no canonical or structured data; its head is set by the prerender. */}
      {notFound ? null : <Seo />}

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-full focus:bg-ink-950 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-paper"
      >
        {t.a11y.skipToContent}
      </a>

      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        {notFound ? <NotFound /> : <Page path={path} guide={guide} />}
      </main>

      <Footer />

      {/* Floating WhatsApp shortcut, only when a number is configured. */}
      {whatsapp && !atContact && path !== 'products/' && path !== 'software/' && path !== 'custom-hardware/' && path !== 'signage/' ? (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.contact.whatsappCta}
          data-track-source="floating"
          className="fixed right-4 bottom-4 z-40 inline-flex size-14 items-center justify-center gap-2 rounded-full bg-[#25d366] text-ink-950 shadow-lift transition-transform motion-safe:hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-950 motion-reduce:transition-none sm:right-6 sm:bottom-6 sm:size-auto sm:px-5 sm:py-3.5"
        >
          <MessageCircle size={24} aria-hidden="true" />
          <span aria-hidden="true" className="hidden text-sm font-semibold sm:inline">
            {t.contact.whatsappCta}
          </span>
        </a>
      ) : null}
    </>
  )
}

/** The page body, from the chunk main.tsx loaded for it (see src/views.ts). */
function Page({ path, guide }: { path: string; guide: Guide | undefined }) {
  const { lang } = useI18n()
  const view = viewOf(lang, path)
  const v = views
  if (view === 'guides') {
    const { GuidePage, GuidesIndex } = v.guides!
    return guide ? <GuidePage guide={guide} /> : <GuidesIndex />
  }
  if (view === 'hub') {
    const { HubPage } = v.hub!
    return <HubPage hub={hubOf(path)!} />
  }
  if (view === 'products') {
    const { ProductsPage } = v.products!
    return <ProductsPage />
  }
  if (view === 'software') {
    const { SoftwarePage } = v.software!
    return <SoftwarePage />
  }
  if (view === 'hardware') {
    const { HardwarePage } = v.hardware!
    return <HardwarePage />
  }
  if (view === 'signage') {
    const { SignagePage } = v.signage!
    return <SignagePage />
  }
  if (view === 'checklist') {
    const { ChecklistPage } = v.checklist!
    return <ChecklistPage />
  }
  if (view === 'glossary') {
    const { GlossaryPage, glossaries } = v.glossary!
    return <GlossaryPage glossaries={glossaries} />
  }
  const { HomePage } = v.home!
  return <HomePage />
}
