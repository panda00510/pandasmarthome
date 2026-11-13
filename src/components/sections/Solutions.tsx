import { ArrowRight, Blinds, Gauge, LayoutDashboard, Lightbulb, Lock, Thermometer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '../ui'
import { pageHref, useI18n } from '../../i18n/context'

const ICONS: Record<string, LucideIcon> = {
  lighting: Lightbulb,
  climate: Thermometer,
  shades: Blinds,
  security: Lock,
  control: LayoutDashboard,
  energy: Gauge,
}

/** Topic pages behind each card. */
const PAGES: Record<string, string> = {
  lighting: 'solutions/smart-lighting/',
  control: 'solutions/home-control/',
  energy: 'solutions/energy-monitoring/',
  climate: 'solutions/smart-aircon-control/',
  shades: 'solutions/motorised-curtains/',
  security: 'solutions/smart-door-locks/',
}

/** The six services as compact, fully clickable cards. */
export function Solutions() {
  const { t, lang } = useI18n()

  return (
    <section id="solutions" className="band">
      <div className="shell">
        <SectionHeading
          eyebrow={t.solutions.eyebrow}
          title={t.solutions.title}
          lead={t.solutions.lead}
          shortOnPhone split
        />

        <ul className="reveal-group mt-8 grid grid-cols-2 gap-3 lg:mt-12 lg:grid-cols-3 lg:gap-4">
          {t.solutions.items.map((item) => {
            const Icon = ICONS[item.id] ?? Lightbulb
            return (
              <li key={item.id} data-reveal>
                <a
                  href={pageHref(lang, PAGES[item.id] ?? 'solutions/')}
                  className="card group flex h-full flex-col items-start gap-3 p-4 transition-colors hover:border-bamboo-200 sm:flex-row sm:gap-4 sm:p-5 lg:p-6"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-bamboo-50 text-bamboo-700 ring-1 ring-bamboo-100 transition-colors group-hover:bg-brand group-hover:text-white">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[1.0625rem] leading-snug font-semibold text-ink-950">
                      {item.title}
                    </span>
                    <span className="mt-1.5 hidden text-[0.9375rem] leading-relaxed text-ink-600 sm:block">
                      {item.body}
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        <a
          href={pageHref(lang, 'solutions/')}
          className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-bamboo-700 hover:text-bamboo-600"
        >
          {t.hubs.solutions.all}
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
