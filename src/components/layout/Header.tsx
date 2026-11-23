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
  const contactHref = path === '' || path === 'smart-home/' || path === 'contact/' ? '#contact' : pageHref(lang, 'contact/')
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
  const dark = (path === 'custom-hardware/' || path === 'signage/') && !scrolled && !open

  const deskDevicesLink: NavLink = {
    key: 'devices',
    label: t.nav.items.find((entry) => entry.id === 'products')!.label,
    href: pageHref(lang, 'products/'),
    current: path === 'products/' || inSection('compare/'),
  }

  const customHardwareLink: NavLink = {
    key: 'hardware',
    label: t.hardware.navLabel,
    href: pageHref(lang, 'custom-hardware/'),
    current: path === 'custom-hardware/',
  }

  const smartHomeLinks: NavLink[] = [
    {
      key: 'smart-home',
      label: t.smartHomePage.overviewLabel,
      href: pageHref(lang, 'smart-home/'),
      current: path === 'smart-home/',
    },
    byId('solutions'),
    { key: 'showroom', label: t.nav.showroom, href: showroom, current: false, icon: true },
  ]
  const smartHomeActive =
    path === 'smart-home/' || inSection('solutions/') || inSection('homes/') || inSection('how-it-works/')

  const businessLinks: NavLink[] = [
    { key: 'signage', label: t.signage.navLabel, href: pageHref(lang, 'signage/'), current: path === 'signage/' },
    byId('software'),
  ]
  const businessActive = path === 'signage/' || path === 'software/'

  const guidesLink: NavLink = {
    key: 'guides',
    label: t.guides.eyebrow,
    href: pageHref(lang, 'guides/'),
    current: inSection('guides/') || inSection('faq/') || inSection('glossary/'),
  }

  const mobileGroups = [
    { id: 'hardware-menu', label: t.nav.groups.hardware, items: [deskDevicesLink, customHardwareLink] },
    { id: 'smarthome-menu', label: t.nav.groups.smartHome, items: smartHomeLinks },
    { id: 'business-menu', label: t.nav.groups.business, items: businessLinks },
    { id: 'resources-menu', label: t.nav.groups.resources, items: [guidesLink] },
  ]

  const topLinkClass = (active: boolean) =>
    `relative inline-flex min-h-11 items-center px-2.5 text-[0.875rem] font-medium whitespace-nowrap transition-colors ${
      dark
        ? active
          ? 'text-ember-300 after:absolute after:inset-x-2.5 after:bottom-1 after:h-[1.5px] after:bg-ember-300'
          : 'text-paper/80 hover:text-paper'
        : active
          ? 'text-brand after:absolute after:inset-x-2.5 after:bottom-1 after:h-[1.5px] after:bg-brand'
          : 'text-ink-700 hover:text-ink-950'
    }`

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

        <nav aria-label={t.a11y.navPrimary} className="hidden items-center gap-1 min-[1280px]:flex">
          <a
            href={deskDevicesLink.href}
            aria-current={deskDevicesLink.current ? 'page' : undefined}
            className={topLinkClass(deskDevicesLink.current)}
          >
            {deskDevicesLink.label}
          </a>
          <a
            href={customHardwareLink.href}
            aria-current={customHardwareLink.current ? 'page' : undefined}
            className={topLinkClass(customHardwareLink.current)}
          >
            {customHardwareLink.label}
          </a>
          <NavMenu
            id="smarthome-menu"
            label={t.nav.groups.smartHome}
            items={smartHomeLinks}
            active={smartHomeActive}
            dark={dark}
          />
          <NavMenu
            id="business-menu"
            label={t.nav.groups.business}
            items={businessLinks}
            active={businessActive}
            dark={dark}
          />
          <a
            href={guidesLink.href}
            aria-current={guidesLink.current ? 'page' : undefined}
            className={topLinkClass(guidesLink.current)}
          >
            {guidesLink.label}
          </a>
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
            className={`inline-flex h-11 w-11 items-center justify-center rounded-[3px] border transition-colors min-[1280px]:hidden ${
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
        className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-ink-950/12 bg-paper min-[1280px]:hidden"
      >
        <nav aria-label={t.a11y.navMobile} className="shell flex flex-col py-4">
          {mobileGroups.map((group) => (
            <div key={group.id} className="mt-5 first:mt-0">
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
                    <span className="inline-flex items-center gap-2">
                      {link.icon ? <Box size={15} aria-hidden="true" className="text-ember-500" /> : null}
                      {link.label}
                    </span>
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

function NavMenu({
  id,
  label,
  items,
  active,
  dark,
}: {
  id: string
  label: string
  items: NavLink[]
  active: boolean
  dark: boolean
}) {
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

  const current = active || items.some((item) => item.current)

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
        className="absolute top-full left-1/2 mt-2 min-w-48 -translate-x-1/2 rounded-[4px] border border-ink-950/16 bg-surface p-1 text-ink-950 shadow-lift"
      >
        <ul className="divide-y divide-ink-950/[0.06]">
          {items.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                onClick={() => setShow(false)}
                className={`flex min-h-10 items-center justify-between gap-3 px-3 text-sm font-medium whitespace-nowrap transition-colors hover:bg-paper hover:text-brand ${
                  item.current ? 'bg-paper text-brand' : 'text-ink-800'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {item.icon ? <Box size={14} aria-hidden="true" className="text-ember-500" /> : null}
                  {item.label}
                </span>
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
            className={`inline-flex h-[2.625rem] min-w-10 items-center justify-center px-2.5 text-xs font-semibold tracking-[0.04em] whitespace-nowrap transition-colors sm:px-3 ${
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
