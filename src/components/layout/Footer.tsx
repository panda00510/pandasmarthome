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

const LINK = 'inline-flex min-h-11 items-center text-sm text-ink-300 transition-colors hover:text-paper'
const LINK_ICON = 'inline-flex min-h-11 items-center gap-2 transition-colors hover:text-paper'
const HEAD = 'text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase'

export function Footer() {
  const { t, lang, path } = useI18n()
  const home = path ? pageHref(lang) : ''
  const year = new Date().getFullYear()
  const companyName = lang === 'zh' ? site.companyNameZh : site.companyName
  const page = (to: string) => pageHref(lang, to)
  const navLabel = (id: string) => t.nav.items.find((item) => item.id === id)!.label
  const columns = [
    {
      title: t.footer.groups.home,
      links: [
        { href: page('solutions/'), label: navLabel('solutions') },
        { href: page('homes/'), label: navLabel('homes') },
        { href: page('how-it-works/'), label: navLabel('process') },
        { href: showroomHref(lang), label: t.nav.showroom },
        { href: `${home}#plan`, label: t.planner.navLabel },
      ],
    },
    {
      title: t.products.nav.group,
      links: [
        { href: page('signage/'), label: t.signage.navLabel },
        { href: page('products/'), label: t.products.nav.devices },
        { href: `${page('products/')}#smart-home-devices`, label: t.products.nav.install },
      ],
    },
    {
      title: t.custom.nav,
      links: [
        { href: page('custom-hardware/'), label: t.hardware.navLabel },
        { href: page('software/'), label: navLabel('software') },
      ],
    },
    {
      title: t.footer.groups.resources,
      links: [
        { href: page('guides/'), label: t.guides.eyebrow },
        { href: page('faq/'), label: t.faq.eyebrow },
        { href: page('glossary/'), label: t.glossary.navLabel },
        { href: page('compare/'), label: t.compare.navLabel },
        { href: page('about/'), label: t.footer.about },
        { href: page('contact/'), label: t.contactPage.navLabel },
      ],
    },
  ]

  // max-sm:pb: room under the footer for the phone quick-action bar (App.tsx).
  return (
    <footer className="bg-ink-950 text-ink-300 max-sm:pb-[calc(4rem+env(safe-area-inset-bottom))] print:pb-0">
      <div className="shell pt-12 pb-8 lg:pt-16 lg:pb-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] lg:gap-16">
          {/* Brand */}
          <div>
            <a
              href={`${home}#top`}
              className="inline-flex min-h-11 items-center rounded-lg text-paper transition-opacity hover:opacity-70"
              aria-label={t.a11y.homeLink}
            >
              <Wordmark />
            </a>
            <p className="mt-5 hidden max-w-sm text-[0.9375rem] leading-relaxed text-ink-400 sm:block">{t.footer.blurb}</p>

            {socialLinks.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-x-4">
                {socialLinks.map(([key, url]) => (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-1 text-sm text-ink-300 transition-colors hover:text-paper"
                    >
                      {SOCIAL_LABELS[key] ?? key}
                      <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {/* Contact: every row is conditional; nothing is invented. */}
            <div className="mt-8">
              <h2 className={HEAD}>
                {t.footer.contactTitle}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-x-4 text-sm text-ink-300 lg:block">
                {site.email ? (
                  <li>
                    <a href={`mailto:${site.email}`} className={LINK_ICON}>
                      <Mail size={14} aria-hidden="true" />
                      {site.email}
                    </a>
                  </li>
                ) : null}
                {site.telephone ? (
                  <li>
                    <a href={`tel:${site.telephone.replace(/\s+/g, '')}`} className={LINK_ICON}>
                      <Phone size={14} aria-hidden="true" />
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
                      <MessageCircle size={14} aria-hidden="true" />
                      WhatsApp
                    </a>
                  </li>
                ) : null}
                {formattedAddress ? <li className="py-1">{formattedAddress}</li> : null}
                {!hasAnyContactDetail ? (
                  <li className="py-1 text-ink-400 italic">{t.contact.pendingDetails}</li>
                ) : null}
                <li className="py-1 text-ink-400">
                  {t.contact.labels.serviceArea}: {lang === 'zh' ? site.serviceAreaZh : site.serviceArea}
                </li>
              </ul>
            </div>
          </div>

          {/* Navigation: the same groups as the header (smart home, products, custom), then resources. */}
          <nav aria-label={t.a11y.navFooter} className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:col-span-1">
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className={HEAD}>{column.title}</h2>
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

        {/* Credits and legal share one row; the disclaimers fold away but stay readable. */}
        <div className="mt-12 flex flex-wrap items-center gap-x-6 border-t border-white/10 pt-3 text-sm text-ink-400 lg:mt-12">
          <a href={pageHref(lang, 'privacy/')} className={LINK_ICON + ' min-h-11'}>
            {t.footer.privacy}
          </a>
          {/* Served from public/ by the prebuild copy of ASSET_SOURCES.md.
              BASE_URL keeps it correct when the site lives at a sub-path. */}
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
            <p className="max-w-4xl text-xs leading-relaxed text-ink-400">{t.footer.disclaimer}</p>
            <p className="mt-2 max-w-4xl text-xs leading-relaxed text-ink-400">{t.footer.imageNote}</p>
          </details>
          {site.registrationNumber ? <span>{site.registrationNumber}</span> : null}
        </div>

        <p className="mt-2 text-xs text-ink-400">
          © {year} {companyName}. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
