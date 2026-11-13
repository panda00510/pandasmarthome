import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { Seo } from './components/Seo'
import { Contact } from './components/sections/Contact'
import { Faq } from './components/sections/Faq'
import { GuidePage, GuidesIndex } from './components/sections/Guides'
import { Hero } from './components/sections/Hero'
import { HubPage } from './components/sections/Hub'
import { Homes } from './components/sections/Homes'
import { Platform } from './components/sections/Platform'
import { Process } from './components/sections/Process'
import { Solutions } from './components/sections/Solutions'
import { ProductsPage } from './components/sections/Products'
import { SoftwarePage } from './components/sections/Software'
import { Custom } from './components/sections/Custom'
import { HardwarePage } from './components/sections/Hardware'
import { Upcoming } from './components/sections/Upcoming'
import { site } from './config/site'
import { findGuide, hubOf } from './content/guides'
import { useReveal } from './hooks/motion'
import { useI18n } from './i18n/context'

export default function App() {
  const { t, lang, path } = useI18n()
  const guide = findGuide(lang, path)
  useReveal()

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
      <Seo />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-full focus:bg-ink-950 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-paper"
      >
        {t.a11y.skipToContent}
      </a>

      <Header />

      <main id="main">
        {guide ? (
          <GuidePage guide={guide} />
        ) : hubOf(path) ? (
          <HubPage hub={hubOf(path)!} />
        ) : path === 'guides/' ? (
          <GuidesIndex />
        ) : path === 'products/' ? (
          <ProductsPage />
        ) : path === 'software/' ? (
          <SoftwarePage />
        ) : path === 'custom-hardware/' ? (
          <HardwarePage />
        ) : (
          <>
            <Hero />
            <Solutions />
            <Custom />
            <Homes />
            <Process />
            <Platform />
            <Faq />
            <Upcoming />
            <Contact />
          </>
        )}
      </main>

      <Footer />

      {/* Floating WhatsApp shortcut, only when a number is configured. */}
      {site.whatsappLink && !atContact && path !== 'products/' && path !== 'software/' && path !== 'custom-hardware/' ? (
        <a
          href={`${site.whatsappLink}?text=${encodeURIComponent(t.contact.whatsappGreeting)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.contact.whatsappCta}
          className="fixed right-4 bottom-4 z-40 inline-flex size-14 items-center justify-center gap-2 rounded-full bg-[#25d366] text-white shadow-lift transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-950 motion-reduce:transition-none sm:right-6 sm:bottom-6 sm:size-auto sm:px-5 sm:py-3.5"
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
