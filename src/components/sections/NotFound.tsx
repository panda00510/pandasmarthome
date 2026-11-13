import { ArrowRight } from 'lucide-react'
import { Button } from '../ui'
import { pageHref, useI18n } from '../../i18n/context'
import { showroomHref } from '../../lib/showroom'

/**
 * Shown for any address that is not a page. The prerender writes it to
 * dist/404.html and dist/zh/404.html, which the Worker (and GitHub Pages)
 * serve with an HTTP 404 status.
 */
export function NotFound() {
  const { t, lang } = useI18n()
  const label = (id: string) => t.nav.items.find((item) => item.id === id)!.label
  const links = [
    { label: label('solutions'), href: pageHref(lang, 'solutions/') },
    { label: label('products'), href: pageHref(lang, 'products/') },
    { label: t.nav.showroom, href: showroomHref(lang) },
    { label: t.notFound.contact, href: `${pageHref(lang)}#contact` },
  ]

  return (
    <section className="band">
      <div className="shell max-w-3xl">
        <p className="eyebrow">{t.notFound.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-ink-950 sm:text-5xl">{t.notFound.title}</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-600">{t.notFound.lead}</p>
        <Button as="a" href={pageHref(lang)} size="lg" className="mt-8">
          {t.notFound.home}
          <ArrowRight size={17} aria-hidden="true" />
        </Button>

        <h2 className="mt-14 text-sm font-semibold tracking-[0.14em] text-bamboo-700 uppercase">{t.notFound.linksTitle}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="card flex min-h-14 items-center justify-between gap-3 px-5 py-4 text-base font-medium text-ink-900"
              >
                {link.label}
                <ArrowRight size={17} aria-hidden="true" className="text-bamboo-700" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
