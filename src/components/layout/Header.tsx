import { useEffect, useState } from 'react'
import { Menu, X, Box } from 'lucide-react'
import { Wordmark } from '../brand/Wordmark'
import { Button } from '../ui'
import { useActiveSection } from '../../hooks/motion'
import { pageHref, useI18n, type Lang } from '../../i18n/context'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
]

export function Header() {
  const { t, lang, path } = useI18n()
  // Section anchors live on the homepage; from a guide they go back there.
  const home = path ? pageHref(lang) : ''
  const [open, setOpen] = useState(false)
  // The showroom is a separate build served from /showroom/. BASE_URL keeps it
  // correct on both hosts, and ?lang carries the current language across.
  const showroomHref = `${import.meta.env.BASE_URL}showroom/?lang=${lang}`
  const [scrolled, setScrolled] = useState(false)
  const activeSection = useActiveSection(t.nav.items.map((item) => item.id))

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

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? 'border-b border-ink-200/70 bg-paper/85 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <a
          href={`${home}#top`}
          className="shrink-0 rounded-lg text-ink-950 transition-opacity hover:opacity-70"
          aria-label={t.a11y.homeLink}
        >
          <Wordmark />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-0.5 xl:flex">
          {t.nav.items.map((item) => {
            const current = item.id === activeSection
            return (
              <a
                key={item.id}
                href={`${home}#${item.id}`}
                aria-current={current ? 'true' : undefined}
                className={`relative rounded-full px-3 py-2 text-[0.9rem] font-medium whitespace-nowrap transition-colors ${
                  current
                    ? 'text-ink-950'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-950'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-bamboo-500 transition-transform duration-300 ${
                    current ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            )
          })}

          <a
            href={showroomHref}
            className="ml-1 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.9rem] font-medium whitespace-nowrap text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-950"
          >
            <Box size={15} aria-hidden="true" />
            {t.nav.showroom}
          </a>
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
            className="-mr-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-800 transition-colors hover:bg-ink-100 xl:hidden"
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-ink-200/70 bg-paper/95 backdrop-blur-xl xl:hidden"
      >
        <nav aria-label="Primary mobile" className="shell flex flex-col gap-1 py-4">
          {t.nav.items.map((item) => (
            <a
              key={item.id}
              href={`${home}#${item.id}`}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-base font-medium text-ink-800 transition-colors hover:bg-ink-100"
            >
              {item.label}
            </a>
          ))}
          <a
            href={showroomHref}
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-3 text-base font-medium text-ink-800 transition-colors hover:bg-ink-100"
          >
            <Box size={17} aria-hidden="true" />
            {t.nav.showroom}
          </a>
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

function LangToggle({
  lang,
  path,
  label,
}: {
  lang: Lang
  path: string
  label: string
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center gap-0.5 rounded-full bg-ink-100 p-0.5"
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
            className={`rounded-full px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
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
