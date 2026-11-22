import { ArrowRight } from 'lucide-react'
import { useI18n } from '../../i18n/context'
import { showroomHref } from '../../lib/showroom'

/**
 * "What you receive": the three written records of a job, drawn as simple
 * architectural illustrations. Labelled as illustrations, not client files.
 */
const INK = 'var(--color-ink-400)'
const GREEN = 'var(--color-brand)'
const BRASS = 'var(--color-ember-500)'

function ScopeArt() {
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full" aria-hidden="true">
      <rect x="62" y="12" width="116" height="128" rx="3" fill="#fcfaf6" stroke={INK} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(78 ${32 + i * 26})`}>
          <rect width="14" height="14" rx="2" fill={i < 3 ? GREEN : 'none'} stroke={i < 3 ? GREEN : INK} />
          {i < 3 ? <path d="M3.5 7.5l2.5 2.5 4.5-5" stroke="#fcfaf6" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          <rect x="24" y="3.5" width={[64, 52, 70, 40][i]} height="6" rx="1.5" fill="var(--color-ink-200)" />
        </g>
      ))}
    </svg>
  )
}

function PlanArt() {
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full" aria-hidden="true">
      <rect x="30" y="18" width="180" height="114" rx="3" fill="#fcfaf6" stroke={INK} />
      <path d="M30 70h84M114 18v52M114 100h96M150 100v32" stroke={INK} fill="none" />
      <path d="M60 94L114 70L168 44" stroke={GREEN} strokeWidth="1.6" strokeDasharray="4 4" fill="none" />
      <path d="M114 70L186 112" stroke={BRASS} strokeWidth="1.6" strokeDasharray="4 4" fill="none" />
      <circle cx="114" cy="70" r="8.5" fill={GREEN} />
      <circle cx="60" cy="94" r="4.5" fill="#fcfaf6" stroke={GREEN} strokeWidth="2" />
      <circle cx="168" cy="44" r="4.5" fill="#fcfaf6" stroke={GREEN} strokeWidth="2" />
      <circle cx="186" cy="112" r="4.5" fill="#fcfaf6" stroke={BRASS} strokeWidth="2" />
    </svg>
  )
}

function HandoverArt() {
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full" aria-hidden="true">
      <rect x="58" y="22" width="124" height="108" rx="3" fill="var(--color-paper-alt)" stroke={INK} />
      <rect x="48" y="14" width="124" height="108" rx="3" fill="#fcfaf6" stroke={INK} />
      <rect x="64" y="30" width="60" height="8" rx="1.5" fill="var(--color-ink-900)" />
      <rect x="64" y="50" width="92" height="5" rx="1.5" fill="var(--color-ink-200)" />
      <rect x="64" y="64" width="76" height="5" rx="1.5" fill="var(--color-ink-200)" />
      <rect x="64" y="86" width="46" height="20" rx="2" fill={BRASS} />
      <circle cx="75" cy="96" r="3.5" fill="#fcfaf6" />
      <rect x="83" y="94" width="18" height="3.5" rx="1" fill="#fcfaf6" />
    </svg>
  )
}

const ART = { scope: ScopeArt, plan: PlanArt, handover: HandoverArt }

/**
 * Compact "what you receive" architectural documentation folio at the foot of Process.
 */
export function DeliverStrip() {
  const { t, lang } = useI18n()
  const d = t.deliver

  return (
    <div id="deliver" className="mt-12 rounded-panel border border-ink-950/15 bg-paper p-5 sm:p-7 lg:mt-14 lg:p-8">
      <div className="flex flex-col gap-3 border-b border-ink-950/12 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">{d.eyebrow}</p>
          <h3 className="title-group mt-3 text-ink-950">
            {d.title}
          </h3>
          <p className="mt-1.5 text-xs text-ink-500">{d.note}</p>
        </div>
        <a
          href={showroomHref(lang)}
          className="link-more shrink-0 hover:text-ink-950"
        >
          {d.demoCta}
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>

      <ul className="reveal-group mt-6 grid gap-4 md:grid-cols-3">
        {d.items.map((item) => {
          const Art = ART[item.id as keyof typeof ART] ?? ScopeArt
          return (
            <li key={item.id} data-reveal className="card flex items-center gap-4 overflow-hidden p-3.5 pr-4">
              <div className="art-stage h-[4.5rem] w-[6.5rem] shrink-0 rounded-[2px] border border-ink-950/12 p-1.5">
                <Art />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[0.65rem] font-semibold tracking-[0.12em] text-ember-500 uppercase">
                  {item.tag}
                </p>
                <p className="mt-1 font-display text-[1rem] leading-snug font-medium text-ink-950">
                  {item.title}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
