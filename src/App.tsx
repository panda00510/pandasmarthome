import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { Seo } from './components/Seo'
import { Compatibility } from './components/sections/Compatibility'
import { Contact } from './components/sections/Contact'
import { CtaBand } from './components/sections/CtaBand'
import { Faq } from './components/sections/Faq'
import { Hero } from './components/sections/Hero'
import { Homes } from './components/sections/Homes'
import { Platform } from './components/sections/Platform'
import { Process } from './components/sections/Process'
import { Solutions } from './components/sections/Solutions'
import { ValueProps } from './components/sections/ValueProps'
import { useReveal } from './hooks/motion'
import { useI18n } from './i18n/context'

export default function App() {
  const { t } = useI18n()
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
        <Hero />
        <ValueProps />
        <Solutions />
        <Platform />
        <Homes />
        <Process />
        <Compatibility />
        <Faq />
        <CtaBand />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
