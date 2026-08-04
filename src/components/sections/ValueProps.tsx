import { KeyRound, Network, Server, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '../ui'
import { useI18n } from '../../i18n/context'

const ICONS: Record<string, LucideIcon> = {
  local: Server,
  brands: Network,
  nolockin: KeyRound,
  handover: ShieldCheck,
}

export function ValueProps() {
  const { t } = useI18n()

  return (
    <section id="why" className="band border-t border-ink-200/70 bg-paper-alt">
      <div className="shell">
        <SectionHeading eyebrow={t.value.eyebrow} title={t.value.title} lead={t.value.lead} />

        <ul className="reveal-group mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {t.value.items.map((item) => {
            const Icon = ICONS[item.id] ?? Server
            return (
              <li key={item.id} data-reveal className="card spotlight flex flex-col p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-bamboo-50 text-bamboo-600 ring-1 ring-bamboo-100">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-[1.0625rem] leading-snug font-semibold text-ink-950">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-600">{item.body}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
