import type { PointerEvent } from 'react'
import { Blinds, Gauge, LayoutDashboard, Lightbulb, Lock, Thermometer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Check } from 'lucide-react'
import { SectionHeading } from '../ui'
import { useI18n } from '../../i18n/context'

const ICONS: Record<string, LucideIcon> = {
  lighting: Lightbulb,
  climate: Thermometer,
  shades: Blinds,
  security: Lock,
  control: LayoutDashboard,
  energy: Gauge,
}

/**
 * Feeds the cursor position to the nearest `.spotlight` card as CSS custom
 * properties. Delegated from the grid so there is one listener rather than
 * one per card, and the CSS decides whether to render anything (pointer
 * devices only).
 */
function onPointerMove(event: PointerEvent<HTMLElement>) {
  const card = (event.target as HTMLElement).closest<HTMLElement>('.spotlight')
  if (!card) return
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  card.style.setProperty('--my', `${event.clientY - rect.top}px`)
}

export function Solutions() {
  const { t } = useI18n()

  return (
    <section id="solutions" className="band">
      <div className="shell">
        <SectionHeading
          eyebrow={t.solutions.eyebrow}
          title={t.solutions.title}
          lead={t.solutions.lead}
        />

        <ul
          className="reveal-group mt-12 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-3"
          onPointerMove={onPointerMove}
        >
          {t.solutions.items.map((item) => {
            const Icon = ICONS[item.id] ?? Lightbulb
            return (
              <li
                key={item.id}
                data-reveal
                className="card spotlight group flex flex-col p-6 transition-shadow duration-300 hover:shadow-lift lg:p-7"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink-950 text-paper transition-colors duration-300 group-hover:bg-bamboo-600">
                  <Icon size={19} aria-hidden="true" />
                </span>

                <h3 className="mt-5 text-lg leading-snug font-semibold text-ink-950">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-600">{item.body}</p>

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
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
