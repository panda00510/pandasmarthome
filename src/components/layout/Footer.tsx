import { ExternalLink, Mail, MessageCircle, Phone } from 'lucide-react'
import { Wordmark } from '../brand/Wordmark'
import { formattedAddress, hasAnyContactDetail, site, socialLinks } from '../../config/site'
import { pageHref, useI18n } from '../../i18n/context'
import { pageWhatsappMessage, whatsappHref } from '../../lib/whatsapp'
import { showroomHref } from '../../lib/showroom'

const SOCIAL_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  telegram: 'Telegram',
  xiaohongshu: '小红书',
}

const LINK = 'inline-flex min-h-11 items-center text-sm text-paper/78 transition-colors hover:text-ember-300'
const LINK_ICON = 'inline-flex min-h-11 items-center gap-2 transition-colors hover:text-ember-300'
const HEAD = 'font-mono text-[0.6875rem] font-semibold tracking-[0.16em] text-ember-300 uppercase'

export function Footer() {
  const { t, lang, path } = useI18n()
  const home = path ? pageHref(lang) : ''
  const year = new Date().getFullYear()
  const companyName = lang === 'zh' ? site.companyNameZh : site.companyName
  const page = (to: string) => pageHref(lang, to)
  const navLabel = (id: string) => t.nav.items.find((item) => item.id === id)!.label

  const columns = [
    {
      title: t.nav.groups.hardware,
      links: [
        { href: page('products/'), label: t.products.nav.devices },
        { href: page('custom-hardware/'), label: t.hardware.navLabel },
        { href: page('compare/'), label: t.compare.navLabel },
        { href: page('solutions/upcoming-products/'), label: t.upcoming.eyebrow },
      ],
    },
    {
      title: t.nav.groups.smartHome,
      links: [
        { href: page('smart-home/'), label: t.smartHomePage.navLabel },
        { href: page('solutions/'), label: navLabel('solutions') },
        { href: page('homes/'), label: navLabel('homes') },
        { href: page('how-it-works/'), label: navLabel('process') },
        { href: showroomHref(lang), label: t.nav.showroom },
        { href: `${page('smart-home/')}#plan`, label: t.planner.navLabel },
      ],
    },
    {
      title: t.nav.groups.business,
      links: [
        { href: page('signage/'), label: t.signage.navLabel },
        { href: page('software/'), label: navLabel('software') },
      ],
    },
    {
      title: t.nav.groups.resources,
      links: [
        { href: page('guides/'), label: t.guides.eyebrow },
        { href: page('faq/'), label: t.faq.eyebrow },
        { href: page('glossary/'), label: t.glossary.navLabel },
        { href: page('about/'), label: t.footer.about },
        { href: page('contact/'), label: t.contactPage.navLabel },
      ],
    },
  ]

  // max-sm:pb: room under the footer for the phone quick-action bar (App.tsx).
  return (
    <footer className="relative bg-ink-950 text-paper/80 max-sm:pb-[calc(4rem+env(safe-area-inset-bottom))] print:pb-0">
      <div aria-hidden="true" className="hairline-dark" />
      <div className="shell pt-14 pb-10 lg:pt-20 lg:pb-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,2.2fr)] lg:gap-16">
          {/* Architectural colophon & contact ledger */}
          <div className="lg:border-r lg:border-paper/12 lg:pr-12">
            <a
              href={`${home}#top`}
              className="inline-flex min-h-11 items-center text-paper transition-opacity hover:opacity-75"
              aria-label={t.a11y.homeLink}
            >
              <Wordmark />
            </a>
            <p className="mt-5 hidden max-w-sm text-[0.9375rem] leading-relaxed text-ink-300 sm:block">
              {t.footer.blurb}
            </p>

            {socialLinks.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-x-4">
                {socialLinks.map(([key, url]) => (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-1 text-sm text-paper/80 transition-colors hover:text-ember-300"
                    >
                      {SOCIAL_LABELS[key] ?? key}
                      <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-8 border-t border-paper/12 pt-6">
              <h2 className={HEAD}>{t.footer.contactTitle}</h2>
              <ul className="mt-3 flex flex-wrap gap-x-4 text-sm text-paper/85 lg:block">
                {site.email ? (
                  <li>
                    <a href={`mailto:${site.email}`} className={LINK_ICON}>
                      <Mail size={14} aria-hidden="true" className="text-ember-300" />
                      {site.email}
                    </a>
                  </li>
                ) : null}
                {site.telephone ? (
                  <li>
                    <a href={`tel:${site.telephone.replace(/\s+/g, '')}`} className={LINK_ICON}>
                      <Phone size={14} aria-hidden="true" className="text-ember-300" />
                      {site.telephone}
                    </a>
                  </li>
                ) : null}
                {site.whatsappLink ? (
                  <li>
                    <a
                      href={whatsappHref(pageWhatsappMessage(t, lang, path))!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK_ICON}
                    >
                      <MessageCircle size={14} aria-hidden="true" className="text-ember-300" />
                      WhatsApp
                    </a>
                  </li>
                ) : null}
                {formattedAddress ? <li className="py-1.5 text-ink-300">{formattedAddress}</li> : null}
                {!hasAnyContactDetail ? (
                  <li className="py-1.5 text-ink-400 italic">{t.contact.pendingDetails}</li>
                ) : null}
                <li className="py-1.5 text-ink-300">
                  {t.contact.labels.serviceArea}: {lang === 'zh' ? site.serviceAreaZh : site.serviceArea}
                </li>
              </ul>
            </div>
          </div>

          {/* Business and resource links */}
          <nav aria-label={t.a11y.navFooter} className="grid grid-cols-2 gap-x-6 gap-y-10 xl:grid-cols-4">
            {columns.map((column, i) => (
              <div
                key={column.title}
                className="border-t border-paper/14 pt-4"
              >
                <span aria-hidden="true" className="numeral block text-[0.6875rem] text-ink-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className={`${HEAD} mt-1`}>{column.title}</h2>
                <ul className="mt-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className={LINK}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Credits and legal colophon row */}
        <div className="mt-12 flex flex-wrap items-center gap-x-6 border-t border-paper/12 pt-4 text-sm text-ink-400">
          <a href={pageHref(lang, 'privacy/')} className={LINK_ICON + ' min-h-11'}>
            {t.footer.privacy}
          </a>
          <a
            href={import.meta.env.BASE_URL + t.footer.creditsHref}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_ICON + ' min-h-11'}
          >
            {t.footer.credits}
            <ExternalLink size={12} aria-hidden="true" />
          </a>
          <details className="group open:basis-full">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center text-sm text-ink-400 transition-colors hover:text-paper [&::-webkit-details-marker]:hidden">
              {t.footer.legalTitle}
            </summary>
            <p className="max-w-4xl pt-2 text-xs leading-relaxed text-ink-300">{t.footer.disclaimer}</p>
            <p className="mt-2 max-w-4xl text-xs leading-relaxed text-ink-300">{t.footer.imageNote}</p>
          </details>
          {site.registrationNumber ? <span className="font-mono text-xs">{site.registrationNumber}</span> : null}
        </div>

        <p className="mt-3 font-mono text-xs tracking-[0.04em] text-ink-400">
          © {year} {companyName}. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
