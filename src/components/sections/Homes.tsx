import { Check, Info } from 'lucide-react'
import condo from '../../assets/photos/sg-condo-marina.jpg'
import hdb from '../../assets/photos/sg-hdb-segar.jpg'
import landed from '../../assets/photos/sg-landed.jpg'
import punggol from '../../assets/photos/sg-hdb-punggol.jpg'
import { SectionHeading } from '../ui'
import { useI18n } from '../../i18n/context'

const IMAGES: Record<string, string> = {
  bto: punggol,
  hdb: hdb,
  condo: condo,
  landed: landed,
}

export function Homes() {
  const { t } = useI18n()

  return (
    <section id="homes" className="band border-t border-ink-200/70 bg-paper-alt">
      <div className="shell">
        <SectionHeading eyebrow={t.homes.eyebrow} title={t.homes.title} lead={t.homes.lead} />

        <ul className="reveal-group mt-12 grid gap-4 md:grid-cols-2 lg:mt-16">
          {t.homes.items.map((item) => (
            <li key={item.id} data-reveal className="card group flex flex-col overflow-hidden">
              <img
                src={IMAGES[item.id]}
                alt={item.imageAlt}
                width={1200}
                height={675}
                loading="lazy"
                decoding="async"
                className="aspect-[16/9] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />

              <div className="flex flex-1 flex-col p-6 lg:p-7">
                <p className="eyebrow">{item.subtitle}</p>
                <h3 className="mt-2.5 text-xl leading-snug font-semibold text-ink-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-600">{item.body}</p>

                <ul className="mt-5 space-y-2 border-t border-ink-100 pt-5">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2.5 text-sm text-ink-700">
                      <Check
                        size={14}
                        strokeWidth={2.8}
                        className="mt-[3px] shrink-0 text-bamboo-500"
                        aria-hidden="true"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 flex max-w-2xl items-start gap-2.5 rounded-2xl bg-ink-100/70 px-5 py-4 text-sm leading-relaxed text-ink-600">
          <Info size={16} className="mt-0.5 shrink-0 text-ink-500" aria-hidden="true" />
          {t.homes.note}
        </p>
      </div>
    </section>
  )
}
