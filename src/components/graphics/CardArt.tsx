import { Blinds, Droplets, Lightbulb, Lock, Plug, Snowflake, Sun, Thermometer } from 'lucide-react'

/**
 * Drawings for the homepage service cards that have no showroom render:
 * aircon, controls and energy. Decoration only (aria-hidden): no readings, no
 * numbers, nothing that could be read as a measurement or a result.
 */
export function CardArt({ id }: { id: string }) {
  if (id === 'climate') return <ClimateArt />
  if (id === 'control') return <ControlArt />
  return <EnergyArt />
}

const tile = 'rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm'

function ClimateArt() {
  return (
    <div aria-hidden="true" className="relative mx-auto mt-4 grid size-28 place-items-center sm:mt-6 sm:size-40">
      <svg viewBox="0 0 120 120" className="absolute inset-0 size-full -rotate-90">
        <defs>
          <linearGradient id="card-art-dial" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#a6dec3" />
            <stop offset="1" stopColor="#3fae7e" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="50" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="9" />
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="url(#card-art-dial)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray="314"
          strokeDashoffset="110"
        />
      </svg>
      <span className={`${tile} grid size-16 place-items-center sm:size-20`}>
        <Thermometer size={28} className="text-bamboo-200" />
      </span>
      <span className={`${tile} absolute -top-1 -right-3 grid size-10 place-items-center`}>
        <Snowflake size={18} className="text-bamboo-200" />
      </span>
      <span className={`${tile} absolute -bottom-1 -left-3 grid size-10 place-items-center`}>
        <Droplets size={18} className="text-bamboo-200" />
      </span>
    </div>
  )
}

function ControlArt() {
  const buttons = [Lightbulb, Blinds, Thermometer, Lock]
  return (
    <div aria-hidden="true" className="mx-auto mt-4 grid w-28 grid-cols-2 gap-2 sm:mt-6 sm:w-44 sm:gap-2.5 lg:w-48">
      {buttons.map((Icon, i) => (
        <span
          key={i}
          className={`grid aspect-square place-items-center rounded-2xl border ${
            i === 0
              ? 'border-bamboo-300/50 bg-bamboo-400 text-ink-950 shadow-glow'
              : 'border-white/10 bg-white/[0.06] text-ink-200'
          }`}
        >
          <Icon size={20} />
        </span>
      ))}
    </div>
  )
}

function EnergyArt() {
  // Bar heights are decoration, not data: no axis, no labels, no values.
  const bars = [38, 54, 46, 70, 88, 64, 50, 76, 58, 42]
  return (
    <div aria-hidden="true" className="relative mx-auto mt-4 w-full max-w-60 sm:mt-6">
      <div className="flex h-20 items-end gap-1.5 sm:h-28">
        {bars.map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className={`flex-1 rounded-t-md ${i === 4 ? 'bg-bamboo-300' : 'bg-gradient-to-t from-bamboo-700/60 to-bamboo-400/70'}`}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-between">
        <span className={`${tile} grid size-9 place-items-center`}>
          <Sun size={16} className="text-bamboo-200" />
        </span>
        <span className={`${tile} grid size-9 place-items-center`}>
          <Plug size={16} className="text-bamboo-200" />
        </span>
      </div>
    </div>
  )
}
