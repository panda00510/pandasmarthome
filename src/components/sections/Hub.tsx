import { ArrowRight } from 'lucide-react'
import { pagesIn, type Hub } from '../../content/guides'
import { pageHref, useI18n } from '../../i18n/context'
import { SectionHeading } from '../ui'

/** /solutions/ and /homes/ — a list of the topic pages beneath each. */
export function HubPage({ hub }: { hub: Hub }) {
  const { t, lang } = useI18n()
  const copy = t.hubs[hub]
  const items = pagesIn(lang).filter((page) => page.path.startsWith(`${hub}/`))

  return (
    <section className="band">
      <div className="shell">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
        <ul className="reveal-group mt-12 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {items.map((page) => (
            <li key={page.path} data-reveal>
              <a href={pageHref(lang, page.path)} className="card group flex h-full flex-col p-6 lg:p-7">
                <h2 className="text-lg leading-snug font-semibold text-ink-950 transition-colors group-hover:text-bamboo-700">
                  {page.title}
                </h2>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-600">{page.description}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-bamboo-700">
                  {t.guides.learnMore}
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
