import { ChevronDown } from 'lucide-react'
import { SectionHeading } from '../ui'
import { useI18n } from '../../i18n/context'

/**
 * Built on native <details>/<summary>: keyboard access, screen-reader
 * semantics and find-in-page all work without a line of JavaScript.
 */
export function Faq() {
  const { t } = useI18n()

  return (
    <section id="faq" className="band">
      <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} lead={t.faq.lead} />
        </div>

        <div className="divide-y divide-ink-200 border-y border-ink-200">
          {t.faq.items.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                <h3 className="text-[1.0625rem] leading-snug font-medium text-ink-900 transition-colors group-hover:text-bamboo-700">
                  {item.q}
                </h3>
                <ChevronDown
                  size={19}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-ink-400 transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <p className="pr-10 pb-6 text-[0.9375rem] leading-relaxed text-ink-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
