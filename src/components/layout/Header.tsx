import { useEffect, useRef, useState } from 'react'
import { Menu, X, Box, ChevronDown } from 'lucide-react'
import { Wordmark } from '../brand/Wordmark'
import { Button } from '../ui'
import { pagePaths } from '../../content/guides'
import { pageHref, useI18n, type Lang } from '../../i18n/context'
import { showroomHref } from '../../lib/showroom'

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
  const home = path ? pageHref(lang) : ''
  const contactHref = path === '' || path === 'contact/' ? '#contact' : pageHref(lang, 'contact/')
  const [open, setOpen] = useState(false)
  const showroom = showroomHref(lang)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const menuButton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    const rest = [...document.querySelectorAll<HTMLElement>('#root > :not(header)')]
    for (const el of rest) el.inert = true
    document.querySelector<HTMLElement>('#mobile-nav a')?.focus()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      for (const el of rest) el.inert = false
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const inSection = (page: string) => path === page || path.startsWith(page)
  const byId = (id: string): NavLink => {
    const item = t.nav.items.find((entry) => entry.id === id)!
    const page = PAGE_ITEMS[id]
    return { key: id, label: item.label, href: pageHref(lang, page), current: inSection(page) }
  }
  // Homepage and Products now open on sunlit travertine; only remaining dark-hero subpages keep the dark top bar.
  const dark = (path === 'custom-hardware/' || path === 'signage/') && !scrolled && !open

  const links: NavLink[] = [
    byId('solutions'),
    byId('homes'),
    { key: 'showroom', label: t.nav.showroom, href: showroom, current: false, icon: true },
    { key: 'guides', label: t.guides.eyebrow, href: pageHref(lang, 'guides/'), current: inSection('guides/') },
    byId('process'),
  ]
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
    `relative inline-flex min-h-11 items-center gap-1.5 px-2.5 text-[0.875rem] font-medium whitespace-nowrap transition-colors ${
      dark
        ? link.current
          ? 'text-ember-300 after:absolute after:inset-x-2.5 after:bottom-1 after:h-[1.5px] after:bg-ember-300'
          : 'text-paper/80 hover:text-paper'
        : link.current
          ? 'text-brand after:absolute after:inset-x-2.5 after:bottom-1 after:h-[1.5px] after:bg-brand'
          : 'text-ink-700 hover:text-ink-950'
    }`
  const desktopLink = (link: NavLink) => (
    <a key={link.key} href={link.href} aria-current={link.current ? 'page' : undefined} className={linkClass(link)}>
      {link.icon ? <Box size={14} aria-hidden="true" className={dark ? 'text-ember-300' : 'text-ember-500'} /> : null}
      {link.label}
    </a>
  )

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        dark
          ? 'border-paper/12 bg-ink-950/92 text-paper backdrop-blur-md'
          : scrolled || open
            ? 'border-ink-950/14 bg-paper/94 text-ink-950 shadow-[0_8px_24px_-20px_rgb(20_34_28/0.25)] backdrop-blur-md'
            : 'border-ink-950/12 bg-paper text-ink-950'
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-3 min-[1280px]:h-[4.75rem]">
        <a
          href={`${home}#top`}
          className={`inline-flex min-h-11 min-w-0 items-center transition-opacity hover:opacity-75 min-[1280px]:shrink-0 ${
            dark ? 'text-paper' : 'text-ink-950'
          }`}
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
          <LangToggle lang={lang} path={pagePaths.includes(path) ? path : ''} label={t.a11y.languageSwitcher} dark={dark} />

          <Button
            as="a"
            href={contactHref}
            data-track="nav_cta_click"
            size="sm"
            variant={dark ? 'glow' : 'primary'}
            className="hidden sm:inline-flex"
          >
            {t.nav.cta}
          </Button>

          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
            className={`-mr-1 inline-flex h-11 w-11 items-center justify-center rounded-[3px] border transition-colors min-[1280px]:hidden ${
              dark
                ? 'border-paper/18 text-paper hover:bg-paper/10'
                : 'border-ink-950/15 bg-surface text-ink-950 hover:border-ink-950/35'
            }`}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-ink-950/12 bg-paper min-[1280px]:hidden"
      >
        <nav aria-label={t.a11y.navMobile} className="shell flex flex-col py-4">
          <div className="divide-y divide-ink-950/10 border-y border-ink-950/10">
            {links.map((link) => (
              <a
                key={link.key}
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-between gap-2 px-1 text-[0.9375rem] font-medium text-ink-900 transition-colors hover:text-brand aria-[current=page]:text-brand"
              >
                <span className="inline-flex items-center gap-2">
                  {link.icon ? <Box size={16} aria-hidden="true" className="text-ember-500" /> : null}
                  {link.label}
                </span>
                {link.current ? <span aria-hidden="true" className="h-1.5 w-1.5 bg-brand" /> : null}
              </a>
            ))}
          </div>
          {groups.map((group) => (
            <div key={group.id} className="mt-5">
              <p className="font-mono text-[0.6875rem] font-semibold tracking-[0.16em] text-ember-500 uppercase">
                {group.label}
              </p>
              <div className="mt-2 divide-y divide-ink-950/10 border-y border-ink-950/10">
                {group.items.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    aria-current={link.current ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center justify-between px-1 text-[0.9375rem] font-medium text-ink-900 transition-colors hover:text-brand aria-[current=page]:text-brand"
                  >
                    <span>{link.label}</span>
                    {link.current ? <span aria-hidden="true" className="h-1.5 w-1.5 bg-brand" /> : null}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <Button
            as="a"
            href={contactHref}
            data-track="nav_cta_click"
            size="lg"
            className="mt-5 w-full"
            onClick={() => setOpen(false)}
          >
            {t.nav.cta}
          </Button>
        </nav>
      </div>
    </header>
  )
}

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
        className={`relative inline-flex min-h-11 cursor-pointer items-center gap-1 px-2.5 text-[0.875rem] font-medium whitespace-nowrap transition-colors ${
          dark
            ? current
              ? 'text-ember-300 after:absolute after:inset-x-2.5 after:bottom-1 after:h-[1.5px] after:bg-ember-300'
              : show
                ? 'text-paper'
                : 'text-paper/80 hover:text-paper'
            : current
              ? 'text-brand after:absolute after:inset-x-2.5 after:bottom-1 after:h-[1.5px] after:bg-brand'
              : show
                ? 'text-ink-950'
                : 'text-ink-700 hover:text-ink-950'
        }`}
      >
        {label}
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`transition-transform duration-200 motion-reduce:transition-none ${show ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={id}
        hidden={!show}
        className="absolute top-full left-1/2 mt-2 w-64 -translate-x-1/2 rounded-[4px] border border-ink-950/16 bg-surface p-1.5 text-ink-950 shadow-lift"
      >
        <ul className="divide-y divide-ink-950/[0.07]">
          {items.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                onClick={() => setShow(false)}
                className={`flex min-h-11 items-center justify-between px-3 text-sm font-medium transition-colors hover:bg-paper hover:text-brand ${
                  item.current ? 'bg-paper text-brand' : 'text-ink-800'
                }`}
              >
                <span>{item.label}</span>
                {item.current ? <span aria-hidden="true" className="h-1.5 w-1.5 bg-brand" /> : null}
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
      className={`flex items-center overflow-hidden rounded-[3px] border ${
        dark ? 'border-paper/20 bg-paper/[0.06]' : 'border-ink-950/18 bg-surface'
      }`}
    >
      {LANGS.map((option, idx) => {
        const active = option.code === lang
        return (
          <a
            key={option.code}
            href={pageHref(option.code, path)}
            aria-current={active ? 'page' : undefined}
            data-track="lang_switch"
            data-track-to={option.code}
            lang={option.code === 'zh' ? 'zh-Hans' : 'en'}
            hrefLang={option.code === 'zh' ? 'zh-Hans' : 'en'}
            className={`inline-flex h-10 min-w-10 items-center justify-center px-2.5 text-xs font-semibold tracking-[0.04em] whitespace-nowrap transition-colors sm:px-3 ${
              idx > 0 ? (dark ? 'border-l border-paper/15' : 'border-l border-ink-950/12') : ''
            } ${
              active
                ? dark
                  ? 'bg-paper text-ink-950'
                  : 'bg-ink-950 text-paper'
                : dark
                  ? 'text-paper/75 hover:text-paper'
                  : 'text-ink-600 hover:bg-paper hover:text-ink-950'
            }`}
          >
            {option.label}
          </a>
        )
      })}
    </div>
  )
}
