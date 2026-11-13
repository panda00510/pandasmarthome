import { ArrowRight } from 'lucide-react'
import { pageHref, useI18n } from '../../i18n/context'

/** A slim note near the foot of the page: these products are not on sale yet. */
export function Upcoming() {
  const { t, lang } = useI18n()

  return (
    <section id="upcoming" className="border-t border-ink-200/70">
      <div className="shell flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-ink-600">
          <span className="mr-2 rounded-full border border-ink-200 px-2.5 py-1 text-xs font-medium text-ink-600">
            {t.upcoming.eyebrow}
          </span>
          {t.upcoming.strip}
        </p>
        <a
          href={pageHref(lang, 'solutions/upcoming-products/')}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold text-bamboo-700 hover:text-bamboo-600"
        >
          {t.guides.learnMore}
          <span className="sr-only">: {t.upcoming.title}</span>
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
