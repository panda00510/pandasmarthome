import { useEffect, useState } from 'react'
import { Menu, X, Box } from 'lucide-react'
import { Wordmark } from '../brand/Wordmark'
import { Button } from '../ui'
import { pageHref, useI18n, type Lang } from '../../i18n/context'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
]

/** Nav items that open an index page instead of scrolling the homepage. */
const HUB_ITEMS: Record<string, string> = {
  solutions: 'solutions/',
  homes: 'homes/',
  process: 'how-it-works/',
}

type NavLink = { key: string; label: string; href: string; current: boolean; icon?: boolean }

export function Header() {
  const { t, lang, path } = useI18n()
  // Section anchors live on the homepage; from a guide they go back there.
  const home = path ? pageHref(lang) : ''
  const [open, setOpen] = useState(false)
  // The showroom is a separate build served from /showroom/. BASE_URL keeps it
  // correct on both hosts, and ?lang carries the current language across.
  const showroomHref = `${import.meta.env.BASE_URL}showroom/?lang=${lang}`
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape closes the mobile panel; body scroll stays locked while it is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  // Five entries: services, your home, showroom, guides, process.
  const byId = (id: string): NavLink => {
    const item = t.nav.items.find((entry) => entry.id === id)!
    const page = HUB_ITEMS[id]
    return { key: id, label: item.label, href: pageHref(lang, page), current: path === page }
  }
  const links: NavLink[] = [
    byId('solutions'),
    byId('homes'),
    { key: 'showroom', label: t.nav.showroom, href: showroomHref, current: false, icon: true },
    { key: 'guides', label: t.guides.eyebrow, href: pageHref(lang, 'guides/'), current: path === 'guides/' },
    byId('process'),
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? 'border-b border-ink-200/70 bg-paper/90 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-3 lg:h-[4.5rem]">
        <a
          href={`${home}#top`}
          className="min-w-0 rounded-lg text-ink-950 transition-opacity hover:opacity-70"
          aria-label={t.a11y.homeLink}
        >
          <Wordmark className="max-w-full" />
        </a>

        <nav aria-label={t.a11y.navPrimary} className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.key}
              href={link.href}
              aria-current={link.current ? 'page' : undefined}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-[0.9375rem] font-medium whitespace-nowrap transition-colors ${
                link.current ? 'bg-ink-100 text-ink-950' : 'text-ink-700 hover:bg-ink-100 hover:text-ink-950'
              }`}
            >
              {link.icon ? <Box size={15} aria-hidden="true" /> : null}
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LangToggle lang={lang} path={path} label={t.a11y.languageSwitcher} />

          <Button as="a" href={`${home}#contact`} size="sm" className="hidden sm:inline-flex">
            {t.nav.cta}
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
            className="-mr-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-800 transition-colors hover:bg-ink-100 lg:hidden"
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-ink-200/70 bg-paper/95 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label={t.a11y.navMobile} className="shell flex flex-col gap-1 py-4">
          {links.map((link) => (
            <a
              key={link.key}
              href={link.href}
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 text-base font-medium text-ink-800 transition-colors hover:bg-ink-100"
            >
              {link.icon ? <Box size={17} aria-hidden="true" /> : null}
              {link.label}
            </a>
          ))}
          <Button
            as="a"
            href={`${home}#contact`}
            size="lg"
            className="mt-3 w-full"
            onClick={() => setOpen(false)}
          >
            {t.nav.cta}
          </Button>
        </nav>
      </div>
    </header>
  )
}

function LangToggle({ lang, path, label }: { lang: Lang; path: string; label: string }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center rounded-full bg-ink-100"
    >
      {LANGS.map((option) => {
        const active = option.code === lang
        return (
          <a
            key={option.code}
            href={pageHref(option.code, path)}
            aria-current={active ? 'page' : undefined}
            lang={option.code === 'zh' ? 'zh-Hans' : 'en'}
            hrefLang={option.code === 'zh' ? 'zh-Hans' : 'en'}
            className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full px-2.5 text-sm sm:px-3 font-semibold whitespace-nowrap transition-colors ${
              active
                ? 'bg-white text-ink-950 shadow-[0_1px_2px_rgb(12_15_19/0.08)]'
                : 'text-ink-500 hover:text-ink-800'
            }`}
          >
            {option.label}
          </a>
        )
      })}
    </div>
  )
}
