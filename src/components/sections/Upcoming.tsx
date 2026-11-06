import { ArrowRight, ScanEye, WifiOff } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '../ui'
import { pageHref, useI18n } from '../../i18n/context'

const ICONS: Record<string, LucideIcon> = { edge: ScanEye, fall: WifiOff }

export function Upcoming() {
  const { t, lang } = useI18n()
  const u = t.upcoming

  return (
    <section id="upcoming" className="band">
      <div className="shell">
        <SectionHeading eyebrow={u.eyebrow} title={u.title} lead={u.lead} />

        <ul className="reveal-group mt-12 grid gap-4 md:grid-cols-2 lg:mt-16">
          {u.items.map((item) => {
            const Icon = ICONS[item.id] ?? ScanEye
            return (
              <li key={item.id} data-reveal className="card flex flex-col p-6 lg:p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink-950 text-paper">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <span className="rounded-full border border-ink-200 px-3 py-1 text-xs font-medium text-ink-600">
                    {u.status}
                  </span>
                </div>

                <h3 className="mt-5 text-lg leading-snug font-semibold text-ink-950">{item.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-600">{item.body}</p>
              </li>
            )
          })}
        </ul>

        <a
          href={pageHref(lang, 'solutions/upcoming-products/')}
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-bamboo-700 hover:text-bamboo-600"
        >
          {t.guides.learnMore}
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
