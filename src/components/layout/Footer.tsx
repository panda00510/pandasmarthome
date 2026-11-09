import { ExternalLink, Mail, MessageCircle, Phone } from 'lucide-react'
import { Wordmark } from '../brand/Wordmark'
import { formattedAddress, hasAnyContactDetail, site, socialLinks } from '../../config/site'
import { pageHref, useI18n } from '../../i18n/context'

const SOCIAL_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  telegram: 'Telegram',
  xiaohongshu: '小红书',
}

const LINK = 'inline-flex min-h-9 items-center text-sm text-ink-700 transition-colors hover:text-bamboo-700'
const LINK_ICON = 'inline-flex min-h-9 items-center gap-2 transition-colors hover:text-bamboo-700'

/** Nav items that open their own page instead of scrolling the homepage. */
const PAGE_FOR: Record<string, string> = {
  solutions: 'solutions/',
  homes: 'homes/',
  process: 'how-it-works/',
}

export function Footer() {
  const { t, lang, path } = useI18n()
  const home = path ? pageHref(lang) : ''
  const year = new Date().getFullYear()
  const companyName = lang === 'zh' ? site.companyNameZh : site.companyName

  return (
    <footer className="border-t border-ink-200 bg-paper">
      <div className="shell py-8 lg:py-14">
        <div className="grid gap-5 lg:gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {/* Brand */}
          <div>
            <a
              href={`${home}#top`}
              className="inline-block rounded-lg text-ink-950 transition-opacity hover:opacity-70"
              aria-label={t.a11y.homeLink}
            >
              <Wordmark />
            </a>
            <p className="mt-3 hidden max-w-sm text-sm leading-relaxed text-ink-600 sm:block">{t.footer.blurb}</p>

            {socialLinks.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-x-4">
                {socialLinks.map(([key, url]) => (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center gap-1 text-sm text-ink-600 transition-colors hover:text-bamboo-700"
                    >
                      {SOCIAL_LABELS[key] ?? key}
                      <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Navigation: two columns on a phone so it stays short. */}
          <nav aria-label={t.a11y.navFooter}>
            <h2 className="text-xs font-semibold tracking-wider text-ink-500 uppercase">
              {t.footer.navTitle}
            </h2>
            <ul className="mt-2 grid grid-cols-2 gap-x-4 lg:grid-cols-1">
              {t.nav.items.map((item) => (
                <li key={item.id}>
                  <a
                    href={PAGE_FOR[item.id] ? pageHref(lang, PAGE_FOR[item.id]) : `${home}#${item.id}`}
                    className={LINK}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`${import.meta.env.BASE_URL}showroom/?lang=${lang}`} className={LINK}>
                  {t.nav.showroom}
                </a>
              </li>
              <li>
                <a href={pageHref(lang, 'guides/')} className={LINK}>
                  {t.guides.eyebrow}
                </a>
              </li>
              <li>
                <a href={`${home}#faq`} className={LINK}>
                  {t.faq.eyebrow}
                </a>
              </li>
            </ul>
          </nav>

          {/* Contact: every row is conditional; nothing is invented. */}
          <div>
            <h2 className="text-xs font-semibold tracking-wider text-ink-500 uppercase">
              {t.footer.contactTitle}
            </h2>
            <ul className="mt-2 flex flex-wrap gap-x-4 text-sm text-ink-700 lg:block">
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
                    href={site.whatsappLink}
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
                <li className="py-1 text-ink-500 italic">{t.contact.pendingDetails}</li>
              ) : null}
              <li className="py-1 text-ink-500">
                {t.contact.labels.serviceArea}: {lang === 'zh' ? site.serviceAreaZh : site.serviceArea}
              </li>
            </ul>
          </div>
        </div>

        {/* Credits and legal share one row; the disclaimers fold away but stay readable. */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 border-t border-ink-200 pt-1 text-sm text-ink-600">
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
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center text-sm text-ink-600 [&::-webkit-details-marker]:hidden">
              {t.footer.legalTitle}
            </summary>
            <p className="max-w-4xl text-xs leading-relaxed text-ink-500">{t.footer.disclaimer}</p>
            <p className="mt-2 max-w-4xl text-xs leading-relaxed text-ink-500">{t.footer.imageNote}</p>
          </details>
          {site.registrationNumber ? <span>{site.registrationNumber}</span> : null}
        </div>

        <p className="text-xs text-ink-500">
          © {year} {companyName}. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
