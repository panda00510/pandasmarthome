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

/** The six services as a light hairline grid; each cell is one link. */
export function Solutions() {
  const { t, lang } = useI18n()

  return (
    <section id="solutions" className="band">
      <div className="shell">
        <SectionHeading
          eyebrow={t.solutions.eyebrow}
          title={t.solutions.title}
          lead={t.solutions.lead}
          shortOnPhone
        />

        {/* Hairline grid, not boxed cards: the 1px gaps show the rule colour
            behind the cells. Revealed as one block so the rules never show
            through a half-faded cell. */}
        <ul
          data-reveal
          className="mt-8 grid grid-cols-2 gap-px border-y border-ink-200 bg-ink-200 lg:mt-10 lg:grid-cols-3"
        >
          {t.solutions.items.map((item) => {
            const Icon = ICONS[item.id] ?? Lightbulb
            return (
              <li key={item.id} className="bg-paper">
                <a
                  href={pageHref(lang, PAGES[item.id] ?? 'solutions/')}
                  className="group flex h-full flex-col items-start gap-2.5 px-3 py-4 transition-colors hover:bg-white sm:flex-row sm:gap-4 sm:px-4 sm:py-6 lg:px-6"
                >
                  <Icon size={22} strokeWidth={1.8} className="mt-0.5 shrink-0 text-bamboo-600" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-[1.0625rem] leading-snug font-semibold text-ink-950 group-hover:text-bamboo-700">
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
