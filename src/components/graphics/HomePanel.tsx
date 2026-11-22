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
 * Interactive architectural wall-keypad demonstration shown beside the hero plate.
 * Styled like a matte limestone & brass residential control plate (zero dark glass):
 * selecting a room or scene updates the live readings and crossfades the hero render.
 */
export function HomePanel({
  compact = false,
  sceneIndex: controlledScene,
  onSceneChange,
}: {
  compact?: boolean
  sceneIndex?: number
  onSceneChange?: (index: number) => void
}) {
  const { t } = useI18n()
  const panel = t.hero.panel
  const [internalScene, setInternalScene] = useState(0)
  const [roomIndex, setRoomIndex] = useState(0)

  const sceneIndex = controlledScene ?? internalScene
  const selectScene = (index: number) => {
    if (onSceneChange) onSceneChange(index)
    else setInternalScene(index)
  }

  const scene = SCENES[sceneIndex] ?? SCENES[0]
  const offset = ROOM_OFFSETS[roomIndex] ?? ROOM_OFFSETS[0]

  const brightness = useAnimatedNumber(clamp(scene.brightness + offset.brightness))
  const temp = useAnimatedNumber(scene.temp + offset.temp)
  const humidity = useAnimatedNumber(scene.humidity)

  return (
    <div
      className={`${
        compact ? 'w-full' : 'w-full'
      } flex h-full flex-col rounded-panel border border-ink-950/18 bg-surface p-4 text-ink-950 shadow-soft sm:p-5`}
    >
      {/* Top machined wall-plate header */}
      <div className="flex items-start justify-between gap-3 border-b border-ink-950/12 pb-3.5">
        <div className="min-w-0">
          <p className="font-display text-lg leading-none font-medium text-ink-950">{panel.title}</p>
          <p className="mt-1.5 font-mono text-[0.6875rem] tracking-[0.06em] text-ink-500 uppercase">
            {panel.subtitle}
          </p>
        </div>
        <span className="mt-0.5 inline-flex items-center gap-1.5 rounded-[2px] border border-brand/25 bg-bamboo-50 px-2 py-1">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-2 w-2 rounded-full bg-brand [animation:ping-soft_2.4s_var(--ease-out-soft)_infinite]" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
          </span>
          <span className="numeral text-[0.625rem] font-semibold text-brand">LOCAL</span>
        </span>
      </div>

      {/* Room selector strip */}
      <div
        className="mt-3.5 grid grid-cols-4 overflow-hidden rounded-[3px] border border-ink-950/14 bg-paper"
        role="group"
        aria-label={panel.title}
      >
        {panel.rooms.map((room, i) => (
          <button
            key={room}
            type="button"
            onClick={() => setRoomIndex(i)}
            aria-pressed={i === roomIndex}
            className={`min-h-9 cursor-pointer px-1.5 text-[0.75rem] font-medium transition-colors ${
              i > 0 ? 'border-l border-ink-950/12' : ''
            } ${
              i === roomIndex
                ? 'bg-ink-950 text-paper'
                : 'text-ink-700 hover:bg-paper-alt hover:text-ink-950'
            }`}
          >
            <span className="block truncate">{room}</span>
          </button>
        ))}
      </div>

      {/* Live architectural telemetry readout */}
      <div className="mt-3 grid grid-cols-2 divide-x divide-ink-950/12 rounded-[3px] border border-ink-950/12 bg-paper">
        <div className="p-3">
          <div className="flex items-center justify-between">
            <Lightbulb
              size={14}
              className={`transition-colors duration-300 ${
                scene.lights ? 'text-ember-500' : 'text-ink-400'
              }`}
              aria-hidden="true"
            />
            <span className="numeral text-[0.625rem] font-semibold text-ink-500 uppercase">LUX</span>
          </div>
          <p className="mt-2 font-display text-2xl leading-none font-normal text-ink-950 tabular-nums">
            {Math.round(brightness)}
            <span className="ml-0.5 font-sans text-xs font-medium text-ink-500">%</span>
          </p>
          <div className="mt-2.5 h-1 overflow-hidden bg-ink-950/10">
            <div
              className="h-1 bg-ember-500 transition-[width] duration-300"
              style={{ width: `${brightness}%` }}
            />
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center justify-between">
            <Thermometer size={14} className="text-brand" aria-hidden="true" />
            <span className="numeral text-[0.625rem] font-semibold text-ink-500 uppercase">
              RH {Math.round(humidity)}%
            </span>
          </div>
          <p className="mt-2 font-display text-2xl leading-none font-normal text-ink-950 tabular-nums">
            {temp.toFixed(1)}
            <span className="ml-0.5 font-sans text-xs font-medium text-ink-500">°C</span>
          </p>
          <div className="mt-2.5 h-1 overflow-hidden bg-ink-950/10">
            <div
              className="h-1 bg-brand transition-[width] duration-300"
              style={{ width: `${Math.min(100, Math.max(15, humidity))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Physical engraved-style scene switches */}
      <ul className="mt-3.5 space-y-2">
        {panel.scenes.map((sceneCopy, i) => {
          const Icon = SCENE_ICONS[i] ?? Blinds
          const on = i === sceneIndex
          return (
            <li key={sceneCopy.name}>
              <button
                type="button"
                onClick={() => selectScene(i)}
                aria-pressed={on}
                className={`flex min-h-[3.25rem] w-full cursor-pointer items-center gap-3 rounded-[3px] border px-3 py-2.5 text-left transition-all duration-200 ${
                  on
                    ? 'border-ink-950 bg-ink-950 text-paper'
                    : 'border-ink-950/14 bg-paper text-ink-900 hover:border-ink-950/38 hover:bg-surface'
                }`}
              >
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-[2px] border transition-colors ${
                    on
                      ? 'border-ember-400/45 bg-ember-400/18 text-ember-300'
                      : 'border-ink-950/12 bg-surface text-ink-700'
                  }`}
                >
                  <Icon size={14} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-[0.8125rem] font-semibold ${on ? 'text-paper' : 'text-ink-950'}`}>
                    {sceneCopy.name}
                  </span>
                  <span className={`block truncate text-[0.6875rem] ${on ? 'text-ink-300' : 'text-ink-500'}`}>
                    {sceneCopy.detail}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`h-4 w-1 shrink-0 transition-colors ${
                    on ? 'bg-ember-400' : 'bg-ink-950/15'
                  }`}
                />
              </button>
            </li>
          )
        })}
      </ul>

      <p className="mt-auto flex items-center gap-2 border-t border-ink-950/12 pt-3 text-[0.6875rem] text-ink-500">
        <Lock
          size={12}
          className={`shrink-0 transition-colors duration-300 ${
            scene.locked ? 'text-brand' : 'text-ink-500'
          }`}
          aria-hidden="true"
        />
        <span className="truncate font-mono tracking-[0.03em]">{panel.status}</span>
      </p>
    </div>
  )
}
