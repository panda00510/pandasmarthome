import { ArrowLeft, ArrowRight, Blinds, DoorOpen, Droplets, Lightbulb, Lock, Monitor, Plug, Snowflake, Sun, Thermometer } from 'lucide-react'

/**
 * Architectural drawings for cards without a showroom render: aircon, controls
 * and energy on the homepage, screens and meeting rooms on the signage page.
 * Decoration only (aria-hidden): no readings, no numbers.
 * Supports `tone="light"` (drafting-paper architectural blueprint) and
 * `tone="dark"` (deep forest stage for inner dark cards).
 */
export function CardArt({ id, tone = 'dark' }: { id: string; tone?: 'light' | 'dark' }) {
  if (id === 'climate') return <ClimateArt light={tone === 'light'} />
  if (id === 'control') return <ControlArt light={tone === 'light'} />
  if (id === 'screens') return <ScreensArt />
  if (id === 'rooms') return <RoomArt />
  return <EnergyArt light={tone === 'light'} />
}

const tileDark =
  'rounded-[4px] border border-paper/15 bg-paper/[0.06] backdrop-blur-md'
const tileLight =
  'rounded-[3px] border border-ink-950/16 bg-surface shadow-[0_2px_6px_-4px_rgb(20_34_28/0.2)]'

function ClimateArt({ light }: { light: boolean }) {
  const tile = light ? tileLight : tileDark
  return (
    <div aria-hidden="true" className="relative mx-auto grid size-28 place-items-center sm:size-32">
      <svg viewBox="0 0 120 120" className="absolute inset-0 size-full -rotate-90">
        <defs>
          <linearGradient id={light ? 'card-art-dial-light' : 'card-art-dial-dark'} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor={light ? '#9a6728' : '#e5c48c'} />
            <stop offset="1" stopColor={light ? '#18523c' : '#87be9f'} />
          </linearGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={light ? 'rgb(20 34 28 / 0.12)' : 'rgb(244 239 230 / 0.09)'}
          strokeWidth="1"
          strokeDasharray="2 5"
        />
        <circle
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke={light ? 'rgb(20 34 28 / 0.1)' : 'rgb(244 239 230 / 0.1)'}
          strokeWidth="6"
        />
        <circle
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke={`url(#${light ? 'card-art-dial-light' : 'card-art-dial-dark'})`}
          strokeWidth="6"
          strokeLinecap="butt"
          strokeDasharray="289"
          strokeDashoffset="96"
        />
      </svg>
      <span className={`${tile} grid size-14 place-items-center`}>
        <Thermometer size={24} className={light ? 'text-ink-950' : 'text-ember-300'} />
      </span>
      <span className={`${tile} absolute -top-1 -right-2 grid size-9 place-items-center`}>
        <Snowflake size={15} className={light ? 'text-brand' : 'text-bamboo-300'} />
      </span>
      <span className={`${tile} absolute -bottom-1 -left-2 grid size-9 place-items-center`}>
        <Droplets size={15} className={light ? 'text-ember-500' : 'text-ember-300'} />
      </span>
    </div>
  )
}

function ControlArt({ light }: { light: boolean }) {
  const buttons = [Lightbulb, Blinds, Thermometer, Lock]
  return (
    <div
      aria-hidden="true"
      className={`mx-auto grid w-32 grid-cols-2 gap-2 rounded-[4px] border p-2.5 sm:w-36 ${
        light ? 'border-ink-950/16 bg-surface shadow-soft' : 'border-paper/14 bg-paper/[0.04]'
      }`}
    >
      {buttons.map((Icon, i) => (
        <span
          key={i}
          className={`grid aspect-square place-items-center rounded-[2px] border ${
            i === 0
              ? light
                ? 'border-ink-950 bg-ink-950 text-ember-300'
                : 'border-ember-300/60 bg-paper text-ink-950'
              : light
                ? 'border-ink-950/12 bg-paper text-ink-700'
                : 'border-paper/12 bg-paper/[0.07] text-paper/80'
          }`}
        >
          <Icon size={18} />
        </span>
      ))}
    </div>
  )
}

function EnergyArt({ light }: { light: boolean }) {
  // Bar heights are decoration, not data: no axis, no labels, no values.
  const bars = [38, 54, 46, 70, 90, 64, 50, 76, 58, 42]
  const tile = light ? tileLight : tileDark
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-52">
      <div
        className={`flex h-20 items-end gap-1.5 rounded-[3px] border p-3 pb-2 sm:h-24 ${
          light ? 'border-ink-950/14 bg-surface' : 'border-paper/12 bg-paper/[0.04]'
        }`}
      >
        {bars.map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className={`flex-1 ${
              i === 4
                ? light
                  ? 'bg-ember-500'
                  : 'bg-ember-300'
                : light
                  ? 'bg-brand/75'
                  : 'bg-bamboo-300/70'
            }`}
          />
        ))}
      </div>
      <div className="mt-2.5 flex justify-between">
        <span className={`${tile} grid size-8 place-items-center`}>
          <Sun size={14} className={light ? 'text-ember-500' : 'text-ember-300'} />
        </span>
        <span className={`${tile} grid size-8 place-items-center`}>
          <Plug size={14} className={light ? 'text-brand' : 'text-bamboo-300'} />
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
          className={`grid aspect-video place-items-center rounded-[3px] border ${
            i === 1 ? 'border-ember-300/70 bg-paper text-ink-950' : 'border-paper/14 bg-paper/[0.06] text-ink-300'
          }`}
        >
          <Monitor size={16} />
        </span>
      ))}
    </div>
  )
}

/** A door panel: the room state as a bar, a schedule as plain lines, wayfinding arrows beside it. */
function RoomArt() {
  return (
    <div aria-hidden="true" className="mx-auto mt-4 flex items-center gap-3 sm:mt-6">
      <span className={`${tileDark} grid size-10 place-items-center`}>
        <ArrowLeft size={18} className="text-ember-300" />
      </span>
      <span className={`${tileDark} flex w-32 flex-col gap-2 p-3 sm:w-40`}>
        <span className="flex h-9 items-center gap-2 rounded-[2px] bg-paper px-2.5 text-ink-950">
          <DoorOpen size={16} />
          <span className="h-1.5 flex-1 bg-ink-950/30" />
        </span>
        <span className="h-1.5 w-4/5 bg-paper/25" />
        <span className="h-1.5 w-3/5 bg-paper/14" />
        <span className="h-1.5 w-2/3 bg-paper/14" />
      </span>
      <span className={`${tileDark} grid size-10 place-items-center`}>
        <ArrowRight size={18} className="text-ember-300" />
      </span>
    </div>
  )
}
