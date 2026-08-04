import { useState } from 'react'
import { Blinds, Clapperboard, Lightbulb, Lock, ShieldCheck, Sunrise, Thermometer } from 'lucide-react'
import { useAnimatedNumber } from '../../hooks/motion'
import { useI18n } from '../../i18n/context'

const SCENE_ICONS = [Sunrise, Clapperboard, ShieldCheck]

/** Readings each scene settles on. Index-matched to `hero.panel.scenes`. */
const SCENES = [
  { brightness: 72, temp: 25.5, humidity: 58, lights: true, curtains: true, locked: false },
  { brightness: 15, temp: 23.5, humidity: 61, lights: true, curtains: false, locked: false },
  { brightness: 0, temp: 28.0, humidity: 66, lights: false, curtains: false, locked: true },
]

/** Rooms differ a little from each other — a west-facing kitchen runs warmer. */
const ROOM_OFFSETS = [
  { brightness: 0, temp: 0 },
  { brightness: -8, temp: -0.6 },
  { brightness: 12, temp: 0.9 },
  { brightness: 4, temp: -0.2 },
]

const clamp = (n: number) => Math.max(0, Math.min(100, n))

/**
 * Interactive control panel shown in the hero.
 *
 * The scenes and rooms actually work: picking one re-runs the readings the
 * way the real system would. It is a demonstration rather than a screenshot —
 * built from live DOM, so it stays sharp at any density, translates with the
 * rest of the site, and cannot be mistaken for another vendor's product UI.
 */
export function HomePanel() {
  const { t } = useI18n()
  const panel = t.hero.panel
  const [sceneIndex, setSceneIndex] = useState(0)
  const [roomIndex, setRoomIndex] = useState(0)

  const scene = SCENES[sceneIndex] ?? SCENES[0]
  const offset = ROOM_OFFSETS[roomIndex] ?? ROOM_OFFSETS[0]

  const brightness = useAnimatedNumber(clamp(scene.brightness + offset.brightness))
  const temp = useAnimatedNumber(scene.temp + offset.temp)
  const humidity = useAnimatedNumber(scene.humidity)

  return (
    <div className="w-[19rem] rounded-[1.375rem] border border-white/12 bg-ink-950/88 p-4 text-paper shadow-[0_24px_60px_-24px_rgb(12_15_19/0.65)] backdrop-blur-xl sm:w-[21rem]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[0.9375rem] leading-none font-semibold">{panel.title}</p>
          <p className="mt-1.5 text-xs text-ink-400">{panel.subtitle}</p>
        </div>
        <span className="relative mt-1 flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-2 w-2 rounded-full bg-bamboo-400 [animation:ping-soft_2.4s_var(--ease-out-soft)_infinite]" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-bamboo-400" />
        </span>
      </div>

      {/* Rooms */}
      <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label={panel.title}>
        {panel.rooms.map((room, i) => (
          <button
            key={room}
            type="button"
            onClick={() => setRoomIndex(i)}
            aria-pressed={i === roomIndex}
            className={`cursor-pointer rounded-full px-2.5 py-1 text-[0.6875rem] font-medium transition-colors duration-300 ${
              i === roomIndex
                ? 'bg-paper text-ink-950'
                : 'bg-white/8 text-ink-300 hover:bg-white/15 hover:text-paper'
            }`}
          >
            {room}
          </button>
        ))}
      </div>

      {/* Readings */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-white/6 p-3">
          <Lightbulb
            size={15}
            className={`transition-colors duration-500 ${
              scene.lights ? 'text-ember-400' : 'text-ink-600'
            }`}
            aria-hidden="true"
          />
          <p className="mt-2 text-lg leading-none font-semibold tabular-nums">
            {Math.round(brightness)}%
          </p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/12">
            <div
              className="h-1 rounded-full bg-ember-400"
              style={{ width: `${brightness}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-white/6 p-3">
          <Thermometer size={15} className="text-bamboo-300" aria-hidden="true" />
          <p className="mt-2 text-lg leading-none font-semibold tabular-nums">
            {temp.toFixed(1)}
            <span className="text-xs font-medium text-ink-400">°C</span>
          </p>
          <p className="mt-2 text-[0.6875rem] text-ink-400 tabular-nums">
            RH {Math.round(humidity)}%
          </p>
        </div>
      </div>

      {/* Scenes — these are the real control */}
      <ul className="mt-3 space-y-1.5">
        {panel.scenes.map((sceneCopy, i) => {
          const Icon = SCENE_ICONS[i] ?? Blinds
          const on = i === sceneIndex
          return (
            <li key={sceneCopy.name}>
              <button
                type="button"
                onClick={() => setSceneIndex(i)}
                aria-pressed={on}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-300 ${
                  on ? 'bg-white/14' : 'bg-white/6 hover:bg-white/10'
                }`}
              >
                <Icon
                  size={15}
                  className={`shrink-0 transition-colors duration-300 ${
                    on ? 'text-bamboo-300' : 'text-ink-300'
                  }`}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.8125rem] font-medium">
                    {sceneCopy.name}
                  </span>
                  <span className="block truncate text-[0.6875rem] text-ink-400">
                    {sceneCopy.detail}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`h-4 w-7 shrink-0 rounded-full p-[3px] transition-colors duration-300 ${
                    on ? 'bg-bamboo-500' : 'bg-white/15'
                  }`}
                >
                  <span
                    className={`block h-2.5 w-2.5 rounded-full bg-white transition-transform duration-300 ${
                      on ? 'translate-x-3' : ''
                    }`}
                  />
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <p className="mt-3.5 flex items-center gap-2 text-[0.6875rem] text-ink-500">
        <Lock
          size={11}
          className={`shrink-0 transition-colors duration-500 ${
            scene.locked ? 'text-bamboo-400' : 'text-ink-600'
          }`}
          aria-hidden="true"
        />
        {panel.status}
      </p>
    </div>
  )
}
