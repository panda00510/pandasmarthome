import { ArrowLeft, ArrowRight, Blinds, DoorOpen, Droplets, Lightbulb, Lock, Monitor, Plug, Snowflake, Sun, Thermometer } from 'lucide-react'

/**
 * Drawings for picture cards that have no showroom render: aircon, controls
 * and energy on the homepage, screens and meeting rooms on the signage page. Decoration only (aria-hidden): no readings, no
 * numbers, nothing that could be read as a measurement or a result.
 */
export function CardArt({ id }: { id: string }) {
  if (id === 'climate') return <ClimateArt />
  if (id === 'control') return <ControlArt />
  if (id === 'screens') return <ScreensArt />
  if (id === 'rooms') return <RoomArt />
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

/** Six screens in a wall, one lit: many screens under one console. */
function ScreensArt() {
  return (
    <div aria-hidden="true" className="mx-auto mt-4 grid w-44 grid-cols-3 gap-2 sm:mt-6 sm:w-60 sm:gap-2.5">
      {Array.from({ length: 6 }, (_, i) => (
        <span
          key={i}
          className={`grid aspect-video place-items-center rounded-lg border ${
            i === 1 ? 'border-bamboo-300/50 bg-bamboo-400 text-ink-950 shadow-glow' : 'border-white/10 bg-white/[0.06] text-ink-300'
          }`}
        >
          <Monitor size={16} />
        </span>
      ))}
    </div>
  )
}

/** A door panel: the room state as a green bar, a schedule as plain lines, wayfinding arrows beside it. */
function RoomArt() {
  return (
    <div aria-hidden="true" className="mx-auto mt-4 flex items-center gap-3 sm:mt-6">
      <span className={`${tile} grid size-10 place-items-center`}>
        <ArrowLeft size={18} className="text-bamboo-200" />
      </span>
      <span className={`${tile} flex w-32 flex-col gap-2 p-3 sm:w-40`}>
        <span className="flex h-9 items-center gap-2 rounded-lg bg-bamboo-400 px-2.5 text-ink-950 shadow-glow">
          <DoorOpen size={16} />
          <span className="h-1.5 flex-1 rounded-full bg-ink-950/30" />
        </span>
        <span className="h-1.5 w-4/5 rounded-full bg-white/20" />
        <span className="h-1.5 w-3/5 rounded-full bg-white/12" />
        <span className="h-1.5 w-2/3 rounded-full bg-white/12" />
      </span>
      <span className={`${tile} grid size-10 place-items-center`}>
        <ArrowRight size={18} className="text-bamboo-200" />
      </span>
    </div>
  )
}
