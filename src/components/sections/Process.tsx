import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '../ui'
import { pageHref, useI18n } from '../../i18n/context'

/** Five steps as a timeline: across on desktop, down on a phone. */
export function Process() {
  const { t, lang } = useI18n()

  return (
    <section id="process" className="band">
      <div className="shell">
        <SectionHeading eyebrow={t.process.eyebrow} title={t.process.title} lead={t.process.lead} shortOnPhone />

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

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-600">{t.process.note}</p>
        <a
          href={pageHref(lang, 'how-it-works/')}
          className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-bamboo-700 hover:text-bamboo-600"
        >
          {t.guides.learnMore}
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
