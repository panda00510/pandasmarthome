import { ArrowRight, ChevronDown } from 'lucide-react'
import { SectionHeading } from '../ui'
import { guidesIn } from '../../content/guides'
import { pageHref, useI18n } from '../../i18n/context'

const VISIBLE = 4

/**
 * Native <details>/<summary> editorial FAQ on warm travertine, paired with
 * a numbered architectural reading list for the newest guides.
 */
export function Faq() {
  const { t, lang } = useI18n()
  const first = t.faq.items.slice(0, VISIBLE)
  const rest = t.faq.items.slice(VISIBLE)

  const row = (item: { q: string; a: string }) => (
    <details key={item.q} className="group transition-colors open:bg-paper/65">
      <summary className="flex min-h-15 cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 text-left [&::-webkit-details-marker]:hidden">
        <h3 className="font-display text-[1.0625rem] leading-snug font-medium text-ink-950 transition-colors group-hover:text-brand">
          {item.q}
        </h3>
        <span className="grid size-8 shrink-0 place-items-center rounded-[2px] border border-ink-950/15 bg-paper text-ink-700 transition-colors group-hover:border-ink-950/35 group-open:border-ink-950 group-open:bg-ink-950 group-open:text-paper">
          <ChevronDown
            size={15}
            aria-hidden="true"
            className="transition-transform duration-300 group-open:rotate-180"
          />
        </span>
      </summary>
      <p className="px-5 pr-10 pb-5 text-[0.9375rem] leading-relaxed text-ink-600 sm:pr-14">{item.a}</p>
    </details>
  )

  return (
    <section id="faq" className="band border-t border-ink-950/12 bg-paper">
      <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} lead={t.faq.lead} shortOnPhone />
          <a
            href={pageHref(lang, 'faq/')}
            className="link-more mt-4 hidden hover:text-ink-950 lg:inline-flex"
          >
            {t.faq.all}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>

        <div>
          <div className="card divide-y divide-ink-950/12 overflow-hidden">{first.map(row)}</div>
          {rest.length ? (
            <details className="group mt-3">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-1 text-sm font-semibold text-brand transition-colors hover:text-ink-950 [&::-webkit-details-marker]:hidden">
                {t.faq.more}
                <ChevronDown
                  size={15}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <div className="card mt-2 divide-y divide-ink-950/12 overflow-hidden">{rest.map(row)}</div>
            </details>
          ) : null}
          <a
            href={pageHref(lang, 'faq/')}
            className="link-more mt-2 hover:text-ink-950 lg:hidden"
          >
            {t.faq.all}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
          <LatestGuides />
        </div>
      </div>
    </section>
  )
}

/** Homepage: the three newest guides as a numbered architectural bibliography. */
function LatestGuides() {
  const { t, lang } = useI18n()
  const latest = guidesIn(lang).slice(0, 3)
  if (!latest.length) return null

  return (
    <div id="guides" className="mt-10 scroll-mt-24 rounded-card border border-ink-950/15 bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-mono text-[0.71875rem] font-semibold tracking-[0.16em] text-ember-500 uppercase">
          {t.guides.eyebrow}
        </h3>
        <a
          href={pageHref(lang, 'guides/')}
          className="link-more min-h-0 text-xs hover:text-ink-950"
        >
          {t.guides.all}
          <ArrowRight size={14} aria-hidden="true" />
        </a>
      </div>
      <ul className="mt-4 divide-y divide-ink-950/10 border-t border-ink-950/12">
        {latest.map((guide, i) => (
          <li key={guide.slug}>
            <a
              href={pageHref(lang, guide.path)}
              className="group flex min-h-12 items-start justify-between gap-4 py-3.5 text-[0.9375rem] leading-snug font-medium text-ink-900 transition-colors hover:text-brand"
            >
              <span className="flex items-baseline gap-3">
                <span className="numeral text-xs font-semibold text-ember-500">{String(i + 1).padStart(2, '0')}</span>
                <span>{guide.heading}</span>
              </span>
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="mt-1 shrink-0 text-ink-400 transition-transform motion-safe:group-hover:translate-x-1 group-hover:text-brand motion-reduce:transition-none"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
