import { MessageCircle } from 'lucide-react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { Seo } from './components/Seo'
import { Compatibility } from './components/sections/Compatibility'
import { Contact } from './components/sections/Contact'
import { CtaBand } from './components/sections/CtaBand'
import { Faq } from './components/sections/Faq'
import { GuidePage, GuidesIndex, LatestGuides } from './components/sections/Guides'
import { Hero } from './components/sections/Hero'
import { Homes } from './components/sections/Homes'
import { Platform } from './components/sections/Platform'
import { Process } from './components/sections/Process'
import { Solutions } from './components/sections/Solutions'
import { ValueProps } from './components/sections/ValueProps'
import { site } from './config/site'
import { findGuide } from './content/guides'
import { useReveal } from './hooks/motion'
import { useI18n } from './i18n/context'

export default function App() {
  const { t, lang, path } = useI18n()
  const guide = findGuide(lang, path)
  useReveal()

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
        ) : path === 'guides/' ? (
          <GuidesIndex />
        ) : (
          <>
            <Hero />
            <ValueProps />
            <Solutions />
            <Platform />
            <Homes />
            <Process />
            <Compatibility />
            <Faq />
            <LatestGuides />
            <CtaBand />
            <Contact />
          </>
        )}
      </main>

      <Footer />

      {/* Floating WhatsApp shortcut, only when a number is configured. */}
      {site.whatsappLink ? (
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
