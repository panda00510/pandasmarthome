import { useEffect, useRef, useState } from 'react'
import { Menu, X, Box, ChevronDown } from 'lucide-react'
import { Wordmark } from '../brand/Wordmark'
import { Button } from '../ui'
import { pageHref, useI18n, type Lang } from '../../i18n/context'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
]

/** Nav items that open their own page instead of scrolling the homepage. */
const PAGE_ITEMS: Record<string, string> = {
  solutions: 'solutions/',
  products: 'products/',
  software: 'software/',
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

  // Seven entries: services, products, software, your home, showroom, guides, process.
  const byId = (id: string): NavLink => {
    const item = t.nav.items.find((entry) => entry.id === id)!
    const page = PAGE_ITEMS[id]
    return { key: id, label: item.label, href: pageHref(lang, page), current: path === page }
  }
  // On the homepage the header starts on the ink hero, so it is dark until
  // the page scrolls; then it becomes frosted paper everywhere.
  const dark = (path === '' || path === 'custom-hardware/' || path === 'signage/') && !scrolled && !open

  // Primary row: services, your home, showroom, [Products ▾], [Custom ▾], guides, process.
  const links: NavLink[] = [
    byId('solutions'),
    byId('homes'),
    { key: 'showroom', label: t.nav.showroom, href: showroomHref, current: false, icon: true },
    { key: 'guides', label: t.guides.eyebrow, href: pageHref(lang, 'guides/'), current: path === 'guides/' },
    byId('process'),
  ]
  // "Products": things that exist already. "Custom": things built to order.
  const productLinks: NavLink[] = [
    { key: 'signage', label: t.signage.navLabel, href: pageHref(lang, 'signage/'), current: path === 'signage/' },
    { key: 'devices', label: t.products.nav.devices, href: pageHref(lang, 'products/'), current: path === 'products/' },
    {
      key: 'install',
      label: t.products.nav.install,
      href: `${pageHref(lang, 'products/')}#smart-home-devices`,
      current: false,
    },
  ]
  const customLinks: NavLink[] = [
    {
      key: 'hardware',
      label: t.hardware.navLabel,
      href: pageHref(lang, 'custom-hardware/'),
      current: path === 'custom-hardware/',
    },
    byId('software'),
  ]
  const groups = [
    { id: 'products-menu', label: t.products.nav.group, items: productLinks },
    { id: 'custom-menu', label: t.custom.nav, items: customLinks },
  ]
  const linkClass = (link: NavLink) =>
    `inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-sm font-medium whitespace-nowrap transition-colors ${
      dark
        ? 'text-ink-300 hover:bg-white/8 hover:text-paper'
        : link.current
          ? 'bg-ink-100 text-ink-950'
          : 'text-ink-700 hover:bg-ink-100 hover:text-ink-950'
    }`
  const desktopLink = (link: NavLink) => (
    <a key={link.key} href={link.href} aria-current={link.current ? 'page' : undefined} className={linkClass(link)}>
      {link.icon ? <Box size={15} aria-hidden="true" /> : null}
      {link.label}
    </a>
  )


  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        dark
          ? 'border-white/8 bg-ink-950 text-paper'
          : scrolled || open
            ? 'border-ink-200/70 bg-paper/75 shadow-[0_8px_30px_-20px_rgb(12_15_19/0.25)] backdrop-blur-xl backdrop-saturate-150'
            : 'border-transparent bg-paper'
      }`}
    >
      {/* Inline links (seven entries, two of them dropdowns) need the full 1200px shell, reached at 1280px. Below that the wordmark
          would shrink, so the menu button stays until then. */}
      <div className="shell flex h-16 items-center justify-between gap-3 min-[1280px]:h-[4.5rem]">
        <a
          href={`${home}#top`}
          className={`min-w-0 rounded-lg transition-opacity hover:opacity-70 ${dark ? 'text-paper' : 'text-ink-950'}`}
          aria-label={t.a11y.homeLink}
        >
          <Wordmark className="max-w-full" />
        </a>

        <nav aria-label={t.a11y.navPrimary} className="hidden items-center gap-0.5 min-[1280px]:flex">
          {links.slice(0, 3).map(desktopLink)}
          {groups.map((group) => (
            <NavMenu key={group.id} id={group.id} label={group.label} items={group.items} dark={dark} />
          ))}
          {links.slice(3).map(desktopLink)}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LangToggle lang={lang} path={path} label={t.a11y.languageSwitcher} dark={dark} />

          <Button
            as="a"
            href={`${home}#contact`}
            size="sm"
            variant={dark ? 'glow' : 'primary'}
            className="hidden sm:inline-flex"
          >
            {t.nav.cta}
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
            className={`-mr-1 inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors min-[1280px]:hidden ${
              dark ? 'text-paper hover:bg-white/10' : 'text-ink-800 hover:bg-ink-100'
            }`}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-ink-200/70 bg-paper/95 backdrop-blur-xl min-[1280px]:hidden"
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
          {groups.map((group) => (
            <div key={group.id} className="flex flex-col gap-1">
              <p className="mt-3 border-t border-ink-200/70 px-3 pt-4 text-xs font-semibold tracking-[0.14em] text-bamboo-700 uppercase">
                {group.label}
              </p>
              {group.items.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  aria-current={link.current ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-12 items-center rounded-xl px-3 text-base font-medium text-ink-800 transition-colors hover:bg-ink-100"
                >
                  {link.label}
                </a>
              ))}
            </div>
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

/**
 * A dropdown group in the desktop nav. A disclosure button, not an ARIA menu:
 * Tab moves through the links; Escape, an outside click or tabbing away closes it.
 */
function NavMenu({ id, label, items, dark }: { id: string; label: string; items: NavLink[]; dark: boolean }) {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!show) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setShow(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShow(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [show])

  const current = items.some((item) => item.current)

  return (
    <div
      ref={ref}
      className="relative"
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) setShow(false)
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={show}
        aria-controls={id}
        onClick={() => setShow((v) => !v)}
        className={`inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-full px-2 text-sm font-semibold whitespace-nowrap transition-colors ${
          dark
            ? 'text-bamboo-300 hover:bg-white/8 hover:text-bamboo-200'
            : current
              ? 'bg-bamboo-50 text-bamboo-800'
              : 'text-bamboo-700 hover:bg-bamboo-50 hover:text-bamboo-800'
        }`}
      >
        {label}
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={`transition-transform duration-200 motion-reduce:transition-none ${show ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={id}
        hidden={!show}
        className="absolute top-full left-1/2 mt-2 w-64 -translate-x-1/2 rounded-2xl border border-ink-200/80 bg-paper p-2 text-ink-900 shadow-lift"
      >
        <ul>
          {items.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                onClick={() => setShow(false)}
                className={`flex min-h-11 items-center rounded-xl px-3 text-sm font-medium transition-colors hover:bg-ink-100 ${
                  item.current ? 'bg-ink-100 text-ink-950' : 'text-ink-800'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function LangToggle({ lang, path, label, dark }: { lang: Lang; path: string; label: string; dark: boolean }) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`flex items-center rounded-full ${dark ? 'bg-white/8' : 'bg-ink-100'}`}
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
            className={`inline-flex h-11 min-w-10 items-center justify-center rounded-full px-2 text-sm sm:min-w-11 sm:px-3 font-semibold whitespace-nowrap transition-colors ${
              active
                ? 'bg-white text-ink-950 shadow-[0_1px_2px_rgb(12_15_19/0.08)]'
                : dark
                  ? 'text-ink-300 hover:text-paper'
                  : 'text-ink-600 hover:text-ink-900'
            }`}
          >
            {option.label}
          </a>
        )
      })}
    </div>
  )
}
