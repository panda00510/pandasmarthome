import haLogo from '../../assets/brands/home-assistant-logo.png'
import { SectionHeading } from '../ui'
import { useI18n } from '../../i18n/context'

export function Platform() {
  const { t } = useI18n()

  return (
    <section id="platform" className="band bg-ink-950 text-paper">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <SectionHeading
            eyebrow={t.platform.eyebrow}
            title={t.platform.title}
            lead={t.platform.lead}
            tone="dark"
          />

          <div className="lg:text-right">
            {/* The logo keeps its own light clear-space, per common brand practice. */}
            <div className="inline-flex items-center rounded-2xl bg-white px-5 py-3.5">
              <img
                src={haLogo}
                alt="Home Assistant"
                width={905}
                height={128}
                loading="lazy"
                decoding="async"
                className="h-6 w-auto sm:h-7"
              />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400 lg:ml-auto">
              {t.compatibility.haCaption}
            </p>
          </div>
        </div>

        <ul
          data-reveal
          className="mt-12 grid gap-px overflow-hidden rounded-panel bg-white/10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
        >
          {t.platform.points.map((point) => (
            <li
              key={point.title}
              className="bg-ink-950 p-6 transition-colors duration-500 hover:bg-ink-900 lg:p-7"
            >
              <h3 className="text-[1.0625rem] leading-snug font-semibold text-paper">
                {point.title}
              </h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-400">{point.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14 border-t border-white/10 pt-10">
          <h3 className="text-sm font-semibold tracking-wide text-ink-300">
            {t.platform.protocolsTitle}
          </h3>
          <ul className="reveal-group mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {t.platform.protocols.map((protocol) => (
              <li
                key={protocol.label}
                data-reveal
                className="rounded-xl bg-white/6 px-4 py-3.5 transition-colors duration-300 hover:bg-white/10"
              >
                <p className="text-[0.9375rem] font-semibold text-paper">{protocol.label}</p>
                <p className="mt-1 text-[0.8125rem] leading-snug text-ink-400">{protocol.note}</p>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-3xl text-[0.8125rem] leading-relaxed text-ink-500">
            {t.platform.sourceNote}
          </p>
        </div>
      </div>
    </section>
  )
}
