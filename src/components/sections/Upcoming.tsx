import { Check, ScanEye, WifiOff } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button, SectionHeading } from '../ui'
import { useI18n } from '../../i18n/context'

const ICONS: Record<string, LucideIcon> = { edge: ScanEye, fall: WifiOff }

export function Upcoming() {
  const { t } = useI18n()
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

                <p className="mt-5 text-sm leading-relaxed text-ink-600">
                  <strong className="font-semibold text-ink-800">{u.limitsLabel}: </strong>
                  {item.limits}
                </p>
              </li>
            )
          })}
        </ul>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ink-600">{u.note}</p>
        <Button as="a" href="#contact" variant="primary" size="lg" className="mt-6">
          {u.cta}
        </Button>
      </div>
    </section>
  )
}
