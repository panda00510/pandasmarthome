import { useEffect, useState } from 'react'
import { Box, Cpu, MessageCircle } from 'lucide-react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { Seo } from './components/Seo'
import { NotFound } from './components/sections/NotFound'
import { findGuide, hubOf, pagePaths, type Guide } from './content/guides'
import { Button } from './components/ui'
import { useReveal } from './hooks/motion'
import { pageHref, useI18n } from './i18n/context'
import { pageWhatsappMessage, whatsappHref } from './lib/whatsapp'
import { viewOf, views } from './views'
import { showroomHref } from './lib/showroom'

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

  // Phones: a bottom bar once the first screen has scrolled away (CSS hides it from 640px and in print).
  const [pastFirstScreen, setPastFirstScreen] = useState(false)
  useEffect(() => {
    const check = () => setPastFirstScreen(window.scrollY > window.innerHeight)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])
  const bar = pastFirstScreen && !atContact && !notFound

  return (
    <>
      {/* A 404 has no canonical or structured data; its head is set by the prerender. */}
      {notFound ? null : <Seo />}

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-[3px] focus:bg-ink-950 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-paper"
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
          className={`${bar ? 'max-sm:hidden ' : ''}fixed right-4 bottom-4 z-40 inline-flex size-14 items-center justify-center gap-2 rounded-full bg-[#25d366] text-ink-950 shadow-lift transition-transform motion-safe:hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-950 motion-reduce:transition-none sm:right-6 sm:bottom-6 sm:size-auto sm:px-5 sm:py-3.5`}
        >
          <MessageCircle size={24} aria-hidden="true" />
          <span aria-hidden="true" className="hidden text-sm font-semibold sm:inline">
            {t.contact.whatsappCta}
          </span>
        </a>
      ) : null}

      {bar ? (
        <nav
          aria-label={t.a11y.quickActions}
          className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-ink-950/15 bg-paper/96 px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden print:hidden"
        >
          {whatsapp ? (
            <Button as="a" href={whatsapp} target="_blank" rel="noopener noreferrer" data-track-source="bar" size="sm" className="flex-1">
              <MessageCircle size={16} aria-hidden="true" />
              WhatsApp
            </Button>
          ) : null}
          {path === 'smart-home/' || path.startsWith('solutions/') || path.startsWith('homes/') || path === 'how-it-works/' ? (
            <Button as="a" href={showroomHref(lang)} variant="secondary" size="sm" className="flex-1">
              <Box size={16} aria-hidden="true" className="text-ember-500" />
              {t.nav.showroom}
            </Button>
          ) : (
            <Button
              as="a"
              href={pageHref(lang, path === 'products/' ? 'custom-hardware/' : 'products/')}
              variant="secondary"
              size="sm"
              className="flex-1"
            >
              <Cpu size={16} aria-hidden="true" className="text-brand" />
              {path === 'products/' ? t.hardware.navLabel : t.products.nav.devices}
            </Button>
          )}
        </nav>
      ) : null}
    </>
  )
}

/** The page body, from the chunk main.tsx loaded for it (see src/views.ts). */
function Page({ path, guide }: { path: string; guide: Guide | undefined }) {
  const { lang } = useI18n()
  const view = viewOf(lang, path)
  const v = views
  if (view === 'smartHome') {
    const { SmartHomePage } = v.smartHome!
    return <SmartHomePage />
  }
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
  if (view === 'contact') {
    const { ContactPage } = v.contact!
    return <ContactPage />
  }
  if (view === 'compare') {
    const { ComparePage } = v.compare!
    return <ComparePage />
  }
  if (view === 'faq') {
    const { FaqPage } = v.faq!
    return <FaqPage />
  }
  if (view === 'glossary') {
    const { GlossaryPage, glossaries } = v.glossary!
    return <GlossaryPage glossaries={glossaries} />
  }
  const { HomePage } = v.home!
  return <HomePage />
}
