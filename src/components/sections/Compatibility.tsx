import { Blinds, Camera, Fan, KeyRound, Lightbulb, Radio } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Chip, SectionHeading } from '../ui'
import { useI18n } from '../../i18n/context'

const GROUP_ICONS: LucideIcon[] = [Lightbulb, Fan, Blinds, KeyRound, Camera, Radio]

export function Compatibility() {
  const { t } = useI18n()

  return (
    <section id="compatibility" className="band border-t border-ink-200/70 bg-paper-alt">
      <div className="shell">
        <SectionHeading
          eyebrow={t.compatibility.eyebrow}
          title={t.compatibility.title}
          lead={t.compatibility.lead}
        />

        {/*
          Brand names are rendered as plain text labels rather than logos:
          third-party logo licensing is not established, and text avoids any
          suggestion of an official partnership.
        */}
        <ul className="reveal-group mt-12 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {t.compatibility.groups.map((group, i) => {
            const Icon = GROUP_ICONS[i] ?? Lightbulb
            return (
              <li key={group.title} data-reveal className="card spotlight p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-700">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <h3 className="text-[0.9375rem] font-semibold text-ink-950">{group.title}</h3>
                </div>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.brands.map((label) => (
                    <li key={label}>
                      <Chip>{label}</Chip>
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>

        <p className="mt-10 max-w-4xl rounded-2xl border border-ink-200 bg-white px-6 py-5 text-[0.8125rem] leading-relaxed text-ink-600">
          {t.compatibility.disclaimer}
        </p>
      </div>
    </section>
  )
}
