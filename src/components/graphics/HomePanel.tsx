import { Blinds, Clapperboard, Lightbulb, ShieldCheck, Sunrise, Thermometer } from 'lucide-react'
import { useI18n } from '../../i18n/context'

const SCENE_ICONS = [Sunrise, Clapperboard, ShieldCheck]

/**
 * Illustrative control panel shown in the hero.
 *
 * Built from live DOM rather than a screenshot: it stays sharp at any density,
 * translates with the rest of the site, and cannot be mistaken for a real
 * product screenshot of someone else's software.
 */
export function HomePanel() {
  const { t } = useI18n()
  const panel = t.hero.panel

  return (
    <div className="w-[19rem] rounded-[1.375rem] border border-white/12 bg-ink-950/88 p-4 text-paper shadow-[0_24px_60px_-24px_rgb(12_15_19/0.65)] backdrop-blur-xl sm:w-[21rem]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[0.9375rem] leading-none font-semibold">{panel.title}</p>
          <p className="mt-1.5 text-xs text-ink-400">{panel.subtitle}</p>
        </div>
        <span className="relative mt-1 flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full rounded-full bg-bamboo-400 opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-bamboo-400" />
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {panel.rooms.map((room, i) => (
          <span
            key={room}
            className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-medium ${
              i === 0 ? 'bg-paper text-ink-950' : 'bg-white/8 text-ink-300'
            }`}
          >
            {room}
          </span>
        ))}
      </div>

      {/* Two quick-glance tiles */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-white/6 p-3">
          <Lightbulb size={15} className="text-ember-400" aria-hidden="true" />
          <p className="mt-2 text-lg leading-none font-semibold tabular-nums">42%</p>
          <div className="mt-2 h-1 rounded-full bg-white/12">
            <div className="h-1 w-[42%] rounded-full bg-ember-400" />
          </div>
        </div>
        <div className="rounded-xl bg-white/6 p-3">
          <Thermometer size={15} className="text-bamboo-300" aria-hidden="true" />
          <p className="mt-2 text-lg leading-none font-semibold tabular-nums">
            24.5<span className="text-xs font-medium text-ink-400">°C</span>
          </p>
          <p className="mt-2 text-[0.6875rem] text-ink-400">RH 61%</p>
        </div>
      </div>

      <ul className="mt-3 space-y-1.5">
        {panel.scenes.map((scene, i) => {
          const Icon = SCENE_ICONS[i] ?? Blinds
          return (
            <li
              key={scene.name}
              className="flex items-center gap-3 rounded-xl bg-white/6 px-3 py-2.5"
            >
              <Icon size={15} className="shrink-0 text-ink-300" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.8125rem] font-medium">{scene.name}</span>
                <span className="block truncate text-[0.6875rem] text-ink-400">{scene.detail}</span>
              </span>
              <span
                aria-hidden="true"
                className={`h-4 w-7 shrink-0 rounded-full p-[3px] transition-colors ${
                  i === 0 ? 'bg-bamboo-500' : 'bg-white/15'
                }`}
              >
                <span
                  className={`block h-2.5 w-2.5 rounded-full bg-white transition-transform ${
                    i === 0 ? 'translate-x-3' : ''
                  }`}
                />
              </span>
            </li>
          )
        })}
      </ul>

      <p className="mt-3.5 text-[0.6875rem] text-ink-500">{panel.status}</p>
    </div>
  )
}
