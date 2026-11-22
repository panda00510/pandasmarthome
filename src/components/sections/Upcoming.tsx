import { ArrowRight } from 'lucide-react'
import { pageHref, useI18n } from '../../i18n/context'

/** A slim editorial note near the foot of the page: these products are not on sale yet. */
export function Upcoming() {
  const { t, lang } = useI18n()

  return (
    <section id="upcoming" className="border-y border-ink-950/12 bg-paper-alt">
      <div className="shell flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex flex-wrap items-center gap-2.5 text-sm leading-relaxed text-ink-800">
          <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-ember-500/35 bg-surface px-2.5 py-0.5 font-mono text-[0.6875rem] font-semibold tracking-[0.1em] text-ember-600 uppercase">
            <span aria-hidden="true" className="size-1.5 bg-ember-500" />
            {t.upcoming.eyebrow}
          </span>
          <span>{t.upcoming.strip}</span>
        </p>
        <a
          href={pageHref(lang, 'solutions/upcoming-products/')}
          className="link-more shrink-0 hover:text-ink-950"
        >
          {t.guides.learnMore}
          <span className="sr-only">: {t.upcoming.title}</span>
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
