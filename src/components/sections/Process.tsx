import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '../ui'
import { DeliverStrip } from './Deliver'
import { pageHref, useI18n } from '../../i18n/context'

/** Five steps as a timeline (across on desktop, down on a phone), then what you receive. */
export function Process() {
  const { t, lang } = useI18n()

  return (
    <section id="process" className="band border-t border-ink-200/70 bg-paper-alt">
      <div className="shell">
        <SectionHeading eyebrow={t.process.eyebrow} title={t.process.title} lead={t.process.lead} shortOnPhone split />

        <ol className="reveal-group mt-8 grid gap-x-5 gap-y-5 lg:mt-12 lg:grid-cols-5">
          {t.process.steps.map((step, i) => (
            <li key={step.title} data-reveal className="relative flex gap-4 lg:block">
              <div className="flex flex-col items-center lg:flex-row">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-[0.8125rem] font-semibold text-white tabular-nums">
                  {i + 1}
                </span>
                {i < t.process.steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="mt-2 w-px flex-1 bg-ink-200 lg:mt-0 lg:ml-3 lg:h-px lg:w-auto"
                  />
                ) : null}
              </div>
              <div className="pb-1 lg:mt-4">
                <h3 className="text-[1.0625rem] leading-snug font-semibold text-ink-950">
                  {step.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-[0.9375rem] leading-relaxed text-ink-600 sm:line-clamp-none lg:text-sm">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <p className="max-w-3xl text-sm leading-relaxed text-ink-600">{t.process.note}</p>
        <a
          href={pageHref(lang, 'how-it-works/')}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold text-bamboo-700 hover:text-bamboo-600"
        >
          {t.guides.learnMore}
          <span className="sr-only">: {t.process.title}</span>
          <ArrowRight size={15} aria-hidden="true" />
        </a>
        </div>

        <DeliverStrip />
      </div>
    </section>
  )
}
