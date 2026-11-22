import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '../ui'
import { DeliverStrip } from './Deliver'
import { pageHref, useI18n } from '../../i18n/context'

/** Five steps as a clean architectural progression ledger, followed by written deliverables. */
export function Process() {
  const { t, lang } = useI18n()

  return (
    <section id="process" className="band border-t border-ink-950/12 bg-surface">
      <div className="shell">
        <SectionHeading eyebrow={t.process.eyebrow} title={t.process.title} lead={t.process.lead} shortOnPhone split />

        <ol className="reveal-group mt-10 grid overflow-hidden rounded-card border border-ink-950/15 bg-paper divide-y divide-ink-950/12 lg:mt-14 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
          {t.process.steps.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              className="flex gap-4 p-5 lg:flex-col lg:gap-0 lg:p-6"
            >
              <div className="flex shrink-0 items-center lg:justify-between lg:border-b lg:border-ink-950/10 lg:pb-4">
                <span className="font-display text-2xl leading-none font-normal text-ember-500 tabular-nums lg:text-[2rem]">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="min-w-0 lg:mt-5">
                <h3 className="title-card text-ink-950">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <p className="max-w-3xl text-sm leading-relaxed text-ink-600">{t.process.note}</p>
          <a
            href={pageHref(lang, 'how-it-works/')}
            className="link-more shrink-0 hover:text-ink-950"
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
