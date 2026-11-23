import { ArrowRight, ArrowUpRight, Blinds, Lightbulb, Lock, SlidersHorizontal, Thermometer, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '../ui'
import { pageHref, useI18n } from '../../i18n/context'

const PAGES: Record<string, string> = {
  lighting: 'solutions/smart-lighting/',
  control: 'solutions/home-control/',
  energy: 'solutions/energy-monitoring/',
  climate: 'solutions/smart-aircon-control/',
  shades: 'solutions/motorised-curtains/',
  security: 'solutions/smart-door-locks/',
}

const ICONS: Record<string, LucideIcon> = {
  lighting: Lightbulb,
  climate: Thermometer,
  shades: Blinds,
  security: Lock,
  control: SlidersHorizontal,
  energy: Zap,
}

/**
 * Six residential disciplines as a crisp, zero-photo architectural index
 * (avoiding repeating the hero's 3D showroom renders), followed by a compact
 * by-situation index strip linking directly to the three scenario pages.
 */
export function Solutions() {
  const { t, lang } = useI18n()

  return (
    <section id="solutions" className="band border-t border-ink-950/12 bg-surface">
      <div className="shell">
        <SectionHeading
          eyebrow={t.solutions.eyebrow}
          title={t.solutions.title}
          lead={t.solutions.lead}
          shortOnPhone
          split
        />

        {/* 6-cell hairline architectural index */}
        <ul className="reveal-group mt-9 grid overflow-hidden rounded-card border border-ink-950/15 bg-paper sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {t.solutions.items.map((item, i) => {
            const Icon = ICONS[item.id] ?? Lightbulb
            return (
              <li
                key={item.id}
                data-reveal
                className="flex border-b border-ink-950/12 last:border-b-0 sm:odd:border-r sm:nth-last-2:border-b-0 lg:border-r lg:nth-[3n]:border-r-0 lg:nth-last-[-n+3]:border-b-0"
              >
                <a
                  href={pageHref(lang, PAGES[item.id] ?? 'solutions/')}
                  className="group flex w-full flex-col p-5 transition-colors hover:bg-surface sm:p-6 lg:p-7"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2.5">
                      <span className="icon-tile h-9! w-9! bg-surface!">
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <span className="numeral text-xs font-semibold text-ember-500">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                      className="text-ink-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink-950"
                    />
                  </div>

                  <h3 className="title-card mt-5 text-ink-950 transition-colors group-hover:text-brand">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {item.body}
                  </p>
                  <span className="link-more mt-auto min-h-0 pt-5 text-sm">
                    {t.guides.learnMore}
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        {/* Compact by-situation links strip + all solutions link */}
        <div
          id="situations"
          className="mt-6 flex flex-col gap-3 border-t border-ink-950/12 pt-5 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-[0.6875rem] font-semibold tracking-[0.14em] text-ember-500 uppercase">
              {t.situations.eyebrow}
            </span>
            {t.situations.items.map((item) => (
              <a
                key={item.id}
                href={pageHref(lang, item.path)}
                className="group inline-flex min-h-10 items-center gap-1.5 rounded-[3px] border border-ink-950/15 bg-paper px-3 text-sm font-medium text-ink-800 transition-colors hover:border-ink-950 hover:bg-surface hover:text-ink-950"
              >
                <span>{item.title}</span>
                <ArrowRight
                  size={13}
                  aria-hidden="true"
                  className="text-ink-500 transition-transform group-hover:translate-x-0.5 group-hover:text-ink-950"
                />
              </a>
            ))}
          </div>

          <a href={pageHref(lang, 'solutions/')} className="link-more shrink-0 hover:text-ink-950">
            {t.hubs.solutions.all}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
