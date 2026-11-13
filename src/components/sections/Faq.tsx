import { ArrowRight, ChevronDown } from 'lucide-react'
import { SectionHeading } from '../ui'
import { guidesIn } from '../../content/guides'
import { pageHref, useI18n } from '../../i18n/context'

const VISIBLE = 4

/**
 * Built on native <details>/<summary>: keyboard access, screen-reader
 * semantics and find-in-page all work without a line of JavaScript. The first
 * questions are listed; the rest sit in one more fold so the page stays short.
 */
export function Faq() {
  const { t } = useI18n()
  const first = t.faq.items.slice(0, VISIBLE)
  const rest = t.faq.items.slice(VISIBLE)

  const row = (item: { q: string; a: string }) => (
    <details key={item.q} className="group">
      <summary className="flex min-h-14 cursor-pointer list-none items-start justify-between gap-6 py-4 text-left [&::-webkit-details-marker]:hidden">
        <h3 className="text-[1.0625rem] leading-snug font-medium text-ink-900 transition-colors group-hover:text-bamboo-700">
          {item.q}
        </h3>
        <ChevronDown
          size={19}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-ink-400 transition-transform duration-300 group-open:rotate-180"
        />
      </summary>
      <p className="pr-10 pb-5 text-[0.9375rem] leading-relaxed text-ink-600">{item.a}</p>
    </details>
  )

  return (
    <section id="faq" className="band">
      <div className="shell grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} lead={t.faq.lead} shortOnPhone />
        </div>

        <div>
          <div className="divide-y divide-ink-200 border-y border-ink-200">{first.map(row)}</div>
          {rest.length ? (
            <details className="group mt-3">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-semibold text-bamboo-700 [&::-webkit-details-marker]:hidden">
                {t.faq.more}
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <div className="divide-y divide-ink-200 border-y border-ink-200">{rest.map(row)}</div>
            </details>
          ) : null}
          <LatestGuides />
        </div>
      </div>
    </section>
  )
}

/** Homepage: the three newest guides as a compact list, under the FAQ heading. */
function LatestGuides() {
  const { t, lang } = useI18n()
  const latest = guidesIn(lang).slice(0, 3)
  if (!latest.length) return null

  return (
    <div id="guides" className="mt-10 scroll-mt-24">
      <h3 className="text-xs font-semibold tracking-[0.14em] text-bamboo-700 uppercase">{t.guides.eyebrow}</h3>
      <ul className="mt-3 divide-y divide-ink-200 border-y border-ink-200">
        {latest.map((guide) => (
          <li key={guide.slug}>
            <a
              href={pageHref(lang, guide.path)}
              className="group flex min-h-12 items-start justify-between gap-4 py-3 text-[0.9375rem] leading-snug font-medium text-ink-800 transition-colors hover:text-bamboo-700"
            >
              {guide.heading}
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-ink-400 transition-transform motion-safe:group-hover:translate-x-0.5 group-hover:text-bamboo-700 motion-reduce:transition-none"
              />
            </a>
          </li>
        ))}
      </ul>
      <a
        href={pageHref(lang, 'guides/')}
        className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-bamboo-700 hover:text-bamboo-600"
      >
        {t.guides.all}
        <ArrowRight size={15} aria-hidden="true" />
      </a>
    </div>
  )
}
