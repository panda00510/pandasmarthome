import { ExternalLink, Mail, MessageCircle, Phone } from 'lucide-react'
import { Wordmark } from '../brand/Wordmark'
import { formattedAddress, hasAnyContactDetail, site, socialLinks } from '../../config/site'
import { useI18n } from '../../i18n/context'

const SOCIAL_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  telegram: 'Telegram',
  xiaohongshu: '小红书',
}

const LINK = 'inline-block py-1 text-sm text-ink-700 transition-colors hover:text-bamboo-700'
const LINK_ICON = 'inline-flex items-center gap-2 py-1 transition-colors hover:text-bamboo-700'

export function Footer() {
  const { t, lang } = useI18n()
  const year = new Date().getFullYear()
  const companyName = lang === 'zh' ? site.companyNameZh : site.companyName

  return (
    <footer className="border-t border-ink-200 bg-paper">
      <div className="shell py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          {/* Brand */}
          <div>
            <a
              href="#top"
              className="inline-block rounded-lg text-ink-950 transition-opacity hover:opacity-70"
              aria-label={t.a11y.homeLink}
            >
              <Wordmark />
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-600">{t.footer.blurb}</p>

            {socialLinks.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-x-4">
                {socialLinks.map(([key, url]) => (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 py-1 text-sm text-ink-600 transition-colors hover:text-bamboo-700"
                    >
                      {SOCIAL_LABELS[key] ?? key}
                      <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Navigation */}
          <nav aria-label="Footer">
            <h2 className="text-xs font-semibold tracking-wider text-ink-500 uppercase">
              {t.footer.navTitle}
            </h2>
            <ul className="mt-3 space-y-1">
              {t.nav.items.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={LINK}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" className={LINK}>
                  {t.footer.contactTitle}
                </a>
              </li>
            </ul>
          </nav>

          {/* Contact — every row is conditional; nothing is invented. */}
          <div>
            <h2 className="text-xs font-semibold tracking-wider text-ink-500 uppercase">
              {t.footer.contactTitle}
            </h2>
            <ul className="mt-3 space-y-1 text-sm text-ink-700">
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
                {t.contact.labels.serviceArea}: {site.serviceArea}
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h2 className="text-xs font-semibold tracking-wider text-ink-500 uppercase">
              {t.footer.legalTitle}
            </h2>
            <ul className="mt-3 space-y-1 text-sm text-ink-700">
              <li>
                {/* Served from public/ by the prebuild copy of ASSET_SOURCES.md. */}
                <a
                  href={t.footer.creditsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK_ICON}
                >
                  {t.footer.credits}
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              </li>
              <li className="py-1 text-ink-500">{t.footer.builtWith}</li>
              {site.registrationNumber ? (
                <li className="py-1 text-ink-500">{site.registrationNumber}</li>
              ) : null}
            </ul>
          </div>
        </div>

        {/* Mandatory third-party compatibility statement. */}
        <p className="mt-12 border-t border-ink-200 pt-8 text-xs leading-relaxed text-ink-500">
          {t.footer.disclaimer}
        </p>

        <p className="mt-4 text-xs text-ink-500">
          © {year} {companyName}. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
