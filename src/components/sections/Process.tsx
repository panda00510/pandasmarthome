import { Info } from 'lucide-react'
import curtains from '../../assets/photos/bedroom-curtains.jpg'
import { SectionHeading } from '../ui'
import { useI18n } from '../../i18n/context'

export function Process() {
  const { t } = useI18n()

  return (
    <section id="process" className="band">
      <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow={t.process.eyebrow}
            title={t.process.title}
            lead={t.process.lead}
          />

          <img
            src={curtains}
            alt=""
            width={760}
            height={1138}
            loading="lazy"
            decoding="async"
            className="mt-9 hidden aspect-[4/3] w-full rounded-panel object-cover shadow-soft lg:block"
          />
        </div>

        <ol className="relative space-y-2">
          {t.process.steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-5 rounded-card p-5 sm:gap-6 sm:p-6">
              <div className="flex flex-col items-center">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-950 text-[0.8125rem] font-semibold text-paper tabular-nums">
                  {i + 1}
                </span>
                {i < t.process.steps.length - 1 ? (
                  <span aria-hidden="true" className="mt-2 w-px flex-1 bg-ink-200" />
                ) : null}
              </div>

              <div className="pb-4">
                <h3 className="text-[1.0625rem] leading-snug font-semibold text-ink-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{step.body}</p>
              </div>
            </li>
          ))}

          <li className="ml-0 flex items-start gap-2.5 rounded-2xl bg-bamboo-50 px-5 py-4 text-sm leading-relaxed text-bamboo-900 ring-1 ring-bamboo-100 sm:ml-[3.5rem]">
            <Info size={16} className="mt-0.5 shrink-0 text-bamboo-600" aria-hidden="true" />
            {t.process.note}
          </li>
        </ol>
      </div>
    </section>
  )
}
